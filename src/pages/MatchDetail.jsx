import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarDays, ExternalLink, Map, Users } from 'lucide-react';
import { api } from '../services/api';

export default function MatchDetail() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getMatch(id)
      .then(setMatch)
      .catch(err => setError(err instanceof Error ? err.message : 'Unable to load match'))
      .finally(() => setLoading(false));
  }, [id]);

  const groupedStats = useMemo(() => {
    const groups = new Map();
    for (const stat of match?.playerStats || []) {
      const key = stat.player?.id || stat.playerId;
      if (!groups.has(key)) groups.set(key, { player: stat.player, stats: [] });
      groups.get(key).stats.push(stat);
    }
    return [...groups.values()];
  }, [match]);

  if (loading) return <main className="page-shell"><section className="section"><p>Loading match…</p></section></main>;
  if (error || !match) return <main className="page-shell"><section className="section"><h1>Match unavailable</h1><p>{error || 'Match not found.'}</p><Link to="/matches">Back to matches</Link></section></main>;

  return (
    <main className="page-shell">
      <section className="match-detail-hero">
        <span className="eyebrow">{match.team?.name || 'KRAKEN'} · {match.event}</span>
        <h1>KRAKEN <span>VS</span> {match.opponentEntity?.name || match.opponentName}</h1>
        <div className="match-detail-meta">
          <span><CalendarDays size={16}/>{match.date} {match.time}</span>
          {match.stage ? <span>{match.stage}</span> : null}
          {match.format ? <span>{match.format}</span> : null}
        </div>
        <div className="match-scoreline">
          <strong>{match.score || (match.status === 'upcoming' ? 'UPCOMING' : 'TBD')}</strong>
          <span>{match.status}</span>
        </div>
        {match.streamUrl ? <a className="button button-primary" href={match.streamUrl} target="_blank" rel="noreferrer">Watch stream <ExternalLink size={16}/></a> : null}
      </section>

      {match.maps?.length ? (
        <section className="section">
          <div className="section-head"><div><span className="eyebrow">SERIES</span><h2>Maps / Games</h2></div><Map size={24}/></div>
          <div className="map-result-grid">
            {match.maps.map(map => <article className="map-result-card" key={map.id}>
              <span>#{String(map.order).padStart(2,'0')}</span>
              <h3>{map.name}</h3>
              <strong>{map.krakenScore ?? '-'} <small>:</small> {map.opponentScore ?? '-'}</strong>
              <em>{map.result || 'pending'}</em>
              {map.notes ? <p>{map.notes}</p> : null}
            </article>)}
          </div>
        </section>
      ) : null}

      {match.lineup?.length ? (
        <section className="section">
          <div className="section-head"><div><span className="eyebrow">MATCH ROSTER</span><h2>Lineup</h2></div><Users size={24}/></div>
          <div className="lineup-grid">
            {match.lineup.map(entry => <article className="lineup-card" key={entry.id}>
              <span>{entry.side}</span>
              <strong>{entry.player?.ign || entry.playerName || 'TBD'}</strong>
              <small>{entry.role || `Slot ${entry.slot}`}</small>
            </article>)}
          </div>
        </section>
      ) : null}

      {groupedStats.length ? (
        <section className="section">
          <div className="section-head"><div><span className="eyebrow">PERFORMANCE</span><h2>Player Statistics</h2></div></div>
          <div className="match-stats-table">
            {groupedStats.map(group => <article className="match-player-stat" key={group.player?.id}>
              <Link to={group.player?.slug ? `/players/${group.player.slug}` : '#'} className="match-player-name">
                {group.player?.ign || group.player?.name || 'Player'}
              </Link>
              <div className="match-player-metrics">
                {group.stats.map(stat => <div key={stat.id}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}
              </div>
            </article>)}
          </div>
        </section>
      ) : null}

      {match.notes ? (
        <section className="section match-report">
          <span className="eyebrow">MATCH REPORT</span>
          <h2>Notes</h2>
          <p>{match.notes}</p>
        </section>
      ) : null}
    </main>
  );
}
