import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'asookeluxe_session';

// Routes that require a logged-in session. Add more paths here as new
// protected pages are built (e.g. '/account/:path*' for saved addresses later).
const PROTECTED_ROUTES = ['/vendor', '/checkout', '/orders'];

// Routes that additionally require the ADMIN role, not just any login.
const ADMIN_ONLY_ROUTES = ['/admin'];

function getSecret() {
  const secret = process.env.JWT_SECRET || 'dev-secret-change-this-in-production';
  return new TextEncoder().encode(secret);
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const needsAuth = PROTECTED_ROUTES.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const needsAdmin = ADMIN_ONLY_ROUTES.some((p) => pathname === p || pathname.startsWith(p + '/'));

  if (!needsAuth && !needsAdmin) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());

    if (needsAdmin && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (err) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/vendor', '/vendor/:path*', '/checkout', '/orders/:path*', '/admin/:path*'],
};
