import { Router } from 'express';
import { prisma } from '../prisma.ts';
import { requireAuth } from '../middleware/auth.ts';

const router = Router();
router.use(requireAuth);

const models = {
  teams: prisma.team,
  players: prisma.player,
  matches: prisma.match,
  news: prisma.newsArticle,
  sponsors: prisma.sponsor,
  staff: prisma.staff,
  achievements: prisma.achievement,
  tournaments: prisma.tournament,
  opponents: prisma.opponent,
  matchMaps: prisma.matchMap,
  matchLineups: prisma.matchLineup,
  matchPlayerStats: prisma.matchPlayerStat,
  rosterHistory: prisma.rosterHistory,
  integrationConfigs: prisma.integrationConfig,
  syncRuns: prisma.syncRun,
  externalMatches: prisma.externalMatch
};

router.get('/overview', async (_req, res) => {
  const [teams, players, matches, news, sponsors, staff, achievements, tournaments, opponents] = await Promise.all([
    prisma.team.count(), prisma.player.count(), prisma.match.count(), prisma.newsArticle.count(), prisma.sponsor.count(),
    prisma.staff.count(), prisma.achievement.count(), prisma.tournament.count(), prisma.opponent.count()
  ]);
  res.json({ teams, players, matches, news, sponsors, staff, achievements, tournaments, opponents });
});

router.get('/:resource', async (req, res) => {
  const model = models[req.params.resource];
  if (!model) return res.status(404).json({ error: 'Unknown resource' });
  res.json(await model.findMany({ orderBy: { id: 'asc' } }));
});

router.post('/:resource', async (req, res) => {
  const model = models[req.params.resource];
  if (!model) return res.status(404).json({ error: 'Unknown resource' });

  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Request body is missing or invalid' });
  }

  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    res.status(201).json(await model.create({ data }));
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unable to create resource' });
  }
});

router.patch('/:resource/:id', async (req, res) => {
  const model = models[req.params.resource];
  if (!model) return res.status(404).json({ error: 'Unknown resource' });

  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid resource ID' });
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Request body is missing or invalid' });
  }

  try {
    const { id: _id, createdAt, updatedAt, ...data } = req.body;
    res.json(await model.update({ where: { id }, data }));
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unable to update resource' });
  }
});

router.delete('/:resource/:id', async (req, res) => {
  const model = models[req.params.resource];
  if (!model) return res.status(404).json({ error: 'Unknown resource' });
  try {
    await model.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
