
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  const isPublicPath = pathname === '/log-in' || pathname === '/sign-up' || pathname === '/';


  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/log-in', request.url));
  }


  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

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
     * - svg (your icon folder)  <-- ADD THIS
     * - images (any other public folders) <-- ADD THIS
     */
    '/((?!api|_next/static|_next/image|favicon.ico|svg|images|public).*)',
  ],
};
