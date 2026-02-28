'use client';

import { useMemo, useState } from 'react';
import { SOCIAL_PLATFORMS, normalizeSocialLinksMap } from '../lib/social-platforms';

export default function AdminBandSocialsForm({ band }) {
  const initial = useMemo(() => normalizeSocialLinksMap(band.social_links), [band.social_links]);
  const [socials, setSocials] = useState(initial);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const updateSocial = (key, nextPartial) => {
    setSocials((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...nextPartial,
      },
    }));
  };

  return (
    <form
      className="card section-space"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        setStatus('Saving social links...');

        try {
          const response = await fetch(`/api/admin/bands/${band.slug}/socials`, {
            method: 'PUT',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({ socials }),
          });

          const payload = await response.json().catch(() => ({}));

          if (!response.ok) {
            setStatus(payload.error || 'Save failed.');
            setSaving(false);
            return;
          }

          setStatus('Saved. Band page socials are updated.');
          setSaving(false);
        } catch {
          setStatus('Save failed due to network error.');
          setSaving(false);
        }
      }}
    >
      <h2 className="section-title">Social Links</h2>
      <p className="meta">Toggle each platform on/off, then enter only the suffix (the base URL is prefixed automatically).</p>

      <div className="grid cols-2 section-space">
        {SOCIAL_PLATFORMS.map((platform) => {
          const value = socials[platform.key] || { enabled: false, suffix: '' };

          return (
            <article key={platform.key} className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem' }}>
                <strong>{platform.label}</strong>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(value.enabled)}
                    onChange={(event) => updateSocial(platform.key, { enabled: event.target.checked })}
                  />
                  <span className="meta">Enabled</span>
                </label>
              </div>
              <p className="meta" style={{ marginTop: '0.45rem' }}>
                Prefix: <code>{platform.prefix}</code>
              </p>
              <div className="form-row" style={{ marginTop: '0.45rem' }}>
                <label htmlFor={`social-${platform.key}`}>Suffix</label>
                <input
                  id={`social-${platform.key}`}
                  type="text"
                  value={value.suffix || ''}
                  onChange={(event) => updateSocial(platform.key, { suffix: event.target.value })}
                  placeholder="your-handle-or-path"
                />
              </div>
            </article>
          );
        })}
      </div>

      <div className="actions">
        <button className="button primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Social Links'}
        </button>
      </div>
      {status ? <p className="meta" style={{ marginTop: '0.7rem' }}>{status}</p> : null}
    </form>
  );
}
