const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    let response: Response;
    try {
        response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
    } catch (networkError) {
        throw new Error(
            `Network error — could not reach ${url}. ` +
            `Check that your API server is running and CORS is configured. ` +
            `(${networkError instanceof Error ? networkError.message : networkError})`
        );
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
}