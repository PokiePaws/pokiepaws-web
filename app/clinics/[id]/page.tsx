'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Star, Clock, ChevronLeft, Calendar, ShieldCheck, Users, Heart } from 'lucide-react';
import Navbar from '../../../components/navbar';
import { mockClinics } from '../../../lib/mock-data';

export default function ClinicDetailPage() {
    const params = useParams();
    const clinic = mockClinics.find(c => c.id === params.id);

    if (!clinic) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold">Clinic not found</h1>
                    <Link href="/clinics" className="text-blue-600 hover:underline mt-4 inline-block">Back to catalog</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main>
                {/* Hero Banner */}
                <div className="h-[40vh] relative">
                    <Image
                        src={clinic.image}
                        alt={clinic.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                        <div className="max-w-7xl mx-auto">
                            <Link href="/clinics" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                                <ChevronLeft className="h-4 w-4" /> Back to Clinics
                            </Link>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-widest mb-2">
                                        <MapPin className="h-4 w-4" />
                                        {clinic.city}
                                    </div>
                                    <h1 className="text-4xl lg:text-6xl font-display font-bold text-white">{clinic.name}</h1>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 text-white">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                            <span className="text-xl font-bold">{clinic.rating}</span>
                                        </div>
                                        <p className="text-xs text-white/60">Clinic Rating</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-12">
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">About the Clinic</h2>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    {clinic.description} We are committed to providing the highest quality care for your pets. Our team of experienced veterinarians and support staff work together to ensure your pet stays healthy and happy.
                                </p>
                            </section>

                            <section className="grid sm:grid-cols-2 gap-8">
                                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                                    <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center">
                                        <ShieldCheck className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-xl">Accredited Care</h3>
                                    <p className="text-slate-500 text-sm">Our facility is fully accredited and follows international standards for veterinary medicine.</p>
                                </div>
                                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                                    <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-xl">Expert Team</h3>
                                    <p className="text-slate-500 text-sm">Our veterinarians are specialists in various fields, from surgery to internal medicine.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Specialists</h2>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center space-y-4">
                                            <div className="w-20 h-20 rounded-full bg-slate-100 mx-auto relative overflow-hidden">
                                                <Image src={`https://picsum.photos/seed/doc${i}/200/200`} alt="Doctor" fill className="object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">Dr. Jane Smith</h4>
                                                <p className="text-xs text-slate-500">Senior Veterinarian</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar / Booking */}
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl sticky top-24">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">Book Visit</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                                        <div>
                                            <p className="font-bold text-slate-900">Address</p>
                                            <p className="text-sm text-slate-500">{clinic.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Phone className="h-5 w-5 text-blue-600 mt-1" />
                                        <div>
                                            <p className="font-bold text-slate-900">Phone</p>
                                            <p className="text-sm text-slate-500">{clinic.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Clock className="h-5 w-5 text-blue-600 mt-1" />
                                        <div>
                                            <p className="font-bold text-slate-900">Opening Hours</p>
                                            <p className="text-sm text-slate-500">Mon-Fri: 8:00 - 20:00<br />Sat: 9:00 - 16:00</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 space-y-4">
                                    <Link
                                        href="/register"
                                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-center block hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                                    >
                                        Schedule Appointment
                                    </Link>
                                    <p className="text-center text-xs text-slate-400">
                                        Unified medical history across the network
                                    </p>
                                </div>
                            </div>

                            <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <Heart className="h-8 w-8 mb-4" />
                                    <h4 className="text-xl font-bold mb-2">Emergency?</h4>
                                    <p className="text-blue-100 text-sm mb-6">Call our 24/7 emergency line for immediate assistance.</p>
                                    <a href={`tel:${clinic.phone}`} className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm inline-block">Call Now</a>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-50" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
