'use client';

import Navbar from '../../components/navbar';
import { HeartPulse, ShieldCheck, Star, Activity, Microscope, Scissors, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
    const services = [
        {
            title: 'Preventative Care',
            description: 'Regular checkups, vaccinations, and parasite prevention to keep your pet healthy.',
            icon: ShieldCheck,
            details: ['Annual Wellness Exams', 'Vaccination Programs', 'Flea & Tick Prevention', 'Heartworm Testing'],
            color: 'bg-emerald-50 text-emerald-600',
        },
        {
            title: 'Internal Medicine',
            description: 'Diagnosis and treatment of complex medical conditions using advanced technology.',
            icon: HeartPulse,
            details: ['Cardiology', 'Endocrinology', 'Gastroenterology', 'Oncology'],
            color: 'bg-rose-50 text-rose-600',
        },
        {
            title: 'Surgery & Orthopedics',
            description: 'Safe surgical procedures ranging from routine spay/neuter to complex orthopedic repairs.',
            icon: Scissors,
            details: ['Soft Tissue Surgery', 'Orthopedic Procedures', 'Laser Surgery', 'Anesthesia Monitoring'],
            color: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'Diagnostics & Lab',
            description: 'In-house laboratory and imaging for fast and accurate diagnosis.',
            icon: Microscope,
            details: ['Digital X-Ray', 'Ultrasound', 'Blood Analysis', 'Urinalysis'],
            color: 'bg-purple-50 text-purple-600',
        },
        {
            title: 'Dental Health',
            description: 'Professional dental cleaning and oral surgery to prevent periodontal disease.',
            icon: Star,
            details: ['Dental Prophylaxis', 'Oral Surgery', 'Digital Dental X-Ray', 'Home Care Education'],
            color: 'bg-amber-50 text-amber-600',
        },
        {
            title: 'Emergency Care',
            description: 'Immediate medical attention for urgent and life-threatening situations.',
            icon: Activity,
            details: ['Triage & Stabilization', 'Critical Care Monitoring', 'Emergency Surgery', 'Oxygen Therapy'],
            color: 'bg-red-50 text-red-600',
        },
    ];

    return (
        <div className="min-h-screen bg-stone-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <header className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-5xl font-display font-bold text-stone-900 mb-6">Our Services</h1>
                    <p className="text-lg text-stone-600">We provide a comprehensive range of veterinary services tailored to your pet&apos;s unique needs.</p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, idx) => (
                        <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className={`${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                <service.icon className="h-8 w-8" />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-stone-900 mb-4">{service.title}</h2>
                            <p className="text-stone-500 mb-8 leading-relaxed">{service.description}</p>

                            <ul className="space-y-3 mb-10">
                                {service.details.map((detail, dIdx) => (
                                    <li key={dIdx} className="flex items-center gap-3 text-sm text-stone-600 font-medium">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        {detail}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all"
                            >
                                Book this service <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
