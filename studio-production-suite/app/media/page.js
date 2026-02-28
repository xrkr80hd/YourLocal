import { getMediaByType } from '../../lib/content';

export default async function MediaPage() {
  const [photos, videos, music] = await Promise.all([
    getMediaByType('photo'),
    getMediaByType('video'),
    getMediaByType('music'),
  ]);

  return (
    <>
      <section className="card hero">
        <h1>Media</h1>
        <p>Snapshots and video moments from sessions, releases, and behind-the-scenes grind.</p>
      </section>

      <section className="card section-space">
        <h3 className="section-title">Photos</h3>
        <div className="grid cols-3">
          {photos.length ? (
            photos.map((item) => (
              <article key={item.id}>
                <img className="cover" src={item.thumbnail_url || item.media_url} alt={item.title || 'Photo'} />
                <strong>{item.title}</strong>
                {item.caption ? <p className="meta">{item.caption}</p> : null}
              </article>
            ))
          ) : (
            <p className="meta">No photos yet.</p>
          )}
        </div>
      </section>

      <section className="card section-space">
        <h3 className="section-title">Videos</h3>
        {videos.length ? (
          videos.map((item) => (
            <p key={item.id}>
              <strong>{item.title}</strong>{' '}
              <a className="button" href={item.media_url} target="_blank" rel="noreferrer">
                Watch
              </a>
            </p>
          ))
        ) : (
          <p className="meta">No videos yet.</p>
        )}
      </section>

      <section className="card section-space">
        <h3 className="section-title">Music</h3>
        {music.length ? (
          music.map((item) => (
            <article key={item.id} style={{ marginBottom: '1rem' }}>
              <p>
                <strong>{item.title}</strong>
              </p>
              <audio controls preload="none" src={item.media_url} />
              {item.caption ? <p className="meta">{item.caption}</p> : null}
            </article>
          ))
        ) : (
          <p className="meta">No music items yet.</p>
        )}
      </section>
    </>
  );
}
