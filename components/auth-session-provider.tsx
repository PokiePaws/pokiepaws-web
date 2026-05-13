'use client';

import { useEffect } from 'react';
import { authApi } from '../lib/features/auth/auth-api';
import { useAuthStore } from '../store/use-auth-store';

export default function AuthSessionProvider({ children }: { children: React.ReactNode }) {
    const setUser = useAuthStore((state) => state.setUser);
    const setSessionResolved = useAuthStore((state) => state.setSessionResolved);

    useEffect(() => {
        let active = true;

        authApi
            .getSession()
            .then((session) => {
                if (!active) return;
                setUser(session?.user ?? null);
            })
            .catch(() => {
                if (!active) return;
                setUser(null);
            })
            .finally(() => {
                if (active) setSessionResolved(true);
            });

        return () => {
            active = false;
        };
    }, [setSessionResolved, setUser]);

    return children;
}
