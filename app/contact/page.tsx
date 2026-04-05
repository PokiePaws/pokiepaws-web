'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../components/navbar';
import { useLanguageStore } from '../../store/use-language-store';
import { translations } from '../../lib/translations';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, User, Building2 } from 'lucide-react';
import { motion } from 'motion/react';
import { mockClinics } from '../../lib/mock-data';

export default function ContactPage() {
    const { language } = useLanguageStore();
    const t = translations[language];
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedClinicId, setSelectedClinicId] = useState(mockClinics[0].id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-stone-50">
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="bg-white border-b border-blue-50 py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-display font-bold text-slate-900 mb-6"
                        >
                            {t.contact.title}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-600 max-w-2xl mx-auto"
                        >
                            {t.contact.subtitle}
                        </motion.p>
                    </div>
                </section>

                {/* Clinic Cards */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">
                            {t.contact.clinicContactsTitle}
                        </h2>
                        <p className="text-slate-600 text-lg">
                            {t.contact.clinicContactsSubtitle}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {mockClinics.map((clinic, index) => (
                            <motion.div
                                key={clinic.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-blue-50 p-3 rounded-2xl">
                                        <Building2 className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{clinic.name}</h3>
                                </div>

                                <div className="space-y-4 text-slate-600">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                        <span className="text-sm">{clinic.address}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                                        <span className="text-sm font-medium">{clinic.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-blue-500 shrink-0" />
                                        <span className="text-sm font-medium">{clinic.email}</span>
                                    </div>

                                    <div className="pt-6 mt-6 border-t border-slate-100">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                                            {t.contact.info.manager}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-100 p-2 rounded-full">
                                                <User className="h-4 w-4 text-slate-500" />
                                            </div>
                                            <span className="font-bold text-slate-900">{clinic.manager}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Contact Form */}
                <section className="bg-slate-50 py-24">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-10 lg:p-16 rounded-[3rem] border border-blue-50 shadow-xl"
                        >
                            {submitted ? (
                                <div className="text-center py-12">
                                    <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                                    </div>
                                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">{t.contact.form.successTitle}</h2>
                                    <p className="text-slate-600 text-lg mb-10">{t.contact.form.successDesc}</p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="text-blue-600 font-bold hover:underline"
                                    >
                                        {t.contact.form.sendAnother}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-12">
                                        <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">{t.contact.form.title}</h2>
                                        <p className="text-slate-600">{t.contact.form.subtitle}</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 ml-1">{t.contact.form.firstName}</label>
                                                <input
                                                    required
                                                    type="text"
                                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                    placeholder="John"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 ml-1">{t.contact.form.lastName}</label>
                                                <input
                                                    required
                                                    type="text"
                                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                    placeholder="Doe"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 ml-1">{t.contact.form.email}</label>
                                                <input
                                                    required
                                                    type="email"
                                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 ml-1">
                                                    {language === 'en' ? 'Select Clinic' : 'Wybierz Klinikę'}
                                                </label>
                                                <select
                                                    value={selectedClinicId}
                                                    onChange={(e) => setSelectedClinicId(e.target.value)}
                                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                                                >
                                                    {mockClinics.map(clinic => (
                                                        <option key={clinic.id} value={clinic.id}>{clinic.name} ({clinic.city})</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">{t.contact.form.subject}</label>
                                            <select
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                                            >
                                                <option value="general">{t.contact.form.subjects.general}</option>
                                                <option value="appointment">{t.contact.form.subjects.appointment}</option>
                                                <option value="records">{t.contact.form.subjects.records}</option>
                                                <option value="feedback">{t.contact.form.subjects.feedback}</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">{t.contact.form.message}</label>
                                            <textarea
                                                required
                                                rows={5}
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                                placeholder={language === 'en' ? 'How can we help you?' : 'Jak możemy Ci pomóc?'}
                                            />
                                        </div>

                                        <button
                                            disabled={loading}
                                            type="submit"
                                            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group disabled:opacity-70"
                                        >
                                            {loading ? (
                                                <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    {t.contact.form.submit}
                                                    <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                </section>
            </main>

            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center items-center gap-2 mb-6">
                        <div className="relative w-12 h-12 overflow-hidden rounded-xl">
                            <Image
                                src="/uq19G.jpg"
                                alt="Logo"
                                fill
                                className="object-cover"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <span className="text-xl font-display font-bold tracking-tight text-white">Pokie Paws <span className="text-blue-400">Network</span></span>
                    </div>
                    <p className="mb-8 max-w-md mx-auto">{t.home.footerDesc}</p>
                    <div className="flex justify-center gap-8 mb-8">
                        <Link href="/clinics" className="hover:text-white transition-colors">{t.nav.clinics}</Link>
                        <Link href="/blog" className="hover:text-white transition-colors">{t.nav.blog}</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">{t.nav.contact}</Link>
                    </div>
                    <p className="text-sm">© 2024 Pokie Paws Network. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}