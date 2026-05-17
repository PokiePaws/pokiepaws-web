import axios from 'axios';
import { NextResponse } from 'next/server';
import { getServerApiBaseUrl } from '../../../../../lib/config/env';
import {
    AUTH_ACCESS_TOKEN_COOKIE,
    AUTH_MFA_PENDING_EMAIL_COOKIE,
    AUTH_USER_EMAIL_COOKIE,
    AUTH_USER_ROLE_COOKIE,
    authCookieOptions,
} from '../../../../../lib/features/auth/auth-cookies';
import { type BackendLoginResponse, mapApiRole } from '../../../../../lib/features/auth/auth-types';

export async function POST(request: Request) {
    const { token } = await request.json();

    if (!token || typeof token !== 'string') {
        return NextResponse.json({ error: 'Missing token.' }, { status: 400 });
    }

    try {
        const backendResponse = await axios.post<BackendLoginResponse>(
            `${getServerApiBaseUrl()}/api/auth/2fa/verify`,
            { token },
        );

        const { accessToken, email, role } = backendResponse.data;
        const userRole = mapApiRole(role);

        const response = NextResponse.json({
            user: { id: email, name: email, email, role: userRole },
        });

        response.cookies.set(AUTH_ACCESS_TOKEN_COOKIE, accessToken, authCookieOptions);
        response.cookies.set(AUTH_USER_EMAIL_COOKIE, email, authCookieOptions);
        response.cookies.set(AUTH_USER_ROLE_COOKIE, userRole, authCookieOptions);
        response.cookies.delete(AUTH_MFA_PENDING_EMAIL_COOKIE);

        return response;
    } catch (error) {
        if (!axios.isAxiosError(error)) {
            return NextResponse.json({ error: 'Verification failed.' }, { status: 500 });
        }
        return NextResponse.json(
            { error: error.response?.data?.message ?? error.response?.data?.error ?? 'Verification failed.' },
            { status: error.response?.status ?? 502 },
        );
    }
}
