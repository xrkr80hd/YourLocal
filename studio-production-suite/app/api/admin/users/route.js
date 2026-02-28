import { NextResponse } from 'next/server';
import { ADMIN_SESSION_USER_COOKIE, isOwnerUsername } from '../../../../lib/admin-auth';
import { adminUsersBootstrapSql, createAdminUser, listAdminUsers } from '../../../../lib/admin-users';

export const runtime = 'nodejs';

function ownerGuard(request) {
  const actingUser = request.cookies.get(ADMIN_SESSION_USER_COOKIE)?.value || '';
  return isOwnerUsername(actingUser);
}

export async function GET(request) {
  if (!ownerGuard(request)) {
    return NextResponse.json({ error: 'Only the owner account can manage admin users.' }, { status: 403 });
  }

  const result = await listAdminUsers();

  return NextResponse.json({
    users: result.users,
    missingTable: result.missingTable,
    error: result.error,
    sql: result.missingTable ? adminUsersBootstrapSql() : '',
  });
}

export async function POST(request) {
  if (!ownerGuard(request)) {
    return NextResponse.json({ error: 'Only the owner account can manage admin users.' }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const result = await createAdminUser({
    username: body.username,
    password: body.password,
    displayName: body.displayName,
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        error: result.error,
        missingTable: result.missingTable,
        sql: result.missingTable ? adminUsersBootstrapSql() : '',
      },
      { status: result.missingTable ? 500 : 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
