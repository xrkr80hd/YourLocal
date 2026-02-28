'use client';

import { useMemo, useState } from 'react';

export default function HomeTracksPlayer({ tracks }) {
  const items = useMemo(() => tracks || [], [tracks]);
  const [index, setIndex] = useState(0);
  const hasTracks = items.length > 0;
  const current = hasTracks ? items[index] || items[0] : null;
  const trackNumber = String((hasTracks ? index : 0) + 1).padStart(2, '0');
  const totalTracks = String(hasTracks ? items.length : 0).padStart(2, '0');

  return (
    <div className="xrkr-radio-shell">
      <div className="xrkr-radio-skin">
        <img className="xrkr-radio-skin-image" src="/assets/player/xrkr-radio-skin-desktop-cropped.png" alt="XRKR Radio player skin" />
        <div className="xrkr-radio-display">
          <p className="xrkr-radio-status">PLAY DISC 01 TRK {trackNumber}/{totalTracks}</p>
          <p className="xrkr-radio-now">
            <strong id="home-current-track">{current?.title || 'NO TRACKS UPLOADED'}</strong>
          </p>
          {current?.audio_url ? (
            <audio key={current.audio_url || current.id} id="home-main-player" className="xrkr-radio-controls" controls src={current.audio_url} />
          ) : (
            <p className="xrkr-radio-controls-placeholder">Upload tracks in admin to activate player controls.</p>
          )}
        </div>
      </div>
      <div className="xrkr-radio-picker">
        <label htmlFor="home-track-select" className="meta">
          Choose track
        </label>
        <select id="home-track-select" value={String(hasTracks ? index : 0)} onChange={(event) => setIndex(Number(event.target.value) || 0)} disabled={!hasTracks}>
          {hasTracks ? (
            items.map((track, trackIndex) => (
              <option key={`${track.id || track.title}-${trackIndex}`} value={String(trackIndex)}>
                {track.title}
              </option>
            ))
          ) : (
            <option value="0">No tracks uploaded yet</option>
          )}
        </select>
      </div>
    </div>
  );
}
