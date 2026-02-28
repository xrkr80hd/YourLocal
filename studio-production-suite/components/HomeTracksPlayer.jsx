'use client';

import { useEffect, useMemo, useState } from 'react';

function randomIndex(length, exclude = -1) {
  if (length <= 1) {
    return 0;
  }

  let next = Math.floor(Math.random() * length);
  let guard = 0;
  while (next === exclude && guard < 12) {
    next = Math.floor(Math.random() * length);
    guard += 1;
  }
  return next;
}

export default function HomeTracksPlayer({ tracks }) {
  const items = useMemo(() => tracks || [], [tracks]);
  const [index, setIndex] = useState(0);
  const hasTracks = items.length > 0;
  const current = hasTracks ? items[index] || items[0] : null;
  const displayArtist = String(current?.artist_name || '').trim() || (hasTracks ? 'XRKR80HD' : 'SYSTEM');
  const displayTrack = String(current?.title || '').trim() || 'NO TRACKS UPLOADED';
  const trackNumber = String((hasTracks ? index : 0) + 1).padStart(2, '0');
  const totalTracks = String(hasTracks ? items.length : 0).padStart(2, '0');

  useEffect(() => {
    if (!items.length) {
      setIndex(0);
      return;
    }

    setIndex((currentIndex) => {
      if (currentIndex >= 0 && currentIndex < items.length) {
        return currentIndex;
      }
      return randomIndex(items.length);
    });
  }, [items.length]);

  return (
    <div className="xrkr-radio-shell">
      <div className="xrkr-radio-skin">
        <img className="xrkr-radio-skin-image" src="/assets/player/xrkr-radio-skin-desktop-cropped.png" alt="XRKR Radio player skin" />
        <div className="xrkr-radio-display">
          <p className="xrkr-radio-status">PLAY DISC 01 TRK {trackNumber}/{totalTracks}</p>
          <p className="xrkr-radio-now">
            <span className="xrkr-radio-artist">{displayArtist}</span>
            <span className="xrkr-radio-sep"> - </span>
            <strong className="xrkr-radio-track" id="home-current-track">{displayTrack}</strong>
          </p>
          {current?.audio_url ? (
            <audio
              key={current.audio_url || current.id}
              id="home-main-player"
              className="xrkr-radio-controls"
              controls
              autoPlay
              src={current.audio_url}
              onEnded={() =>
                setIndex((currentIndex) => {
                  if (items.length <= 1) {
                    return 0;
                  }
                  return randomIndex(items.length, currentIndex);
                })
              }
            />
          ) : (
            <p className="xrkr-radio-controls-placeholder">Upload tracks in admin to activate player controls.</p>
          )}
        </div>
      </div>
    </div>
  );
}
