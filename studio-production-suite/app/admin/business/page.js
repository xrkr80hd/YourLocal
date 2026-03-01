import Link from 'next/link';
import { getLocalBusinessesForAdmin } from '../../../lib/content';

export const metadata = {
  title: 'Business Manager | Admin',
};
export const dynamic = 'force-dynamic';

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

export default async function AdminBusinessPage() {
  const businesses = await getLocalBusinessesForAdmin();

  return (
    <>
      <section className="card hero">
        <h1>YourLocal Business Manager</h1>
        <p>Create, edit, and remove business cards for the public YourLocal Business page.</p>
        <div className="actions">
          <Link className="button primary" href="/admin/business/new" prefetch={false}>
            New Business Card
          </Link>
          <Link className="button" href="/your-local-business" prefetch={false}>
            View Public Page
          </Link>
        </div>
      </section>

      <section className="section-space">
        {businesses.length ? (
          <div className="band-grid">
            {businesses.map((item) => (
              <article key={item.id} className="band-card">
                <div className="band-card-content">
                  <div className="business-logo-wrap">
                    {item.logo_url ? (
                      <img className="business-logo" src={item.logo_url} alt={`${item.name} logo`} />
                    ) : (
                      <div className="business-logo business-logo-fallback">{initials(item.name)}</div>
                    )}
                  </div>
                  <div className="band-card-year">sort {Number.isFinite(Number(item.sort_order)) ? Number(item.sort_order) : 0}</div>
                  <h3 className="band-card-name">{item.name}</h3>
                  {item.category ? <span className="band-card-genre">{item.category}</span> : null}
                  {item.summary ? <p className="band-card-desc">{item.summary}</p> : null}
                  {item.description ? <p className="meta">{item.description}</p> : null}
                  <p className="meta">Published: {item.is_published ? 'yes' : 'no'}</p>
                  <div className="actions">
                    <Link className="button primary" href={`/admin/business/${item.id}/edit`} prefetch={false}>
                      Edit Business
                    </Link>
                    {item.website_url ? (
                      <a className="button" href={item.website_url} target="_blank" rel="noreferrer">
                        Visit Site
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <article className="card">
            <p className="meta">No business cards yet. Create one from this admin panel.</p>
          </article>
        )}
      </section>
    </>
  );
}
