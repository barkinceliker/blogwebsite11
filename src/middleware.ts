
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a basic passthrough middleware.
// It's here to satisfy Next.js's requirement for an exported middleware function
// when a middleware.ts file exists, but it doesn't implement any specific logic.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Optionally, you can define a config if you want to limit which paths this runs on.
// If you don't want it to run on any paths or want it to run on all,
// you can adjust or remove this config.
// For a "do-nothing" middleware that still allows the app to start,
// matching all paths is fine.
export const config = {
  matcher: '/:path*', // This will match all paths
};
