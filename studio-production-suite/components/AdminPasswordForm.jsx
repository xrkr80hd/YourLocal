'use client';

import { useState } from 'react';

export default function AdminPasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  return (
    <form
      className="card section-space"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        setStatus('Updating password...');

        try {
          const response = await fetch('/api/admin/me/password', {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword }),
          });
          const body = await response.json().catch(() => ({}));

          if (!response.ok) {
            setStatus(body.error || 'Password update failed.');
            setSaving(false);
            return;
          }

          setCurrentPassword('');
          setNewPassword('');
          setStatus('Password updated.');
          setSaving(false);
        } catch {
          setStatus('Password update failed due to network error.');
          setSaving(false);
        }
      }}
    >
      <h2 className="section-title">Change My Password</h2>
      <div className="grid cols-2">
        <div className="form-row">
          <label htmlFor="admin-current-password">Current Password</label>
          <input
            id="admin-current-password"
            type={showCurrent ? 'text' : 'password'}
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
          />
          <button className="button" type="button" style={{ marginTop: '0.45rem' }} onClick={() => setShowCurrent((value) => !value)}>
            {showCurrent ? 'Hide Password' : 'Show Password'}
          </button>
        </div>
        <div className="form-row">
          <label htmlFor="admin-new-password">New Password</label>
          <input
            id="admin-new-password"
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="At least 10 chars"
            required
          />
          <button className="button" type="button" style={{ marginTop: '0.45rem' }} onClick={() => setShowNew((value) => !value)}>
            {showNew ? 'Hide Password' : 'Show Password'}
          </button>
        </div>
      </div>
      <div className="actions">
        <button className="button primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Update Password'}
        </button>
      </div>
      {status ? <p className="meta">{status}</p> : null}
    </form>
  );
}
