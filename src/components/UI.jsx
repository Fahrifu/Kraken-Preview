import React from 'react';
import { ArrowUpRight, CalendarDays, Crosshair, Database, RefreshCw, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Eyebrow({children}) { return <p className="eyebrow"><span/>{children}</p>; }

export function GameCard({game}) {
  return <Link className={`game-card ${game.tier || ''}`} to={`/teams/${game.slug}`}>
    <div className="game-watermark">{game.short || game.name?.slice(0, 2).toUpperCase() || 'KR'}</div>
    <div className="game-top"><span>{game.tier === 'flagship' ? 'FLAGSHIP' : 'DIVISION'}</span><small>{game.region || 'TBD'}</small></div>
    <div className="game-bottom"><div><small>{game.ranking || 'UNRANKED'}</small><h3>{game.name || 'Kraken Division'}</h3></div><span className="round-action"><ArrowUpRight/></span></div>
  </Link>
}

export function PlayerRow({player}) {
  const primaryStat = Array.isArray(player.stats) && Array.isArray(player.stats[0]) ? player.stats[0] : null;
  const form = primaryStat ? `${primaryStat[1] ?? '—'} ${primaryStat[0] ?? ''}`.trim() : 'NO DATA';

  return <Link className="player-row" to={`/players/${player.slug}`}>
    <span className="player-num">{player.number ?? '—'}</span>
    <div className="avatar"><Crosshair size={24}/></div>
    <div className="player-name"><h3>{player.ign || player.name || 'Unknown player'}</h3><p>{player.name || 'Roster member'}</p></div>
    <div className="player-meta"><small>ROLE</small><b>{player.role || 'TBD'}</b></div>
    <div className="player-meta"><small>REGION</small><b>{player.country || 'TBD'}</b></div>
    <div className="player-meta stat"><small>FORM</small><b>{form}</b></div>
    <ArrowUpRight className="player-arrow"/>
  </Link>
}

export function MatchRow({match}) {
  const status = String(match.status || 'upcoming').toLowerCase();
  const resultClass = status === 'win' ? 'win' : status === 'loss' ? 'loss' : 'upcoming';
  const opponent = String(match.opponentName || match.opponent || 'TBD').toUpperCase();

  return <div className="match-row">
    <div className="match-date"><CalendarDays size={17}/><span>{match.date || 'TBD'}<small>{match.time || match.event || 'Schedule pending'}</small></span></div>
    <div className="match-versus"><b>KRAKEN</b><span>{match.score || 'VS'}</span><b>{opponent}</b></div>
    <div className="match-event-cell"><small>{match.event || 'Competition'}</small><strong className={resultClass}>{status.toUpperCase()}</strong></div>
  </div>
}


export function DataStatus({ source, loading, error, onRefresh }) {
  return <div className={`data-status ${source}`}>
    <div className="data-status-copy">
      {source === 'database' ? <Database size={15}/> : <WifiOff size={15}/>} 
      <span>{loading ? 'SYNCING DATA' : source === 'database' ? 'LIVE DATABASE DATA' : 'LOCAL FALLBACK DATA'}</span>
      {error && <small>API unavailable — public demo data remains active.</small>}
    </div>
    <button onClick={onRefresh} disabled={loading} aria-label="Refresh Kraken data"><RefreshCw size={15}/></button>
  </div>;
}
