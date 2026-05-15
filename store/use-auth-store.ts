import { create } from 'zustand';
import { authApi } from '../lib/features/auth/auth-api';
import type { User, UserRole } from '../lib/features/auth/auth-types';

export type { User, UserRole };

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isSessionResolved: boolean;
    setUser: (user: User | null) => void;
    setSessionResolved: (resolved: boolean) => void;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    isAuthenticated: false,
    isSessionResolved: false,
    setUser: (user) =>
        set({
            user,
            isAuthenticated: !!user,
            isSessionResolved: true,
        }),
    setSessionResolved: (resolved) => set({ isSessionResolved: resolved }),
    logout: async () => {
        await authApi.logout().catch(() => undefined);
        set({
            user: null,
            isAuthenticated: false,
            isSessionResolved: true,
        });
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    },
}));
