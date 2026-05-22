import axios from 'axios';
import { NextResponse } from 'next/server';
import { getServerApiBaseUrl } from '../../../../lib/config/env';
import {
    AUTH_ACCESS_TOKEN_COOKIE,
    AUTH_MFA_PENDING_EMAIL_COOKIE,
    AUTH_REFRESH_TOKEN_COOKIE,
    AUTH_USER_EMAIL_COOKIE,
    AUTH_USER_ROLE_COOKIE,
    authCookieOptions,
} from '../../../../lib/features/auth/auth-cookies';
import {
    type BackendLoginResponse,
    type BackendMfaRequiredResponse,
    mapApiRole,
} from '../../../../lib/features/auth/auth-types';
import { loginRequestSchema } from '../../../../lib/features/auth/auth-schema';

export async function POST(request: Request) {
    const payload = await request.json();
    const parsedCredentials = loginRequestSchema.safeParse(payload);

    if (!parsedCredentials.success) {
        return NextResponse.json({ message: 'Invalid email or password format.' }, { status: 400 });
    }

    try {
        const backendResponse = await axios.post<BackendLoginResponse | BackendMfaRequiredResponse>(
            `${getServerApiBaseUrl()}/api/auth/login`,
            parsedCredentials.data,
        );

        if ('mfaRequired' in backendResponse.data && backendResponse.data.mfaRequired) {
            const pendingEmail = backendResponse.data.email ?? parsedCredentials.data.email;
            const response = NextResponse.json(
                {
                    mfaRequired: true,
                    email: pendingEmail,
                    message: backendResponse.data.message ?? 'Check your email to finish signing in.',
                },
                { status: 202 },
            );

            response.cookies.set(AUTH_MFA_PENDING_EMAIL_COOKIE, pendingEmail, {
                ...authCookieOptions,
                maxAge: 15 * 60,
            });

            return response;
        }

        const loginData = backendResponse.data as BackendLoginResponse;
        const { accessToken, refreshToken, email, role } = loginData;
        const userRole = mapApiRole(role);
        const response = NextResponse.json({
            user: {
                id: email,
                name: email,
                email,
                role: userRole,
            },
        });

        response.cookies.set(AUTH_ACCESS_TOKEN_COOKIE, accessToken, authCookieOptions);
        response.cookies.set(AUTH_REFRESH_TOKEN_COOKIE, refreshToken, {
            ...authCookieOptions,
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });
        response.cookies.set(AUTH_USER_EMAIL_COOKIE, email, authCookieOptions);
        response.cookies.set(AUTH_USER_ROLE_COOKIE, userRole, authCookieOptions);
        response.cookies.delete(AUTH_MFA_PENDING_EMAIL_COOKIE);

        return response;
    } catch (error) {
        if (!axios.isAxiosError(error)) {
            return NextResponse.json({ message: 'Login failed.' }, { status: 500 });
        }

        return NextResponse.json(
            { message: error.response?.data?.message ?? error.response?.data?.error ?? 'Login failed.' },
            { status: error.response?.status ?? 502 },
        );
    }
}
