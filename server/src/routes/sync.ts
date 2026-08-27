import { Router } from 'express';
import { prisma } from '../prisma.ts';
import { requireAuth } from '../middleware/auth.ts';
import { listProviders } from '../integrations/registry.ts';
import { runTeamSync } from '../integrations/syncService.ts';

const router = Router();
router.use(requireAuth);

router.get('/providers', (_req, res) => {
  res.json(listProviders());
});

router.get('/runs', async (_req, res) => {
  res.json(await prisma.syncRun.findMany({
    orderBy: { startedAt: 'desc' },
    take: 50
  }));
});

router.post('/teams/:teamId', async (req, res) => {
  const teamId = Number(req.params.teamId);
  if (!Number.isInteger(teamId)) {
    return res.status(400).json({ error: 'Invalid team ID' });
  }

  try {
    res.json(await runTeamSync(teamId));
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Sync failed'
    });
  }
});

export default router;
