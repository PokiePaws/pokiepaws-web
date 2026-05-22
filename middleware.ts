import { type NextRequest, NextResponse } from 'next/server';
import {
    AUTH_ACCESS_TOKEN_COOKIE,
    AUTH_MFA_PENDING_EMAIL_COOKIE,
    AUTH_USER_ROLE_COOKIE,
} from './lib/features/auth/auth-cookies';
import type { UserRole } from './lib/features/auth/auth-types';

const ADMIN_ROLES: UserRole[] = ['Admin', 'SuperAdmin'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get(AUTH_ACCESS_TOKEN_COOKIE)?.value;
    const mfaPendingEmail = request.cookies.get(AUTH_MFA_PENDING_EMAIL_COOKIE)?.value;
    const userRole = request.cookies.get(AUTH_USER_ROLE_COOKIE)?.value as UserRole | undefined;

    // Not authenticated — redirect to MFA pending page or login
    if (!accessToken) {
        if (mfaPendingEmail) {
            return NextResponse.redirect(new URL('/auth/2fa/pending', request.url));
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Admin routes require Admin or SuperAdmin role
    if (pathname.startsWith('/admin')) {
        if (!userRole || !ADMIN_ROLES.includes(userRole)) {
            const fallback = userRole === 'Staff' ? '/staff' : '/dashboard';
            return NextResponse.redirect(new URL(fallback, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/staff/:path*', '/dashboard/:path*'],
};
