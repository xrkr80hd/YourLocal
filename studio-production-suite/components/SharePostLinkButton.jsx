'use client';

import { useState } from 'react';

function toAbsoluteUrl(path) {
  const raw = String(path || '').trim();
  if (!raw) {
    return '';
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  if (typeof window === 'undefined') {
    return raw;
  }

  if (raw.startsWith('/')) {
    return `${window.location.origin}${raw}`;
  }

  return `${window.location.origin}/${raw}`;
}

export default function SharePostLinkButton({ path = '', title = '', label = 'Share Link', className = 'button' }) {
  const [status, setStatus] = useState('');

  return (
    <span className="share-link-wrap">
      <button
        type="button"
        className={className}
        onClick={async () => {
          const url = toAbsoluteUrl(path);
          if (!url) {
            setStatus('Link unavailable.');
            return;
          }

          const sharePayload = {
            title: String(title || 'Blog post').trim(),
            text: 'Check this post out:',
            url,
          };

          if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
            try {
              await navigator.share(sharePayload);
              setStatus('Shared.');
              return;
            } catch (error) {
              if (error?.name === 'AbortError') {
                return;
              }
            }
          }

          if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            try {
              await navigator.clipboard.writeText(url);
              setStatus('Link copied.');
              return;
            } catch {
              // Fall through to prompt fallback.
            }
          }

          if (typeof window !== 'undefined' && typeof window.prompt === 'function') {
            window.prompt('Copy this link:', url);
            setStatus('Link ready to copy.');
            return;
          }

          setStatus(url);
        }}
      >
        {label}
      </button>
      {status ? <span className="share-link-status">{status}</span> : null}
    </span>
  );
}
