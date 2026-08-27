
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Crosshair } from 'lucide-react';
import { useKrakenData } from '../context/DataContext';
import { DataStatus, Eyebrow } from '../components/UI';

export default function PlayerDetail(){
 const {slug}=useParams();
 const { players, teams, source, loading, error, refresh } = useKrakenData();
 const player=players.find(p=>p.slug===slug);
 if(loading && !player) return <main className="page-main"><section className="page-hero"><Eyebrow>SYNCING</Eyebrow><h1>LOADING PLAYER</h1></section></main>;
 if(!player) return <main className="page-main"><section className="page-hero"><h1>PLAYER NOT FOUND</h1></section></main>;
 const team=teams.find(t=>t.slug===player.game);
 return <main className="page-main"><section className="player-hero"><div className="player-profile-copy"><Link className="back-link" to={`/teams/${team?.slug || player.game}`}><ArrowLeft size={16}/> {team?.name || 'TEAM'}</Link><Eyebrow>{player.country} // {player.role.toUpperCase()}</Eyebrow><p className="profile-number">{player.number}</p><h1>{player.ign}</h1><h3>{player.name}</h3><p>{player.bio}</p></div><div className="player-visual"><img src="/kraken-logo-transparent.png" alt=""/><Crosshair size={90}/></div></section><section className="section data-status-wrap"><DataStatus source={source} loading={loading} error={error} onRefresh={refresh}/></section><section className="profile-stats">{(player.stats || []).map(([label,value])=><div key={label}><small>{label}</small><strong>{value}</strong></div>)}</section><section className="section profile-info"><div><Eyebrow>PLAYER PROFILE</Eyebrow><h2>ROLE & STYLE</h2><p>{player.bio}</p></div><div><Eyebrow>SPECIALTIES</Eyebrow><div className="specialty-list">{(player.specialties || []).map(x=><span key={x}>{x}</span>)}</div></div></section></main>
}
