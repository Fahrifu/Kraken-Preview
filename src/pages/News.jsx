
import React from 'react';
import { useKrakenData } from '../context/DataContext';
import { DataStatus, Eyebrow } from '../components/UI';
export default function News(){
 const { news, source, loading, error, refresh }=useKrakenData();
 return <main className="page-main"><section className="page-hero"><Eyebrow>ORGANIZATION UPDATES</Eyebrow><h1>NEWS</h1><p>Roster announcements, tournament updates and Kraken stories are now ready to be managed from the backend.</p></section><section className="section data-status-wrap"><DataStatus source={source} loading={loading} error={error} onRefresh={refresh}/></section><section className="section"><div className="news-grid page-news">{news.length?news.map((n,i)=><article className="news-card" key={n.id || n.title}><div className={`news-art art-${(i%3)+1}`}><img src="/kraken-logo-transparent.png" alt=""/></div><div className="news-meta"><span>{n.tag}</span><small>{n.date}</small></div><h3>{n.title}</h3><p>{n.text}</p></article>):<div className="empty-state">No news articles published yet.</div>}</div></section></main>;
}
