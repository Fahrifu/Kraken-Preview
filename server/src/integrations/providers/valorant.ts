import type { CompetitiveProvider, SyncSummary } from '../types.ts';

export class ValorantProvider implements CompetitiveProvider {
  id = 'valorant-provider';
  game = 'valorant';

  async syncTeam(_teamId: number): Promise<SyncSummary> {
    throw new Error('Valorant sync is not enabled yet. Configure an approved competitive-data provider first.');
  }
}
