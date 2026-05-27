import axios from 'axios';
import { NextResponse } from 'next/server';
import { getServerApiBaseUrl } from '../../../../lib/config/env';

export async function POST(request: Request) {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
        return NextResponse.json({ message: 'Missing email.' }, { status: 400 });
    }

    try {
        await axios.post(`${getServerApiBaseUrl()}/api/auth/forgot-password`, { email });
        return NextResponse.json({ ok: true });
    } catch (error) {
        if (!axios.isAxiosError(error)) {
            return NextResponse.json({ message: 'Failed to send reset email.' }, { status: 500 });
        }
        return NextResponse.json(
            { message: error.response?.data?.message ?? 'Failed to send reset email.' },
            { status: error.response?.status ?? 502 },
        );
    }
}
