'use client';

import { useAuthStore } from '../../store/use-auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isSessionResolved } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isSessionResolved) return;
        if (!user || (user.role !== 'Admin' && user.role !== 'SuperAdmin')) {
            if (user?.role === 'Staff') {
                router.push('/staff');
            } else {
                router.push('/login');
            }
        }
    }, [isSessionResolved, user, router]);

    if (!isSessionResolved || !user) return null;
    if (user.role !== 'Admin' && user.role !== 'SuperAdmin') return null;

    return <>{children}</>;
}
