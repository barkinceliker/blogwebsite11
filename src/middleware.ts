
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth'; // Assuming getSession can be used in middleware

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession();

  // Protect all routes under /admin/dashboard
  if (pathname.startsWith('/admin/dashboard')) {
    if (!session || !session.isAuthenticated) {
      // User is not authenticated, redirect to login page
      const loginUrl = new URL('/admin', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname); // Optional: pass redirect info
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is authenticated and tries to access /admin (login page), redirect to dashboard
  if (pathname === '/admin' || pathname === '/admin/') {
    if (session && session.isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to /admin and all its sub-paths
  // Exclude API routes, _next/static, _next/image, favicon.ico to avoid unnecessary checks
  matcher: [
    '/admin/:path*',
    '/admin',
    // Negative lookaheads to exclude common static assets and API routes from this specific auth middleware
    // If you have API routes under /admin/api that need protection, they should be handled separately or included if this middleware is appropriate.
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
