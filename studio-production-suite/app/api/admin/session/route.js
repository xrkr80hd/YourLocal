import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, areAdminCredentialsValid, getAdminConfig, isAdminConfigReady } from '../../../../lib/admin-auth';

export const runtime = 'nodejs';

function getJsonBodySafe(request) {
  return request.json().catch(() => ({}));
}

export async function POST(request) {
  if (!isAdminConfigReady()) {
    return NextResponse.json({ error: 'Admin auth is not configured on the server.' }, { status: 500 });
  }

  const body = await getJsonBodySafe(request);
  const username = String(body.username || '').trim();
  const password = String(body.password || '');

  if (!areAdminCredentialsValid(username, password)) {
    return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
  }

  const { sessionToken } = getAdminConfig();
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: sessionToken,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
