'use client';

import { useState } from 'react';
import { STORAGE_FOLDER_PRESETS } from '../lib/storage-folders';

export default function UploadForm() {
  const [status, setStatus] = useState('');
  const [url, setUrl] = useState('');
  const [folder, setFolder] = useState('images/bands');

  return (
    <form
      className="card section-space"
      onSubmit={async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const file = formData.get('file');

        if (!(file instanceof File) || !file.size) {
          setStatus('Pick a file first.');
          setUrl('');
          return;
        }

        setStatus('Uploading...');
        setUrl('');

        formData.set('folder', folder);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const payload = await response.json();

        if (!response.ok) {
          setStatus(payload.error || 'Upload failed.');
          return;
        }

        setStatus('Upload complete.');
        setUrl(payload.url || '');
      }}
    >
      <h3 className="section-title">Storage Upload Test</h3>
      <p className="meta">Uploads go to Supabase Storage so they persist outside Docker.</p>
      <div className="form-row">
        <label htmlFor="upload-file">File</label>
        <input id="upload-file" name="file" type="file" required />
      </div>
      <div className="form-row">
        <label htmlFor="upload-folder">Folder</label>
        <select id="upload-folder" name="folder" value={folder} onChange={(event) => setFolder(event.target.value)}>
          {STORAGE_FOLDER_PRESETS.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <p className="meta">Current path prefix: {folder}/</p>
      <button className="button primary" type="submit">
        Upload
      </button>
      {status ? <p className="meta">{status}</p> : null}
      {url ? (
        <p>
          <a className="button" href={url} target="_blank" rel="noreferrer">
            Open Uploaded File
          </a>
        </p>
      ) : null}
    </form>
  );
}
