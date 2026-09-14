import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Staff(){
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');

  useEffect(()=>{
    let active=true;
    api.getStaff()
      .then((data)=>{if(active)setItems(Array.isArray(data)?data:[]);})
      .catch((err)=>{if(active)setError(err instanceof Error?err.message:'Unable to load staff');})
      .finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[]);

  return <main className="page-shell"><section className="page-hero compact"><span className="eyebrow">KRAKEN ORGANIZATION</span><h1>Staff</h1><p>Coaches, analysts and management supporting Kraken competition.</p></section><section className="section staff-grid">{loading?<div className="empty-state">Loading staff…</div>:error?<div className="empty-state">Staff data is temporarily unavailable.</div>:items.length?items.map(item=><article className="staff-card" key={item.id}><div className="staff-image">{item.imageUrl?<img src={item.imageUrl} alt={item.name||'Kraken staff member'}/>:<span>{(item.name||'KR').slice(0,2).toUpperCase()}</span>}</div><div><span className="eyebrow">{item.team?.name||'ORGANIZATION'}</span><h3>{item.name||'Kraken Staff'}</h3><strong>{item.role||'Staff'}</strong>{item.bio?<p>{item.bio}</p>:null}</div></article>):<div className="empty-state">No staff profiles have been published yet.</div>}</section></main>;
}
