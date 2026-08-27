import React from 'react';
import { ArrowUpRight, CalendarDays, Crosshair, Database, RefreshCw, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Eyebrow({children}) { return <p className="eyebrow"><span/>{children}</p>; }

export function GameCard({game}) {
  return <Link className={`game-card ${game.tier}`} to={`/teams/${game.slug}`}>
    <div className="game-watermark">{game.short}</div>
    <div className="game-top"><span>{game.tier === 'flagship' ? 'FLAGSHIP' : 'DIVISION'}</span><small>{game.region}</small></div>
    <div className="game-bottom"><div><small>{game.ranking}</small><h3>{game.name}</h3></div><span className="round-action"><ArrowUpRight/></span></div>
  </Link>
}

export function PlayerRow({player}) {
  return <Link className="player-row" to={`/players/${player.slug}`}>
    <span className="player-num">{player.number}</span>
    <div className="avatar"><Crosshair size={24}/></div>
    <div className="player-name"><h3>{player.ign}</h3><p>{player.name}</p></div>
    <div className="player-meta"><small>ROLE</small><b>{player.role}</b></div>
    <div className="player-meta"><small>REGION</small><b>{player.country}</b></div>
    <div className="player-meta stat"><small>FORM</small><b>{player.stats[0][1]} {player.stats[0][0]}</b></div>
    <ArrowUpRight className="player-arrow"/>
  </Link>
}

export function MatchRow({match}) {
  const resultClass = match.status === 'win' ? 'win' : match.status === 'loss' ? 'loss' : 'upcoming';
  return <div className="match-row">
    <div className="match-date"><CalendarDays size={17}/><span>{match.date}<small>{match.time || match.event}</small></span></div>
    <div className="match-versus"><b>KRAKEN</b><span>{match.score || 'VS'}</span><b>{(match.opponentName || match.opponent || 'TBD').toUpperCase()}</b></div>
    <div className="match-event-cell"><small>{match.event}</small><strong className={resultClass}>{match.status.toUpperCase()}</strong></div>
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
