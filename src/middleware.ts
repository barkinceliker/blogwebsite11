
// Middleware has been removed as per user request for direct access to admin pages.
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { isAuthenticated } from '@/lib/auth';
// import { AUTH_COOKIE_NAME } from '@/lib/constants';

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME);
//   let isAuth = false;
//   if (sessionCookie?.value) {
//     try {
//       const sessionData = JSON.parse(sessionCookie.value);
//       // Basic check, can be enhanced with timestamp validation from lib/auth
//       if (sessionData.isAuthenticated) {
//         isAuth = true;
//       }
//     } catch (e) {
//       // Invalid cookie
//     }
//   }


//   // If user is authenticated and tries to access /admin (login page), redirect to dashboard
//   if (isAuth && pathname === '/admin') {
//     return NextResponse.redirect(new URL('/admin/dashboard', request.url));
//   }

//   // If user is not authenticated and tries to access any admin/* path (except /admin itself), redirect to login
//   if (!isAuth && pathname.startsWith('/admin/') && pathname !== '/admin') {
//     return NextResponse.redirect(new URL('/admin', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/admin/:path*', '/admin'],
// };
