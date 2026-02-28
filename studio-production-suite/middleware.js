import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_USER_COOKIE, isAdminConfigReady, isAdminSessionValid, isOwnerUsername } from './lib/admin-auth';

function isProtectedPath(pathname) {
  if (pathname === '/admin/login' || pathname.startsWith('/api/admin/session')) {
    return false;
  }

  return (
    pathname === '/hub' ||
    pathname.startsWith('/hub/') ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/upload' ||
    pathname.startsWith('/upload/') ||
    pathname === '/api/upload' ||
    pathname.startsWith('/api/upload/') ||
    pathname.startsWith('/api/admin/')
  );
}

function isOwnerOnlyPath(pathname) {
  return (
    pathname === '/hub' ||
    pathname.startsWith('/hub/') ||
    pathname === '/admin/users' ||
    pathname.startsWith('/admin/users/') ||
    pathname === '/admin/home' ||
    pathname.startsWith('/admin/home/') ||
    pathname === '/admin/tracks' ||
    pathname.startsWith('/admin/tracks/') ||
    pathname === '/api/admin/users' ||
    pathname.startsWith('/api/admin/users/') ||
    pathname === '/api/admin/site-profile' ||
    pathname.startsWith('/api/admin/site-profile/') ||
    pathname === '/api/admin/tracks' ||
    pathname.startsWith('/api/admin/tracks/')
  );
}

export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (!isAdminConfigReady()) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Admin auth is not configured on the server.' }, { status: 500 });
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.searchParams.set('error', 'config');
    loginUrl.searchParams.set('next', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value || '';

  if (isAdminSessionValid(sessionCookie)) {
    if (isOwnerOnlyPath(pathname)) {
      const sessionUser = request.cookies.get(ADMIN_SESSION_USER_COOKIE)?.value || '';
      if (!isOwnerUsername(sessionUser)) {
        const adminUrl = request.nextUrl.clone();
        adminUrl.pathname = '/admin';
        adminUrl.searchParams.set('error', 'owner');
        return NextResponse.redirect(adminUrl);
      }
    }

    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/admin/login';
  loginUrl.searchParams.set('next', pathname + search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/upload/:path*', '/api/upload/:path*', '/api/admin/:path*'],
};
