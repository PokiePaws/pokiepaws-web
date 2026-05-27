import axios, { AxiosError } from 'axios';
import type { AuthSession, LoginResult } from './auth-types';
import type { RegisterRequest } from '../api-schemas';

export interface AuthApi {
    login(email: string, password: string): Promise<LoginResult>;
    logout(): Promise<void>;
    getSession(): Promise<AuthSession | null>;
    resendMfa(email: string): Promise<void>;
    register(payload: RegisterRequest): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
}

function createAuthApi(): AuthApi {
    return {
        async login(email, password) {
            try {
                const response = await axios.post<LoginResult>('/api/auth/login', { email, password });
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
        async resendMfa(email) {
            await axios.post('/api/auth/2fa/resend', { email });
        },
        async register(payload) {
            try {
                await axios.post('/api/auth/register', payload);
            } catch (error) {
                throw toAuthError(error);
            }
        },
        async forgotPassword(email) {
            try {
                await axios.post('/api/auth/forgot-password', { email });
            } catch (error) {
                throw toAuthError(error);
            }
        },
        async resetPassword(token, newPassword) {
            try {
                await axios.post('/api/auth/reset-password', { token, newPassword });
            } catch (error) {
                throw toAuthError(error);
            }
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
