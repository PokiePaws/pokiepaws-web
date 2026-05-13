import axios, { AxiosError } from 'axios';
import type { AuthSession } from './auth-types';

export interface AuthApi {
    login(email: string, password: string): Promise<AuthSession>;
    logout(): Promise<void>;
    getSession(): Promise<AuthSession | null>;
}

function createAuthApi(): AuthApi {
    return {
        async login(email, password) {
            try {
                const response = await axios.post<AuthSession>('/api/auth/login', { email, password });
                return response.data;
            } catch (error) {
                throw toAuthError(error);
            }
        },
        async logout() {
            await axios.post('/api/auth/logout');
        },
        async getSession() {
            const response = await axios.get<AuthSession | null>('/api/auth/session');
            return response.data;
        },
    };
}

export const authApi = createAuthApi();

function toAuthError(error: unknown) {
    if (!axios.isAxiosError(error)) {
        return error instanceof Error ? error : new Error('Authentication failed.');
    }

    const axiosError = error as AxiosError<{ message?: string }>;
    return new Error(axiosError.response?.data?.message ?? 'Authentication failed.');
}
