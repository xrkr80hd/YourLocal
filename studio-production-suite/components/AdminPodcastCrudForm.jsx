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

export default function AdminPodcastCrudForm({ mode = 'create', initialPodcast = null, topicOptions = [] }) {
  const router = useRouter();
  const isEdit = mode === 'edit';

  const [title, setTitle] = useState(String(initialPodcast?.title || ''));
  const [slug, setSlug] = useState(String(initialPodcast?.slug || ''));
  const [slugTouched, setSlugTouched] = useState(Boolean(initialPodcast?.slug));
  const [hosts, setHosts] = useState(String(initialPodcast?.hosts || ''));
  const [topic, setTopic] = useState(String(initialPodcast?.topic || ''));
  const [summary, setSummary] = useState(String(initialPodcast?.summary || ''));
  const [description, setDescription] = useState(String(initialPodcast?.description || ''));
  const [coverImageUrl, setCoverImageUrl] = useState(String(initialPodcast?.cover_image_url || ''));
  const [sortOrder, setSortOrder] = useState(String(initialPodcast?.sort_order ?? 0));
  const [isPublished, setIsPublished] = useState(initialPodcast?.is_published === undefined ? true : Boolean(initialPodcast?.is_published));
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
        setStatus(isEdit ? 'Saving podcast...' : 'Creating podcast...');

        const payload = {
          title,
          slug: slugify(slug || title),
          hosts,
          topic,
          summary,
          description,
          cover_image_url: coverImageUrl,
          sort_order: sortOrder,
          is_published: isPublished,
        };

        const endpoint = isEdit ? `/api/admin/podcasts/${encodeURIComponent(initialPodcast.slug)}` : '/api/admin/podcasts';
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

          setStatus(isEdit ? 'Podcast updated.' : 'Podcast created.');
          setSaving(false);
          if (isEdit) {
            router.refresh();
            return;
          }

          const nextSlug = body?.item?.slug || payload.slug;
          router.push(`/admin/podcasts/${encodeURIComponent(nextSlug)}/edit`);
          router.refresh();
        } catch {
          setStatus('Save failed due to network error.');
          setSaving(false);
        }
      }}
    >
      <h2 className="section-title">{isEdit ? 'Edit Local Podcast' : 'Create Local Podcast'}</h2>
      <p className="meta">Create the podcast profile first, then add 1-2 episodes from its edit page.</p>

      <AdminAccordionSection title="Podcast Basics" note="Name, slug, hosts, topic and ordering." defaultOpen>
        <div className="grid cols-3">
          <div className="form-row">
            <label htmlFor="podcast-title">Podcast Name</label>
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
            <label htmlFor="podcast-hosts">Who They Are (hosts)</label>
            <input id="podcast-hosts" type="text" value={hosts} onChange={(event) => setHosts(event.target.value)} placeholder="Jane Doe, John Doe" />
          </div>
        </div>

        <div className="grid cols-3">
          <div className="form-row">
            <label htmlFor="podcast-topic">Topic (create new by typing)</label>
            <input id="podcast-topic" list="podcast-topic-options" type="text" value={topic} onChange={(event) => setTopic(event.target.value)} />
            <datalist id="podcast-topic-options">
              {topicDataList.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </div>
          <div className="form-row">
            <label htmlFor="podcast-sort-order">Sort Order</label>
            <input id="podcast-sort-order" type="number" min="0" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} />
          </div>
        </div>
      </AdminAccordionSection>

      <AdminAccordionSection title="Podcast Description" note="Short summary and long description." defaultOpen={false}>
        <div className="form-row">
          <label htmlFor="podcast-summary">What It Is (short summary)</label>
          <textarea id="podcast-summary" value={summary} onChange={(event) => setSummary(event.target.value)} />
        </div>

        <div className="form-row">
          <label htmlFor="podcast-description">What It Is About (full description)</label>
          <textarea id="podcast-description" value={description} onChange={(event) => setDescription(event.target.value)} />
        </div>
      </AdminAccordionSection>

      <AdminAccordionSection title="Podcast Cover" note="Upload or set cover image." defaultOpen={false}>
        <MediaUrlInput
          id="podcast-cover-url"
          label="Podcast Cover Image URL"
          value={coverImageUrl}
          onChange={setCoverImageUrl}
          folder="images/posts"
          accept="image/*"
          placeholder="https://... or /..."
        />
      </AdminAccordionSection>

      <AdminAccordionSection title="Publish and Save" note="Final publish + save actions." defaultOpen>
        <div className="actions">
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            <input type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} />
            <span className="meta">Published</span>
          </label>
        </div>

        <div className="actions">
          <button className="button primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Podcast' : 'Create Podcast'}
          </button>
          {isEdit ? (
            <button
              className="button danger"
              type="button"
              onClick={async () => {
                const confirmed = window.confirm('Delete this podcast profile and its episodes?');
                if (!confirmed) {
                  return;
                }

                const response = await fetch(`/api/admin/podcasts/${encodeURIComponent(initialPodcast.slug)}`, { method: 'DELETE' });
                const body = await response.json().catch(() => ({}));
                if (!response.ok) {
                  setStatus(body.error || 'Delete failed.');
                  return;
                }

                router.push('/admin/podcasts');
                router.refresh();
              }}
            >
              Delete Podcast
            </button>
          ) : null}
        </div>
        {status ? <p className="meta">{status}</p> : null}
      </AdminAccordionSection>
    </form>
  );
}
