'use client';

import { useState } from 'react';

function SqlBlock({ sql }) {
  if (!sql) {
    return null;
  }

  return (
    <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto', background: 'rgba(8, 13, 23, 0.86)', border: '1px solid rgba(127,216,255,0.28)', borderRadius: '10px', padding: '0.7rem' }}>
      {sql}
    </pre>
  );
}

export default function AdminUsersManager({ initialUsers, missingTable, initialError, sqlSnippet, ownerUsername }) {
  const [users, setUsers] = useState(initialUsers || []);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(initialError || '');
  const [saving, setSaving] = useState(false);

  const refreshUsers = async () => {
    const response = await fetch('/api/admin/users', { method: 'GET' });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus(payload.error || 'Failed to refresh admin users.');
      return;
    }

    setUsers(payload.users || []);
  };

  return (
    <>
      <section className="card section-space">
        <h2 className="section-title">Create Admin User</h2>
        <p className="meta">Owner account: {ownerUsername}</p>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setSaving(true);
            setStatus('Creating admin user...');

            const response = await fetch('/api/admin/users', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ username, displayName, password }),
            });

            const payload = await response.json().catch(() => ({}));

            if (!response.ok) {
              setStatus(payload.error || 'Create failed.');
              setSaving(false);
              return;
            }

            setUsername('');
            setDisplayName('');
            setPassword('');
            setStatus('Admin user created.');
            setSaving(false);
            await refreshUsers();
          }}
        >
          <div className="grid cols-3">
            <div className="form-row">
              <label htmlFor="admin-user-username">Username</label>
              <input
                id="admin-user-username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="mattadmin"
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="admin-user-display">Display Name (optional)</label>
              <input
                id="admin-user-display"
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Matt"
              />
            </div>
            <div className="form-row">
              <label htmlFor="admin-user-password">Password</label>
              <input
                id="admin-user-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 10 chars"
                required
              />
            </div>
          </div>
          <div className="actions">
            <button className="button primary" type="submit" disabled={saving || missingTable}>
              {saving ? 'Creating...' : 'Create Admin'}
            </button>
          </div>
        </form>
        {status ? <p className="meta" style={{ marginTop: '0.7rem' }}>{status}</p> : null}
      </section>

      <section className="card section-space">
        <h2 className="section-title">Existing Admin Users</h2>
        {users.length ? (
          <div className="grid cols-2">
            {users.map((user) => (
              <article key={user.username} className="card">
                <h3 className="section-title" style={{ marginBottom: '0.2rem' }}>{user.username}</h3>
                <p className="meta">{user.display_name || 'No display name'}</p>
                <div className="actions">
                  <button
                    className="button danger"
                    type="button"
                    onClick={async () => {
                      const response = await fetch(`/api/admin/users/${encodeURIComponent(user.username)}`, { method: 'DELETE' });
                      const payload = await response.json().catch(() => ({}));

                      if (!response.ok) {
                        setStatus(payload.error || 'Delete failed.');
                        return;
                      }

                      setStatus(`Deleted ${user.username}.`);
                      await refreshUsers();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="meta">No DB-managed admins yet.</p>
        )}
      </section>

      {missingTable ? (
        <section className="card section-space">
          <h2 className="section-title">One-Time Setup Needed</h2>
          <p className="meta">Run this SQL once in Supabase SQL Editor, then refresh this page.</p>
          <SqlBlock sql={sqlSnippet} />
        </section>
      ) : null}
    </>
  );
}
