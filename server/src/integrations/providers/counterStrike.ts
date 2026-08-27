import type { CompetitiveProvider, SyncSummary } from '../types.ts';

export class CounterStrikeProvider implements CompetitiveProvider {
  id = 'counter-strike-provider';
  game = 'counter-strike';

  async syncTeam(_teamId: number): Promise<SyncSummary> {
    throw new Error('Counter-Strike sync is not enabled yet. Configure the selected competitive-data provider first.');
  }
}
