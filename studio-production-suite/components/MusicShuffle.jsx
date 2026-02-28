'use client';

import { useMemo, useState } from 'react';

export default function MusicShuffle({ tracks }) {
  const items = useMemo(() => tracks || [], [tracks]);
  const [activeId, setActiveId] = useState(items[0]?.id || null);

  if (!items.length) {
    return <article className="card"><p className="meta">No tracks published yet.</p></article>;
  }

  const activeTrack = items.find((track) => track.id === activeId) || items[0];

  return (
    <>
      <section className="card section-space">
        <div className="player">
          <strong id="current-track">{activeTrack?.title || 'No track selected'}</strong>
          <audio key={activeTrack?.audio_url || activeTrack?.id} id="main-player" controls src={activeTrack?.audio_url || ''} />
          <div className="actions">
            <button
              className="button primary"
              id="shuffle-btn"
              type="button"
              onClick={() => {
                const random = items[Math.floor(Math.random() * items.length)];
                if (random) {
                  setActiveId(random.id);
                }
              }}
            >
              Shuffle / Random Track
            </button>
          </div>
        </div>
      </section>

      <section className="stack-grid section-space" id="track-list">
        {items.map((track) => (
          <article key={track.id} className="card">
            {track.cover_image_url ? <img className="cover" src={track.cover_image_url} alt={`${track.title} cover`} /> : null}
            <h3 className="section-title">{track.title}</h3>
            <p className="meta">
              {track.artist_name} {track.genre ? `- ${track.genre}` : ''}
            </p>
            {track.description ? <p>{track.description}</p> : null}
            <div className="actions">
              <button className="button play-btn" type="button" onClick={() => setActiveId(track.id)}>
                Play
              </button>
              {track.external_url ? (
                <a className="button" href={track.external_url} target="_blank" rel="noreferrer">
                  Open Link
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
