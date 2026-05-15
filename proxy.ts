import { NextResponse, type NextRequest } from 'next/server';
import {
    AUTH_ACCESS_TOKEN_COOKIE,
    AUTH_MFA_PENDING_EMAIL_COOKIE,
    AUTH_USER_ROLE_COOKIE,
} from './lib/features/auth/auth-cookies';
import type { UserRole } from './lib/features/auth/auth-types';

const protectedRoutes: Array<{ prefix: string; roles: UserRole[] }> = [
    { prefix: '/admin', roles: ['Admin', 'SuperAdmin'] },
    { prefix: '/staff', roles: ['Staff', 'Admin', 'SuperAdmin'] },
    { prefix: '/dashboard', roles: ['Client', 'Staff', 'Admin', 'SuperAdmin'] },
];

export function proxy(request: NextRequest) {
    const matchedRoute = protectedRoutes.find((route) =>
        request.nextUrl.pathname.startsWith(route.prefix),
    );

    if (!matchedRoute) {
        return NextResponse.next();
    }

    const token = request.cookies.get(AUTH_ACCESS_TOKEN_COOKIE)?.value;
    const pendingMfaEmail = request.cookies.get(AUTH_MFA_PENDING_EMAIL_COOKIE)?.value;
    const role = request.cookies.get(AUTH_USER_ROLE_COOKIE)?.value as UserRole | undefined;

    if (!token && pendingMfaEmail) {
        const pendingUrl = new URL('/auth/2fa/pending', request.url);
        pendingUrl.searchParams.set('email', pendingMfaEmail);
        return NextResponse.redirect(pendingUrl);
    }

    if (!token || !role) {
        return redirectToLogin(request);
    }

    if (!matchedRoute.roles.includes(role)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ['/admin/:path*', '/staff/:path*', '/dashboard/:path*'],
};
