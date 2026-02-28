'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MediaUrlInput from './MediaUrlInput';

export default function AdminHomeSettingsForm({ initialProfile = null }) {
  const router = useRouter();
  const [headline, setHeadline] = useState(String(initialProfile?.headline || ''));
  const [shortBio, setShortBio] = useState(String(initialProfile?.short_bio || ''));
  const [fullBio, setFullBio] = useState(String(initialProfile?.full_bio || ''));
  const [avatarUrl, setAvatarUrl] = useState(String(initialProfile?.avatar_url || ''));
  const [legendsCardImageUrl, setLegendsCardImageUrl] = useState(String(initialProfile?.home_legends_card_image_url || ''));
  const [sceneCardImageUrl, setSceneCardImageUrl] = useState(String(initialProfile?.home_scene_card_image_url || ''));
  const [podcastCardImageUrl, setPodcastCardImageUrl] = useState(String(initialProfile?.home_podcast_card_image_url || ''));
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  return (
    <form
      className="card section-space"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        setStatus('Saving homepage settings...');

        const payload = {
          headline,
          short_bio: shortBio,
          full_bio: fullBio,
          avatar_url: avatarUrl,
          home_legends_card_image_url: legendsCardImageUrl,
          home_scene_card_image_url: sceneCardImageUrl,
          home_podcast_card_image_url: podcastCardImageUrl,
        };

        try {
          const response = await fetch('/api/admin/site-profile', {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
          });

          const body = await response.json().catch(() => ({}));
          if (!response.ok) {
            setStatus(body.error || 'Save failed.');
            setSaving(false);
            return;
          }

          setStatus('Homepage profile and card images saved.');
          setSaving(false);
          router.refresh();
        } catch {
          setStatus('Save failed due to network error.');
          setSaving(false);
        }
      }}
    >
      <h2 className="section-title">Homepage Controls (Owner)</h2>
      <p className="meta">Change your landing profile image and front-page card images from here.</p>

      <div className="form-row">
        <label htmlFor="home-headline">Headline</label>
        <input id="home-headline" type="text" value={headline} onChange={(event) => setHeadline(event.target.value)} />
      </div>

      <div className="form-row">
        <label htmlFor="home-short-bio">Short Bio</label>
        <textarea id="home-short-bio" value={shortBio} onChange={(event) => setShortBio(event.target.value)} />
      </div>

      <div className="form-row">
        <label htmlFor="home-full-bio">Full Bio</label>
        <textarea id="home-full-bio" value={fullBio} onChange={(event) => setFullBio(event.target.value)} />
      </div>

      <MediaUrlInput
        id="home-avatar-url"
        label="Landing Profile Picture URL"
        value={avatarUrl}
        onChange={setAvatarUrl}
        folder="images/artists"
        accept="image/*"
        placeholder="https://... or /..."
      />

      <MediaUrlInput
        id="home-legends-card-image-url"
        label="YourLocal Legends Card Image URL"
        value={legendsCardImageUrl}
        onChange={setLegendsCardImageUrl}
        folder="images/posts"
        accept="image/*"
        placeholder="https://... or /..."
      />

      <MediaUrlInput
        id="home-scene-card-image-url"
        label="YourLocal Scene Card Image URL"
        value={sceneCardImageUrl}
        onChange={setSceneCardImageUrl}
        folder="images/posts"
        accept="image/*"
        placeholder="https://... or /..."
      />

      <MediaUrlInput
        id="home-podcast-card-image-url"
        label="YourLocal Podcast Card Image URL"
        value={podcastCardImageUrl}
        onChange={setPodcastCardImageUrl}
        folder="images/posts"
        accept="image/*"
        placeholder="https://... or /..."
      />

      <div className="actions">
        <button className="button primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Homepage Settings'}
        </button>
      </div>
      {status ? <p className="meta">{status}</p> : null}
    </form>
  );
}
