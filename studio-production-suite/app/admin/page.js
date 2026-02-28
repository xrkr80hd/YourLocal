import Link from 'next/link';
import { cookies } from 'next/headers';
import { getSupabaseAdminLinks } from '../../lib/admin-links';
import AdminLogoutButton from '../../components/AdminLogoutButton';
import { ADMIN_SESSION_USER_COOKIE, isOwnerUsername } from '../../lib/admin-auth';

export const metadata = {
  title: 'Admin | xrkr80hd Studio',
};

export default function AdminPage() {
  const links = getSupabaseAdminLinks();
  const actingUser = cookies().get(ADMIN_SESSION_USER_COOKIE)?.value || '';
  const ownerMode = isOwnerUsername(actingUser);

  return (
    <>
      <section className="card hero">
        <h1>Admin Dashboard</h1>
        <p>Use this panel to manage uploads and open your Supabase admin tools.</p>
      </section>

      <section className="card section-space">
        <h3 className="section-title">Site Admin Actions</h3>
        <div className="actions">
          <Link className="button" href="/admin/bands">
            Manage Band Socials
          </Link>
          {ownerMode ? (
            <Link className="button" href="/admin/users">
              Manage Admin Users
            </Link>
          ) : null}
          <Link className="button primary" href="/upload">
            Upload Media
          </Link>
          <a className="button" href={links.tableEditor} target="_blank" rel="noreferrer">
            Supabase Table Editor
          </a>
          <a className="button" href={links.storage} target="_blank" rel="noreferrer">
            Supabase Storage
          </a>
          <a className="button" href={links.project} target="_blank" rel="noreferrer">
            Supabase Project
          </a>
          <AdminLogoutButton />
        </div>
        <p className="meta" style={{ marginTop: '0.8rem' }}>
          Note: the old Laravel `/admin/*` controllers were replaced during the Next.js migration. This is the active admin entry for the current app.
        </p>
        <p className="meta">Signed in as: {actingUser || 'unknown'}</p>
        {ownerMode ? (
          <p className="meta">Owner tools are enabled for this session.</p>
        ) : (
          <p className="meta">Standard admin mode: content CRUD + uploads.</p>
        )}
      </section>
    </>
  );
}
