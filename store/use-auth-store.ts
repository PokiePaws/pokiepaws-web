import {create} from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'Client' | 'Staff' | 'Admin';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    clinicId?: string; // Optional, used for Staff to identify their clinic
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            setUser: (user) => set({
                user,
                isAuthenticated: !!user
            }),
            logout: () => set({
                user: null,
                isAuthenticated: false
            }),
        }),
        {
            name: 'vet-clinic-auth', // Key in localStorage
        }
    )
);
