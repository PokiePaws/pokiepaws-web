'use client';

import { useAuthStore } from '../../store/use-auth-store';
import { PawPrint, Calendar, Clock, ChevronRight, Plus, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useAnimals, useOwnerUpcomingVisits } from '../../lib/features/api-hooks';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { data: pets = [], isLoading: petsLoading } = useAnimals();
    const { data: appointments = [], isLoading: visitsLoading } = useOwnerUpcomingVisits();
    const petNameById = new Map(pets.map((pet) => [pet.id, pet.name]));

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-display font-bold text-slate-900">Welcome back, {user?.name}!</h1>
                <p className="text-slate-500">Here&apos;s what&apos;s happening with your pets today.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-2xl">
                        <PawPrint className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{pets.length}</p>
                        <p className="text-sm text-slate-500">Registered Pets</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-2xl">
                        <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{appointments.length}</p>
                        <p className="text-sm text-slate-500">Upcoming Visits</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-amber-100 p-3 rounded-2xl">
                        <HeartPulse className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">Healthy</p>
                        <p className="text-sm text-slate-500">Pet Status</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Pets Section */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900">My Pets</h2>
                        <Link href="/dashboard/pets" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center gap-1">
                            View all <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {pets.slice(0, 4).map((pet) => (
                            <motion.div
                                key={pet.id}
                                whileHover={{ x: 5 }}
                                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                        <PawPrint className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{pet.name}</h3>
                                        <p className="text-xs text-slate-500">{pet.breed || pet.species}</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                            </motion.div>
                        ))}
                        {!petsLoading && pets.length === 0 && (
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-sm text-slate-500">
                                No pets registered yet.
                            </div>
                        )}
                        <Link
                            href="/dashboard/pets/add"
                            className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        >
                            <Plus className="h-5 w-5" />
                            <span className="font-medium">Add New Pet</span>
                        </Link>
                    </div>
                </section>

                {/* Appointments Section */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900">Upcoming Appointments</h2>
                        <Link href="/dashboard/appointments" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center gap-1">
                            View all <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {appointments.slice(0, 4).map((apt) => {
                            const startsAt = new Date(apt.startsAt);

                            return (
                            <div key={apt.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{apt.description || 'Veterinary visit'}</h3>
                                        <p className="text-sm text-slate-500">for {petNameById.get(apt.animalId) || `Pet #${apt.animalId}`}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        apt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                    {apt.status}
                  </span>
                                </div>
                                <div className="flex items-center gap-6 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        <span>{startsAt.toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-slate-400" />
                                        <span>{startsAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                        {!visitsLoading && appointments.length === 0 && (
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-sm text-slate-500">
                                No upcoming appointments.
                            </div>
                        )}
                        <Link
                            href="/dashboard/appointments/book"
                            className="flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                        >
                            <Calendar className="h-5 w-5" />
                            <span>Book New Appointment</span>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
