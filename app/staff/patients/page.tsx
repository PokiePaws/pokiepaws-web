'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Filter, ChevronRight, PawPrint, User, Phone, Mail, Plus, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PatientsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const patients = [
        { id: '1', name: 'Buddy', breed: 'Golden Retriever', owner: 'John Doe', lastVisit: '2024-04-15', phone: '+1 (555) 123-4567', email: 'john@example.com', image: 'https://picsum.photos/seed/dog1/200/200' },
        { id: '2', name: 'Luna', breed: 'Siamese', owner: 'Jane Smith', lastVisit: '2024-04-20', phone: '+1 (555) 987-6543', email: 'jane@example.com', image: 'https://picsum.photos/seed/cat1/200/200' },
        { id: '3', name: 'Max', breed: 'Beagle', owner: 'Robert Brown', lastVisit: '2024-03-10', phone: '+1 (555) 456-7890', email: 'robert@example.com', image: 'https://picsum.photos/seed/dog2/200/200' },
        { id: '4', name: 'Bella', breed: 'Persian', owner: 'Sarah Wilson', lastVisit: '2024-05-01', phone: '+1 (555) 321-0987', email: 'sarah@example.com', image: 'https://picsum.photos/seed/cat2/200/200' },
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
                    <h1 className="text-3xl font-display font-bold text-slate-900">Patient Directory</h1>
                    <p className="text-slate-500">Search and manage all clinic patients and their owners.</p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                    <Plus className="h-5 w-5" />
                    Register New Patient
                </button>
            </header>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search by name, breed, or owner..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-stone-200 rounded-2xl text-stone-600 font-medium hover:bg-stone-50 transition-all">
                    <Filter className="h-5 w-5" />
                    Filters
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
                            <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                <MoreVertical className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{patient.name}</h3>
                                <p className="text-sm text-slate-500">{patient.breed}</p>
                            </div>

                            <div className="pt-4 border-t border-slate-50 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <User className="h-4 w-4 text-slate-400" />
                                    <span>{patient.owner}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                    <span>{patient.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <span className="truncate">{patient.email}</span>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-between items-center">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Last Visit: {patient.lastVisit}
                                </div>
                                <button className="text-blue-600 font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
                                    View Records <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredPatients.length === 0 && (
                <div className="py-20 text-center">
                    <div className="bg-stone-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="h-10 w-10 text-stone-400" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">No patients found</h3>
                    <p className="text-stone-500">Try adjusting your search terms or filters.</p>
                </div>
            )}
        </div>
    );
}
