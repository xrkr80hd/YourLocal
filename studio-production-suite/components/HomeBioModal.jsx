'use client';

import { useEffect, useState } from 'react';

export default function HomeBioModal({ fullBio = '', avatarUrl = '', headline = '' }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const bio = String(fullBio || '').trim();
  if (!bio) {
    return null;
  }

  const title = String(headline || 'XRKR80HD').trim() || 'XRKR80HD';

  return (
    <>
      <button type="button" className="button" onClick={() => setOpen(true)}>
        Read full bio here
      </button>

      <div
        className={`hub-modal home-bio-modal ${open ? 'open' : ''}`.trim()}
        aria-hidden={open ? 'false' : 'true'}
        onClick={() => setOpen(false)}
      >
        <div
          className="hub-modal-dialog home-bio-modal-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="home-bio-modal-title"
          onClick={(event) => event.stopPropagation()}
        >
          <button type="button" className="hub-modal-close" aria-label="Close full bio" onClick={() => setOpen(false)}>
            ×
          </button>

          <h3 id="home-bio-modal-title" className="section-title">
            {title} Full Bio
          </h3>

          <div className="home-bio-modal-content">
            <div className="home-bio-modal-photo">
              {avatarUrl ? <img src={avatarUrl} alt={`${title} profile`} /> : <span>XR</span>}
            </div>
            <div className="home-bio-modal-text">
              <p>{bio}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
