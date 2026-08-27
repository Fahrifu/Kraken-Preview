
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useKrakenData } from '../context/DataContext';
import { DataStatus, Eyebrow, PlayerRow, MatchRow } from '../components/UI';

export default function TeamDetail(){
  const {slug}=useParams();
  const { teams, players, matches, source, loading, error, refresh } = useKrakenData();
  const team=teams.find(t=>t.slug===slug);
  if(loading && !team) return <main className="page-main"><section className="page-hero"><Eyebrow>SYNCING</Eyebrow><h1>LOADING DIVISION</h1></section></main>;
  if(!team) return <main className="page-main"><section className="page-hero"><h1>DIVISION NOT FOUND</h1><Link to="/teams">Back to teams</Link></section></main>;
  const roster=players.filter(p=>p.game===slug), teamMatches=matches.filter(m=>m.game===slug);
  return <main className="page-main">
    <section className="division-hero"><div className="division-watermark">{team.short}</div><div className="division-copy"><Link className="back-link" to="/teams"><ArrowLeft size={16}/> ALL TEAMS</Link><Eyebrow>{team.tier.toUpperCase()} DIVISION // {team.region}</Eyebrow><h1>{team.name}</h1><p>{team.summary}</p><div className="division-badges"><span>{team.record} RECORD</span><span>{team.ranking}</span></div></div><img src="/kraken-logo-transparent.png" alt="UiA Kraken"/></section>
    <section className="section data-status-wrap"><DataStatus source={source} loading={loading} error={error} onRefresh={refresh}/></section>
    <section className="division-stats">{(team.stats || []).map(s=><div key={s.label}><small>{s.label}</small><strong>{s.value}</strong></div>)}</section>
    <section className="section"><div className="section-head"><div><Eyebrow>ACTIVE LINEUP</Eyebrow><h2>ROSTER</h2></div><p>Select a player to open their individual competitive profile.</p></div><div className="roster-list full">{roster.length?roster.map(p=><PlayerRow key={p.slug} player={p}/>):<div className="empty-state">No players have been added to this division yet.</div>}</div></section>
    <section className="section alt-section"><div className="section-head"><div><Eyebrow>MATCH CENTER</Eyebrow><h2>SCHEDULE & RESULTS</h2></div><Link className="text-link" to="/matches">ALL MATCHES <ArrowUpRight size={16}/></Link></div><div className="match-list">{teamMatches.length?teamMatches.map(m=><MatchRow key={m.id} match={m}/>):<div className="empty-state">No match data has been added for this division yet.</div>}</div></section>
  </main>;
}
