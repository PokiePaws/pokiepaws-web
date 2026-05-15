'use client';

import { useAuthStore } from '../../store/use-auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    const { user, isSessionResolved } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isSessionResolved) return;
        if (!user || (user.role !== 'Staff' && user.role !== 'Admin')) {
            router.push('/login');
        }
    }, [isSessionResolved, user, router]);

    if (!isSessionResolved || !user) return null;

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            <Navbar />
            <div className="flex-grow flex">
                <Sidebar />

                {/* Main Content */}
                <main className="flex-grow p-4 md:p-8 lg:p-12 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
