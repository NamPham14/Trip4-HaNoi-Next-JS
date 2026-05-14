import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected and Public routes configuration
const protectedRoutes = ['/admin', '/profile', '/planner'];
const publicOnlyRoutes = ['/login', '/register'];

/**
 * Middleware for Route Protection and Redirection
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  // 1. If trying to access protected route without token
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If trying to access public-only route with token
  const isPublicOnlyRoute = publicOnlyRoutes.some((route) => pathname.startsWith(route));
  if (isPublicOnlyRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. Admin specific protection (Optional: can be enhanced with JWT decoding)
  if (pathname.startsWith('/admin') && token) {
     // In a real production app, you might want to decode the JWT here 
     // to check the ROLE before allowing access. 
     // For simplicity, we assume token check is enough for now.
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
