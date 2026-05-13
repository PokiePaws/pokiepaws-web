import axios from 'axios';
import { NextResponse } from 'next/server';
import { getServerApiBaseUrl } from '../../../../lib/config/env';
import {
    AUTH_ACCESS_TOKEN_COOKIE,
    AUTH_USER_EMAIL_COOKIE,
    AUTH_USER_ROLE_COOKIE,
    authCookieOptions,
} from '../../../../lib/features/auth/auth-cookies';
import {
    type BackendLoginResponse,
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
        const backendResponse = await axios.post<BackendLoginResponse>(
            `${getServerApiBaseUrl()}/api/auth/login`,
            parsedCredentials.data,
        );

        const { token, email, role } = backendResponse.data;
        const userRole = mapApiRole(role);
        const response = NextResponse.json({
            user: {
                id: email,
                name: email,
                email,
                role: userRole,
            },
        });

        response.cookies.set(AUTH_ACCESS_TOKEN_COOKIE, token, authCookieOptions);
        response.cookies.set(AUTH_USER_EMAIL_COOKIE, email, authCookieOptions);
        response.cookies.set(AUTH_USER_ROLE_COOKIE, userRole, authCookieOptions);

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
