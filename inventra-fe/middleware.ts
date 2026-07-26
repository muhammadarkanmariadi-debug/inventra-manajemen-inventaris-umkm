import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getProfile } from './services/user.service';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  // Daftar route publik yang harus dibypass middleware
  const publicRoutes = ['/auth/signin', '/auth/signup', '/docs', '/api', '/_next', '/favicon.ico'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route)) || pathname === '/';

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  try {
    // 2. Tunggu hasil profile (Wajib Await)
    const response = await getProfile();
    const user = response.data?.user;

    if (!user && !pathname.startsWith('/')) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    const isSuperadmin = user.role === 'SUPERADMIN';


    if (!isSuperadmin && !pathname.startsWith('/dashboard') && !pathname.startsWith('/account')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (isSuperadmin && !pathname.startsWith('/admin') && !pathname.startsWith('/account')) {
      return NextResponse.redirect(new URL('/admin/businesses', request.url));
    }

  } catch (error) {
    console.error("Failed to fetch profile in middleware:", error);
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/businesses/:path*', '/businesses', '/account/:path*'],
};