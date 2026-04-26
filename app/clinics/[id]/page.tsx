'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MapPin, Phone, Star, Clock, ChevronLeft, ShieldCheck, Users, Heart, Loader2 } from 'lucide-react';
import Navbar from '../../../components/navbar';
import { apiRequest } from '../../../lib/api';
import { useLanguageStore } from '../../../store/use-language-store';
import { translations } from '../../../lib/translations';
import Clinic from '../../../lib/types';

export default function ClinicDetailPage() {
    const params = useParams();
    const { language } = useLanguageStore();
    const t = translations[language].clinics.detail;

    const [clinic, setClinic] = useState<Clinic | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchClinic() {
            try {
                const data = await apiRequest<Clinic>(`/api/clinics/${params.id}`);
                setClinic(data);
            } catch (e) {
                console.error('Error fetching clinic:', e);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        if (params.id) fetchClinic();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="flex flex-col items-center justify-center py-40">
                    <Loader2 className="h-12 w-12 animate-spin text-[#68b9dc] mb-4" />
                    <p className="text-slate-500 font-medium">{t.loading}</p>
                </div>
            </div>
        );
    }

    if (error || !clinic) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold">{t.notFound}</h1>
                    <Link href="/clinics" className="text-[#68b9dc] hover:underline mt-4 inline-block">
                        {t.notFoundBack}
                    </Link>
                </div>
            </div>
        );
    }

    const address = `${clinic.street} ${clinic.houseNumber}${clinic.apartmentNumber ? `/${clinic.apartmentNumber}` : ''}, ${clinic.postalCode} ${clinic.city}`;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main>
                {/* Hero Banner */}
                <div className="h-[40vh] relative">
                    <Image
                        src={clinic.imageUrl || 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800'}
                        alt={clinic.clinicName}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                        <div className="max-w-7xl mx-auto">
                            <Link href="/clinics" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                                <ChevronLeft className="h-4 w-4" /> {t.back}
                            </Link>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-widest mb-2">
                                        <MapPin className="h-4 w-4" />
                                        {clinic.city}
                                    </div>
                                    <h1 className="text-4xl lg:text-6xl font-display font-bold text-white">
                                        {clinic.clinicName}
                                    </h1>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 text-white">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Star className="h-4 w-4 text-[#d65759] fill-[#d65759]" />
                                        <span className="text-xl font-bold">5.0</span>
                                    </div>
                                    <p className="text-xs text-white/60">{t.rating}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-12">
                            <section className="grid sm:grid-cols-2 gap-8">
                                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                                    <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center">
                                        <ShieldCheck className="h-6 w-6 text-[#68b9dc]" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-xl">{t.accreditedTitle}</h3>
                                    <p className="text-slate-500 text-sm">{t.accreditedDesc}</p>
                                </div>
                                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                                    <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center">
                                        <Users className="h-6 w-6 text-[#68b9dc]" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-xl">{t.expertTitle}</h3>
                                    <p className="text-slate-500 text-sm">{t.expertDesc}</p>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl sticky top-24">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">{t.bookVisit}</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <MapPin className="h-5 w-5 text-[#68b9dc] mt-1 shrink-0" />
                                        <div>
                                            <p className="font-bold text-slate-900">{t.address}</p>
                                            <p className="text-sm text-slate-500">{address}</p>
                                        </div>
                                    </div>
                                    {clinic.phone && (
                                        <div className="flex items-start gap-4">
                                            <Phone className="h-5 w-5 text-[#68b9dc] mt-1 shrink-0" />
                                            <div>
                                                <p className="font-bold text-slate-900">{t.phone}</p>
                                                <p className="text-sm text-slate-500">{clinic.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                    {clinic.workingHours && (
                                        <div className="flex items-start gap-4">
                                            <Clock className="h-5 w-5 text-[#68b9dc] mt-1 shrink-0" />
                                            <div>
                                                <p className="font-bold text-slate-900">{t.hours}</p>
                                                <p className="text-sm text-slate-500">{clinic.workingHours}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-10">
                                    <Link
                                        href="/register"
                                        className="w-full bg-[#68b9dc] text-white py-4 rounded-2xl font-bold text-center block hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                                    >
                                        {t.scheduleBtn}
                                    </Link>
                                </div>
                            </div>

                            {clinic.phone && (
                                <div className="bg-[#d34f57] p-8 rounded-[2.5rem] text-white relative overflow-hidden">
                                    <div className="relative z-10">
                                        <Heart className="h-8 w-8 mb-4" />
                                        <h4 className="text-xl font-bold mb-2">{t.emergency}</h4>
                                        <p className="text-red-100 text-sm mb-6">{t.emergencyDesc}</p>
                                        <a href={`tel:${clinic.phone}`} className="bg-white text-[#d34f57] px-6 py-3 rounded-xl font-bold text-sm inline-block">
                                            {t.callNow}
                                        </a>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#c04047] rounded-full blur-3xl opacity-50" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}