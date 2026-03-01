import Link from 'next/link';
import HubMediaGallery from '../../components/HubMediaGallery';
import HubTracksPlayer from '../../components/HubTracksPlayer';
import { getHubData } from '../../lib/content';
import { formatDate, stripHtml, truncate } from '../../lib/format';

export default async function HubPage() {
  const { tracks, posts, photos, videos, counts } = await getHubData();

  return (
    <>
      <section className="card hero">
        <h1>
          <span className="hero-accent">
            <span className="split-cool">XRKR</span>
            <span className="split-80">80</span>
            <span className="split-cool">HD</span>Local
          </span>{' '}
          Hub
        </h1>
        <p>Everything in one place: music, photos, videos, projects, blog updates, and media drops.</p>
      </section>

      <section className="card section-space hub-player">
        <div className="hub-player-head">
          <h3 className="section-title">XRKR80HD Tracks</h3>
          <span className="meta">{counts.tracks} total</span>
          <Link className="button" href="/admin/tracks" prefetch={false}>
            Upload XRKR Music
          </Link>
        </div>
        <HubTracksPlayer tracks={tracks} />
      </section>

      <HubMediaGallery photos={photos.slice(0, 8)} videos={videos.slice(0, 8)} />

      <section className="card section-space hub-blog-section">
        <div className="hub-player-head">
          <h3 className="section-title">Blog</h3>
          <span className="meta">{counts.posts} published</span>
        </div>
        <div className="hub-blog-shell">
          <div className="hub-blog-scroll">
            {posts.length ? (
              posts.slice(0, 8).map((post) => {
                const preview = truncate(stripHtml(post.excerpt || post.content || ''), 340);

                return (
                  <article key={post.id} className="hub-blog-entry">
                    <h4>{post.title}</h4>
                    <p className="meta">{formatDate(post.published_at)}</p>
                    <p>{preview || 'No preview text available yet.'}</p>
                    <Link className="hub-blog-read" href={`/blog/${post.slug}`}>
                      Read full post
                    </Link>
                  </article>
                );
              })
            ) : (
              <p className="meta">No posts yet.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
