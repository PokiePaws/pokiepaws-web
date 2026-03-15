'use client';

import { useAuthStore } from '../../store/use-auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '../../components/navbar';
import Link from 'next/link';
import { LayoutDashboard, PawPrint, Calendar, User, Settings, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) return null;

    const sidebarLinks = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Pets', href: '/dashboard/pets', icon: PawPrint },
        { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
        { name: 'Profile', href: '/dashboard/profile', icon: User },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            <Navbar />
            <div className="flex-grow flex">
                {/* Sidebar */}
                <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200 pt-8 pb-4">
                    <div className="flex-grow px-4 space-y-2">
                        {sidebarLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-600 rounded-xl hover:bg-stone-50 hover:text-emerald-600 transition-all"
                            >
                                <link.icon className="h-5 w-5" />
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="px-4 pt-4 border-t border-stone-100">
                        <button
                            onClick={() => logout()}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-all"
                        >
                            <LogOut className="h-5 w-5" />
                            Log out
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-grow p-4 md:p-8 lg:p-12 overflow-y-auto">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
