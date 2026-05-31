import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
    AUTH_ACCESS_TOKEN_COOKIE,
    AUTH_USER_API_ROLE_COOKIE,
    AUTH_USER_EMAIL_COOKIE,
    AUTH_USER_ROLE_COOKIE,
} from '../../../../lib/features/auth/auth-cookies';
import type { ApiRole, UserRole } from '../../../../lib/features/auth/auth-types';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_ACCESS_TOKEN_COOKIE)?.value;
    const email = cookieStore.get(AUTH_USER_EMAIL_COOKIE)?.value;
    const role = cookieStore.get(AUTH_USER_ROLE_COOKIE)?.value as UserRole | undefined;
    const apiRole = cookieStore.get(AUTH_USER_API_ROLE_COOKIE)?.value as ApiRole | undefined;

    if (!token || !email || !role) {
        return NextResponse.json(null);
    }

    return NextResponse.json({
        user: {
            id: email,
            name: email,
            email,
            role,
            apiRole,
        },
    });
}
