'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function getErrorMessage(code) {
  if (code === 'config') {
    return 'Admin auth is not configured on the server.';
  }

  return '';
}

export default function AdminLoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = useMemo(() => searchParams.get('next') || '/admin', [searchParams]);
  const initialError = useMemo(() => getErrorMessage(searchParams.get('error') || ''), [searchParams]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(initialError);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="card admin-login-card"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        setStatus('Signing in...');

        try {
          const response = await fetch('/api/admin/session', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });

          const payload = await response.json().catch(() => ({}));

          if (!response.ok) {
            setStatus(payload.error || 'Sign in failed.');
            setLoading(false);
            return;
          }

          setStatus('Signed in. Redirecting...');
          router.push(next);
          router.refresh();
        } catch {
          setStatus('Sign in failed due to a network error.');
          setLoading(false);
        }
      }}
    >
      <h1 className="section-title">Admin Login</h1>
      <p className="meta">Protected admin access for uploads and management routes.</p>
      <div className="form-row">
        <label htmlFor="admin-username">Username</label>
        <input
          id="admin-username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button
          className="button"
          type="button"
          style={{ marginTop: '0.45rem' }}
          onClick={() => setShowPassword((value) => !value)}
        >
          {showPassword ? 'Hide Password' : 'Show Password'}
        </button>
      </div>
      <button className="button primary" type="submit" disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
      {status ? <p className="meta" style={{ marginTop: '0.7rem' }}>{status}</p> : null}
    </form>
  );
}
