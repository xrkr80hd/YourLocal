import Link from 'next/link';

const businesses = [
  {
    name: 'MyWildRoseDesigns',
    category: 'Print Business',
    summary: 'Custom print work and design support.',
    logo_url: '',
    website_url: '',
  },
  {
    name: 'MMSound',
    category: 'Live Sound / Audio',
    summary: 'Local sound support and production services.',
    logo_url: '',
    website_url: '',
  },
  {
    name: 'Nick Lena EG',
    category: 'Media / Production',
    summary: 'Creative media and production support.',
    logo_url: '',
    website_url: '',
  },
  {
    name: 'Red River Music',
    category: 'Music Community',
    summary: 'Supporting local music growth and connections.',
    logo_url: '',
    website_url: '',
  },
  {
    name: 'Cenla Music Repair',
    category: 'Instrument Repair',
    summary: 'Local instrument maintenance and repair services.',
    logo_url: '',
    website_url: '',
  },
  {
    name: 'Juggling Juices and Bowls',
    category: 'Local Food Business',
    summary: 'Fresh local food and drink options.',
    logo_url: '',
    website_url: '',
  },
];

function initials(value) {
  const parts = String(value || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) {
    return 'YL';
  }

  return parts.map((part) => part[0]?.toUpperCase() || '').join('');
}

export default function YourLocalBusinessPage() {
  return (
    <>
      <section className="card hero band-hero">
        <span className="tag-badge">Support Local</span>
        <h1>
          <span className="hero-accent">YourLocal</span> Business
        </h1>
        <p>Local businesses we support. This page is staged and ready for logos, links, and spotlight updates.</p>
        <div className="actions">
          <Link className="button" href="/your-local-scene">
            YourLocal Scene
          </Link>
          <Link className="button" href="/local-legends-archive">
            YourLocal Legends
          </Link>
          <Link className="button primary" href="/your-local-business">
            YourLocal Business
          </Link>
        </div>
      </section>

      <section className="section-space">
        <div className="band-grid">
          {businesses.map((item) => (
            <article key={item.name} className="band-card">
              <div className="band-card-content">
                <div className="business-logo-wrap">
                  {item.logo_url ? (
                    <img className="business-logo" src={item.logo_url} alt={`${item.name} logo`} />
                  ) : (
                    <div className="business-logo business-logo-fallback">{initials(item.name)}</div>
                  )}
                </div>
                <div className="band-card-year">Staged Support Listing</div>
                <h3 className="band-card-name">{item.name}</h3>
                <span className="band-card-genre">{item.category}</span>
                <p className="band-card-desc">{item.summary}</p>
                <div className="actions">
                  {item.website_url ? (
                    <a className="button" href={item.website_url} target="_blank" rel="noreferrer">
                      Visit
                    </a>
                  ) : (
                    <span className="meta">Website link pending</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
