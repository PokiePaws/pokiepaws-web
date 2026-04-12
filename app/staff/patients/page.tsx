'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Filter, ChevronRight, PawPrint, User, Phone, Mail, Plus, MoreVertical, Sparkles, X as CloseIcon, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

import { useLanguageStore } from '../../../store/use-language-store';
import { translations } from '../../../lib/translations';


export default function PatientsPage() {
    const { language } = useLanguageStore();
    const t = translations[language];
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatientForRecords, setSelectedPatientForRecords] = useState<any>(null);

    const patients = [
        { id: '1', name: 'Buddy', breed: 'Golden Retriever', owner: 'John Doe', lastVisit: '2024-04-15', phone: '+1 (555) 123-4567', email: 'john@example.com', image: 'https://picsum.photos/seed/dog1/200/200', history: 'Chronic ear infections, allergic to chicken, last vaccination Apr 2024.' },
        { id: '2', name: 'Luna', breed: 'Siamese', owner: 'Jane Smith', lastVisit: '2024-04-20', phone: '+1 (555) 987-6543', email: 'jane@example.com', image: 'https://picsum.photos/seed/cat1/200/200', history: 'Healthy, indoor only, slight dental tartar noted in last visit.' },
        { id: '3', name: 'Max', breed: 'Beagle', owner: 'Robert Brown', lastVisit: '2024-03-10', phone: '+1 (555) 456-7890', email: 'robert@example.com', image: 'https://picsum.photos/seed/dog2/200/200', history: 'History of hip dysplasia, on daily anti-inflammatory medication.' },
        { id: '4', name: 'Bella', breed: 'Persian', owner: 'Sarah Wilson', lastVisit: '2024-05-01', phone: '+1 (555) 321-0987', email: 'sarah@example.com', image: 'https://picsum.photos/seed/cat2/200/200', history: 'Recovering from minor skin irritation, finished antibiotics last week.' },
    ];

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.breed.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-stone-900">{t.patients.title}</h1>
                    <p className="text-stone-500">{t.patients.subtitle}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/staff/clients/register"
                        className="bg-white text-stone-600 border border-stone-200 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-stone-50 transition-all"
                    >
                        <User className="h-5 w-5" />
                        {t.patients.registerClient}
                    </Link>

                </div>
            </header>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <input
                        type="text"
                        placeholder={t.patients.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-stone-200 rounded-2xl text-stone-600 font-medium hover:bg-stone-50 transition-all">
                    <Filter className="h-5 w-5" />
                    {t.patients.filters}
                </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPatients.map((patient) => (
                    <motion.div
                        key={patient.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-inner bg-slate-100 relative">
                                <Image
                                    src={patient.image}
                                    alt={patient.name}
                                    fill
                                    className="object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-stone-300 hover:text-stone-600 transition-colors">
                                    <MoreVertical className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-stone-900 group-hover:text-emerald-600 transition-colors">{patient.name}</h3>
                                <p className="text-sm text-stone-500">{patient.breed}</p>
                            </div>

                            <div className="pt-4 border-t border-stone-50 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-stone-600">
                                    <User className="h-4 w-4 text-stone-400" />
                                    <span>{patient.owner}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-stone-600">
                                    <Phone className="h-4 w-4 text-stone-400" />
                                    <span>{patient.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-stone-600">
                                    <Mail className="h-4 w-4 text-stone-400" />
                                    <span className="truncate">{patient.email}</span>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-between items-center">
                                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                                    {t.patients.lastVisit}: {patient.lastVisit}
                                </div>
                                <button
                                    onClick={() => setSelectedPatientForRecords(patient)}
                                    className="text-emerald-600 font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all"
                                >
                                    {t.patients.viewRecords} <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Medical Records Modal */}
            <AnimatePresence>
                {selectedPatientForRecords && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-stone-50 flex justify-between items-center bg-stone-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-50 p-2 rounded-xl">
                                        <FileText className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-display font-bold text-stone-900">{t.patients.viewRecords}</h2>
                                </div>
                                <button onClick={() => setSelectedPatientForRecords(null)} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                                    <CloseIcon className="h-6 w-6 text-stone-400" />
                                </button>
                            </div>

                            <div className="p-8 max-h-[60vh] overflow-y-auto">
                                <div className="flex items-center gap-6 mb-8 p-4 bg-stone-50 rounded-3xl">
                                    <div className="h-20 w-20 rounded-2xl overflow-hidden relative shadow-sm">
                                        <Image src={selectedPatientForRecords.image} alt={selectedPatientForRecords.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-stone-900">{selectedPatientForRecords.name}</h3>
                                        <p className="text-stone-500">{selectedPatientForRecords.breed}</p>
                                        <div className="flex gap-4 mt-2">
                      <span className="text-xs font-medium px-2 py-1 bg-white border border-stone-200 rounded-lg text-stone-600">
                        {t.patients.lastVisit}: {selectedPatientForRecords.lastVisit}
                      </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <section>
                                        <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">
                                            {language === 'pl' ? 'Historia Medyczna' : 'Medical History'}
                                        </h4>
                                        <div className="p-6 bg-white border border-stone-100 rounded-2xl shadow-sm">
                                            <p className="text-stone-700 leading-relaxed">
                                                {selectedPatientForRecords.history}
                                            </p>
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">
                                            {language === 'pl' ? 'Właściciel' : 'Owner'}
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-stone-50 rounded-2xl">
                                                <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">
                                                    {language === 'pl' ? 'Imię i Nazwisko' : 'Full Name'}
                                                </p>
                                                <p className="font-bold text-stone-900">{selectedPatientForRecords.owner}</p>
                                            </div>
                                            <div className="p-4 bg-stone-50 rounded-2xl">
                                                <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">
                                                    {language === 'pl' ? 'Telefon' : 'Phone'}
                                                </p>
                                                <p className="font-bold text-stone-900">{selectedPatientForRecords.phone}</p>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>

                            <div className="p-8 bg-stone-50 flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedPatientForRecords(null)}
                                    className="px-6 py-3 bg-white border border-stone-200 rounded-xl font-bold text-stone-600 hover:bg-white/50 transition-all"
                                >
                                    {language === 'pl' ? 'Zamknij' : 'Close'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {filteredPatients.length === 0 && (
                <div className="py-20 text-center">
                    <div className="bg-stone-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="h-10 w-10 text-stone-400" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">{t.patients.noPatients}</h3>
                    <p className="text-stone-500">{t.patients.noPatientsDesc}</p>
                </div>
            )}
        </div>
    );
}
