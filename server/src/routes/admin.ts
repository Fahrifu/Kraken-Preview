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

function parseResourceId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function isValidBody(body) {
  return body && typeof body === 'object' && !Array.isArray(body);
}

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

  if (!isValidBody(req.body)) {
    return res.status(400).json({ error: 'Request body is missing or invalid' });
  }

  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    res.status(201).json(await model.create({ data }));
  } catch (error) {
    console.error('Admin create failed:', error);
    res.status(400).json({ error: 'Unable to create resource. Check the submitted fields and relationships.' });
  }
});

router.patch('/:resource/:id', async (req, res) => {
  const model = models[req.params.resource];
  if (!model) return res.status(404).json({ error: 'Unknown resource' });

  const id = parseResourceId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid resource ID' });
  if (!isValidBody(req.body)) {
    return res.status(400).json({ error: 'Request body is missing or invalid' });
  }

  try {
    const { id: _id, createdAt, updatedAt, ...data } = req.body;
    res.json(await model.update({ where: { id }, data }));
  } catch (error) {
    console.error('Admin update failed:', error);
    res.status(400).json({ error: 'Unable to update resource. Check the submitted fields and relationships.' });
  }
});

router.delete('/:resource/:id', async (req, res) => {
  const model = models[req.params.resource];
  if (!model) return res.status(404).json({ error: 'Unknown resource' });

  const id = parseResourceId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid resource ID' });

  try {
    await model.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    console.error('Admin delete failed:', error);
    res.status(400).json({ error: 'Unable to delete resource. It may be referenced by related data.' });
  }
});

export default router;
