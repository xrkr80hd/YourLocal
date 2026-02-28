'use client';

import { useState } from 'react';

export default function MediaUrlInput({
  id,
  label,
  value,
  onChange,
  folder,
  accept = '*/*',
  placeholder = '',
  help = '',
}) {
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  return (
    <div className="form-row">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      {help ? <p className="meta">{help}</p> : null}
      <div className="upload-widget">
        <input
          id={`${id}-file`}
          type="file"
          accept={accept}
          disabled={uploading}
          onChange={async (event) => {
            const file = event.target.files && event.target.files[0];
            if (!file) {
              return;
            }

            const form = new FormData();
            form.set('file', file);
            form.set('folder', folder);

            setUploading(true);
            setStatus('Uploading...');

            try {
              const response = await fetch('/api/upload', {
                method: 'POST',
                body: form,
              });
              const payload = await response.json().catch(() => ({}));

              if (!response.ok) {
                setStatus(payload.error || 'Upload failed.');
                setUploading(false);
                return;
              }

              const nextUrl = String(payload.url || '');
              if (nextUrl) {
                onChange(nextUrl);
              }
              setStatus(nextUrl ? 'Uploaded and URL set.' : 'Upload complete.');
              setUploading(false);
            } catch {
              setStatus('Upload failed due to network error.');
              setUploading(false);
            }
          }}
        />
        {status ? <span className="upload-status">{status}</span> : null}
      </div>
      {value ? (
        <p style={{ marginTop: '0.45rem' }}>
          <a className="button" href={value} target="_blank" rel="noreferrer">
            Open File
          </a>
        </p>
      ) : null}
    </div>
  );
}
