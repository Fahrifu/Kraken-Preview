import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function RosterHistory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.getRosterHistory().then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <main className="page-shell">
      <section className="page-hero compact">
        <span className="eyebrow">KRAKEN ARCHIVE</span>
        <h1>Roster History</h1>
        <p>Current and previous competitive roster assignments across Kraken divisions.</p>
      </section>

      <section className="section roster-history-list">
        {items.map(item => <article className="roster-history-card" key={item.id}>
          <div>
            <span className="eyebrow">{item.team?.name || 'KRAKEN'}</span>
            <h3>{item.player?.ign || item.player?.name}</h3>
            <p>{item.role || item.player?.role}</p>
          </div>
          <div className="roster-history-dates">
            <strong>{item.active ? 'ACTIVE' : 'FORMER'}</strong>
            <span>{item.joinedAt || 'Unknown'} → {item.active ? 'Present' : (item.leftAt || 'Unknown')}</span>
          </div>
          {item.notes ? <p>{item.notes}</p> : null}
        </article>)}
      </section>
    </main>
  );
}
