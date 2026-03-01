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
    { href: '/admin/tracks', label: 'XRKR Hub Tracks', detail: 'Upload and manage owner-only tracks for the Hub player.' },
    { href: '/admin/users', label: 'Manage Admin Users', detail: 'Create/remove lower-tier admins.' },
  ];
  const publicQaLinks = [
    { href: '/', label: 'Home', detail: 'Confirm hero content, radio, and cards.' },
    { href: '/local-legends-archive', label: 'Legends', detail: 'Confirm archive band cards and details.' },
    { href: '/your-local-scene', label: 'Scene', detail: 'Confirm active band listings.' },
    { href: '/podcast', label: 'Podcast', detail: 'Confirm podcast profile changes and latest episodes.' },
    { href: '/your-local-business', label: 'Business', detail: 'Confirm public business page content.' },
    { href: '/contact', label: 'Contact', detail: 'Confirm public contact flow.' },
  ];
  const commonActions = [
    { href: '/admin/guide', label: 'Admin Guide', detail: 'Image sizes and media upload standards.' },
    { href: '/admin/blog', label: 'Blog Manager', detail: 'Write and publish blog posts.' },
    { href: '/admin/bands', label: 'Band Manager', detail: 'Create/edit bands, members, and each band track library.' },
    { href: '/admin/podcasts', label: 'Podcast Manager', detail: 'Create podcast profiles and manage parent-owned episodes.' },
    { href: '/admin/business', label: 'Business Manager', detail: 'Create/edit local business cards with logos and links.' },
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
            <Link key={item.href} className="admin-action-tile" href={item.href} prefetch={false}>
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </Link>
          ))}
          {ownerMode
            ? ownerActions.map((item) => (
                <Link key={item.href} className="admin-action-tile owner" href={item.href} prefetch={false}>
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
        <h3 className="section-title" style={{ marginTop: '1rem' }}>
          Public QA Links
        </h3>
        <div className="admin-action-grid compact">
          {publicQaLinks.map((item) => (
            <Link key={item.href} className="admin-action-tile" href={item.href} prefetch={false}>
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </Link>
          ))}
        </div>
        <p className="meta" style={{ marginTop: '0.8rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(138, 164, 196, 0.12)' }}>
          Signed in as: <strong>{actingUser || 'unknown'}</strong>
          {ownerMode ? ' · Owner tools enabled' : ' · Standard admin mode'}
        </p>
        <p className="meta">Media upload should happen directly inside band/podcast edit forms.</p>
      </section>

      <AdminMediaGuide />
    </>
  );
}
