'use client';

import { useEffect, useState } from 'react';

export default function HubMediaGallery({ photos, videos }) {
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (!modal) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setModal(null);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [modal]);

  const close = () => setModal(null);

  return (
    <>
      <section className="hub-stack section-space">
        <details className="hub-panel card">
          <summary>
            <span className="section-title">Photos</span>
            <span className="meta">{photos.length} latest</span>
          </summary>
          <div className="hub-panel-content">
            <div className="hub-thumb-strip">
              {photos.length ? (
                photos.map((item) => (
                  <button
                    key={`photo-${item.id}`}
                    type="button"
                    className="hub-thumb"
                    onClick={() => setModal({ type: 'image', src: item.media_url, title: item.title || 'Photo' })}
                  >
                    {item.thumbnail_url ? <img src={item.thumbnail_url} alt={item.title || 'Photo'} /> : <span>{item.title}</span>}
                  </button>
                ))
              ) : (
                <p className="meta">No photos yet.</p>
              )}
            </div>
          </div>
        </details>

        <details className="hub-panel card">
          <summary>
            <span className="section-title">Videos</span>
            <span className="meta">{videos.length} latest</span>
          </summary>
          <div className="hub-panel-content">
            <div className="hub-thumb-strip">
              {videos.length ? (
                videos.map((item) => (
                  <button
                    key={`video-${item.id}`}
                    type="button"
                    className="hub-thumb hub-video-thumb"
                    onClick={() => setModal({ type: 'video', src: item.media_url, title: item.title || 'Video' })}
                  >
                    {item.thumbnail_url ? <img src={item.thumbnail_url} alt={item.title || 'Video'} /> : <span>{item.title}</span>}
                    <span className="hub-play-icon">▶</span>
                  </button>
                ))
              ) : (
                <p className="meta">No videos yet.</p>
              )}
            </div>
          </div>
        </details>
      </section>

      <div className={`hub-modal ${modal ? 'open' : ''}`} id="hub-modal" aria-hidden={modal ? 'false' : 'true'}>
        <div className="hub-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="hub-modal-title">
          <button type="button" className="hub-modal-close" aria-label="Close" onClick={close}>
            ×
          </button>
          <h4 id="hub-modal-title" className="section-title">
            {modal?.title || ''}
          </h4>
          {modal?.type === 'video' ? (
            <video className="hub-modal-video" controls autoPlay src={modal.src} />
          ) : modal?.type === 'image' ? (
            <img className="hub-modal-image" src={modal.src} alt={modal.title || 'Media'} />
          ) : null}
        </div>
      </div>
    </>
  );
}
