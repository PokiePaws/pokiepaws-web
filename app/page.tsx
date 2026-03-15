'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PawPrint, MapPin, Star, ChevronRight, Search, Building2, Users2, ShieldCheck, Sparkles } from 'lucide-react';
import Navbar from '../components/navbar';
import { mockClinics } from '../lib/mock-data';
import { useLanguageStore } from '../store/use-language-store';
import { translations } from '../lib/translations';

export default function Home() {
    const { language } = useLanguageStore();
    const t = translations[language];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-blue-600 py-20 lg:py-32 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <h1 className="text-4xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
                            {t.home.heroTitle} <br />
                            <span className="text-blue-200 underline decoration-blue-400">{t.home.heroSubtitle}</span>
                        </h1>
                        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                            {t.home.heroDescription}
                        </p>

                        <div className="max-w-2xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder={t.home.searchPlaceholder}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-400/30 text-slate-900"
                            />
                        </div>
                    </div>

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
                    </div>
                </section>

                {/* Network Stats */}
                <section className="py-12 bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <p className="text-3xl font-bold text-blue-600">15+</p>
                                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t.home.stats.clinics}</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-blue-600">50+</p>
                                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t.home.stats.specialists}</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-blue-600">10k+</p>
                                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t.home.stats.pets}</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-blue-600">24/7</p>
                                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t.home.stats.support}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Smart Triage CTA */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-emerald-600 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden shadow-2xl shadow-emerald-200">
                            <div className="relative z-10 flex-grow space-y-6 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/30 text-emerald-50 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                    <Sparkles className="h-4 w-4" />
                                    New Feature
                                </div>
                                <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                                    {t.triage.title}
                                </h2>
                                <p className="text-emerald-100 text-lg max-w-xl">
                                    {t.triage.subtitle} Get immediate guidance on your pet&apos;s health using our advanced AI assistant.
                                </p>
                                <Link
                                    href="/triage"
                                    className="inline-flex items-center gap-3 bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-xl"
                                >
                                    Try AI Triage <ChevronRight className="h-5 w-5" />
                                </Link>
                            </div>

                            <div className="relative z-10 w-full max-w-sm">
                                <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 shadow-inner">
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-400 shrink-0" />
                                            <div className="bg-white/20 h-4 w-3/4 rounded-full" />
                                        </div>
                                        <div className="flex gap-3 justify-end">
                                            <div className="bg-emerald-400 h-4 w-1/2 rounded-full" />
                                            <div className="w-8 h-8 rounded-full bg-white/30 shrink-0" />
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-400 shrink-0" />
                                            <div className="bg-white/20 h-12 w-full rounded-2xl" />
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative elements */}
                                <div className="absolute -top-6 -right-6 w-12 h-12 bg-emerald-400 rounded-full blur-xl opacity-50 animate-pulse" />
                                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-300 rounded-full blur-2xl opacity-30" />
                            </div>

                            {/* Background Pattern */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-700 rounded-full blur-[80px] opacity-30 translate-y-1/2 -translate-x-1/2" />
                        </div>
                    </div>
                </section>

                {/* Clinic Catalog */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">{t.home.clinicsTitle}</h2>
                                <p className="text-slate-500">{t.home.clinicsSubtitle}</p>
                            </div>
                            <Link href="/clinics" className="text-blue-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                {t.home.viewAll} <ChevronRight className="h-5 w-5" />
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {mockClinics.map((clinic) => (
                                <Link
                                    key={clinic.id}
                                    href={`/clinics/${clinic.id}`}
                                    className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all"
                                >
                                    <div className="aspect-video relative overflow-hidden">
                                        <Image
                                            src={clinic.image}
                                            alt={clinic.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            referrerPolicy="no-referrer"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                            <span className="text-xs font-bold text-slate-900">{clinic.rating}</span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-widest mb-2">
                                            <MapPin className="h-3 w-3" />
                                            {clinic.city}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{clinic.name}</h3>
                                        <p className="text-slate-500 text-sm line-clamp-2 mb-6">{clinic.description}</p>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                            <span className="text-xs text-slate-400">{clinic.address}</span>
                                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <ChevronRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Our Network */}
                <section className="py-24 bg-blue-50/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">{t.home.advantageTitle}</h2>
                            <p className="text-slate-600 text-lg">{t.home.advantageSubtitle}</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12">
                            <div className="text-center space-y-4">
                                <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto text-blue-600">
                                    <ShieldCheck className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{t.home.features.historyTitle}</h3>
                                <p className="text-slate-500">{t.home.features.historyDesc}</p>
                            </div>
                            <div className="text-center space-y-4">
                                <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto text-blue-600">
                                    <Building2 className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{t.home.features.facilitiesTitle}</h3>
                                <p className="text-slate-500">{t.home.features.facilitiesDesc}</p>
                            </div>
                            <div className="text-center space-y-4">
                                <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto text-blue-600">
                                    <Users2 className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{t.home.features.teamTitle}</h3>
                                <p className="text-slate-500">{t.home.features.teamDesc}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center items-center gap-2 mb-6">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <PawPrint className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-display font-bold tracking-tight text-white">VetClinic <span className="text-blue-400">Network</span></span>
                    </div>
                    <p className="mb-8 max-w-md mx-auto">{t.home.footerDesc}</p>
                    <div className="flex justify-center gap-8 mb-8">
                        <Link href="/clinics" className="hover:text-white transition-colors">{t.nav.clinics}</Link>
                        <Link href="/blog" className="hover:text-white transition-colors">{t.nav.blog}</Link>
                    </div>
                    <p className="text-sm">© 2024 VetClinic Network. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
