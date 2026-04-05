'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../store/use-auth-store';
import { useLanguageStore } from '../store/use-language-store';
import { translations } from '../lib/translations';
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
    ShieldCheck,
    Building2
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Sidebar() {
    const { user, logout } = useAuthStore();
    const pathname = usePathname();
    const { language } = useLanguageStore();

    if (!user) return null;

    const t = translations[language];

    const links = [
        { name: t.sidebar.overview, href: '/staff', icon: LayoutDashboard },
        { name: t.sidebar.schedule, href: '/staff/schedule', icon: Calendar },
        { name: t.sidebar.patients, href: '/staff/patients', icon: Users },
        { name: t.sidebar.prescriptions, href: '/staff/prescriptions', icon: ClipboardList },
        { name: t.sidebar.labOrders, href: '/staff/labOrders', icon: Microscope },
        { name: t.sidebar.supplies, href: '/staff/supplies', icon: Package },
        { name: t.sidebar.settings, href: '/staff/settings', icon: Settings },
    ];

    if (user.role === 'Admin' || user.role === 'SuperAdmin') {
        links.push({ name: t.sidebar.adminPanel, href: '/staff/users', icon: ShieldCheck });
        links.push({ name: language === 'pl' ? 'Kliniki' : 'Clinics', href: '/staff/clinics', icon: Building2 });
        links.push({ name: language === 'pl' ? 'Statystyki' : 'Statistics', href: '/staff/stats', icon: LayoutDashboard });

    }

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200 pt-8 pb-4">
            <div className="px-6 mb-8">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">{t.common.role}</p>
                    <p className="text-sm font-bold text-stone-900">
                        {user.role === 'Staff' ? t.common.vet : user.role === 'Admin' ? t.common.admin : t.common.superAdmin}
                    </p>
                </div>
            </div>

            <div className="flex-grow px-4 space-y-2">
                {links.map((link) => {
                    const isActive = pathname === link.href || (link.href !== '/staff' && pathname.startsWith(link.href));

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
                    {t.common.logout}
                </button>
            </div>
        </aside>
    );
}

