import { prisma } from '../../prisma.ts';
import { hashPayload, sleep } from '../utils.ts';
import type { CompetitiveProvider, SyncSummary } from '../types.ts';

function headers() {
  if (!process.env.RIOT_API_KEY) throw new Error('RIOT_API_KEY is not configured');
  return { 'X-Riot-Token': process.env.RIOT_API_KEY };
}

async function riotJson(url: string) {
  const response = await fetch(url, { headers: headers() });

  if (response.status === 429) {
    const retry = Number(response.headers.get('retry-after') || '1');
    await sleep(Math.max(retry, 1) * 1000);
    return riotJson(url);
  }

  if (!response.ok) {
    throw new Error(`Riot API ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

function playerPuuid(player: any) {
  return player?.externalAccounts?.riot?.puuid || null;
}

export class RiotLeagueProvider implements CompetitiveProvider {
  id = 'riot';
  game = 'league-of-legends';

  async syncTeam(teamId: number): Promise<SyncSummary> {
    const routing = process.env.RIOT_REGIONAL_ROUTING || 'europe';
    const count = Math.min(Math.max(Number(process.env.SYNC_DEFAULT_MATCH_COUNT || 10), 1), 20);
    const delay = Math.max(Number(process.env.SYNC_REQUEST_DELAY_MS || 150), 0);

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { players: true }
    });

    if (!team) throw new Error('Team not found');
    if (team.slug !== this.game) throw new Error('This provider only supports the League of Legends team');

    const anchorPlayer = team.players.find(player => playerPuuid(player));
    if (!anchorPlayer) {
      throw new Error('No League player has externalAccounts.riot.puuid configured');
    }

    const puuid = playerPuuid(anchorPlayer);
    const idsUrl = `https://${routing}.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids?start=0&count=${count}`;
    const ids = await riotJson(idsUrl) as string[];

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const externalId of ids) {
      const existing = await prisma.externalMatch.findUnique({
        where: { provider_externalId: { provider: this.id, externalId } }
      });

      const raw: any = await riotJson(`https://${routing}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(externalId)}`);
      const payloadHash = hashPayload(raw);

      if (existing?.payloadHash === payloadHash) {
        skipped++;
        await sleep(delay);
        continue;
      }

      const participants = raw?.info?.participants || [];
      const knownPlayers = new Map(
        team.players
          .map((p: any) => [playerPuuid(p), p])
          .filter(([puuid]) => puuid)
      );
      const krakenParticipants = participants.filter((p: any) => p.puuid && knownPlayers.has(p.puuid));

      let localMatchId = existing?.matchId || null;

      if (!localMatchId) {
        const winVotes = krakenParticipants.filter((p: any) => p.win).length;
        const detectedWin = krakenParticipants.length ? winVotes >= Math.ceil(krakenParticipants.length / 2) : null;

        const created = await prisma.match.create({
          data: {
            teamId: team.id,
            opponentName: 'Riot Match Opponent',
            event: 'Riot Match History',
            date: raw?.info?.gameCreation
              ? new Date(raw.info.gameCreation).toISOString().slice(0, 10)
              : new Date().toISOString().slice(0, 10),
            time: '',
            status: detectedWin === null ? 'completed' : detectedWin ? 'win' : 'loss',
            notes: `Imported automatically from Riot Match-V5 (${externalId}).`
          }
        });

        localMatchId = created.id;
        imported++;
      } else {
        updated++;
      }

      for (const participant of krakenParticipants) {
        const localPlayer: any = knownPlayers.get(participant.puuid);
        if (!localPlayer || !localMatchId) continue;

        await prisma.matchPlayerStat.deleteMany({
          where: {
            matchId: localMatchId,
            playerId: localPlayer.id,
            category: 'riot-auto'
          }
        });

        const stats = [
          ['Champion', participant.championName],
          ['K', participant.kills],
          ['D', participant.deaths],
          ['A', participant.assists],
          ['Damage', participant.totalDamageDealtToChampions],
          ['Gold', participant.goldEarned],
          ['Vision', participant.visionScore],
          ['CS', (participant.totalMinionsKilled || 0) + (participant.neutralMinionsKilled || 0)]
        ].filter(([, value]) => value !== undefined && value !== null);

        for (let i = 0; i < stats.length; i++) {
          const [label, value] = stats[i];
          await prisma.matchPlayerStat.create({
            data: {
              matchId: localMatchId,
              playerId: localPlayer.id,
              label: String(label),
              value: String(value),
              category: 'riot-auto',
              sortOrder: i
            }
          });
        }
      }

      await prisma.externalMatch.upsert({
        where: { provider_externalId: { provider: this.id, externalId } },
        update: {
          payloadHash,
          raw,
          matchId: localMatchId
        },
        create: {
          provider: this.id,
          externalId,
          game: this.game,
          payloadHash,
          raw,
          matchId: localMatchId
        }
      });

      await sleep(delay);
    }

    return {
      imported,
      updated,
      skipped,
      metadata: {
        requested: ids.length,
        sourcePlayer: anchorPlayer.slug,
        routing
      }
    };
  }
}
