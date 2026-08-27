import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export function BrandLogo({ compact=false }) {
  return (
    <Link className={`brand-logo ${compact ? 'compact' : ''}`} to="/" aria-label="UiA Kraken home">
      <img src="/kraken-logo-transparent.png" alt="UiA Kraken" />
      {!compact && <span><b>KRAKEN</b><small>ESPORTS</small></span>}
    </Link>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const items = [['Teams','/teams'],['Matches','/matches'],['Tournaments','/tournaments'],['Achievements','/achievements'],['News','/news'],['About','/about']];
  return (
    <div className="site-shell">
      <header className="navbar">
        <BrandLogo />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {items.map(([label,path]) => <NavLink key={path} to={path}>{label}</NavLink>)}
        <NavLink to="/partners">Partners</NavLink>
        <NavLink to="/staff">Staff</NavLink>
</nav>
        <Link className="nav-cta" to="/about">KRAKEN PROFILE <ArrowUpRight size={15}/></Link>
        <button className="menu-btn" onClick={()=>setOpen(true)} aria-label="Open menu"><Menu/></button>
      </header>

      {open && <div className="mobile-menu">
        <div className="mobile-top"><BrandLogo/><button onClick={()=>setOpen(false)} aria-label="Close menu"><X/></button></div>
        <div className="mobile-links">
          {items.map(([label,path],i)=><NavLink key={path} to={path} onClick={()=>setOpen(false)}><span>0{i+1}</span>{label}</NavLink>)}
        </div>
      </div>}

      <Outlet />

      <footer>
        <div className="footer-top">
          <BrandLogo />
          <div className="footer-statement">RELEASE THE KRAKEN.<br/><span>COMPETE TOGETHER.</span></div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 UiA KRAKEN ESPORTS</span>
          <div><a href="#">INSTAGRAM</a><a href="#">X / TWITTER</a><a href="#">YOUTUBE</a><a href="#">DISCORD</a></div>
          <Link to="/">HOME ↑</Link>
        </div>
      </footer>
    </div>
  );
}
