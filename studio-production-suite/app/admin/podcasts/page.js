import Link from 'next/link';
import { getPodcastEpisodesForAdmin } from '../../../lib/content';

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
  const episodes = await getPodcastEpisodesForAdmin();
  const groups = groupByTopic(episodes);

  return (
    <>
      <section className="card hero">
        <h1>Podcast Manager</h1>
        <p>Manage episodes by topic. Any admin can create new topics by typing them.</p>
        <div className="actions">
          <Link className="button primary" href="/admin/podcasts/new">
            New Episode
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
                {items.map((episode) => (
                  <article key={episode.id} className="band-card">
                    <div className="band-card-content">
                      <div className="band-card-year">{episode.published_at || 'Draft'}</div>
                      <h3 className="band-card-name">{episode.title}</h3>
                      <span className="band-card-genre">{episode.topic || 'uncategorized'}</span>
                      <p className="band-card-desc">{episode.summary || episode.description || 'No summary yet.'}</p>
                      <div className="actions">
                        <Link className="button primary" href={`/admin/podcasts/${episode.slug}/edit`}>
                          Edit Episode
                        </Link>
                        <Link className="button" href="/podcast">
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
            <p className="meta">No podcast episodes yet.</p>
          </article>
        )}
      </section>
    </>
  );
}
