import { prisma } from '../prisma.ts';
import { getProvider } from './registry.ts';

export async function runTeamSync(teamId: number) {
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) throw new Error('Team not found');

  const provider = getProvider(team.slug);
  if (!provider) throw new Error(`No provider registered for ${team.slug}`);

  const run = await prisma.syncRun.create({
    data: {
      provider: provider.id,
      game: provider.game,
      status: 'running'
    }
  });

  try {
    const summary = await provider.syncTeam(team.id);

    return prisma.syncRun.update({
      where: { id: run.id },
      data: {
        status: 'success',
        finishedAt: new Date(),
        imported: summary.imported,
        updated: summary.updated,
        skipped: summary.skipped,
        metadata: summary.metadata || {}
      }
    });
  } catch (error) {
    await prisma.syncRun.update({
      where: { id: run.id },
      data: {
        status: 'failed',
        finishedAt: new Date(),
        errorMessage: error instanceof Error ? error.message : 'Unknown sync error'
      }
    });
    throw error;
  }
}
