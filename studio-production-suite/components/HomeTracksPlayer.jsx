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
    <div className="xrkr-radio-shell">
      <div className="xrkr-radio-skin">
        <img className="xrkr-radio-skin-image" src="/assets/player/xrkr-radio-skin-desktop.png" alt="XRKR Radio player skin" />
        <div className="xrkr-radio-display">
          <p className="xrkr-radio-now">
            <strong id="home-current-track">{current.title}</strong>
          </p>
          <audio key={current.audio_url || current.id} id="home-main-player" className="xrkr-radio-controls" controls src={current.audio_url} />
        </div>
      </div>
      <div className="xrkr-radio-picker">
        <label htmlFor="home-track-select" className="meta">
          Choose track
        </label>
        <select id="home-track-select" value={String(index)} onChange={(event) => setIndex(Number(event.target.value) || 0)}>
          {items.map((track, trackIndex) => (
            <option key={`${track.id || track.title}-${trackIndex}`} value={String(trackIndex)}>
              {track.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
