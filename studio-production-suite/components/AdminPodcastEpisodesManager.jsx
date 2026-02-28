'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import MediaUrlInput from './MediaUrlInput';
import AdminAccordionSection from './AdminAccordionSection';

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
}

function toDateTimeLocal(value) {
  const raw = String(value || '').trim();
  if (!raw) {
    return '';
  }
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const pad = (part) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function emptyEpisode() {
  return {
    id: null,
    title: '',
    slug: '',
    summary: '',
    description: '',
    audio_url: '',
    cover_image_url: '',
    published_at: '',
    sort_order: 0,
    is_published: true,
  };
}

function normalizeEpisode(item) {
  return {
    ...emptyEpisode(),
    ...item,
    published_at: toDateTimeLocal(item?.published_at),
    sort_order: Number.isFinite(Number(item?.sort_order)) ? Number(item.sort_order) : 0,
    is_published: item?.is_published === undefined ? true : Boolean(item.is_published),
  };
}

export default function AdminPodcastEpisodesManager({ podcastSlug, initialEpisodes = [] }) {
  const router = useRouter();
  const [episodes, setEpisodes] = useState((initialEpisodes || []).map(normalizeEpisode));
  const [form, setForm] = useState(emptyEpisode());
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const sortedEpisodes = useMemo(() => {
    const items = [...episodes];
    items.sort((a, b) => {
      const orderA = Number.isFinite(Number(a.sort_order)) ? Number(a.sort_order) : 0;
      const orderB = Number.isFinite(Number(b.sort_order)) ? Number(b.sort_order) : 0;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      const aDate = String(a.published_at || '');
      const bDate = String(b.published_at || '');
      return bDate.localeCompare(aDate);
    });
    return items;
  }, [episodes]);

  const resetForm = () => setForm(emptyEpisode());

  const reload = async () => {
    const response = await fetch(`/api/admin/podcasts/${encodeURIComponent(podcastSlug)}/episodes`);
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(body.error || 'Failed to refresh episodes.');
    }
    setEpisodes((body.items || []).map(normalizeEpisode));
  };

  return (
    <>
      <form
        className="card section-space"
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          setStatus(form.id ? 'Saving episode...' : 'Adding episode...');

          const payload = {
            title: form.title,
            slug: slugify(form.slug || form.title),
            summary: form.summary,
            description: form.description,
            audio_url: form.audio_url,
            cover_image_url: form.cover_image_url,
            published_at: form.published_at,
            sort_order: form.sort_order,
            is_published: form.is_published,
          };

          try {
            const endpoint = form.id
              ? `/api/admin/podcasts/${encodeURIComponent(podcastSlug)}/episodes/${encodeURIComponent(form.id)}`
              : `/api/admin/podcasts/${encodeURIComponent(podcastSlug)}/episodes`;
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

            await reload();
            setStatus(form.id ? 'Episode updated.' : 'Episode added.');
            setSaving(false);
            resetForm();
            router.refresh();
          } catch (error) {
            setStatus(error instanceof Error ? error.message : 'Save failed due to network error.');
            setSaving(false);
          }
        }}
      >
        <h2 className="section-title">Episodes</h2>
        <p className="meta">Add 1-2 current episodes for this podcast profile.</p>

        <AdminAccordionSection title="Episode Basics" note="Title, slug, summary and description." defaultOpen>
          <div className="grid cols-3">
            <div className="form-row">
              <label htmlFor="episode-title">Episode Title</label>
              <input id="episode-title" type="text" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
            </div>
            <div className="form-row">
              <label htmlFor="episode-slug">Episode Slug</label>
              <input id="episode-slug" type="text" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
            </div>
            <div className="form-row">
              <label htmlFor="episode-sort-order">Sort Order</label>
              <input id="episode-sort-order" type="number" min="0" value={form.sort_order} onChange={(event) => setForm((current) => ({ ...current, sort_order: event.target.value }))} />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="episode-summary">Summary</label>
            <textarea id="episode-summary" value={form.summary} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} />
          </div>

          <div className="form-row">
            <label htmlFor="episode-description">Description</label>
            <textarea id="episode-description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
          </div>
        </AdminAccordionSection>

        <AdminAccordionSection title="Episode Media" note="Audio and optional cover image." defaultOpen>
          <MediaUrlInput
            id="episode-audio-url"
            label="Audio URL"
            value={form.audio_url}
            onChange={(value) => setForm((current) => ({ ...current, audio_url: value }))}
            folder="audio/tracks"
            accept="audio/*"
            placeholder="https://... or /..."
          />

          <MediaUrlInput
            id="episode-cover-url"
            label="Episode Cover URL (optional)"
            value={form.cover_image_url}
            onChange={(value) => setForm((current) => ({ ...current, cover_image_url: value }))}
            folder="images/posts"
            accept="image/*"
            placeholder="https://... or /..."
          />
        </AdminAccordionSection>

        <AdminAccordionSection title="Publishing and Save" note="Date, visibility, and save actions." defaultOpen={false}>
          <div className="grid cols-3">
            <div className="form-row">
              <label htmlFor="episode-published-at">Published At</label>
              <input
                id="episode-published-at"
                type="datetime-local"
                value={form.published_at}
                onChange={(event) => setForm((current) => ({ ...current, published_at: event.target.value }))}
              />
            </div>
          </div>

          <div className="actions">
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
              <input type="checkbox" checked={form.is_published} onChange={(event) => setForm((current) => ({ ...current, is_published: event.target.checked }))} />
              <span className="meta">Published</span>
            </label>
          </div>

          <div className="actions">
            <button className="button primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : form.id ? 'Update Episode' : 'Add Episode'}
            </button>
            {form.id ? (
              <button className="button" type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            ) : null}
          </div>
          {status ? <p className="meta">{status}</p> : null}
        </AdminAccordionSection>
      </form>

      <section className="card section-space">
        <AdminAccordionSection title={`Episode List (${sortedEpisodes.length})`} note="Open and edit existing episodes." defaultOpen={false}>
          {sortedEpisodes.length ? (
            <div className="grid">
              {sortedEpisodes.map((episode) => (
                <article key={episode.id} className="card">
                  <h4>{episode.title}</h4>
                  <p className="meta">
                    sort {episode.sort_order} | {episode.published_at ? episode.published_at.replace('T', ' ') : 'Draft'} | {episode.is_published ? 'published' : 'draft'}
                  </p>
                  {episode.summary ? <p>{episode.summary}</p> : null}
                  {episode.audio_url ? <audio controls src={episode.audio_url} style={{ width: '100%' }} /> : null}
                  <div className="actions">
                    <button className="button primary" type="button" onClick={() => setForm(normalizeEpisode(episode))}>
                      Edit
                    </button>
                    <button
                      className="button danger"
                      type="button"
                      onClick={async () => {
                        const confirmed = window.confirm(`Delete episode "${episode.title}"?`);
                        if (!confirmed) {
                          return;
                        }

                        const response = await fetch(
                          `/api/admin/podcasts/${encodeURIComponent(podcastSlug)}/episodes/${encodeURIComponent(episode.id)}`,
                          { method: 'DELETE' }
                        );
                        const body = await response.json().catch(() => ({}));
                        if (!response.ok) {
                          setStatus(body.error || 'Delete failed.');
                          return;
                        }

                        await reload();
                        setStatus('Episode deleted.');
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
            <p className="meta">No episodes yet for this podcast.</p>
          )}
        </AdminAccordionSection>
      </section>
    </>
  );
}
