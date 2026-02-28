'use client';

import { useState } from 'react';
import AdminAccordionSection from './AdminAccordionSection';

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
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [resetPasswords, setResetPasswords] = useState({});
  const [showResetPassword, setShowResetPassword] = useState({});
  const [deliveryMessages, setDeliveryMessages] = useState({});
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

  const setResetPasswordValue = (targetUser, value) => {
    setResetPasswords((current) => ({ ...current, [targetUser]: value }));
  };

  const setShowResetPasswordValue = (targetUser, value) => {
    setShowResetPassword((current) => ({ ...current, [targetUser]: value }));
  };

  const setDeliveryMessageValue = (targetUser, value) => {
    setDeliveryMessages((current) => ({ ...current, [targetUser]: value }));
  };

  const getResetPasswordValue = (targetUser) => resetPasswords[targetUser] || '';
  const isResetPasswordVisible = (targetUser) => Boolean(showResetPassword[targetUser]);
  const getDeliveryMessageValue = (targetUser) => deliveryMessages[targetUser] || '';

  const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
    const bytes = new Uint32Array(18);
    if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
      window.crypto.getRandomValues(bytes);
    } else {
      for (let index = 0; index < bytes.length; index += 1) {
        bytes[index] = Math.floor(Math.random() * 0xffffffff);
      }
    }

    let output = '';
    for (let index = 0; index < bytes.length; index += 1) {
      output += chars[bytes[index] % chars.length];
    }
    return output;
  };

  const copyToClipboard = async (text) => {
    if (!text) {
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  const buildAdminLoginMessage = (targetUser, plainPassword = '') => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const loginUrl = `${origin}/admin/login`;
    const lines = [
      'xrkr80hd.studio admin access',
      `Login URL: ${loginUrl}`,
      `Username: ${targetUser}`,
    ];

    if (plainPassword) {
      lines.push(`Password: ${plainPassword}`);
      lines.push('You can change this password later.');
    } else {
      lines.push('Password: use your current password (or ask owner for a reset).');
    }

    return lines.join('\n');
  };

  return (
    <>
      <section className="card section-space">
        <AdminAccordionSection title="Create Admin User" note={`Owner account: ${ownerUsername}`} defaultOpen>
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
                  type={showCreatePassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 10 chars"
                  required
                />
                <button
                  className="button"
                  type="button"
                  style={{ marginTop: '0.45rem' }}
                  onClick={() => setShowCreatePassword((value) => !value)}
                >
                  {showCreatePassword ? 'Hide Password' : 'Show Password'}
                </button>
              </div>
            </div>
            <div className="actions">
              <button className="button primary" type="submit" disabled={saving || missingTable}>
                {saving ? 'Creating...' : 'Create Admin'}
              </button>
            </div>
          </form>
          {status ? <p className="meta" style={{ marginTop: '0.7rem' }}>{status}</p> : null}
        </AdminAccordionSection>
      </section>

      <section className="card section-space">
        <AdminAccordionSection title={`Existing Admin Users (${users.length})`} note="Manage passwords and remove users." defaultOpen={false}>
          {users.length ? (
            <div className="grid cols-2">
              {users.map((user) => (
                <article key={user.username} className="card">
                  <h3 className="section-title" style={{ marginBottom: '0.2rem' }}>{user.username}</h3>
                  <p className="meta">{user.display_name || 'No display name'}</p>
                  <div className="form-row" style={{ marginTop: '0.6rem' }}>
                    <label htmlFor={`reset-password-${user.username}`}>Reset Password (if they forgot)</label>
                    <input
                      id={`reset-password-${user.username}`}
                      type={isResetPasswordVisible(user.username) ? 'text' : 'password'}
                      value={getResetPasswordValue(user.username)}
                      onChange={(event) => setResetPasswordValue(user.username, event.target.value)}
                      placeholder="Set temporary password (min 10 chars)"
                    />
                    <button
                      className="button"
                      type="button"
                      style={{ marginTop: '0.45rem' }}
                      onClick={() => setShowResetPasswordValue(user.username, !isResetPasswordVisible(user.username))}
                    >
                      {isResetPasswordVisible(user.username) ? 'Hide Password' : 'Show Password'}
                    </button>
                  </div>
                  <div className="actions">
                    <button
                      className="button"
                      type="button"
                      onClick={async () => {
                        const text = buildAdminLoginMessage(user.username);
                        const copied = await copyToClipboard(text);
                        setDeliveryMessageValue(user.username, text);
                        setStatus(copied ? `Copied login link for ${user.username}.` : `Clipboard blocked. Use manual copy box for ${user.username}.`);
                      }}
                    >
                      Copy Login Link
                    </button>
                    <button
                      className="button"
                      type="button"
                      onClick={async () => {
                        let nextPassword = getResetPasswordValue(user.username);

                        if (nextPassword.length < 10) {
                          nextPassword = generateTemporaryPassword();
                          setResetPasswordValue(user.username, nextPassword);
                        }

                        const response = await fetch(`/api/admin/users/${encodeURIComponent(user.username)}`, {
                          method: 'PATCH',
                          headers: { 'content-type': 'application/json' },
                          body: JSON.stringify({ password: nextPassword }),
                        });
                        const payload = await response.json().catch(() => ({}));

                        if (!response.ok) {
                          setStatus(payload.error || 'Password reset failed.');
                          return;
                        }

                        const text = buildAdminLoginMessage(user.username, nextPassword);
                        const copied = await copyToClipboard(text);
                        setDeliveryMessageValue(user.username, text);
                        setShowResetPasswordValue(user.username, true);
                        setStatus(
                          copied
                            ? `Password reset for ${user.username}. New login details copied.`
                            : `Password reset for ${user.username}. Clipboard blocked; use manual copy box.`
                        );
                      }}
                    >
                      Reset Password + Copy
                    </button>
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
                  {getDeliveryMessageValue(user.username) ? (
                    <div className="form-row" style={{ marginTop: '0.7rem' }}>
                      <label htmlFor={`delivery-${user.username}`}>Manual Copy Box</label>
                      <textarea
                        id={`delivery-${user.username}`}
                        readOnly
                        rows={5}
                        value={getDeliveryMessageValue(user.username)}
                        onFocus={(event) => event.target.select()}
                      />
                      <div className="actions" style={{ marginTop: '0.45rem' }}>
                        <button
                          className="button"
                          type="button"
                          onClick={async () => {
                            const copied = await copyToClipboard(getDeliveryMessageValue(user.username));
                            setStatus(copied ? `Copied message for ${user.username}.` : 'Select text in box and copy manually.');
                          }}
                        >
                          Copy From Box
                        </button>
                      </div>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <p className="meta">No DB-managed admins yet.</p>
          )}
        </AdminAccordionSection>
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
