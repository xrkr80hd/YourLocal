'use client';

import { useMemo, useState } from 'react';

export default function HomeTracksPlayer({ tracks }) {
  const items = useMemo(() => tracks || [], [tracks]);
  const [index, setIndex] = useState(0);

  if (!items.length) {
    return <p className="meta">No tracks uploaded yet.</p>;
  }

  const current = items[index] || items[0];

  return (
    <>
      <p>
        <strong id="home-current-track">{current.title}</strong>{' '}
        <span className="meta">{current.artist_name}</span>
      </p>
      <audio key={current.audio_url || current.id} id="home-main-player" className="home-mini-player" controls src={current.audio_url} />
      <div className="home-track-list" id="home-track-list">
        {items.map((track, trackIndex) => (
          <button
            key={`${track.id || track.title}-${trackIndex}`}
            type="button"
            className={`home-track-pill ${trackIndex === index ? 'active' : ''}`}
            onClick={() => setIndex(trackIndex)}
          >
            {track.title} <span className="meta">{track.artist_name}</span>
          </button>
        ))}
      </div>
    </>
  );
}
