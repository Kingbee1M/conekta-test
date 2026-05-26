import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
  const { pathname } = request.nextUrl;

  const PUBLIC_PATHS = [
    '/log-in',
    '/sign-up',
    '/password',
    '/reset-password',
    '/create-account',
    '/add-email',
    '/verify-email',
    '/get-started',
    '/verify-email',
    '/',
  ];

  const isPublicPage = PUBLIC_PATHS.some((path) => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // 1. STRICT UNUATHENTICATED ROUTE GUARD
  // If they try to hit an internal protected route block without a session, catch and boot them.
  if (!isPublicPage && !isLoggedIn) {
    const url = new URL('/log-in', request.url);
    url.searchParams.set('callbackUrl', pathname); 
    return NextResponse.redirect(url);
  }

  // All other traffic patterns pass through transparently
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - svg (if your logos are in public/svg)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|svg|public).*)',
  ],
};