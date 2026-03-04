'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PawPrint, Plus, Search, Filter, ChevronRight, Info, Activity, Calendar, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockWeightData = [
    { date: 'Jan', weight: 28.5 },
    { date: 'Feb', weight: 29.0 },
    { date: 'Mar', weight: 28.8 },
    { date: 'Apr', weight: 29.2 },
    { date: 'May', weight: 29.5 },
];

export default function PetsPage() {
    const [selectedPet, setSelectedPet] = useState<string | null>(null);

    const pets = [
        {
            id: '1',
            name: 'Buddy',
            breed: 'Golden Retriever',
            type: 'Dog',
            dob: '2020-05-12',
            chip: '985112345678901',
            image: 'https://picsum.photos/seed/dog1/400/400',
            tags: ['Friendly', 'Active'],
            allergies: ['Chicken', 'Pollen'],
            notes: 'Loves belly rubs. Nervous around loud noises.',
            weightHistory: mockWeightData
        },
        {
            id: '2',
            name: 'Luna',
            breed: 'Siamese',
            type: 'Cat',
            dob: '2021-08-20',
            chip: '985112345678902',
            image: 'https://picsum.photos/seed/cat1/400/400',
            tags: ['Indoor', 'Quiet'],
            allergies: [],
            notes: 'Very vocal in the morning.',
            weightHistory: [
                { date: 'Jan', weight: 4.2 },
                { date: 'Feb', weight: 4.3 },
                { date: 'Mar', weight: 4.3 },
                { date: 'Apr', weight: 4.4 },
                { date: 'May', weight: 4.5 },
            ]
        },
    ];

    const activePet = pets.find(p => p.id === selectedPet) || pets[0];

    return (
        <div className="space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-stone-900">My Pets</h1>
                    <p className="text-stone-500">Manage your pets&apos; health records and information.</p>
                </div>
                <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                    <Plus className="h-5 w-5" />
                    Add New Pet
                </button>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Pet List Sidebar */}
                <aside className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search pets..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="space-y-3">
                        {pets.map((pet) => (
                            <button
                                key={pet.id}
                                onClick={() => setSelectedPet(pet.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                                    activePet.id === pet.id
                                        ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                                        : 'bg-white border-stone-100 hover:border-stone-200'
                                }`}
                            >
                                <div className="h-12 w-12 rounded-xl overflow-hidden relative flex-shrink-0">
                                    <Image
                                        src={pet.image}
                                        alt={pet.name}
                                        fill
                                        className="object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h3 className={`font-bold ${activePet.id === pet.id ? 'text-emerald-900' : 'text-stone-900'}`}>{pet.name}</h3>
                                    <p className="text-xs text-stone-500">{pet.breed}</p>
                                </div>
                                <ChevronRight className={`h-5 w-5 ${activePet.id === pet.id ? 'text-emerald-500' : 'text-stone-300'}`} />
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Pet Details Main View */}
                <div className="lg:col-span-2 space-y-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activePet.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {/* Profile Header */}
                            <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm relative overflow-hidden">
                                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                                    <div className="h-32 w-32 rounded-3xl overflow-hidden shadow-lg border-4 border-white flex-shrink-0 relative">
                                        <Image
                                            src={activePet.image}
                                            alt={activePet.name}
                                            fill
                                            className="object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                    <div className="flex-grow space-y-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-4xl font-display font-bold text-stone-900">{activePet.name}</h2>
                                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {activePet.type}
                      </span>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Breed</p>
                                                <p className="text-sm font-medium text-stone-700">{activePet.breed}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Birthday</p>
                                                <p className="text-sm font-medium text-stone-700">{activePet.dob}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Microchip</p>
                                                <p className="text-sm font-medium text-stone-700">{activePet.chip}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {activePet.tags.map(tag => (
                                                <span key={tag} className="bg-stone-100 text-stone-600 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                          <Hash className="h-3 w-3" /> {tag}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative background */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
                            </div>

                            {/* Health Info Grid */}
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Weight Chart */}
                                <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-5 w-5 text-emerald-600" />
                                            <h3 className="font-bold text-stone-900">Weight History</h3>
                                        </div>
                                        <span className="text-xs font-medium text-stone-400">Last 5 months</span>
                                    </div>
                                    <div className="h-48 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={activePet.weightHistory}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a8a29e' }} />
                                                <YAxis hide />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                    labelStyle={{ fontWeight: 'bold', color: '#1c1917' }}
                                                />
                                                <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="pt-4 border-t border-stone-50 flex justify-between items-center">
                                        <p className="text-sm text-stone-500">Current Weight</p>
                                        <p className="text-lg font-bold text-stone-900">{activePet.weightHistory[activePet.weightHistory.length - 1].weight} kg</p>
                                    </div>
                                </div>

                                {/* Allergies & Notes */}
                                <div className="space-y-8">
                                    <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Info className="h-5 w-5 text-amber-600" />
                                            <h3 className="font-bold text-stone-900">Allergies & Risks</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {activePet.allergies.length > 0 ? (
                                                activePet.allergies.map(allergy => (
                                                    <span key={allergy} className="bg-amber-50 text-amber-700 px-3 py-1 rounded-lg text-xs font-bold border border-amber-100">
                            {allergy}
                          </span>
                                                ))
                                            ) : (
                                                <p className="text-sm text-stone-400 italic">No known allergies</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-5 w-5 text-blue-600" />
                                            <h3 className="font-bold text-stone-900">Medical Notes</h3>
                                        </div>
                                        <p className="text-sm text-stone-600 leading-relaxed">
                                            {activePet.notes}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
