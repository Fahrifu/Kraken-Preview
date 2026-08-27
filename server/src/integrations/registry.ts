import { RiotLeagueProvider } from './providers/riotLeague.ts';
import { ValorantProvider } from './providers/valorant.ts';
import { CounterStrikeProvider } from './providers/counterStrike.ts';

const providers = [
  new RiotLeagueProvider(),
  new ValorantProvider(),
  new CounterStrikeProvider()
];

export function getProvider(game: string) {
  return providers.find(provider => provider.game === game);
}

export function listProviders() {
  return providers.map(provider => ({ id: provider.id, game: provider.game }));
}
