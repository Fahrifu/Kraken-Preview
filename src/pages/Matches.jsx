
import React from 'react';
import { useKrakenData } from '../context/DataContext';
import { DataStatus, Eyebrow, MatchRow } from '../components/UI';
export default function Matches(){
 const { matches, source, loading, error, refresh } = useKrakenData();
 const upcoming=matches.filter(m=>m.status==='upcoming'), recent=matches.filter(m=>m.status!=='upcoming');
 return <main className="page-main"><section className="page-hero"><Eyebrow>KRAKEN MATCH CENTER</Eyebrow><h1>MATCHES</h1><p>One database-driven schedule for every Kraken division. Admin changes can now flow into the public match center through the API.</p></section><section className="section data-status-wrap"><DataStatus source={source} loading={loading} error={error} onRefresh={refresh}/></section><section className="section"><div className="section-head"><div><Eyebrow>NEXT UP</Eyebrow><h2>UPCOMING</h2></div></div><div className="match-list">{upcoming.length?upcoming.map(m=><MatchRow key={m.id} match={m}/>):<div className="empty-state">No upcoming matches.</div>}</div></section><section className="section alt-section"><div className="section-head"><div><Eyebrow>RECENT</Eyebrow><h2>RESULTS</h2></div></div><div className="match-list">{recent.length?recent.map(m=><MatchRow key={m.id} match={m}/>):<div className="empty-state">No recent results.</div>}</div></section></main>;
}
