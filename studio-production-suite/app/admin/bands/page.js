import Link from 'next/link';
import { getBandsForAdmin } from '../../../lib/content';

export const metadata = {
  title: 'Admin Bands | xrkr80hd Studio',
};
export const dynamic = 'force-dynamic';

function groupByGenre(items) {
  const map = new Map();

  for (const item of items) {
    const key = String(item.genre || 'uncategorized').trim() || 'uncategorized';
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(item);
  }

  for (const [, group] of map) {
    group.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
  }

  return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

export default async function AdminBandsPage() {
  const bands = await getBandsForAdmin();
  const archiveBands = bands.filter((band) => band.era === 'archive');
  const sceneBands = bands.filter((band) => band.era === 'scene');
  const groupedArchive = groupByGenre(archiveBands);
  const groupedScene = groupByGenre(sceneBands);

  return (
    <>
      <section className="card hero">
        <h1>Band Manager</h1>
        <p>Create/edit bands for each page and keep members organized by genre. Backend only.</p>
        <div className="actions">
          <Link className="button primary" href="/admin/bands/new?era=archive" prefetch={false}>
            New Legends Band
          </Link>
          <Link className="button primary" href="/admin/bands/new?era=scene" prefetch={false}>
            New Scene Band
          </Link>
          <Link className="button" href="/admin/podcasts" prefetch={false}>
            Podcast Manager
          </Link>
        </div>
      </section>

      <section className="section-space">
        <article className="card section-space">
          <h2 className="section-title">YourLocal Legends (Archive)</h2>
          {groupedArchive.length ? (
            groupedArchive.map(([genre, items]) => (
              <section key={`archive-${genre}`} className="section-space">
                <h3 className="section-title">{genre}</h3>
                <div className="band-grid">
                  {items.map((band) => (
                    <article key={band.id} className="band-card">
                      <div className="band-card-content">
                        <div className="band-card-year">{band.years_active || 'Archive Band'}</div>
                        <h3 className="band-card-name">{band.name}</h3>
                        <span className="band-card-genre">{band.genre || 'Local Band'}</span>
                        <p className="band-card-desc">{band.summary || 'No summary yet.'}</p>
                        <div className="actions">
                          <Link className="button primary" href={`/admin/bands/${band.slug}/edit`} prefetch={false}>
                            Edit Band
                          </Link>
                          <Link className="button" href={`/admin/bands/${band.slug}/socials`} prefetch={false}>
                            Social Links
                          </Link>
                          <Link className="button" href={`/bands/${band.slug}`} prefetch={false}>
                            View Page
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <p className="meta">No bands in Legends yet.</p>
          )}
        </article>

        <article className="card section-space">
          <h2 className="section-title">YourLocal Scene (Current)</h2>
          {groupedScene.length ? (
            groupedScene.map(([genre, items]) => (
              <section key={`scene-${genre}`} className="section-space">
                <h3 className="section-title">{genre}</h3>
                <div className="band-grid">
                  {items.map((band) => (
                    <article key={band.id} className="band-card">
                      <div className="band-card-content">
                        <div className="band-card-year">{band.years_active || 'Current Artist'}</div>
                        <h3 className="band-card-name">{band.name}</h3>
                        <span className="band-card-genre">{band.genre || 'Local Band'}</span>
                        <p className="band-card-desc">{band.summary || 'No summary yet.'}</p>
                        <div className="actions">
                          <Link className="button primary" href={`/admin/bands/${band.slug}/edit`} prefetch={false}>
                            Edit Band
                          </Link>
                          <Link className="button" href={`/admin/bands/${band.slug}/socials`} prefetch={false}>
                            Social Links
                          </Link>
                          <Link className="button" href={`/bands/${band.slug}`} prefetch={false}>
                            View Page
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <p className="meta">No bands in Scene yet.</p>
          )}
        </article>
      </section>
    </>
  );
}
