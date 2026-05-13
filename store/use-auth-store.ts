import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'Staff' | 'Admin' | 'SuperAdmin' | 'Client';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    clinicId?: string; // Optional, used for Staff to identify their clinic
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setUser: (user: User | null, token?: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            setUser: (user, token = null) => set({
                user,
                token,
                isAuthenticated: !!user
            }),
            logout: () => set({
                user: null,
                token: null,
                isAuthenticated: false
            }),
        }),
        {
            name: 'vet-clinic-auth', // Key in localStorage
        }
    )
);
