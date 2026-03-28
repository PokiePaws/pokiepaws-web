'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, PawPrint, User, Calendar, LogOut, Bell, ClipboardList, Microscope, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/use-auth-store';
import { useNotificationStore } from '../store/use-notification-store';
import { useLanguageStore } from '../store/use-language-store';
import { translations } from '../lib/translations';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuthStore();
    const { notifications, removeNotification } = useNotificationStore();
    const { language, setLanguage } = useLanguageStore();
    const [showNotifications, setShowNotifications] = useState(false);

    const t = translations[language];

    const navLinks = [
        { name: t.nav.home, href: '/' },
        { name: t.nav.blog, href: '/blog' },
        { name: t.nav.clinics, href: '/clinics' },
        { name: t.nav.contact, href: '/contact' },
    ];

    const staffLinks = [
        { name: t.staffNav.schedule, href: '/staff', icon: Calendar },
        { name: t.staffNav.patients, href: '/staff/patients', icon: PawPrint },
        { name: t.staffNav.prescriptions, href: '/staff/prescriptions', icon: ClipboardList },
        { name: t.staffNav.labOrders, href: '/staff/lab-orders', icon: Microscope },
        { name: t.staffNav.supplies, href: '/staff/supplies', icon: Package },
        { name: t.staffNav.management, href: '/staff/management', icon: User },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-blue-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg">
                                <PawPrint className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-display font-bold tracking-tight text-slate-900">Pokie Paws <span className="text-blue-600">Network</span></span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg mr-4">
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setLanguage('pl')}
                                className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${language === 'pl' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                PL
                            </button>
                        </div>

                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                                    pathname === link.href ? 'text-blue-600' : 'text-slate-600'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {user ? (
                            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="p-2 text-slate-500 hover:text-blue-600 transition-colors relative"
                                    >
                                        <Bell className="h-5 w-5" />
                                        {notifications.length > 0 && (
                                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {showNotifications && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-blue-100 overflow-hidden"
                                            >
                                                <div className="p-3 border-b border-blue-50 bg-blue-50/30">
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">{t.common.notifications}</p>
                                                </div>
                                                <div className="max-h-64 overflow-y-auto">
                                                    {notifications.length === 0 ? (
                                                        <div className="p-4 text-center text-slate-400 text-sm italic">{t.common.noNotifications}</div>
                                                    ) : (
                                                        notifications.map((n) => (
                                                            <div key={n.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors flex justify-between items-start gap-2">
                                                                <div>
                                                                    <p className="text-sm text-slate-800">{n.message}</p>
                                                                    <p className="text-[10px] text-slate-400 mt-1">{n.timestamp.toLocaleTimeString()}</p>
                                                                </div>
                                                                <button onClick={() => removeNotification(n.id)} className="text-slate-300 hover:text-slate-500">
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <Link
                                    href="/staff"
                                    className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
                                >
                                    <User className="h-4 w-4" />
                                    <span>{user.name}</span>
                                </Link>
                                <button
                                    onClick={() => logout()}
                                    className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 ml-4">
                                <Link
                                    href="/login"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-sm active:scale-95"
                                >
                                    {t.nav.login}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md text-stone-600 hover:text-emerald-600 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-stone-200 overflow-hidden"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-stone-600 hover:text-emerald-600 hover:bg-stone-50"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 pb-3 border-t border-stone-100">
                                {user ? (
                                    <>
                                        <div className="px-3 py-2 flex items-center gap-3">
                                            <div className="bg-emerald-100 p-2 rounded-full">
                                                <User className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-base font-medium text-stone-800">{user.name}</p>
                                                <p className="text-sm text-stone-500">{user.role}</p>
                                            </div>
                                        </div>
                                        {staffLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-stone-600 hover:text-emerald-600 hover:bg-stone-50"
                                            >
                                                <link.icon className="h-5 w-5" />
                                                {link.name}
                                            </Link>
                                        ))}
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            Log out
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-2 px-3">
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="block w-full text-center px-4 py-2 rounded-lg border border-stone-200 text-stone-600 font-medium"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setIsOpen(false)}
                                            className="block w-full text-center px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium"
                                        >
                                            Sign up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
