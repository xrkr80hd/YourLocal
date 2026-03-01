'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import MediaUrlInput from './MediaUrlInput';
import AdminAccordionSection from './AdminAccordionSection';

function isValidWebsiteUrl(value) {
  const url = String(value || '').trim();
  if (!url) {
    return true;
  }
  return /^(https?:\/\/|\/)/i.test(url);
}

function normalizeWebsiteUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) {
    return '';
  }
  if (/^(https?:\/\/|\/)/i.test(raw)) {
    return raw;
  }
  return `https://${raw}`;
}

export default function AdminBusinessCrudForm({ mode = 'create', initialBusiness = null, categoryOptions = [] }) {
  const router = useRouter();
  const isEdit = mode === 'edit';
  const goToBusinessManager = () => {
    const next = `/admin/business?refresh=${Date.now()}`;
    if (typeof window !== 'undefined') {
      window.location.assign(next);
      return;
    }
    router.replace(next);
    router.refresh();
  };

  const [name, setName] = useState(String(initialBusiness?.name || ''));
  const [category, setCategory] = useState(String(initialBusiness?.category || ''));
  const [summary, setSummary] = useState(String(initialBusiness?.summary || ''));
  const [description, setDescription] = useState(String(initialBusiness?.description || ''));
  const [logoUrl, setLogoUrl] = useState(String(initialBusiness?.logo_url || ''));
  const [websiteUrl, setWebsiteUrl] = useState(String(initialBusiness?.website_url || ''));
  const [sortOrder, setSortOrder] = useState(String(initialBusiness?.sort_order ?? 0));
  const [isPublished, setIsPublished] = useState(initialBusiness?.is_published === undefined ? true : Boolean(initialBusiness?.is_published));
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const categoryDataList = useMemo(() => {
    const merged = Array.from(new Set(categoryOptions.map((item) => String(item || '').trim()).filter(Boolean)));
    return merged.sort((a, b) => a.localeCompare(b));
  }, [categoryOptions]);

  return (
    <form
      className="card section-space"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        setStatus(isEdit ? 'Saving business...' : 'Creating business...');

        const normalizedWebsiteUrl = normalizeWebsiteUrl(websiteUrl);

        if (!isValidWebsiteUrl(normalizedWebsiteUrl)) {
          setStatus('Website URL must start with https:// or /.');
          setSaving(false);
          return;
        }

        const payload = {
          name,
          category,
          summary,
          description,
          logo_url: logoUrl,
          website_url: normalizedWebsiteUrl,
          sort_order: sortOrder,
          is_published: isPublished,
        };

        const endpoint = isEdit ? `/api/admin/business/${encodeURIComponent(initialBusiness.id)}` : '/api/admin/business';
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

          setStatus(isEdit ? 'Business updated.' : 'Business created.');
          setSaving(false);
          goToBusinessManager();
        } catch {
          setStatus('Save failed due to network error.');
          setSaving(false);
        }
      }}
    >
      <h2 className="section-title">{isEdit ? 'Edit Business' : 'Create Business'}</h2>
      <p className="meta">Manage local business cards shown on the public YourLocal Business page.</p>

      <AdminAccordionSection title="Business Basics" note="Name, category, sort order and status." defaultOpen>
        <div className="grid cols-3">
          <div className="form-row">
            <label htmlFor="business-name">Business Name</label>
            <input id="business-name" type="text" value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div className="form-row">
            <label htmlFor="business-category">Category</label>
            <input
              id="business-category"
              type="text"
              list="business-category-options"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Local Food Business"
            />
            <datalist id="business-category-options">
              {categoryDataList.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </div>
          <div className="form-row">
            <label htmlFor="business-sort-order">Sort Order</label>
            <input id="business-sort-order" type="number" min="0" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} />
          </div>
        </div>

        <div className="actions">
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            <input type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} />
            <span className="meta">Published</span>
          </label>
        </div>
      </AdminAccordionSection>

      <AdminAccordionSection title="Business Copy" note="Summary and description text." defaultOpen={false}>
        <div className="form-row">
          <label htmlFor="business-summary">Summary</label>
          <textarea id="business-summary" value={summary} onChange={(event) => setSummary(event.target.value)} />
        </div>
        <div className="form-row">
          <label htmlFor="business-description">Description</label>
          <textarea id="business-description" value={description} onChange={(event) => setDescription(event.target.value)} />
        </div>
      </AdminAccordionSection>

      <AdminAccordionSection title="Business Media and Links" note="Logo and website URL." defaultOpen={false}>
        <MediaUrlInput
          id="business-logo-url"
          label="Logo or Business Image URL"
          value={logoUrl}
          onChange={setLogoUrl}
          folder="images/business"
          accept="image/*"
          placeholder="https://... or /..."
          help="Upload a logo or card image. PNG/WebP/JPG all work."
        />

        <div className="form-row">
          <label htmlFor="business-website-url">Website URL (optional)</label>
          <input
            id="business-website-url"
            type="text"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            placeholder="https://..."
          />
        </div>
      </AdminAccordionSection>

      <AdminAccordionSection title="Save Business" note="Create/update or delete." defaultOpen>
        <div className="actions">
          <button className="button primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Business' : 'Create Business'}
          </button>
          {isEdit ? (
            <button
              className="button danger"
              type="button"
              onClick={async () => {
                const confirmed = window.confirm('Delete this business card?');
                if (!confirmed) {
                  return;
                }

                const response = await fetch(`/api/admin/business/${encodeURIComponent(initialBusiness.id)}`, { method: 'DELETE' });
                const body = await response.json().catch(() => ({}));
                if (!response.ok) {
                  setStatus(body.error || 'Delete failed.');
                  return;
                }

                goToBusinessManager();
              }}
            >
              Delete Business
            </button>
          ) : null}
        </div>
        {status ? <p className="meta">{status}</p> : null}
      </AdminAccordionSection>
    </form>
  );
}
