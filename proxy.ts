import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy (formerly middleware): protect /dashboard/* routes server-side.
 * Checks the `weddingly_auth` cookie (set on login).
 * If not present → redirect to /login.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const authCookie = req.cookies.get('weddingly_auth');
    if (!authCookie || authCookie.value !== 'true') {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
