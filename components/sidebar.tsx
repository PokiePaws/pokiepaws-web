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


}
