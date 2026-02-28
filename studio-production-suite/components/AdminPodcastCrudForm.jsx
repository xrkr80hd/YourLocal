'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import MediaUrlInput from './MediaUrlInput';

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

export default function AdminPodcastCrudForm({ mode = 'create', initialEpisode = null, topicOptions = [] }) {
  const router = useRouter();
  const isEdit = mode === 'edit';

  const [title, setTitle] = useState(String(initialEpisode?.title || ''));
  const [slug, setSlug] = useState(String(initialEpisode?.slug || ''));
  const [slugTouched, setSlugTouched] = useState(Boolean(initialEpisode?.slug));
  const [topic, setTopic] = useState(String(initialEpisode?.topic || ''));
  const [summary, setSummary] = useState(String(initialEpisode?.summary || ''));
  const [description, setDescription] = useState(String(initialEpisode?.description || ''));
  const [audioUrl, setAudioUrl] = useState(String(initialEpisode?.audio_url || ''));
  const [coverImageUrl, setCoverImageUrl] = useState(String(initialEpisode?.cover_image_url || ''));
  const [publishedAt, setPublishedAt] = useState(toDateTimeLocal(initialEpisode?.published_at));
  const [isFeatured, setIsFeatured] = useState(Boolean(initialEpisode?.is_featured));
  const [isPublished, setIsPublished] = useState(initialEpisode?.is_published === undefined ? true : Boolean(initialEpisode?.is_published));
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const topicDataList = useMemo(() => {
    const merged = Array.from(new Set(topicOptions.map((item) => String(item || '').trim()).filter(Boolean)));
    return merged.sort((a, b) => a.localeCompare(b));
  }, [topicOptions]);

  return (
    <form
      className="card section-space"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        setStatus(isEdit ? 'Saving episode...' : 'Creating episode...');

        const payload = {
          title,
          slug: slugify(slug || title),
          topic,
          summary,
          description,
          audio_url: audioUrl,
          cover_image_url: coverImageUrl,
          published_at: publishedAt,
          is_featured: isFeatured,
          is_published: isPublished,
        };

        const endpoint = isEdit ? `/api/admin/podcasts/${encodeURIComponent(initialEpisode.slug)}` : '/api/admin/podcasts';
        const method = isEdit ? 'PUT' : 'POST';

        try {
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

          setStatus(isEdit ? 'Episode updated.' : 'Episode created.');
          setSaving(false);
          router.push('/admin/podcasts');
          router.refresh();
        } catch {
          setStatus('Save failed due to network error.');
          setSaving(false);
        }
      }}
    >
      <h2 className="section-title">{isEdit ? 'Edit Podcast Episode' : 'Create Podcast Episode'}</h2>
      <p className="meta">Topics can be newly typed by any admin. This is backend-only.</p>

      <div className="grid cols-3">
        <div className="form-row">
          <label htmlFor="podcast-title">Title</label>
          <input
            id="podcast-title"
            type="text"
            value={title}
            onChange={(event) => {
              const next = event.target.value;
              setTitle(next);
              if (!slugTouched) {
                setSlug(slugify(next));
              }
            }}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="podcast-slug">Slug</label>
          <input
            id="podcast-slug"
            type="text"
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(slugify(event.target.value));
            }}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="podcast-topic">Topic (create new by typing)</label>
          <input id="podcast-topic" list="podcast-topic-options" type="text" value={topic} onChange={(event) => setTopic(event.target.value)} />
          <datalist id="podcast-topic-options">
            {topicDataList.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="podcast-summary">Summary</label>
        <textarea id="podcast-summary" value={summary} onChange={(event) => setSummary(event.target.value)} />
      </div>

      <div className="form-row">
        <label htmlFor="podcast-description">Description</label>
        <textarea id="podcast-description" value={description} onChange={(event) => setDescription(event.target.value)} />
      </div>

      <MediaUrlInput
        id="podcast-audio-url"
        label="Audio URL"
        value={audioUrl}
        onChange={setAudioUrl}
        folder="audio/tracks"
        accept="audio/*"
        placeholder="https://... or /..."
      />

      <MediaUrlInput
        id="podcast-cover-url"
        label="Cover Image URL"
        value={coverImageUrl}
        onChange={setCoverImageUrl}
        folder="images/posts"
        accept="image/*"
        placeholder="https://... or /..."
      />

      <div className="grid cols-3">
        <div className="form-row">
          <label htmlFor="podcast-published-at">Published At</label>
          <input
            id="podcast-published-at"
            type="datetime-local"
            value={publishedAt}
            onChange={(event) => setPublishedAt(event.target.value)}
          />
        </div>
      </div>

      <div className="actions">
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
          <input type="checkbox" checked={isFeatured} onChange={(event) => setIsFeatured(event.target.checked)} />
          <span className="meta">Featured</span>
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
          <input type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} />
          <span className="meta">Published</span>
        </label>
      </div>

      <div className="actions">
        <button className="button primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Update Episode' : 'Create Episode'}
        </button>
        {isEdit ? (
          <button
            className="button danger"
            type="button"
            onClick={async () => {
              const confirmed = window.confirm('Delete this podcast episode?');
              if (!confirmed) {
                return;
              }

              const response = await fetch(`/api/admin/podcasts/${encodeURIComponent(initialEpisode.slug)}`, { method: 'DELETE' });
              const body = await response.json().catch(() => ({}));
              if (!response.ok) {
                setStatus(body.error || 'Delete failed.');
                return;
              }

              router.push('/admin/podcasts');
              router.refresh();
            }}
          >
            Delete Episode
          </button>
        ) : null}
      </div>
      {status ? <p className="meta">{status}</p> : null}
    </form>
  );
}
