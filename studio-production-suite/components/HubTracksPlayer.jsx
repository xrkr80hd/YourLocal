'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

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

export default function HubTracksPlayer({ tracks }) {
  const items = useMemo(() => tracks || [], [tracks]);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayOnChange, setAutoPlayOnChange] = useState(false);
  const audioRef = useRef(null);
  const hasTracks = items.length > 0;
  const activeTrack = hasTracks ? items[index] || items[0] : null;
  const trackNumber = String((hasTracks ? index : 0) + 1).padStart(2, '0');
  const totalTracks = String(hasTracks ? items.length : 0).padStart(2, '0');

  useEffect(() => {
    if (!items.length) {
      setIndex(0);
      setIsPlaying(false);
      return;
    }

    setIndex((currentIndex) => {
      if (currentIndex >= 0 && currentIndex < items.length) {
        return currentIndex;
      }
      return randomIndex(items.length);
    });
  }, [items.length]);

  useEffect(() => {
    if (!autoPlayOnChange || !activeTrack?.audio_url) {
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const playResult = audio.play();
    if (playResult && typeof playResult.then === 'function') {
      playResult
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        })
        .finally(() => {
          setAutoPlayOnChange(false);
        });
      return;
    }

    setIsPlaying(true);
    setAutoPlayOnChange(false);
  }, [autoPlayOnChange, activeTrack?.audio_url]);

  if (!hasTracks) {
    return <p className="meta">No tracks yet.</p>;
  }

  function setTrackIndex(nextIndex, { autoplay = false } = {}) {
    setIndex((currentIndex) => {
      const safeCurrent = currentIndex >= 0 && currentIndex < items.length ? currentIndex : 0;
      const resolved = typeof nextIndex === 'function' ? nextIndex(safeCurrent) : nextIndex;
      if (!Number.isFinite(resolved)) {
        return safeCurrent;
      }
      if (resolved < 0) {
        return items.length - 1;
      }
      if (resolved >= items.length) {
        return 0;
      }
      return resolved;
    });

    setAutoPlayOnChange(autoplay);
  }

  async function playCurrent() {
    if (!activeTrack?.audio_url || !audioRef.current) {
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  function stopCurrent() {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  }

  return (
    <>
      <p className="hub-now-playing">
        <strong id="hub-current-track">{activeTrack?.title || 'No track loaded'}</strong>{' '}
        <span className="meta">{activeTrack?.artist_name}</span>
        <span className="meta">{`  TRK ${trackNumber}/${totalTracks}`}</span>
      </p>
      <audio
        ref={audioRef}
        key={activeTrack?.audio_url || activeTrack?.id}
        id="hub-main-player"
        className="hub-main-player"
        src={activeTrack?.audio_url || ''}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setTrackIndex((currentIndex) => randomIndex(items.length, currentIndex), { autoplay: true })}
      />
      <div className="hub-icon-controls" role="group" aria-label="Hub track controls">
        <button type="button" className="icon-control" aria-label="First track" onClick={() => setTrackIndex(0, { autoplay: true })}>
          {'<<'}
        </button>
        <button type="button" className="icon-control" aria-label="Previous track" onClick={() => setTrackIndex((currentIndex) => currentIndex - 1, { autoplay: true })}>
          {'<'}
        </button>
        <button type="button" className="icon-control" aria-label="Play" onClick={playCurrent}>
          {'\u25B6'}
        </button>
        <button type="button" className="icon-control" aria-label="Stop" onClick={stopCurrent}>
          {'\u25A0'}
        </button>
        <button type="button" className="icon-control" aria-label="Next track" onClick={() => setTrackIndex((currentIndex) => currentIndex + 1, { autoplay: true })}>
          {'>'}
        </button>
        <button
          type="button"
          className={`icon-control ${isPlaying ? 'is-active' : ''}`.trim()}
          aria-label="Shuffle track"
          onClick={() => setTrackIndex((currentIndex) => randomIndex(items.length, currentIndex), { autoplay: true })}
        >
          {'>>'}
        </button>
      </div>
    </>
  );
}
