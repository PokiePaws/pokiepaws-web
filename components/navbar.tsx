'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../store/use-auth-store';
import {
    LayoutDashboard,
    PawPrint,
    Calendar,
    User,
    Settings,
    LogOut,
    Users,
    ClipboardList,
    Microscope,
    Package,
    ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Sidebar() {
    const { user, logout } = useAuthStore();
    const pathname = usePathname();

    if (!user) return null;

    const isStaff = user.role === 'Staff' || user.role === 'Admin';

    const clientLinks = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Pets', href: '/dashboard/pets', icon: PawPrint },
        { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
        { name: 'Profile', href: '/dashboard/profile', icon: User },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    const staffLinks = [
        { name: 'Overview', href: '/staff', icon: LayoutDashboard },
        { name: 'Schedule', href: '/staff/schedule', icon: Calendar },
        { name: 'Patients', href: '/staff/patients', icon: Users },
        { name: 'Prescriptions', href: '/staff/prescriptions', icon: ClipboardList },
        { name: 'Lab Orders', href: '/staff/lab-orders', icon: Microscope },
        { name: 'Supplies', href: '/staff/supplies', icon: Package },
        { name: 'Settings', href: '/staff/settings', icon: Settings },
    ];

    if (user.role === 'Admin') {
        staffLinks.push({ name: 'Admin Panel', href: '/staff/admin', icon: ShieldCheck });
    }

    const links = isStaff ? staffLinks : clientLinks;

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200 pt-8 pb-4">
            {isStaff && (
                <div className="px-6 mb-8">
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Role</p>
                        <p className="text-sm font-bold text-stone-900">{user.role}</p>
                    </div>
                </div>
            )}

            <div className="flex-grow px-4 space-y-2">
                {links.map((link) => {
                    const isActive = pathname === link.href || (link.href !== '/dashboard' && link.href !== '/staff' && pathname.startsWith(link.href));

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all",
                                isActive
                                    ? "bg-emerald-50 text-emerald-600 shadow-sm"
                                    : "text-stone-600 hover:bg-stone-50 hover:text-emerald-600"
                            )}
                        >
                            <link.icon className={cn("h-5 w-5", isActive ? "text-emerald-600" : "text-stone-400")} />
                            {link.name}
                        </Link>
                    );
                })}
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
    );
}
