import Link from 'next/link';
import { cookies } from 'next/headers';
import { getSupabaseAdminLinks } from '../../lib/admin-links';
import AdminLogoutButton from '../../components/AdminLogoutButton';
import AdminMediaGuide from '../../components/AdminMediaGuide';
import { ADMIN_SESSION_USER_COOKIE, getAdminOwnerUsername, isOwnerUsername } from '../../lib/admin-auth';

export const metadata = {
  title: 'Admin | xrkr80hd Studio',
};

export default function AdminPage({ searchParams }) {
  const links = getSupabaseAdminLinks();
  const actingUser = cookies().get(ADMIN_SESSION_USER_COOKIE)?.value || '';
  const ownerMode = isOwnerUsername(actingUser);
  const ownerUsername = getAdminOwnerUsername();
  const error = String(searchParams?.error || '');
  const deniedPath = String(searchParams?.from || '');
  const ownerActions = [
    { href: '/admin/home', label: 'Homepage Controls', detail: 'Landing profile and Site Guide card photos.' },
    { href: '/admin/tracks', label: 'Tracks Manager', detail: 'Upload audio, sort tracks, choose home player list.' },
    { href: '/admin/users', label: 'Manage Admin Users', detail: 'Create/remove lower-tier admins.' },
  ];
  const commonActions = [
    { href: '/admin/guide', label: 'Admin Guide', detail: 'Image sizes and media upload standards.' },
    { href: '/admin/blog', label: 'Blog Manager', detail: 'Write and publish blog posts.' },
    { href: '/admin/bands', label: 'Band Manager', detail: 'Create/edit bands, photos, members, socials.' },
    { href: '/admin/podcasts', label: 'Podcast Manager', detail: 'Create podcast profiles and manage episodes.' },
    { href: '/admin/password', label: 'My Password', detail: 'Update your own login password.' },
  ];

  return (
    <>
      <section className="card hero">
        <h1>Admin Dashboard</h1>
        <p>Use this panel to manage uploads and open your Supabase admin tools.</p>
      </section>

      <section className="card section-space">
        {error === 'owner' ? (
          <p className="alert">
            Access denied for <strong>{deniedPath || 'that route'}</strong>. Signed in as <strong>{actingUser || 'unknown'}</strong>. Owner-only routes
            require <strong>{ownerUsername}</strong>.
          </p>
        ) : null}
        <h3 className="section-title">Edit Panels</h3>
        <div className="admin-action-grid">
          {commonActions.map((item) => (
            <Link key={item.href} className="admin-action-tile" href={item.href}>
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </Link>
          ))}
          {ownerMode
            ? ownerActions.map((item) => (
                <Link key={item.href} className="admin-action-tile owner" href={item.href}>
                  <strong>{item.label}</strong>
                  <span>{item.detail}</span>
                </Link>
              ))
            : null}
        </div>

        <h3 className="section-title" style={{ marginTop: '1rem' }}>
          Supabase Tools
        </h3>
        <div className="admin-action-grid compact">
          <a className="admin-action-tile" href={links.tableEditor} target="_blank" rel="noreferrer">
            <strong>Table Editor</strong>
            <span>Open DB rows/columns.</span>
          </a>
          <a className="admin-action-tile" href={links.storage} target="_blank" rel="noreferrer">
            <strong>Storage</strong>
            <span>Open files and buckets.</span>
          </a>
          <a className="admin-action-tile" href={links.project} target="_blank" rel="noreferrer">
            <strong>Project</strong>
            <span>Open Supabase project settings.</span>
          </a>
          <div className="admin-action-tile danger">
            <strong>Session</strong>
            <span>Sign out of admin mode.</span>
            <div className="actions" style={{ marginTop: '0.55rem' }}>
              <AdminLogoutButton />
            </div>
          </div>
        </div>
        <p className="meta" style={{ marginTop: '0.8rem' }}>
          Note: the old Laravel `/admin/*` controllers were replaced during the Next.js migration. This is the active admin entry for the current app.
        </p>
        <p className="meta">Signed in as: {actingUser || 'unknown'}</p>
        <p className="meta">Media upload should happen directly inside band/podcast edit forms.</p>
        {ownerMode ? (
          <p className="meta">Owner tools are enabled for this session.</p>
        ) : (
          <p className="meta">Standard admin mode: content CRUD + uploads.</p>
        )}
      </section>

      <AdminMediaGuide />
    </>
  );
}
