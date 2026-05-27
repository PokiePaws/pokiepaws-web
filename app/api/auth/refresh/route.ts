import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getServerApiBaseUrl } from '../../../../lib/config/env';
import {
    AUTH_ACCESS_TOKEN_COOKIE,
    AUTH_REFRESH_TOKEN_COOKIE,
    authCookieOptions,
} from '../../../../lib/features/auth/auth-cookies';

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(AUTH_REFRESH_TOKEN_COOKIE)?.value;

    if (!refreshToken) {
        return NextResponse.json({ message: 'No refresh token.' }, { status: 401 });
    }

    try {
        const backendResponse = await fetch(`${getServerApiBaseUrl()}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
            cache: 'no-store',
        });

        if (!backendResponse.ok) {
            return NextResponse.json({ message: 'Session expired.' }, { status: 401 });
        }

        const data = await backendResponse.json();
        const { accessToken, refreshToken: newRefreshToken } = data as {
            accessToken: string;
            refreshToken: string;
        };

        const response = NextResponse.json({ ok: true });
        response.cookies.set(AUTH_ACCESS_TOKEN_COOKIE, accessToken, authCookieOptions);
        if (newRefreshToken) {
            response.cookies.set(AUTH_REFRESH_TOKEN_COOKIE, newRefreshToken, {
                ...authCookieOptions,
                maxAge: 7 * 24 * 60 * 60,
            });
        }

        return response;
    } catch {
        return NextResponse.json({ message: 'Refresh failed.' }, { status: 500 });
    }
}
