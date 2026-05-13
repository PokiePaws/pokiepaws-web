import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getServerApiBaseUrl } from '../../../../lib/config/env';
import { AUTH_ACCESS_TOKEN_COOKIE } from '../../../../lib/features/auth/auth-cookies';

type RouteContext = {
    params: Promise<{ path?: string[] }>;
};

const BODYLESS_METHODS = new Set(['GET', 'HEAD']);

async function proxy(request: Request, context: RouteContext) {
    const { path = [] } = await context.params;
    const sourceUrl = new URL(request.url);
    const targetUrl = `${getServerApiBaseUrl()}/${path.join('/')}${sourceUrl.search}`;
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_ACCESS_TOKEN_COOKIE)?.value;
    const headers = new Headers();

    const contentType = request.headers.get('content-type');
    const accept = request.headers.get('accept');
    if (contentType) headers.set('content-type', contentType);
    if (accept) headers.set('accept', accept);
    if (token) headers.set('authorization', `Bearer ${token}`);

    const backendResponse = await fetch(targetUrl, {
        method: request.method,
        headers,
        body: BODYLESS_METHODS.has(request.method) ? undefined : await request.arrayBuffer(),
        cache: 'no-store',
    });

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
