import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Tournaments(){
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');

  useEffect(()=>{
    let active=true;
    api.getTournaments()
      .then((data)=>{if(active)setItems(Array.isArray(data)?data:[]);})
      .catch((err)=>{if(active)setError(err instanceof Error?err.message:'Unable to load tournaments');})
      .finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[]);

  return <main className="page-shell"><section className="page-hero compact"><span className="eyebrow">COMPETITION</span><h1>Tournaments</h1><p>Current and upcoming competitions across Kraken divisions.</p></section><section className="section tournament-list">{loading?<div className="empty-state">Loading tournaments…</div>:error?<div className="empty-state">Tournament data is temporarily unavailable.</div>:items.length?items.map(item=><article className="tournament-card" key={item.id}><div className="tournament-logo">{item.logoUrl?<img src={item.logoUrl} alt=""/>:<span>{(item.name||'KR').slice(0,2).toUpperCase()}</span>}</div><div><span className="eyebrow">{item.team?.name||item.region||'KRAKEN'}</span><h3>{item.name||'Kraken Tournament'}</h3><p>{[item.organizer,item.tier,item.region].filter(Boolean).join(' · ')}</p></div><div className="tournament-meta"><strong>{item.status||'TBD'}</strong><span>{[item.startDate,item.endDate].filter(Boolean).join(' → ')||'Dates TBD'}</span></div></article>):<div className="empty-state">No tournaments have been published yet.</div>}</section></main>;
}
