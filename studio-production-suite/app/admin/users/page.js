import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminUsersManager from '../../../components/AdminUsersManager';
import { ADMIN_SESSION_USER_COOKIE, getAdminOwnerUsername, isOwnerUsername } from '../../../lib/admin-auth';
import { adminUsersBootstrapSql, listAdminUsers, normalizeAdminUsername } from '../../../lib/admin-users';

export const metadata = {
  title: 'Admin Users | xrkr80hd Studio',
};

export default async function AdminUsersPage() {
  const actingUser = normalizeAdminUsername(cookies().get(ADMIN_SESSION_USER_COOKIE)?.value || '');
  const ownerUsername = getAdminOwnerUsername();

  if (!isOwnerUsername(actingUser)) {
    redirect('/admin');
  }

  const result = await listAdminUsers();

  return (
    <>
      <section className="card hero">
        <h1>Admin User Manager</h1>
        <p>Add or remove editor/admin accounts from the site without editing Vercel env vars each time.</p>
      </section>

      <AdminUsersManager
        initialUsers={result.users}
        missingTable={result.missingTable}
        initialError={result.error || ''}
        sqlSnippet={result.missingTable ? adminUsersBootstrapSql() : ''}
        ownerUsername={ownerUsername}
      />
    </>
  );
}
