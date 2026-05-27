import axios from 'axios';
import { NextResponse } from 'next/server';
import { getServerApiBaseUrl } from '../../../../../lib/config/env';

/**
 * ARCHITECTURE_WARNING: POST /api/auth/2fa/resend is not documented in the official API.
 * The documented 2FA endpoint is POST /api/auth/2fa/verify (used to complete MFA login).
 * This endpoint is live and used by app/auth/2fa/pending/page.tsx to let users
 * request a new MFA email. Backend-specific endpoint — requires backend support.
 */
export async function POST(request: Request) {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
        return NextResponse.json({ error: 'Missing email.' }, { status: 400 });
    }

    try {
        await axios.post(`${getServerApiBaseUrl()}/api/auth/2fa/resend`, { email });
        return NextResponse.json({ ok: true });
    } catch (error) {
        if (!axios.isAxiosError(error)) {
            return NextResponse.json({ error: 'Failed to resend.' }, { status: 500 });
        }
        return NextResponse.json(
            { error: error.response?.data?.message ?? 'Failed to resend.' },
            { status: error.response?.status ?? 502 },
        );
    }
}
