export type SyncSummary = {
  imported: number;
  updated: number;
  skipped: number;
  metadata?: Record<string, unknown>;
};

export interface CompetitiveProvider {
  id: string;
  game: string;
  syncTeam(teamId: number): Promise<SyncSummary>;
}
