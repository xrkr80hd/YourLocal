'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
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

function isActive(pathname, href) {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          xrkr80hd.studio
        </Link>
        <button
          className="nav-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open ? 'true' : 'false'}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
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
