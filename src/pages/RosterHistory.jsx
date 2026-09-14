import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function RosterHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.getRosterHistory()
      .then((data) => { if (active) setItems(Array.isArray(data) ? data : []); })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : 'Unable to load roster history'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <main className="page-shell">
      <section className="page-hero compact">
        <span className="eyebrow">KRAKEN ARCHIVE</span>
        <h1>Roster History</h1>
        <p>Current and previous competitive roster assignments across Kraken divisions.</p>
      </section>

      <section className="section roster-history-list">
        {loading ? <div className="empty-state">Loading roster history…</div> : error ? <div className="empty-state">Roster history is temporarily unavailable.</div> : items.length ? items.map(item => <article className="roster-history-card" key={item.id}>
          <div>
            <span className="eyebrow">{item.team?.name || 'KRAKEN'}</span>
            <h3>{item.player?.ign || item.player?.name || 'Unknown player'}</h3>
            <p>{item.role || item.player?.role || 'Player'}</p>
          </div>
          <div className="roster-history-dates">
            <strong>{item.active ? 'ACTIVE' : 'FORMER'}</strong>
            <span>{item.joinedAt || 'Unknown'} → {item.active ? 'Present' : (item.leftAt || 'Unknown')}</span>
          </div>
          {item.notes ? <p>{item.notes}</p> : null}
        </article>) : <div className="empty-state">No roster history has been published yet.</div>}
      </section>
    </main>
  );
}
