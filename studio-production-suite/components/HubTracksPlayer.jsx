'use client';

import { useMemo, useState } from 'react';
import { groupTracksByGenre } from '../lib/content';

function toTitleCase(text) {
  return String(text || '')
    .split(' ')
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ');
}

export default function HubTracksPlayer({ tracks }) {
  const ordered = useMemo(() => {
    const list = [...(tracks || [])];
    list.sort((a, b) => {
      const genreA = String(a.genre || 'other').toLowerCase();
      const genreB = String(b.genre || 'other').toLowerCase();
      const titleA = String(a.title || '').toLowerCase();
      const titleB = String(b.title || '').toLowerCase();
      return `${genreA}|${titleA}`.localeCompare(`${genreB}|${titleB}`);
    });
    return list;
  }, [tracks]);

  const grouped = useMemo(() => groupTracksByGenre(ordered), [ordered]);
  const [genre, setGenre] = useState(grouped.allGenres[0] || 'other');
  const initialTrack = ordered[0] || null;
  const [activeTrackId, setActiveTrackId] = useState(initialTrack?.id || null);

  if (!ordered.length) {
    return <p className="meta">No tracks yet.</p>;
  }

  const visibleTracks = grouped.tracksByGenre.get(genre) || [];
  const activeTrack = ordered.find((track) => track.id === activeTrackId) || initialTrack;

  return (
    <>
      <p className="hub-now-playing">
        <strong id="hub-current-track">{activeTrack?.title}</strong>{' '}
        <span className="meta">{activeTrack?.artist_name}</span>
      </p>
      <audio key={activeTrack?.audio_url || activeTrack?.id} id="hub-main-player" className="hub-main-player" controls src={activeTrack?.audio_url || ''} />
      <div className="hub-genre-filter-wrap">
        <label className="meta" htmlFor="hub-genre-filter">
          Choose your genre:
        </label>
        <select
          id="hub-genre-filter"
          className="hub-genre-filter"
          value={genre}
          onChange={(event) => {
            const nextGenre = event.target.value;
            setGenre(nextGenre);
            const nextTrack = (grouped.tracksByGenre.get(nextGenre) || [])[0];
            if (nextTrack) {
              setActiveTrackId(nextTrack.id);
            }
          }}
        >
          {grouped.allGenres.map((genreKey) => (
            <option key={genreKey} value={genreKey}>
              {toTitleCase(genreKey)}
            </option>
          ))}
        </select>
      </div>
      <div className="hub-track-groups" id="hub-track-list">
        <details className="hub-genre-section is-visible" open>
          <summary className="hub-genre-heading">
            Track List
            <span className="meta">{visibleTracks.length}</span>
          </summary>
          <div className="hub-genre-list-plain">
            {visibleTracks.length ? (
              visibleTracks.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  className={`hub-track-line ${track.id === activeTrack?.id ? 'active' : ''}`}
                  onClick={() => setActiveTrackId(track.id)}
                >
                  {track.title}
                </button>
              ))
            ) : (
              <div className="hub-track-empty">No tracks in this genre yet.</div>
            )}
          </div>
        </details>
      </div>
    </>
  );
}
