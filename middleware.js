import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.AUTH_SECRET || 'dev-insecure-secret-key-32-characters-minimum-for-jwt-signing';
const encodedKey = new TextEncoder().encode(SECRET_KEY);

const protectedPaths = ['/dashboard', '/expenses', '/budgets', '/debts', '/reports'];
const authPaths = ['/login', '/signup'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_session')?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, encodedKey, { algorithms: ['HS256'] });
      isAuthenticated = true;
    } catch (err) {
      isAuthenticated = false;
    }
  }

  // Root path routing
  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check protected dashboard paths
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check public auth paths (redirect to dashboard if already logged in)
  const isAuthPath = authPaths.some((p) => pathname.startsWith(p));
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/dashboard/:path*',
    '/expenses/:path*',
    '/budgets/:path*',
    '/debts/:path*',
    '/reports/:path*',
  ],
};
