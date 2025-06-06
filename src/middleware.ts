
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth'; // Assuming getSession can be used in middleware

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`[Middleware] Pathname: ${pathname}`);

  const session = await getSession();
  console.log(`[Middleware] Session status for ${pathname}:`, session ? { isAuthenticated: session.isAuthenticated, name: session.name, loginTimestamp: session.loginTimestamp } : null);

  // Protect all routes under /admin/dashboard
  if (pathname.startsWith('/admin/dashboard')) {
    if (!session || !session.isAuthenticated) {
      console.log(`[Middleware] User not authenticated for ${pathname}. Redirecting to /admin.`);
      const loginUrl = new URL('/admin', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }
    console.log(`[Middleware] User authenticated for ${pathname}. Allowing access.`);
  }

  // If user is authenticated and tries to access /admin (login page), redirect to dashboard
  if (pathname === '/admin' || pathname === '/admin/') {
    if (session && session.isAuthenticated) {
      console.log(`[Middleware] Authenticated user accessing /admin. Redirecting to /admin/dashboard.`);
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    console.log(`[Middleware] Unauthenticated user accessing /admin. Allowing access.`);
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to /admin and all its sub-paths
  // Exclude API routes, _next/static, _next/image, favicon.ico to avoid unnecessary checks
  matcher: [
    '/admin/dashboard/:path*', // More specific for dashboard protection
    '/admin', // For redirecting authenticated users from login page
     // Keep a broad matcher to catch requests but let the logic inside decide.
     // If too broad, it might cause issues with static assets if not careful.
     // '/((?!api|_next/static|_next/image|favicon.ico).*)'
     // For now, let's focus on admin paths.
  ],
};
