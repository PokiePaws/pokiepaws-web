import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getServerApiBaseUrl } from '../../../../lib/config/env';
import {
    AUTH_ACCESS_TOKEN_COOKIE,
    AUTH_MFA_COMPLETED_COOKIE,
    AUTH_MFA_PENDING_EMAIL_COOKIE,
    AUTH_REFRESH_TOKEN_COOKIE,
    AUTH_USER_EMAIL_COOKIE,
    AUTH_USER_ROLE_COOKIE,
} from '../../../../lib/features/auth/auth-cookies';

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(AUTH_REFRESH_TOKEN_COOKIE)?.value;

    // Best-effort: tell the backend to invalidate the refresh token
    if (refreshToken) {
        try {
            await fetch(`${getServerApiBaseUrl()}/api/auth/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });
        } catch {
            // ignore — we still clear cookies locally
        }
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.delete(AUTH_ACCESS_TOKEN_COOKIE);
    response.cookies.delete(AUTH_REFRESH_TOKEN_COOKIE);
    response.cookies.delete(AUTH_MFA_PENDING_EMAIL_COOKIE);
    response.cookies.delete(AUTH_MFA_COMPLETED_COOKIE);
    response.cookies.delete(AUTH_USER_EMAIL_COOKIE);
    response.cookies.delete(AUTH_USER_ROLE_COOKIE);

    return response;
}
