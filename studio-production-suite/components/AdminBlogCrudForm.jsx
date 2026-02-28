'use client';

import { useState } from 'react';
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

export default function AdminBlogCrudForm({ mode = 'create', initialPost = null }) {
  const router = useRouter();
  const isEdit = mode === 'edit';

  const [title, setTitle] = useState(String(initialPost?.title || ''));
  const [slug, setSlug] = useState(String(initialPost?.slug || ''));
  const [slugTouched, setSlugTouched] = useState(Boolean(initialPost?.slug));
  const [excerpt, setExcerpt] = useState(String(initialPost?.excerpt || ''));
  const [content, setContent] = useState(String(initialPost?.content || ''));
  const [coverImageUrl, setCoverImageUrl] = useState(String(initialPost?.cover_image_url || ''));
  const [publishedAt, setPublishedAt] = useState(toDateTimeLocal(initialPost?.published_at));
  const [isPublished, setIsPublished] = useState(Boolean(initialPost?.is_published));
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  return (
    <form
      className="card section-space"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        setStatus(isEdit ? 'Saving post...' : 'Creating post...');

        const payload = {
          title,
          slug: slugify(slug || title),
          excerpt,
          content,
          cover_image_url: coverImageUrl,
          published_at: publishedAt,
          is_published: isPublished,
        };

        const endpoint = isEdit ? `/api/admin/blog/${encodeURIComponent(initialPost.slug)}` : '/api/admin/blog';
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

          setStatus(isEdit ? 'Post updated.' : 'Post created.');
          setSaving(false);
          router.push('/admin/blog');
          router.refresh();
        } catch {
          setStatus('Save failed due to network error.');
          setSaving(false);
        }
      }}
    >
      <h2 className="section-title">{isEdit ? 'Edit Blog Post' : 'Create Blog Post'}</h2>

      <div className="grid cols-3">
        <div className="form-row">
          <label htmlFor="blog-title">Title</label>
          <input
            id="blog-title"
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
          <label htmlFor="blog-slug">Slug</label>
          <input
            id="blog-slug"
            type="text"
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(slugify(event.target.value));
            }}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="blog-excerpt">Excerpt</label>
        <textarea id="blog-excerpt" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} />
      </div>

      <div className="form-row">
        <label htmlFor="blog-content">Content</label>
        <textarea id="blog-content" value={content} onChange={(event) => setContent(event.target.value)} required style={{ minHeight: '260px' }} />
      </div>

      <MediaUrlInput
        id="blog-cover-image"
        label="Cover Image URL"
        value={coverImageUrl}
        onChange={setCoverImageUrl}
        folder="images/posts"
        accept="image/*"
        placeholder="https://... or /..."
      />

      <div className="grid cols-3">
        <div className="form-row">
          <label htmlFor="blog-published-at">Published At</label>
          <input
            id="blog-published-at"
            type="datetime-local"
            value={publishedAt}
            onChange={(event) => setPublishedAt(event.target.value)}
          />
        </div>
      </div>

      <div className="actions">
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
          <input type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} />
          <span className="meta">Published</span>
        </label>
      </div>

      <div className="actions">
        <button className="button primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
        </button>
        {isEdit ? (
          <button
            className="button danger"
            type="button"
            onClick={async () => {
              const confirmed = window.confirm('Delete this post?');
              if (!confirmed) {
                return;
              }

              const response = await fetch(`/api/admin/blog/${encodeURIComponent(initialPost.slug)}`, { method: 'DELETE' });
              const body = await response.json().catch(() => ({}));
              if (!response.ok) {
                setStatus(body.error || 'Delete failed.');
                return;
              }

              router.push('/admin/blog');
              router.refresh();
            }}
          >
            Delete Post
          </button>
        ) : null}
      </div>

      {status ? <p className="meta">{status}</p> : null}
    </form>
  );
}
