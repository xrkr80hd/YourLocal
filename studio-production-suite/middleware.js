import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, isAdminConfigReady, isAdminSessionValid } from './lib/admin-auth';

function isProtectedPath(pathname) {
  if (pathname === '/admin/login' || pathname.startsWith('/api/admin/session')) {
    return false;
  }

  return (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/upload' ||
    pathname.startsWith('/upload/') ||
    pathname === '/api/upload' ||
    pathname.startsWith('/api/upload/') ||
    pathname.startsWith('/api/admin/')
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
