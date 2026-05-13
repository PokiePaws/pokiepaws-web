import { NextResponse } from 'next/server';
import {
    AUTH_ACCESS_TOKEN_COOKIE,
    AUTH_USER_EMAIL_COOKIE,
    AUTH_USER_ROLE_COOKIE,
} from '../../../../lib/features/auth/auth-cookies';

export async function POST() {
    const response = NextResponse.json({ ok: true });

    response.cookies.delete(AUTH_ACCESS_TOKEN_COOKIE);
    response.cookies.delete(AUTH_USER_EMAIL_COOKIE);
    response.cookies.delete(AUTH_USER_ROLE_COOKIE);

    return response;
}
