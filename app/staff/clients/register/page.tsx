'use client';

import { useState } from 'react';
import { useLanguageStore } from '../../../../store/use-language-store';
import { translations } from '../../../../lib/translations';
import { User, Mail, Phone, MapPin, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function ClientRegistrationPage() {
    const { language } = useLanguageStore();
    const t = translations[language];

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        zipCode: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, we would save this to Firestore
        console.log('Registering client:', formData);
        setIsSubmitted(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-12 rounded-[2.5rem] border border-stone-100 shadow-xl text-center"
                >
                    <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-stone-900 mb-4">{t.clientRegistration.success}</h2>
                    <p className="text-stone-500 mb-10">
                        {formData.firstName} {formData.lastName} has been added to the system.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/staff/patients"
                            className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                        >
                            Go to Patients
                        </Link>
                        <button
                            onClick={() => {
                                setIsSubmitted(false);
                                setFormData({
                                    firstName: '',
                                    lastName: '',
                                    email: '',
                                    phone: '',
                                    street: '',
                                    city: '',
                                    zipCode: '',
                                });
                            }}
                            className="bg-stone-100 text-stone-600 px-8 py-4 rounded-2xl font-bold hover:bg-stone-200 transition-all"
                        >
                            Register Another
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <Link
                href="/staff/patients"
                className="inline-flex items-center gap-2 text-stone-500 hover:text-emerald-600 font-medium transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Patients
            </Link>

            <header>
                <h1 className="text-3xl font-display font-bold text-stone-900">{t.clientRegistration.title}</h1>
                <p className="text-stone-500">{t.clientRegistration.subtitle}</p>
            </header>

            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-700 ml-1">{t.clientRegistration.firstName}</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                            <input
                                required
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="John"
                                className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-700 ml-1">{t.clientRegistration.lastName}</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                            <input
                                required
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Doe"
                                className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-700 ml-1">{t.clientRegistration.email}</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-700 ml-1">{t.clientRegistration.phone}</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                            <input
                                required
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                                className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-stone-50">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-700 ml-1">{t.clientRegistration.street}</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                            <input
                                required
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                placeholder="123 Pet Lane"
                                className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-700 ml-1">{t.clientRegistration.city}</label>
                            <input
                                required
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="New York"
                                className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-700 ml-1">{t.clientRegistration.zipCode}</label>
                            <input
                                required
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                placeholder="10001"
                                className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                >
                    {t.clientRegistration.submit}
                </button>
            </form>
        </div>
    );
}
