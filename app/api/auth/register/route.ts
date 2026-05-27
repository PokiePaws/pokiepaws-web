import axios from 'axios';
import { NextResponse } from 'next/server';
import { getServerApiBaseUrl } from '../../../../lib/config/env';

export async function POST(request: Request) {
    const payload = await request.json();

    try {
        await axios.post(`${getServerApiBaseUrl()}/api/auth/register`, payload);
        return NextResponse.json({ ok: true });
    } catch (error) {
        if (!axios.isAxiosError(error)) {
            return NextResponse.json({ message: 'Registration failed.' }, { status: 500 });
        }
        return NextResponse.json(
            { message: error.response?.data?.message ?? 'Registration failed.' },
            { status: error.response?.status ?? 502 },
        );
    }
}
