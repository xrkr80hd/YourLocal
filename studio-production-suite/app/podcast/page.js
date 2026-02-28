import Link from 'next/link';
import { formatDate } from '../../lib/format';
import { getPodcastEpisodes } from '../../lib/content';

export default async function PodcastPage() {
  const episodes = await getPodcastEpisodes();

  return (
    <>
      <section className="card hero band-hero">
        <span className="tag-badge">Podcast Channel</span>
        <h1>
          <span className="hero-accent">YourLocal</span> Podcasts
        </h1>
        <p>Local stories, artist interviews, and scene conversations in one archive-friendly feed.</p>
        <div className="actions">
          <Link className="button" href="/local-legends-archive">
            YourLocal Legends
          </Link>
          <Link className="button" href="/your-local-scene">
            YourLocal Scene
          </Link>
          <Link className="button primary" href="/podcast">
            YourLocal Podcasts
          </Link>
        </div>
      </section>

      <section className="section-space">
        <div className="band-grid">
          {episodes.length ? (
            episodes.map((episode) => (
              <article key={episode.id} className="band-card podcast-card">
                <div className="band-card-image">
                  {episode.cover_image_url ? (
                    <img src={episode.cover_image_url} alt={`${episode.title} cover`} />
                  ) : (
                    <span className="image-placeholder">[ Podcast Cover ]</span>
                  )}
                </div>
                <div className="band-card-content">
                  {episode.published_at ? <div className="band-card-year">{formatDate(episode.published_at)}</div> : null}
                  <h3 className="band-card-name">{episode.title}</h3>
                  <span className="band-card-genre">Podcast Episode</span>
                  {episode.summary ? <p className="band-card-desc">{episode.summary}</p> : null}
                  {!episode.summary && episode.description ? <p className="band-card-desc">{episode.description}</p> : null}
                  {episode.audio_url ? <audio controls preload="none" src={episode.audio_url} /> : null}
                </div>
              </article>
            ))
          ) : (
            <article className="card">
              <p className="meta">No podcast episodes yet.</p>
            </article>
          )}
        </div>
      </section>
    </>
  );
}
