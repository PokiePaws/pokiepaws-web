const API_URL_ERROR =
    'NEXT_PUBLIC_API_URL is not configured. Set it to your PokiePaws API URL, e.g. http://localhost:9090.';

export function getApiBaseUrl() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
        throw new Error(API_URL_ERROR);
    }

    return apiUrl.replace(/\/$/, '');
}

export function getServerApiBaseUrl() {
    return (process.env.API_INTERNAL_URL ?? getApiBaseUrl()).replace(/\/$/, '');
}
