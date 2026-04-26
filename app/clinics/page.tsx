'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Star, ChevronRight, Filter, Building2, Loader2 } from 'lucide-react';
import Navbar from '../../components/navbar';
import { useLanguageStore } from '../../store/use-language-store';
import { translations } from '../../lib/translations';
import { apiRequest } from '../../lib/api';
import Clinic from '../../lib/types';

export default function ClinicsPage() {
    const { language } = useLanguageStore();
    const t = translations[language];
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('All');

    useEffect(() => {
        async function fetchClinics() {
            try {
                setLoading(true);
                const endpoint = selectedCity === 'All'
                    ? '/api/clinics'
                    : `/api/clinics/city/${selectedCity}`;

                const data = await apiRequest<Clinic[]>(endpoint);
                setClinics(data);
            } catch (error) {
                console.error('Error fetching clinics:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchClinics();
    }, [selectedCity]);

    const filteredClinics = clinics.filter(clinic =>
        clinic.clinicName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const cities = ['All', ...Array.from(new Set(clinics.map(c => c.city)))];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="max-w-xl">
                        <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">
                            {t.clinics.title}
                        </h1>
                        <p className="text-slate-600 text-lg">
                            {t.clinics.subtitle}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative grow md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder={t.clinics.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#68b9dc]"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="pl-10 pr-8 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#68b9dc] appearance-none"
                            >
                                <option value="All">{t.clinics.allCities}</option>
                                {cities.filter(c => c !== 'All').map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-12 w-12 animate-spin text-[#68b9dc] mb-4" />
                        <p className="text-slate-500 font-medium">{t.clinics.loadingClinics}</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredClinics.map((clinic) => (
                            <Link
                                key={clinic.id}
                                href={`/clinics/${clinic.id}`}
                                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all"
                            >
                                <div className="aspect-video relative overflow-hidden bg-slate-100">
                                    <Image
                                        src={clinic.imageUrl || 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800'}
                                        alt={clinic.clinicName}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                        <Star className="h-3 w-3 text-[#d25257] fill-[#d25257]" />
                                        <span className="text-xs font-bold text-slate-900">5.0</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-[#68b9dc] text-xs font-bold uppercase tracking-widest mb-2">
                                        <MapPin className="h-3 w-3" />
                                        {clinic.city}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#68b9dc] transition-colors">
                                        {clinic.clinicName}
                                    </h3>
                                    <p className="text-slate-500 text-sm line-clamp-2 mb-6">
                                        {clinic.workingHours || t.clinics.hoursUnavailable}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Building2 className="h-3 w-3" />
                                            {clinic.street} {clinic.houseNumber}
                                        </div>
                                        <div className="bg-blue-50 p-2 rounded-lg text-[#68b9dc] group-hover:bg-[#68b9dc] group-hover:text-white transition-colors">
                                            <ChevronRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && filteredClinics.length === 0 && (
                    <div className="text-center py-20">
                        <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{t.clinics.noClinics}</h3>
                        <p className="text-slate-500">{t.clinics.noClinicsDesc}</p>
                    </div>
                )}
            </main>
        </div>
    );
}