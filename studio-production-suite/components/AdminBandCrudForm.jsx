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

function normalizeMembers(value) {
  if (!Array.isArray(value) || !value.length) {
    return [{ name: '', role: '', image_url: '' }];
  }

  return value.map((item) => ({
    name: String(item?.name || ''),
    role: String(item?.role || ''),
    image_url: String(item?.image_url || ''),
  }));
}

export default function AdminBandCrudForm({ mode = 'create', initialBand = null, genreOptions = [], initialEra = 'archive' }) {
  const router = useRouter();
  const isEdit = mode === 'edit';

  const [name, setName] = useState(String(initialBand?.name || ''));
  const [slug, setSlug] = useState(String(initialBand?.slug || ''));
  const [slugTouched, setSlugTouched] = useState(Boolean(initialBand?.slug));
  const [era, setEra] = useState(initialBand?.era === 'scene' ? 'scene' : initialEra === 'scene' ? 'scene' : 'archive');
  const [yearsActive, setYearsActive] = useState(String(initialBand?.years_active || ''));
  const [genre, setGenre] = useState(String(initialBand?.genre || ''));
  const [tagline, setTagline] = useState(String(initialBand?.tagline || ''));
  const [summary, setSummary] = useState(String(initialBand?.summary || ''));
  const [story, setStory] = useState(String(initialBand?.story || ''));
  const [imageUrl, setImageUrl] = useState(String(initialBand?.image_url || ''));
  const [bannerImageUrl, setBannerImageUrl] = useState(String(initialBand?.banner_image_url || ''));
  const [bandPhotoUrl, setBandPhotoUrl] = useState(String(initialBand?.band_photo_url || ''));
  const [isSoloArtist, setIsSoloArtist] = useState(Boolean(initialBand?.is_solo_artist));
  const [isPublished, setIsPublished] = useState(initialBand?.is_published === undefined ? true : Boolean(initialBand?.is_published));
  const [sortOrder, setSortOrder] = useState(String(initialBand?.sort_order ?? 0));
  const [members, setMembers] = useState(normalizeMembers(initialBand?.members));
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const genreDataList = useMemo(() => {
    const merged = Array.from(new Set(genreOptions.map((value) => String(value || '').trim()).filter(Boolean)));
    return merged.sort((a, b) => a.localeCompare(b));
  }, [genreOptions]);

  const setMemberValue = (index, key, value) => {
    setMembers((current) => current.map((member, idx) => (idx === index ? { ...member, [key]: value } : member)));
  };

  return (
    <form
      className="card section-space"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        setStatus(isEdit ? 'Saving band...' : 'Creating band...');

        const resolvedSlug = slugify(slug || name);
        const payload = {
          name,
          slug: resolvedSlug,
          era,
          years_active: yearsActive,
          genre,
          tagline,
          summary,
          story,
          image_url: imageUrl,
          banner_image_url: bannerImageUrl,
          band_photo_url: bandPhotoUrl,
          is_solo_artist: isSoloArtist,
          is_published: isPublished,
          sort_order: sortOrder,
          members,
        };

        const endpoint = isEdit ? `/api/admin/bands/${encodeURIComponent(initialBand.slug)}` : '/api/admin/bands';
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

          setStatus(isEdit ? 'Band updated.' : 'Band created.');
          setSaving(false);
          router.push('/admin/bands');
          router.refresh();
        } catch {
          setStatus('Save failed due to network error.');
          setSaving(false);
        }
      }}
    >
      <h2 className="section-title">{isEdit ? 'Edit Band' : 'Create Band'}</h2>
      <p className="meta">Create the band and members in one save. This only appears in admin backend.</p>

      <div className="grid cols-3">
        <div className="form-row">
          <label htmlFor="band-name">Band Name</label>
          <input
            id="band-name"
            type="text"
            value={name}
            onChange={(event) => {
              const nextName = event.target.value;
              setName(nextName);
              if (!slugTouched) {
                setSlug(slugify(nextName));
              }
            }}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="band-slug">Slug</label>
          <input
            id="band-slug"
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
          <label htmlFor="band-era">Page</label>
          <select id="band-era" value={era} onChange={(event) => setEra(event.target.value)}>
            <option value="archive">YourLocal Legends (Archive)</option>
            <option value="scene">YourLocal Scene (Current)</option>
          </select>
        </div>
      </div>

      <div className="grid cols-3">
        <div className="form-row">
          <label htmlFor="band-years-active">Years Active</label>
          <input id="band-years-active" type="text" value={yearsActive} onChange={(event) => setYearsActive(event.target.value)} placeholder="2008 - 2013" />
        </div>
        <div className="form-row">
          <label htmlFor="band-genre">Genre (create new by typing)</label>
          <input id="band-genre" list="band-genre-options" type="text" value={genre} onChange={(event) => setGenre(event.target.value)} placeholder="metalcore" />
          <datalist id="band-genre-options">
            {genreDataList.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>
        <div className="form-row">
          <label htmlFor="band-sort-order">Sort Order</label>
          <input id="band-sort-order" type="number" min="0" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} />
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="band-tagline">Tagline</label>
        <input id="band-tagline" type="text" value={tagline} onChange={(event) => setTagline(event.target.value)} />
      </div>

      <div className="form-row">
        <label htmlFor="band-summary">Summary</label>
        <textarea id="band-summary" value={summary} onChange={(event) => setSummary(event.target.value)} required />
      </div>

      <div className="form-row">
        <label htmlFor="band-story">Story</label>
        <textarea id="band-story" value={story} onChange={(event) => setStory(event.target.value)} />
      </div>

      <MediaUrlInput
        id="band-image-url"
        label="Card Image URL"
        value={imageUrl}
        onChange={setImageUrl}
        folder="images/bands"
        accept="image/*"
        placeholder="https://... or /..."
      />

      <MediaUrlInput
        id="band-banner-image-url"
        label="Banner Image URL"
        value={bannerImageUrl}
        onChange={setBannerImageUrl}
        folder="images/bands"
        accept="image/*"
        placeholder="https://... or /..."
      />

      <MediaUrlInput
        id="band-photo-url"
        label="Band Photo URL"
        value={bandPhotoUrl}
        onChange={setBandPhotoUrl}
        folder="images/bands"
        accept="image/*"
        placeholder="https://... or /..."
      />

      <section className="section-space">
        <h3 className="section-title">{isSoloArtist ? 'Artist Team' : 'Band Members'}</h3>
        <div className="grid">
          {members.map((member, index) => (
            <article key={`member-${index}`} className="card">
              <div className="grid cols-3">
                <div className="form-row">
                  <label htmlFor={`member-name-${index}`}>Name</label>
                  <input
                    id={`member-name-${index}`}
                    type="text"
                    value={member.name}
                    onChange={(event) => setMemberValue(index, 'name', event.target.value)}
                    placeholder="Member name"
                  />
                </div>
                <div className="form-row">
                  <label htmlFor={`member-role-${index}`}>Role</label>
                  <input
                    id={`member-role-${index}`}
                    type="text"
                    value={member.role}
                    onChange={(event) => setMemberValue(index, 'role', event.target.value)}
                    placeholder="Vocals / Guitar / Drums"
                  />
                </div>
              </div>
              <MediaUrlInput
                id={`member-image-${index}`}
                label="Member Image URL"
                value={member.image_url}
                onChange={(nextValue) => setMemberValue(index, 'image_url', nextValue)}
                folder="images/artists"
                accept="image/*"
                placeholder="https://... or /..."
              />
              <div className="actions">
                <button
                  className="button danger"
                  type="button"
                  onClick={() => setMembers((current) => (current.length > 1 ? current.filter((_, idx) => idx !== index) : current))}
                  disabled={members.length <= 1}
                >
                  Remove Member
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="actions">
          <button
            className="button"
            type="button"
            onClick={() => setMembers((current) => [...current, { name: '', role: '', image_url: '' }])}
          >
            Add Member
          </button>
        </div>
      </section>

      <div className="actions">
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
          <input type="checkbox" checked={isSoloArtist} onChange={(event) => setIsSoloArtist(event.target.checked)} />
          <span className="meta">Solo Artist</span>
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
          <input type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} />
          <span className="meta">Published</span>
        </label>
      </div>

      <div className="actions">
        <button className="button primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Update Band' : 'Create Band'}
        </button>
        {isEdit ? (
          <button
            className="button danger"
            type="button"
            onClick={async () => {
              const confirmed = window.confirm('Delete this band? This cannot be undone.');
              if (!confirmed) {
                return;
              }

              const response = await fetch(`/api/admin/bands/${encodeURIComponent(initialBand.slug)}`, { method: 'DELETE' });
              const body = await response.json().catch(() => ({}));
              if (!response.ok) {
                setStatus(body.error || 'Delete failed.');
                return;
              }

              router.push('/admin/bands');
              router.refresh();
            }}
          >
            Delete Band
          </button>
        ) : null}
      </div>
      {status ? <p className="meta">{status}</p> : null}
    </form>
  );
}
