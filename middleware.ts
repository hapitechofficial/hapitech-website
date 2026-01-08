import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected API routes that require authentication
  const protectedRoutes = [
    '/api/user',
    '/api/subscription',
    '/api/poster',
  ];

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        console.log(`[Auth Middleware] Unauthorized access to ${pathname} - no token`);
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Please sign in first' },
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Continue to next middleware/route handler
      return NextResponse.next();
    } catch (error) {
      console.error(`[Auth Middleware] Token verification failed for ${pathname}:`, error);
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid session' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api/auth (authentication routes)
     * - api/contact (public routes)
     * - api/webhook (webhook routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|api/contact|api/webhook|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

