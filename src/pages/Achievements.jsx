import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { api } from '../services/api';

export default function Achievements(){
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');

  useEffect(()=>{
    let active=true;
    api.getAchievements()
      .then((data)=>{if(active)setItems(Array.isArray(data)?data:[]);})
      .catch((err)=>{if(active)setError(err instanceof Error?err.message:'Unable to load achievements');})
      .finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[]);

  return <main className="page-shell"><section className="page-hero compact"><span className="eyebrow">KRAKEN HISTORY</span><h1>Achievements</h1><p>Competitive placements, trophies and organization milestones.</p></section><section className="section achievement-grid">{loading?<div className="empty-state">Loading achievements…</div>:error?<div className="empty-state">Achievement data is temporarily unavailable.</div>:items.length?items.map(item=><article className={`achievement-card ${item.featured?'featured':''}`} key={item.id}><Trophy size={24}/><span className="eyebrow">{item.team?.name||'KRAKEN'}</span><h3>{item.title||'Kraken Achievement'}</h3><strong>{item.placement||'Milestone'}</strong><p>{[item.tournament,item.date,item.prize].filter(Boolean).join(' · ')}</p>{item.description?<small>{item.description}</small>:null}</article>):<div className="empty-state">No achievements have been published yet.</div>}</section></main>;
}
