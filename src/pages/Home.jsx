import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, Crosshair, Gamepad2, Shield, Trophy } from 'lucide-react';
import { useKrakenData } from '../context/DataContext';
import { DataStatus, Eyebrow, GameCard, PlayerRow } from '../components/UI';

import PartnersSection from '../components/PartnersSection';
export default function Home(){
  const { teams, players, matches, news, source, loading, error, refresh } = useKrakenData();
  const featured = players.filter(p=>p.game==='valorant');
  const next = matches.find(m=>m.status==='upcoming') || matches[0];
  return <main>
    <section className="hero">
      <div className="hero-grid"/>
      <img className="hero-logo" src="/kraken-logo-transparent.png" alt="" aria-hidden="true"/>
      <div className="hero-content">
        <Eyebrow>UiA // EUROPEAN ESPORTS</Eyebrow>
        <h1>RELEASE<br/><em>THE KRAKEN.</em></h1>
        <p className="hero-copy">Five divisions under one red-and-white identity. Built around competition, player development and the UiA esports community.</p>
        <div className="hero-actions"><Link className="button primary" to="/teams">EXPLORE TEAMS <ChevronRight size={17}/></Link><Link className="button ghost" to="/matches">LATEST MATCH</Link></div>
      </div>
      <div className="hero-side-label">UiA KRAKEN // NORWAY</div>
      <div className="hero-index"><b>05</b><span>DIVISIONS</span></div>
    </section>

    <section className="match-strip">{next ? <><div className="match-kicker"><span className="live-dot"/> NEXT MATCH</div><div className="match-event"><small>{next.event}</small><b>KRAKEN <span>VS</span> {(next.opponentName || next.opponent || 'TBD').toUpperCase()}</b></div><div className="match-time"><small>{next.date}</small><b>{next.time}</b></div><Link to="/matches">MATCH CENTER <ArrowUpRight size={16}/></Link></> : <div className="empty-state">No matches scheduled.</div>}</section>

    <section className="section data-status-wrap home-data-status"><DataStatus source={source} loading={loading} error={error} onRefresh={refresh}/></section>

    <section className="section teams-section">
      <div className="section-head"><div><Eyebrow>DIVISIONS</Eyebrow><h2>OUR TEAMS</h2></div><p>Valorant, League of Legends and Counter-Strike lead the competitive program, supported by Overwatch 2 and Fortnite.</p></div>
      <div className="game-grid">{teams.map(g=><GameCard key={g.slug} game={g}/>)}</div>
    </section>

    <section className="section roster-section">
      <div className="roster-intro"><Eyebrow>FEATURED ROSTER</Eyebrow><h2>VALORANT<br/><em>STARTING FIVE</em></h2><p>The flagship roster showcases the profile system used across every Kraken division.</p><Link className="text-link" to="/teams/valorant">VIEW FULL DIVISION <ArrowUpRight size={16}/></Link></div>
      <div className="roster-list">{featured.map(p=><PlayerRow key={p.slug} player={p}/>)}</div>
    </section>

    <section className="numbers"><div><Shield/><strong>05</strong><span>ACTIVE DIVISIONS</span></div><div><Trophy/><strong>12</strong><span>PODIUM FINISHES</span></div><div><Gamepad2/><strong>18</strong><span>DEMO PLAYERS</span></div><div><Crosshair/><strong>73%</strong><span>SEASON WIN RATE</span></div></section>

    <section className="section news-section">
      <div className="section-head"><div><Eyebrow>LATEST</Eyebrow><h2>FROM KRAKEN</h2></div><Link className="text-link" to="/news">ALL NEWS <ArrowUpRight size={16}/></Link></div>
      <div className="news-grid">{news.slice(0,3).map((n,i)=><article className="news-card" key={n.title}><div className={`news-art art-${i+1}`}><img src="/kraken-logo-transparent.png" alt=""/></div><div className="news-meta"><span>{n.tag}</span><small>{n.date}</small></div><h3>{n.title}</h3><p>{n.text}</p></article>)}</div>
    </section>

    <section className="brand-section">
      <img className="brand-logo-art" src="/kraken-logo-transparent.png" alt="UiA Kraken logo"/>
      <div className="brand-content"><Eyebrow>OUR IDENTITY</Eyebrow><h2>RED. WHITE.<br/>KRAKEN.</h2><p>The supplied UiA Kraken crest is now the core visual asset throughout the site—from navigation and hero treatment to footer, news art and favicon branding.</p><Link className="button light" to="/about">DISCOVER KRAKEN <ArrowUpRight size={16}/></Link></div>
    </section>
        <PartnersSection />
    </main>
}
