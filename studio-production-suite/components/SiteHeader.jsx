'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const publicNavItems = [
  { href: '/', label: 'Home', className: 'nav-cool' },
  {
    href: '/hub',
    label: (
      <span className="split-label">
        <span className="split-cool">XRKR</span>
        <span className="split-80">80</span>
        <span className="split-cool">HD</span>
        <span className="split-space"> </span>
        <span className="split-white">Hub</span>
      </span>
    ),
  },
  {
    href: '/local-legends-archive',
    label: (
      <span className="split-label">
        <span className="split-cool">YourLocal</span>
        <span className="split-space"> </span>
        <span className="split-white">Legends</span>
      </span>
    ),
  },
  {
    href: '/your-local-scene',
    label: (
      <span className="split-label">
        <span className="split-cool">YourLocal</span>
        <span className="split-space"> </span>
        <span className="split-white">Scene</span>
      </span>
    ),
  },
  {
    href: '/podcast',
    label: (
      <span className="split-label">
        <span className="split-cool">YourLocal</span>
        <span className="split-space"> </span>
        <span className="split-white">Podcast</span>
      </span>
    ),
  },
  { href: '/contact', label: 'Contact', className: 'nav-cool' },
];

function getAdminNavItems(ownerMode) {
  const items = [
    { href: '/admin', label: 'Dashboard', className: 'nav-admin-link' },
    { href: '/admin/bands', label: 'Band Editor', className: 'nav-admin-link' },
    { href: '/admin/podcasts', label: 'Podcast Editor', className: 'nav-admin-link' },
    { href: '/admin/password', label: 'My Password', className: 'nav-admin-link' },
  ];

  if (ownerMode) {
    items.push({ href: '/admin/home', label: 'Home Controls', className: 'nav-admin-link' });
    items.push({ href: '/admin/tracks', label: 'Tracks Manager', className: 'nav-admin-link' });
    items.push({ href: '/admin/users', label: 'Admin Users', className: 'nav-admin-link' });
  }

  return items;
}

function isActive(pathname, href) {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader({ adminMode = false, ownerMode = false, adminUser = '' }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navItems = adminMode ? [...getAdminNavItems(ownerMode), ...publicNavItems] : publicNavItems;

  return (
    <header className={`nav ${adminMode ? 'admin-mode' : ''}`.trim()}>
      <div className="container nav-inner">
        <Link href={adminMode ? '/admin' : '/'} className={`brand ${adminMode ? 'admin-brand' : ''}`.trim()} onClick={() => setOpen(false)}>
          xrkr80hd.studio
        </Link>
        <button
          className={`nav-toggle ${adminMode ? 'admin-toggle' : ''}`.trim()}
          type="button"
          aria-label={adminMode ? 'Toggle admin navigation' : 'Toggle navigation'}
          aria-expanded={open ? 'true' : 'false'}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
        {adminMode ? <span className="admin-badge">{adminUser ? `Admin: ${adminUser}` : 'Admin Mode'}</span> : null}
        <nav className={`nav-links ${open ? 'open' : ''}`} id="site-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${item.className || ''} ${isActive(pathname, item.href) ? 'active' : ''}`.trim()}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
