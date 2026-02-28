import Link from 'next/link';
import { getPodcastsForAdmin } from '../../../lib/content';

export const metadata = {
  title: 'Admin Podcasts | xrkr80hd Studio',
};

function groupByTopic(items) {
  const map = new Map();

  for (const item of items) {
    const key = String(item.topic || 'uncategorized').trim() || 'uncategorized';
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(item);
  }

  return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

export default async function AdminPodcastsPage() {
  const podcasts = await getPodcastsForAdmin();
  const groups = groupByTopic(podcasts);

  return (
    <>
      <section className="card hero">
        <h1>Podcast Manager</h1>
        <p>Manage local podcast profiles by topic. Open each profile to CRUD its episodes.</p>
        <div className="actions">
          <Link className="button primary" href="/admin/podcasts/new">
            New Podcast
          </Link>
          <Link className="button" href="/admin/bands">
            Band Manager
          </Link>
        </div>
      </section>

      <section className="section-space">
        {groups.length ? (
          groups.map(([topic, items]) => (
            <article key={topic} className="card section-space">
              <h2 className="section-title">{topic}</h2>
              <div className="band-grid">
                {items.map((podcast) => (
                  <article key={podcast.id} className="band-card">
                    <div className="band-card-content">
                      <div className="band-card-year">{podcast.is_published ? 'Published' : 'Draft'}</div>
                      <h3 className="band-card-name">{podcast.title}</h3>
                      <span className="band-card-genre">{podcast.topic || 'uncategorized'}</span>
                      <p className="band-card-desc">{podcast.summary || podcast.description || 'No summary yet.'}</p>
                      <div className="actions">
                        <Link className="button primary" href={`/admin/podcasts/${podcast.slug}/edit`}>
                          Edit Podcast
                        </Link>
                        <Link className="button" href={`/podcast/${podcast.slug}`}>
                          View Podcast Page
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          ))
        ) : (
          <article className="card">
            <p className="meta">No podcasts yet.</p>
          </article>
        )}
      </section>
    </>
  );
}
