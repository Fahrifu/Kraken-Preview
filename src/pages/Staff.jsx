import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Staff(){
  const [items,setItems]=useState([]);
  useEffect(()=>{api.getStaff().then(setItems).catch(()=>setItems([]));},[]);
  return <main className="page-shell"><section className="page-hero compact"><span className="eyebrow">KRAKEN ORGANIZATION</span><h1>Staff</h1><p>Coaches, analysts and management supporting Kraken competition.</p></section><section className="section staff-grid">{items.map(item=><article className="staff-card" key={item.id}><div className="staff-image">{item.imageUrl?<img src={item.imageUrl} alt={item.name}/>:<span>{item.name.slice(0,2).toUpperCase()}</span>}</div><div><span className="eyebrow">{item.team?.name||'ORGANIZATION'}</span><h3>{item.name}</h3><strong>{item.role}</strong>{item.bio?<p>{item.bio}</p>:null}</div></article>)}</section></main>;
}
