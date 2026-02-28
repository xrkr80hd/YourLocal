import { NextResponse } from 'next/server';
import { ADMIN_SESSION_USER_COOKIE, isOwnerUsername } from '../../../../../lib/admin-auth';
import { deleteAdminUser, normalizeAdminUsername } from '../../../../../lib/admin-users';

export const runtime = 'nodejs';

function ownerGuard(request) {
  const actingUser = request.cookies.get(ADMIN_SESSION_USER_COOKIE)?.value || '';
  return isOwnerUsername(actingUser);
}

export async function DELETE(request, { params }) {
  if (!ownerGuard(request)) {
    return NextResponse.json({ error: 'Only the owner account can manage admin users.' }, { status: 403 });
  }

  const username = normalizeAdminUsername(params.username);
  const actingUser = normalizeAdminUsername(request.cookies.get(ADMIN_SESSION_USER_COOKIE)?.value || '');

  if (!username) {
    return NextResponse.json({ error: 'Invalid username.' }, { status: 400 });
  }

  if (username === actingUser) {
    return NextResponse.json({ error: 'You cannot delete your own active account.' }, { status: 400 });
  }

  const result = await deleteAdminUser(username);

  if (!result.ok) {
    return NextResponse.json({ error: result.error || 'Delete failed.' }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
