import Link from 'next/link';
import { getCurrentBandsForAdmin } from '../../../lib/content';

export const metadata = {
  title: 'Admin Bands | xrkr80hd Studio',
};

export default async function AdminBandsPage() {
  const bands = await getCurrentBandsForAdmin();

  return (
    <>
      <section className="card hero">
        <h1>Manage Current Artist Socials</h1>
        <p>Choose a current band/artist and configure the social links shown on their band page.</p>
      </section>

      <section className="section-space">
        <div className="band-grid">
          {bands.length ? (
            bands.map((band) => (
              <article key={band.id} className="band-card">
                <div className="band-card-content">
                  <div className="band-card-year">{band.years_active || 'Current Artist'}</div>
                  <h3 className="band-card-name">{band.name}</h3>
                  <span className="band-card-genre">{band.genre || 'Local Band'}</span>
                  <p className="band-card-desc">{band.summary || 'No summary yet.'}</p>
                  <div className="actions">
                    <Link className="button primary" href={`/admin/bands/${band.slug}/socials`}>
                      Edit Social Links
                    </Link>
                    <Link className="button" href={`/bands/${band.slug}`}>
                      View Band Page
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <article className="card">
              <p className="meta">No current bands found yet in the `scene` era.</p>
            </article>
          )}
        </div>
      </section>
    </>
  );
}
