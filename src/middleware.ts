import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require login
const protectedRoutes = ['/admin', '/profile', '/planner', '/my-itineraries', '/saved-places'];
// Routes that should NOT be accessible if already logged in
const publicOnlyRoutes = ['/login', '/register'];

/**
 * Middleware for Route Protection and Redirection
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  //  If trying to access protected route without token
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  //  If trying to access public-only route (login/register) with token
  const isPublicOnlyRoute = publicOnlyRoutes.some((route) => pathname.startsWith(route));
  if (isPublicOnlyRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  //  Admin specific protection
  // Note: For full security, role check should happen on Server Components or via JWT decode
  if (pathname.startsWith('/admin') && token) {
    // Optional: Add logic to decode JWT and check role if possible here
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
