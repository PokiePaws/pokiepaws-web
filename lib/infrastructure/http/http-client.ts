import axios, { AxiosError, type AxiosInstance } from 'axios';
import { getApiBaseUrl } from '../../config/env';
import { ApiError } from './api-error';

export interface HttpClient {
    get<T>(endpoint: string): Promise<T>;
    post<T>(endpoint: string, body?: unknown): Promise<T>;
    put<T>(endpoint: string, body?: unknown): Promise<T>;
    patch<T>(endpoint: string, body?: unknown): Promise<T>;
    delete<T>(endpoint: string): Promise<T>;
}

interface HttpClientOptions {
    baseUrl?: string;
}

class AxiosHttpClient implements HttpClient {
    private readonly client: AxiosInstance;

    constructor(options: HttpClientOptions = {}) {
        this.client = axios.create({
            headers: {
                Accept: 'application/json',
            },
        });

        // Lazy baseURL resolution — avoids calling getApiBaseUrl() at module init
        // which would crash during Next.js SSG when NEXT_PUBLIC_API_URL is not yet available.
        this.client.interceptors.request.use((config) => {
            if (!config.baseURL) {
                const baseURL = options.baseUrl ?? (typeof window === 'undefined' ? getApiBaseUrl() : '/api/backend');
                config.baseURL = baseURL.replace(/\/$/, '');
            }
            return config;
        });
    }

    get<T>(endpoint: string) {
        return this.request<T>(() => this.client.get<T>(endpoint));
    }

    post<T>(endpoint: string, body?: unknown) {
        return this.request<T>(() => this.client.post<T>(endpoint, body));
    }

    put<T>(endpoint: string, body?: unknown) {
        return this.request<T>(() => this.client.put<T>(endpoint, body));
    }

    patch<T>(endpoint: string, body?: unknown) {
        return this.request<T>(() => this.client.patch<T>(endpoint, body));
    }

    delete<T>(endpoint: string) {
        return this.request<T>(() => this.client.delete<T>(endpoint));
    }

    private async request<T>(execute: () => Promise<{ data: T }>): Promise<T> {
        try {
            const response = await execute();
            return response.data;
        } catch (error) {
            throw this.toApiError(error);
        }
    }

    private toApiError(error: unknown) {
        if (!axios.isAxiosError(error)) {
            return new ApiError(error instanceof Error ? error.message : 'Unexpected API error');
        }

        const axiosError = error as AxiosError<{ message?: string; error?: string }>;
        const url = axiosError.config?.url;
        const status = axiosError.response?.status;

        if (!axiosError.response) {
            return new ApiError(
                `Network error - could not reach ${url ?? 'API'}. Check that your API server is running and CORS is configured. (${axiosError.message})`,
                undefined,
                url,
            );
        }

        const message =
            axiosError.response.data?.message ??
            axiosError.response.data?.error ??
            `API Error ${status} @ ${url}`;

        return new ApiError(message, status, url);
    }
}

export const httpClient: HttpClient = new AxiosHttpClient();
