import { cookies } from "next/headers";
import { NextResponse } from 'next/server';
import { getServerApiBaseUrl } from '../../../../lib/config/env';
import { AUTH_ACCESS_TOKEN_COOKIE } from '../../../../lib/features/auth/auth-cookies';

type RouteContext = {
    params: Promise<{ path?: string[] }>;
};

const BODYLESS_METHODS = new Set(['GET', 'HEAD']);

async function proxy(request: Request, context: RouteContext) {
    let backendBase: string;
    try {
        backendBase = getServerApiBaseUrl();
    } catch (err) {
        const msg = err instanceof Error ? err.message : 'API URL not configured';
        console.error('[proxy] Configuration error:', msg);
        return NextResponse.json({ message: msg }, { status: 503 });
    }

    const { path = [] } = await context.params;
    const sourceUrl = new URL(request.url);
    const targetUrl = `${backendBase}/${path.join('/')}${sourceUrl.search}`;

    console.log(`[proxy] ${request.method} ${targetUrl}`);

    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_ACCESS_TOKEN_COOKIE)?.value;
    const headers = new Headers();

    const contentType = request.headers.get('content-type');
    const accept = request.headers.get('accept');
    if (contentType) headers.set('content-type', contentType);
    if (accept) headers.set('accept', accept);
    if (token) headers.set('authorization', `Bearer ${token}`);

    let backendResponse: Response;
    try {
        backendResponse = await fetch(targetUrl, {
            method: request.method,
            headers,
            body: BODYLESS_METHODS.has(request.method) ? undefined : await request.arrayBuffer(),
            cache: 'no-store',
        });
    } catch (err) {
        const msg = err instanceof Error ? err.message : 'Backend unreachable';
        console.error(`[proxy] Network error reaching ${targetUrl}:`, msg);
        return NextResponse.json(
            { message: `Cannot reach backend at ${backendBase}. ${msg}` },
            { status: 503 },
        );
    }

    console.log(`[proxy] ${request.method} ${targetUrl} → ${backendResponse.status}`);

    if (!backendResponse.ok) {
        console.error(
            `[proxy] Backend error ${backendResponse.status} @ ${targetUrl}`
        );
    }

    const responseHeaders = new Headers();
    const responseContentType = backendResponse.headers.get('content-type');
    if (responseContentType) responseHeaders.set('content-type', responseContentType);

    if (backendResponse.status === 204) {
        return new NextResponse(null, { status: 204, headers: responseHeaders });
    }

    return new NextResponse(await backendResponse.arrayBuffer(), {
        status: backendResponse.status,
        headers: responseHeaders,
    });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
