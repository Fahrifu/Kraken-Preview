
import React from 'react';
import { useKrakenData } from '../context/DataContext';
import { DataStatus, Eyebrow, GameCard } from '../components/UI';

export default function Teams(){
  const { teams, source, loading, error, refresh } = useKrakenData();
  return <main className="page-main">
    <section className="page-hero"><Eyebrow>05 DIVISIONS // ONE IDENTITY</Eyebrow><h1>TEAMS</h1><p>Explore every competitive Kraken roster. Team information is now loaded through the Kraken API and PostgreSQL when available.</p></section>
    <section className="section data-status-wrap"><DataStatus source={source} loading={loading} error={error} onRefresh={refresh}/></section>
    <section className="section"><div className="game-grid page-grid">{teams.map(g=><GameCard key={g.slug} game={g}/>)}</div></section>
  </main>;
}
