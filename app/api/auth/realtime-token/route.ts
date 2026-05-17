import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_ACCESS_TOKEN_COOKIE } from '../../../../lib/features/auth/auth-cookies';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_ACCESS_TOKEN_COOKIE)?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ token });
}
