'use client';

import { useAuthStore } from '@/store/use-auth-store';
import Image from 'next/image';
import { PawPrint, Calendar, Clock, ChevronRight, Plus, HeartPulse, ShieldCheck, Activity } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function DashboardPage() {
    const { user } = useAuthStore();

    const pets = [
        { id: '1', name: 'Buddy', breed: 'Golden Retriever', type: 'Dog', image: 'https://picsum.photos/seed/dog1/200/200' },
        { id: '2', name: 'Luna', breed: 'Siamese', type: 'Cat', image: 'https://picsum.photos/seed/cat1/200/200' },
    ];

    const appointments = [
        { id: '1', pet: 'Buddy', service: 'Vaccination', date: '2024-05-15', time: '10:00 AM', status: 'Confirmed' },
        { id: '2', pet: 'Luna', service: 'Dental Cleaning', date: '2024-05-20', time: '02:30 PM', status: 'Pending' },
    ];

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
                        {pets.map((pet) => (
                            <motion.div
                                key={pet.id}
                                whileHover={{ x: 5 }}
                                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl overflow-hidden relative">
                                        <Image
                                            src={pet.image}
                                            alt={pet.name}
                                            fill
                                            className="object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{pet.name}</h3>
                                        <p className="text-xs text-slate-500">{pet.breed}</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                            </motion.div>
                        ))}
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
                        {appointments.map((apt) => (
                            <div key={apt.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{apt.service}</h3>
                                        <p className="text-sm text-slate-500">for {apt.pet}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                    {apt.status}
                  </span>
                                </div>
                                <div className="flex items-center gap-6 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        <span>{apt.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-slate-400" />
                                        <span>{apt.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
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
