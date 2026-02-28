'use client';

import { useState } from 'react';

function isAudioFile(file) {
  const type = String(file?.type || '').toLowerCase();
  const name = String(file?.name || '').toLowerCase();
  return (
    type.startsWith('audio/') ||
    name.endsWith('.mp3') ||
    name.endsWith('.wav') ||
    name.endsWith('.ogg') ||
    name.endsWith('.m4a') ||
    name.endsWith('.flac')
  );
}

async function createSignedUploadIntent({ file, folder, replaceMode, replaceKey, currentValue }) {
  const response = await fetch('/api/upload/signed', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      filename: file.name,
      folder,
      replace: replaceMode ? '1' : '0',
      replace_key: replaceKey || '',
      replace_from_url: currentValue || '',
      content_type: file.type || '',
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || 'Failed to initialize direct upload.');
  }

  const signedUrl = String(payload.signed_url || '').trim();
  if (!signedUrl) {
    throw new Error('Signed upload URL was not returned by server.');
  }

  return payload;
}

async function uploadViaSignedUrl({ file, folder, replaceMode, replaceKey, currentValue }) {
  const intent = await createSignedUploadIntent({ file, folder, replaceMode, replaceKey, currentValue });
  const signedUrl = String(intent.signed_url || '').trim();
  const contentType = String(intent.content_type || file.type || 'application/octet-stream');

  const uploadResponse = await fetch(signedUrl, {
    method: 'PUT',
    headers: {
      'content-type': contentType,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    const failureText = await uploadResponse.text().catch(() => '');
    throw new Error(failureText || `Direct upload failed with status ${uploadResponse.status}.`);
  }

  return intent;
}

export default function MediaUrlInput({
  id,
  label,
  value,
  onChange,
  folder,
  replaceMode = false,
  replaceKey = '',
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
            if (replaceMode) {
              form.set('replace', '1');
              if (replaceKey) {
                form.set('replace_key', replaceKey);
              }
              if (value) {
                form.set('replace_from_url', value);
              }
            }

            setUploading(true);
            setStatus('Uploading...');

            try {
              const shouldUseSignedUpload = isAudioFile(file) || file.size > 4 * 1024 * 1024;
              let payload = {};

              if (shouldUseSignedUpload) {
                setStatus('Uploading directly to storage...');
                payload = await uploadViaSignedUrl({
                  file,
                  folder,
                  replaceMode,
                  replaceKey,
                  currentValue: value,
                });
              } else {
                const response = await fetch('/api/upload', {
                  method: 'POST',
                  body: form,
                });
                payload = await response.json().catch(() => ({}));

                if (!response.ok) {
                  const shouldFallbackToSigned = response.status === 413 || /payload|too large|FUNCTION_PAYLOAD_TOO_LARGE/i.test(String(payload.error || ''));
                  if (shouldFallbackToSigned) {
                    setStatus('Switching to direct storage upload...');
                    payload = await uploadViaSignedUrl({
                      file,
                      folder,
                      replaceMode,
                      replaceKey,
                      currentValue: value,
                    });
                  } else {
                    throw new Error(String(payload.error || 'Upload failed.'));
                  }
                }
              }

              const nextUrl = String(payload.url || payload.canonical_url || '');
              if (nextUrl) {
                onChange(nextUrl);
              }
              setStatus(nextUrl ? (replaceMode ? 'Uploaded and replaced.' : 'Uploaded and URL set.') : 'Upload complete.');
              setUploading(false);
            } catch (error) {
              setStatus(error instanceof Error ? error.message : 'Upload failed due to network error.');
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
