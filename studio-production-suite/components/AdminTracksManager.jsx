'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import MediaUrlInput from './MediaUrlInput';

function emptyTrack() {
  return {
    id: null,
    title: '',
    artist_name: 'xrkr80hd',
    genre: '',
    description: '',
    audio_url: '',
    cover_image_url: '',
    external_url: '',
    release_date: '',
    sort_order: 0,
    is_featured: true,
  };
}

function normalizeTrack(track) {
  const base = emptyTrack();
  const releaseDateRaw = String(track?.release_date || '').trim();
  const releaseDate = releaseDateRaw ? releaseDateRaw.slice(0, 10) : '';

  return {
    ...base,
    ...track,
    release_date: releaseDate,
    sort_order: Number.isFinite(Number(track?.sort_order)) ? Number(track.sort_order) : 0,
    is_featured: Boolean(track?.is_featured),
  };
}

function formatReleaseDate(value) {
  const raw = String(value || '').trim();
  if (!raw) {
    return 'No date';
  }
  return raw.slice(0, 10);
}

export default function AdminTracksManager({ initialTracks = [] }) {
  const router = useRouter();
  const [tracks, setTracks] = useState(initialTracks.map((track) => normalizeTrack(track)));
  const [form, setForm] = useState(emptyTrack());
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const sortedTracks = useMemo(() => {
    const items = [...tracks];
    items.sort((a, b) => {
      const orderA = Number.isFinite(Number(a.sort_order)) ? Number(a.sort_order) : 0;
      const orderB = Number.isFinite(Number(b.sort_order)) ? Number(b.sort_order) : 0;
      if (orderA !== orderB) {
        return orderA - orderB;
      }

      const dateA = String(a.release_date || '');
      const dateB = String(b.release_date || '');
      if (dateA !== dateB) {
        return dateB.localeCompare(dateA);
      }

      return String(a.title || '').localeCompare(String(b.title || ''));
    });
    return items;
  }, [tracks]);

  const resetForm = () => setForm(emptyTrack());

  const reloadTracks = async () => {
    const response = await fetch('/api/admin/tracks');
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || 'Failed to refresh tracks.');
    }
    setTracks((payload.items || []).map((track) => normalizeTrack(track)));
  };

  const startEdit = (track) => {
    setForm(normalizeTrack(track));
    setStatus(`Editing track: ${track.title}`);
  };

  return (
    <>
      <form
        className="card section-space"
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          setStatus(form.id ? 'Updating track...' : 'Creating track...');

          const payload = {
            title: form.title,
            artist_name: form.artist_name,
            genre: form.genre,
            description: form.description,
            audio_url: form.audio_url,
            cover_image_url: form.cover_image_url,
            external_url: form.external_url,
            release_date: form.release_date,
            sort_order: form.sort_order,
            is_featured: form.is_featured,
          };

          try {
            const endpoint = form.id ? `/api/admin/tracks/${encodeURIComponent(form.id)}` : '/api/admin/tracks';
            const method = form.id ? 'PUT' : 'POST';
            const response = await fetch(endpoint, {
              method,
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify(payload),
            });
            const body = await response.json().catch(() => ({}));

            if (!response.ok) {
              setStatus(body.error || 'Save failed.');
              setSaving(false);
              return;
            }

            await reloadTracks();
            setStatus(form.id ? 'Track updated.' : 'Track created.');
            setSaving(false);
            resetForm();
            router.refresh();
          } catch (error) {
            setStatus(error instanceof Error ? error.message : 'Save failed due to network error.');
            setSaving(false);
          }
        }}
      >
        <h2 className="section-title">{form.id ? 'Edit Track' : 'Add Track'}</h2>
        <p className="meta">Owner-only tracks panel. Set order and choose what appears in the home player.</p>

        <div className="grid cols-3">
          <div className="form-row">
            <label htmlFor="track-title">Title</label>
            <input
              id="track-title"
              type="text"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="track-artist">Artist Name</label>
            <input
              id="track-artist"
              type="text"
              value={form.artist_name}
              onChange={(event) => setForm((current) => ({ ...current, artist_name: event.target.value }))}
            />
          </div>
          <div className="form-row">
            <label htmlFor="track-genre">Genre</label>
            <input
              id="track-genre"
              type="text"
              value={form.genre}
              onChange={(event) => setForm((current) => ({ ...current, genre: event.target.value }))}
              placeholder="metalcore"
            />
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="track-description">Description</label>
          <textarea
            id="track-description"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          />
        </div>

        <MediaUrlInput
          id="track-audio-url"
          label="Audio URL"
          value={form.audio_url}
          onChange={(value) => setForm((current) => ({ ...current, audio_url: value }))}
          folder="audio/tracks"
          accept="audio/*"
          placeholder="https://... or /..."
        />

        <MediaUrlInput
          id="track-cover-image-url"
          label="Cover Image URL"
          value={form.cover_image_url}
          onChange={(value) => setForm((current) => ({ ...current, cover_image_url: value }))}
          folder="images/posts"
          accept="image/*"
          placeholder="https://... or /..."
        />

        <div className="grid cols-3">
          <div className="form-row">
            <label htmlFor="track-external-url">External Link (optional)</label>
            <input
              id="track-external-url"
              type="text"
              value={form.external_url}
              onChange={(event) => setForm((current) => ({ ...current, external_url: event.target.value }))}
              placeholder="https://spotify.com/..."
            />
          </div>
          <div className="form-row">
            <label htmlFor="track-release-date">Release Date</label>
            <input
              id="track-release-date"
              type="date"
              value={form.release_date}
              onChange={(event) => setForm((current) => ({ ...current, release_date: event.target.value }))}
            />
          </div>
          <div className="form-row">
            <label htmlFor="track-sort-order">Sort Order</label>
            <input
              id="track-sort-order"
              type="number"
              min="0"
              value={form.sort_order}
              onChange={(event) => setForm((current) => ({ ...current, sort_order: event.target.value }))}
            />
          </div>
        </div>

        <div className="actions">
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(event) => setForm((current) => ({ ...current, is_featured: event.target.checked }))}
            />
            <span className="meta">Show on home player</span>
          </label>
        </div>

        <div className="actions">
          <button className="button primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : form.id ? 'Update Track' : 'Create Track'}
          </button>
          {form.id ? (
            <button className="button" type="button" onClick={resetForm}>
              Cancel Edit
            </button>
          ) : null}
        </div>
        {status ? <p className="meta">{status}</p> : null}
      </form>

      <section className="card section-space">
        <h3 className="section-title">Tracks</h3>
        <p className="meta">Ordered by `sort_order`, then release date. Home player uses tracks with `Show on home player` enabled.</p>
        {sortedTracks.length ? (
          <div className="grid">
            {sortedTracks.map((track) => (
              <article key={track.id} className="card">
                <h4>{track.title}</h4>
                <p className="meta">
                  {track.artist_name || 'xrkr80hd'} | {track.genre || 'other'} | {formatReleaseDate(track.release_date)} | sort {track.sort_order}
                </p>
                <p className="meta">Home player: {track.is_featured ? 'on' : 'off'}</p>
                {track.audio_url ? <audio controls src={track.audio_url} style={{ width: '100%' }} /> : null}
                <div className="actions">
                  <button className="button primary" type="button" onClick={() => startEdit(track)}>
                    Edit
                  </button>
                  <button
                    className="button danger"
                    type="button"
                    onClick={async () => {
                      const confirmed = window.confirm(`Delete track "${track.title}"?`);
                      if (!confirmed) {
                        return;
                      }

                      setStatus(`Deleting "${track.title}"...`);
                      const response = await fetch(`/api/admin/tracks/${encodeURIComponent(track.id)}`, { method: 'DELETE' });
                      const body = await response.json().catch(() => ({}));
                      if (!response.ok) {
                        setStatus(body.error || 'Delete failed.');
                        return;
                      }

                      await reloadTracks();
                      setStatus(`Deleted "${track.title}".`);
                      router.refresh();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="meta">No tracks yet.</p>
        )}
      </section>
    </>
  );
}
