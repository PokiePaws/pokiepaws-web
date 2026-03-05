'use client';

import { useAuthStore } from '../../store/use-auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';
import { useNotificationStore } from '../../store/use-notification-store';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const addNotification = useNotificationStore(state => state.addNotification);

    useEffect(() => {
        if (!user || (user.role !== 'Staff' && user.role !== 'Admin')) {
            router.push('/login');
        }
    }, [user, router]);

    // Simulate WebSocket notifications
    useEffect(() => {
        if (!user) return;

        const interval = setInterval(() => {
            const rand = Math.random();
            if (rand > 0.8) {
                addNotification({
                    message: rand > 0.9 ? 'New appointment request from John Doe' : 'Buddy\'s vaccination confirmed',
                    type: 'info'
                });
            }
        }, 30000); // Every 30 seconds

        return () => clearInterval(interval);
    }, [user, addNotification]);

    if (!user) return null;

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
