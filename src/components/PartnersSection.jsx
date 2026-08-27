import { ExternalLink } from 'lucide-react';
import { useSponsors } from '../hooks/useSponsors';

export default function PartnersSection() {
  const { sponsors, loading, error } = useSponsors();

  if (loading) {
    return <section className="partners-section section"><div className="section-head"><div><span className="eyebrow">KRAKEN NETWORK</span><h2>Our Partners</h2></div></div><p className="muted">Loading partners…</p></section>;
  }

  if (error || sponsors.length === 0) return null;

  return (
    <section className="partners-section section">
      <div className="section-head partners-head">
        <div><span className="eyebrow">KRAKEN NETWORK</span><h2>Our Partners</h2></div>
        <p>Organizations supporting Kraken competition, development and community.</p>
      </div>
      <div className="partners-grid">
        {sponsors.map((sponsor) => {
          const body = <>
            <div className="partner-logo-wrap">
              {sponsor.logoUrl ? <img src={sponsor.logoUrl} alt={`${sponsor.name} logo`} /> : <span className="partner-fallback">{sponsor.name.slice(0,2).toUpperCase()}</span>}
            </div>
            <div className="partner-copy"><span className="partner-tier">{sponsor.tier}</span><h3>{sponsor.name}</h3>{sponsor.description ? <p>{sponsor.description}</p> : null}</div>
            {sponsor.websiteUrl ? <ExternalLink size={17} aria-hidden="true" /> : null}
          </>;
          return sponsor.websiteUrl ? <a className="partner-card" href={sponsor.websiteUrl} target="_blank" rel="noreferrer" key={sponsor.id} aria-label={`Visit ${sponsor.name}`}>{body}</a> : <article className="partner-card" key={sponsor.id}>{body}</article>;
        })}
      </div>
    </section>
  );
}
