import { Router } from 'express';
import { prisma } from '../prisma.ts';

const router = Router();

function getOptionalQueryString(value) {
  if (value === undefined) return { value: undefined };
  if (typeof value !== 'string') return { error: 'Query parameter must be a single string value' };
  const trimmed = value.trim();
  return trimmed ? { value: trimmed } : { value: undefined };
}

router.get('/teams', async (_req, res) => {
  const teams = await prisma.team.findMany({ orderBy: { id: 'asc' } });
  res.json(teams);
});

router.get('/players', async (req, res) => {
  const parsedTeam = getOptionalQueryString(req.query.team);
  if (parsedTeam.error) return res.status(400).json({ error: parsedTeam.error });

  const players = await prisma.player.findMany({
    where: parsedTeam.value ? { team: { slug: parsedTeam.value } } : undefined,
    include: { team: { select: { slug: true, name: true } } },
    orderBy: [{ teamId: 'asc' }, { number: 'asc' }]
  });
  res.json(players.map(p => ({ ...p, game: p.team.slug })));
});

router.get('/matches', async (req, res) => {
  const parsedTeam = getOptionalQueryString(req.query.team);
  if (parsedTeam.error) return res.status(400).json({ error: parsedTeam.error });

  const matches = await prisma.match.findMany({
    where: parsedTeam.value ? { team: { slug: parsedTeam.value } } : undefined,
    include: {
      team: { select: { slug: true, name: true } },
      tournament: true,
      opponentEntity: true
    },
    orderBy: { id: 'asc' }
  });
  res.json(matches.map(m => ({ ...m, game: m.team.slug })));
});

router.get('/news', async (_req, res) => {
  res.json(await prisma.newsArticle.findMany({ orderBy: { id: 'desc' } }));
});

router.get('/sponsors', async (_req, res) => {
  res.json(await prisma.sponsor.findMany({
    where: { active: true },
    orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }]
  }));
});

router.get('/staff', async (_req, res) => {
  res.json(await prisma.staff.findMany({
    where: { active: true },
    include: { team: { select: { slug: true, name: true } } },
    orderBy: [{ teamId: 'asc' }, { role: 'asc' }, { name: 'asc' }]
  }));
});

router.get('/achievements', async (_req, res) => {
  res.json(await prisma.achievement.findMany({
    include: { team: { select: { slug: true, name: true } } },
    orderBy: [{ featured: 'desc' }, { id: 'desc' }]
  }));
});

router.get('/tournaments', async (_req, res) => {
  res.json(await prisma.tournament.findMany({
    include: { team: { select: { slug: true, name: true } } },
    orderBy: [{ startDate: 'asc' }, { id: 'asc' }]
  }));
});

router.get('/opponents', async (_req, res) => {
  res.json(await prisma.opponent.findMany({ orderBy: { name: 'asc' } }));
});

router.get('/matches/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid match ID' });

  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      team: true,
      tournament: true,
      opponentEntity: true,
      maps: { orderBy: { order: 'asc' } },
      lineup: {
        orderBy: [{ side: 'asc' }, { slot: 'asc' }],
        include: { player: true }
      },
      playerStats: {
        orderBy: [{ playerId: 'asc' }, { sortOrder: 'asc' }],
        include: { player: true }
      }
    }
  });

  if (!match) return res.status(404).json({ error: 'Match not found' });
  res.json(match);
});

router.get('/roster-history', async (req, res) => {
  const parsedTeam = getOptionalQueryString(req.query.team);
  if (parsedTeam.error) return res.status(400).json({ error: parsedTeam.error });

  const data = await prisma.rosterHistory.findMany({
    where: parsedTeam.value ? { team: { slug: parsedTeam.value } } : undefined,
    include: {
      team: { select: { slug: true, name: true } },
      player: true
    },
    orderBy: [{ active: 'desc' }, { id: 'desc' }]
  });
  res.json(data);
});

export default router;
