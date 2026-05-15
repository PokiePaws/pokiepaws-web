'use client';

import { useAuthStore } from '../../store/use-auth-store';
import { useLanguageStore } from '../../store/use-language-store';
import { translations } from '../../lib/translations';
import { Calendar, Users, ChevronRight, Search, Package, Microscope, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useVetVisitsRange } from '../../lib/features/api-hooks';

const toDateInputValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const formatVisitTime = (startsAt: string) =>
    new Intl.DateTimeFormat('en', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(startsAt));

export default function StaffDashboard() {
    const { user } = useAuthStore();
    const { language } = useLanguageStore();
    const t = translations[language];
    const today = toDateInputValue(new Date());
    const { data: todaySchedule = [], isLoading } = useVetVisitsRange(today, today);
    const patientCount = new Set(todaySchedule.map((visit) => visit.animalId)).size;

    const stats = [
        { name: t.dashboard.stats.visits, value: String(todaySchedule.length), icon: Calendar, color: 'bg-blue-100 text-blue-600' },
        { name: t.dashboard.stats.patients, value: String(patientCount), icon: Users, color: 'bg-emerald-100 text-emerald-600' },
        { name: t.dashboard.stats.orders, value: '0', icon: Package, color: 'bg-amber-100 text-amber-600' },
        { name: t.dashboard.stats.results, value: '0', icon: Microscope, color: 'bg-purple-100 text-purple-600' },
    ];

    return (
        <div className="space-y-10">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">{t.dashboard.title}</h1>
                    <p className="text-slate-500">{t.dashboard.welcome.replace('{name}', user?.name || '')}</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder={t.dashboard.searchPlaceholder}
                        className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
                    />
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.name}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Today's Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900">{t.dashboard.schedule.title}</h2>
                        <Link href="/staff/schedule" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center gap-1">
                            {t.dashboard.schedule.fullCalendar} <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.dashboard.schedule.table.time}</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.dashboard.schedule.table.patient}</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.dashboard.schedule.table.service}</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.dashboard.schedule.table.status}</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest"></th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                {isLoading && (
                                    <tr>
                                        <td className="px-6 py-12 text-center" colSpan={5}>
                                            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && todaySchedule.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-slate-900">{formatVisitTime(item.startsAt)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900">Animal #{item.animalId}</span>
                                                <span className="text-xs text-slate-400">Clinic #{item.clinicId}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600">{item.description || '-'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            item.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                item.status === 'CONFIRMED' || item.status === 'SCHEDULED' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.status}
                        </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-300 hover:text-blue-600 transition-colors">
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {!isLoading && todaySchedule.length === 0 && (
                                    <tr>
                                        <td className="px-6 py-12 text-center text-sm text-slate-400" colSpan={5}>
                                            {t.schedule.noVisits}
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pending Requests */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">{t.dashboard.requests.title}</h2>
                    <div className="space-y-4">
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center">
                            <p className="text-slate-400 text-sm italic">{t.dashboard.requests.empty}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
