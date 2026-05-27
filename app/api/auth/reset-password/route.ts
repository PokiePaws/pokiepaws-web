import axios from 'axios';
import { NextResponse } from 'next/server';
import { getServerApiBaseUrl } from '../../../../lib/config/env';

export async function POST(request: Request) {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
        return NextResponse.json({ message: 'Missing token or password.' }, { status: 400 });
    }

    try {
        await axios.post(`${getServerApiBaseUrl()}/api/auth/reset-password`, { token, newPassword });
        return NextResponse.json({ ok: true });
    } catch (error) {
        if (!axios.isAxiosError(error)) {
            return NextResponse.json({ message: 'Failed to reset password.' }, { status: 500 });
        }
        return NextResponse.json(
            { message: error.response?.data?.message ?? 'Failed to reset password.' },
            { status: error.response?.status ?? 502 },
        );
    }
}
