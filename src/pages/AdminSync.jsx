import { useEffect, useState } from 'react';
import { DatabaseZap, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function AdminSync() {
  const token = localStorage.getItem('kraken_admin_token') || '';
  const [teams, setTeams] = useState([]);
  const [providers, setProviders] = useState([]);
  const [runs, setRuns] = useState([]);
  const [message, setMessage] = useState('');
  const [busyTeam, setBusyTeam] = useState(null);

  async function load() {
    if (!token) return;
    try {
      const [teamData, providerData, runData] = await Promise.all([
        api.adminList('teams', token),
        api.syncProviders(token),
        api.syncRuns(token)
      ]);
      setTeams(teamData);
      setProviders(providerData);
      setRuns(runData);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to load sync data');
    }
  }

  useEffect(() => { load(); }, []);

  async function sync(team) {
    setBusyTeam(team.id);
    setMessage('');
    try {
      const result = await api.syncTeam(team.id, token);
      setMessage(`${team.name}: ${result.imported} imported, ${result.updated} updated, ${result.skipped} skipped.`);
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Sync failed');
      await load();
    } finally {
      setBusyTeam(null);
    }
  }

  const providerGames = new Set(providers.map(p => p.game));

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <div>
          <span className="eyebrow">KRAKEN DATA PIPELINE</span>
          <h1>Competitive Sync</h1>
          <p className="muted">Import external competitive data into PostgreSQL.</p>
        </div>
        <button className="button button-ghost" onClick={load}><RefreshCw size={16}/> Refresh</button>
      </header>

      {message ? <p className="sync-message">{message}</p> : null}

      <section className="sync-team-grid">
        {teams.filter(team => ['league-of-legends','valorant','counter-strike'].includes(team.slug)).map(team => (
          <article className="sync-team-card" key={team.id}>
            <div>
              <span className="eyebrow">{team.short}</span>
              <h2>{team.name}</h2>
              <p>{team.slug === 'league-of-legends'
                ? 'Riot Match-V5 sync is available after configuring RIOT_API_KEY and a player PUUID.'
                : 'Adapter slot exists; provider selection is still pending.'}</p>
            </div>
            <button
              className="button button-primary"
              disabled={busyTeam === team.id || !providerGames.has(team.slug)}
              onClick={() => sync(team)}
            >
              <DatabaseZap size={16}/>
              {busyTeam === team.id ? 'Syncing…' : 'Run Sync'}
            </button>
          </article>
        ))}
      </section>

      <section className="section">
        <div className="section-head"><div><span className="eyebrow">AUDIT</span><h2>Recent Sync Runs</h2></div></div>
        <div className="sync-run-list">
          {runs.map(run => (
            <article className={`sync-run ${run.status}`} key={run.id}>
              <div><strong>{run.game}</strong><span>{run.provider}</span></div>
              <div><strong>{run.status}</strong><span>{new Date(run.startedAt).toLocaleString()}</span></div>
              <div><strong>{run.imported}</strong><span>imported</span></div>
              <div><strong>{run.updated}</strong><span>updated</span></div>
              <div><strong>{run.skipped}</strong><span>skipped</span></div>
              {run.errorMessage ? <p>{run.errorMessage}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
