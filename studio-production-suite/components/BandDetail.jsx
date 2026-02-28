'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function BandDetail({ band, backHref, backLabel }) {
  const members = Array.isArray(band.members_json) ? band.members_json : [];
  const primaryPhoto = band.band_photo_url || band.image_url;
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (!modal) {
      document.body.classList.remove('no-scroll');
      return undefined;
    }

    document.body.classList.add('no-scroll');

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setModal(null);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [modal]);

  return (
    <>
      <section className="card band-page-hero">
        {band.banner_image_url ? <div className="band-banner" style={{ backgroundImage: `url('${band.banner_image_url}')` }} /> : null}
        <Link className="button" href={backHref}>
          {backLabel}
        </Link>
        <div className={`band-profile-wrap ${band.is_solo_artist ? 'solo' : ''}`.trim()}>
          <div className="band-photo">
            {primaryPhoto ? (
              <button
                type="button"
                className="band-photo-trigger"
                aria-label={`Expand ${band.name} photo`}
                onClick={() => setModal({ src: primaryPhoto, alt: `${band.name} photo` })}
              >
                <img src={primaryPhoto} alt={band.name} />
              </button>
            ) : (
              <span>BND</span>
            )}
          </div>
          <div className="band-main-copy">
            <h1>{band.name}</h1>
            <p className="meta">
              {band.years_active || 'Years Active'} • {band.genre || 'Local Band'}
            </p>
            {band.tagline ? <p>{band.tagline}</p> : null}
          </div>
        </div>
      </section>

      <section className="card section-space">
        <h2 className="section-title">Story</h2>
        <p>{band.story || band.summary}</p>
      </section>

      {members.length ? (
        <section className="card section-space">
          <h2 className="section-title">{band.is_solo_artist ? 'Artist Team' : 'Band Members'}</h2>
          <div className="members-grid">
            {members.map((member, index) => (
              <article key={`${member.name || 'member'}-${index}`} className="member-card">
                <div className="member-avatar">
                  {member.image_url ? (
                    <button
                      type="button"
                      className="member-avatar-trigger"
                      aria-label={`Expand ${member.name || 'member'} photo`}
                      onClick={() => setModal({ src: member.image_url, alt: `${member.name || 'Member'} photo` })}
                    >
                      <img src={member.image_url} alt={member.name || 'Member'} />
                    </button>
                  ) : (
                    <span>{String(member.name || 'M').slice(0, 1).toUpperCase()}</span>
                  )}
                </div>
                <div className="member-name">{member.name || 'Member'}</div>
                {member.role ? <div className="member-role">{member.role}</div> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <div className={`band-lightbox ${modal ? 'open' : ''}`} id="band-lightbox" aria-hidden={modal ? 'false' : 'true'}>
        <div className="band-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Expanded band photo">
          <button type="button" className="band-lightbox-close" aria-label="Close" onClick={() => setModal(null)}>
            ×
          </button>
          {modal ? <img className="band-lightbox-image" src={modal.src} alt={modal.alt || 'Expanded band photo'} /> : null}
        </div>
      </div>
    </>
  );
}
