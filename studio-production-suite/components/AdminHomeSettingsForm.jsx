'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MediaUrlInput from './MediaUrlInput';
import AdminAccordionSection from './AdminAccordionSection';

const SHORT_BIO_MAX = 300;
const WELCOME_MESSAGE_MAX = 220;
const BLOG_NOTICE_MESSAGE_MAX = 180;

export default function AdminHomeSettingsForm({ initialProfile = null }) {
  const router = useRouter();
  const [headline, setHeadline] = useState(String(initialProfile?.headline || ''));
  const [welcomeMessage, setWelcomeMessage] = useState(String(initialProfile?.welcome_message || ''));
  const [blogNoticeMessage, setBlogNoticeMessage] = useState(String(initialProfile?.blog_notice_message || ''));
  const [shortBio, setShortBio] = useState(String(initialProfile?.short_bio || ''));
  const [fullBio, setFullBio] = useState(String(initialProfile?.full_bio || ''));
  const [avatarUrl, setAvatarUrl] = useState(String(initialProfile?.avatar_url || ''));
  const [legendsCardImageUrl, setLegendsCardImageUrl] = useState(String(initialProfile?.home_legends_card_image_url || ''));
  const [sceneCardImageUrl, setSceneCardImageUrl] = useState(String(initialProfile?.home_scene_card_image_url || ''));
  const [podcastCardImageUrl, setPodcastCardImageUrl] = useState(String(initialProfile?.home_podcast_card_image_url || ''));
  const [hubCardImageUrl, setHubCardImageUrl] = useState(String(initialProfile?.home_hub_card_image_url || ''));
  const [businessCardImageUrl, setBusinessCardImageUrl] = useState(String(initialProfile?.home_business_card_image_url || ''));
  const [contactCardImageUrl, setContactCardImageUrl] = useState(String(initialProfile?.home_contact_card_image_url || ''));
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const welcomeMessageCount = welcomeMessage.length;
  const blogNoticeMessageCount = blogNoticeMessage.length;
  const shortBioCount = shortBio.length;

  return (
    <form
      className="card section-space"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        setStatus('Saving homepage settings...');

        const payload = {
          headline,
          welcome_message: welcomeMessage,
          blog_notice_message: blogNoticeMessage,
          short_bio: shortBio,
          full_bio: fullBio,
          avatar_url: avatarUrl,
          home_legends_card_image_url: legendsCardImageUrl,
          home_scene_card_image_url: sceneCardImageUrl,
          home_podcast_card_image_url: podcastCardImageUrl,
          home_hub_card_image_url: hubCardImageUrl,
          home_business_card_image_url: businessCardImageUrl,
          home_contact_card_image_url: contactCardImageUrl,
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
      <p className="meta">Change homepage messaging, landing profile image, and front-page card images from here.</p>

      <AdminAccordionSection title="Profile Copy" note="Headline and bio text." defaultOpen>
        <div className="form-row">
          <label htmlFor="home-headline">Headline</label>
          <input id="home-headline" type="text" value={headline} onChange={(event) => setHeadline(event.target.value)} />
        </div>

        <div className="form-row">
          <label htmlFor="home-welcome-message">Welcome Message</label>
          <textarea
            id="home-welcome-message"
            value={welcomeMessage}
            maxLength={WELCOME_MESSAGE_MAX}
            onChange={(event) => setWelcomeMessage(event.target.value)}
            placeholder="Welcome to the site..."
          />
          <p className="meta">
            {welcomeMessageCount}/{WELCOME_MESSAGE_MAX} characters (max {WELCOME_MESSAGE_MAX})
          </p>
        </div>

        <div className="form-row">
          <label htmlFor="home-blog-notice-message">Blog Notification Message</label>
          <textarea
            id="home-blog-notice-message"
            value={blogNoticeMessage}
            maxLength={BLOG_NOTICE_MESSAGE_MAX}
            onChange={(event) => setBlogNoticeMessage(event.target.value)}
            placeholder="New blog post is live."
          />
          <p className="meta">
            {blogNoticeMessageCount}/{BLOG_NOTICE_MESSAGE_MAX} characters (max {BLOG_NOTICE_MESSAGE_MAX})
          </p>
        </div>

        <div className="form-row">
          <label htmlFor="home-short-bio">Short Bio</label>
          <textarea
            id="home-short-bio"
            value={shortBio}
            maxLength={SHORT_BIO_MAX}
            onChange={(event) => setShortBio(event.target.value)}
          />
          <p className="meta">
            {shortBioCount}/{SHORT_BIO_MAX} characters (max {SHORT_BIO_MAX})
          </p>
        </div>

        <div className="form-row">
          <label htmlFor="home-full-bio">Full Bio</label>
          <textarea id="home-full-bio" value={fullBio} onChange={(event) => setFullBio(event.target.value)} />
        </div>
      </AdminAccordionSection>

      <AdminAccordionSection title="Profile Image" note="Landing profile photo." defaultOpen={false}>
        <MediaUrlInput
          id="home-avatar-url"
          label="Landing Profile Picture URL"
          value={avatarUrl}
          onChange={setAvatarUrl}
          folder="images/artists"
          accept="image/*"
          placeholder="https://... or /..."
        />
      </AdminAccordionSection>

      <AdminAccordionSection title="Home Card Images" note="Site Guide card images for each destination." defaultOpen={false}>
        <MediaUrlInput
          id="home-hub-card-image-url"
          label="XRKR80HDLocal Hub Card Image URL"
          value={hubCardImageUrl}
          onChange={setHubCardImageUrl}
          folder="images/posts"
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

        <MediaUrlInput
          id="home-business-card-image-url"
          label="YourLocal Business Card Image URL"
          value={businessCardImageUrl}
          onChange={setBusinessCardImageUrl}
          folder="images/posts"
          accept="image/*"
          placeholder="https://... or /..."
        />

        <MediaUrlInput
          id="home-contact-card-image-url"
          label="Contact Card Image URL"
          value={contactCardImageUrl}
          onChange={setContactCardImageUrl}
          folder="images/posts"
          accept="image/*"
          placeholder="https://... or /..."
        />
      </AdminAccordionSection>

      <AdminAccordionSection title="Save Homepage Settings" note="Apply all changes." defaultOpen>
        <div className="actions">
          <button className="button primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Homepage Settings'}
          </button>
        </div>
        {status ? <p className="meta">{status}</p> : null}
      </AdminAccordionSection>
    </form>
  );
}
