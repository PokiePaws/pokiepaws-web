'use client';

import { useState } from 'react';
import { Building2, Users, Search, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../../store/use-auth-store';
import { useLanguageStore } from '../../../store/use-language-store';
import { translations } from '../../../lib/translations';
import { useClinics } from '../../../lib/features/clinics/use-clinics';

export default function ManagementPage() {
    const { user } = useAuthStore();
    const { language } = useLanguageStore();
    const t = translations[language];
    const m = t.management;
    const [searchTerm, setSearchTerm] = useState('');
    const { data: clinics = [], isLoading } = useClinics();

    const filtered = clinics.filter(
        (c) =>
            c.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.city.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const isAdmin = user?.role === 'Admin' || user?.role === 'SuperAdmin';

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-display font-bold text-stone-900">{m.title}</h1>
                <p className="text-stone-500 mt-1">{isAdmin ? m.adminDesc : m.adminDesc}</p>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                        <Users className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">—</p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{m.statsVets}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="bg-emerald-100 text-emerald-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{clinics.length}</p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{m.statsClinics}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="bg-amber-100 text-amber-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">—</p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{m.statsAdmins}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="bg-purple-100 text-purple-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">—</p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{m.statsUnits}</p>
                </div>
            </div>

            {/* Clinic list */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-stone-900">{m.statsClinics}</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder={m.searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-16 text-center text-slate-400 text-sm">Ładowanie&hellip;</div>
                ) : filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-stone-500 font-medium">{m.noUsers}</p>
                        <p className="text-stone-400 text-sm mt-1">{m.noUsersDesc}</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-50">
                        {filtered.map((clinic) => (
                            <li key={clinic.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                        <Building2 className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-stone-900">{clinic.clinicName}</p>
                                        <p className="text-sm text-stone-500">{clinic.city}</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-300" />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
