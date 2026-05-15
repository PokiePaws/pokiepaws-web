'use client';

import { useState } from 'react';
import { PawPrint, Plus, Search, ChevronRight, Info, Activity, Hash, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAnimals } from '../../../lib/features/api-hooks';

export default function PetsPage() {
    const [selectedPet, setSelectedPet] = useState<string | null>(null);
    const { data: pets = [], isLoading } = useAnimals();
    const activePet = pets.find(p => String(p.id) === selectedPet) || pets[0];
    const activeWeightData = activePet?.weight
        ? [{ date: 'Current', weight: activePet.weight }]
        : [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            </div>
        );
    }

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
                                onClick={() => setSelectedPet(String(pet.id))}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                                    activePet?.id === pet.id
                                        ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                                        : 'bg-white border-stone-100 hover:border-stone-200'
                                }`}
                            >
                                <div className="h-12 w-12 rounded-xl overflow-hidden relative flex-shrink-0">
                                    <div className="absolute inset-0 flex items-center justify-center bg-emerald-50">
                                        <PawPrint className="h-6 w-6 text-emerald-500" />
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <h3 className={`font-bold ${activePet?.id === pet.id ? 'text-emerald-900' : 'text-stone-900'}`}>{pet.name}</h3>
                                    <p className="text-xs text-stone-500">{pet.breed || pet.species}</p>
                                </div>
                                <ChevronRight className={`h-5 w-5 ${activePet?.id === pet.id ? 'text-emerald-500' : 'text-stone-300'}`} />
                            </button>
                        ))}
                    </div>
                    {pets.length === 0 && (
                        <div className="bg-white border border-stone-100 rounded-2xl p-6 text-sm text-stone-500">
                            No pets registered yet.
                        </div>
                    )}
                </aside>

                {/* Pet Details Main View */}
                {activePet && (
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
                                        <div className="absolute inset-0 flex items-center justify-center bg-emerald-50">
                                            <PawPrint className="h-14 w-14 text-emerald-500" />
                                        </div>
                                    </div>
                                    <div className="flex-grow space-y-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-4xl font-display font-bold text-stone-900">{activePet.name}</h2>
                                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {activePet.species}
                      </span>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Breed</p>
                                                <p className="text-sm font-medium text-stone-700">{activePet.breed || '-'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Birthday</p>
                                                <p className="text-sm font-medium text-stone-700">{activePet.birthDate || '-'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Microchip</p>
                                                <p className="text-sm font-medium text-stone-700">{activePet.microchipNumber || '-'}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 pt-2">
                                            <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                                                <Hash className="h-3 w-3" /> {activePet.gender}
                                            </span>
                                            {activePet.color && (
                                                <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                                                    <Hash className="h-3 w-3" /> {activePet.color}
                                                </span>
                                            )}
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
                                        <span className="text-xs font-medium text-stone-400">API data</span>
                                    </div>
                                    {activeWeightData.length > 0 ? (
                                        <div className="h-48 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={activeWeightData}>
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
                                    ) : (
                                        <div className="h-48 w-full rounded-2xl border border-dashed border-stone-200 bg-stone-50 flex items-center justify-center px-6 text-center">
                                            <p className="text-sm text-stone-500">
                                                Weight history is not available in the API yet.
                                            </p>
                                        </div>
                                    )}
                                    <div className="pt-4 border-t border-stone-50 flex justify-between items-center">
                                        <p className="text-sm text-stone-500">Current Weight</p>
                                        <p className="text-lg font-bold text-stone-900">{activePet.weight ? `${activePet.weight} kg` : '-'}</p>
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
                                            <p className="text-sm text-stone-400 italic">No allergy data in API.</p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-5 w-5 text-blue-600" />
                                            <h3 className="font-bold text-stone-900">Medical Notes</h3>
                                        </div>
                                        <p className="text-sm text-stone-600 leading-relaxed">
                                            {activePet.notes || 'No medical notes yet.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
                )}
            </div>
        </div>
    );
}
