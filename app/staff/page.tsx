'use client';

import { useAuthStore } from '../../store/use-auth-store';
import { Calendar, Users, Clock, Check, X, ChevronRight, AlertCircle, TrendingUp, Search, Package, Microscope } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function StaffDashboard() {
    const { user } = useAuthStore();

    const stats = [
        { name: 'Today\'s Visits', value: '12', icon: Calendar, color: 'bg-blue-100 text-blue-600' },
        { name: 'Active Patients', value: '842', icon: Users, color: 'bg-emerald-100 text-emerald-600' },
        { name: 'Pending Orders', value: '5', icon: Package, color: 'bg-amber-100 text-amber-600' },
        { name: 'Lab Results', value: '8', icon: Microscope, color: 'bg-purple-100 text-purple-600' },
    ];

    const todaySchedule = [
        { id: '1', time: '09:00 AM', pet: 'Buddy', owner: 'John Doe', service: 'Vaccination', status: 'In Progress' },
        { id: '2', time: '10:30 AM', pet: 'Luna', owner: 'Jane Smith', service: 'Checkup', status: 'Waiting' },
        { id: '3', time: '11:45 AM', pet: 'Max', owner: 'Robert Brown', service: 'Surgery', status: 'Upcoming' },
    ];

    const pendingRequests = [
        { id: '4', pet: 'Bella', owner: 'Sarah Wilson', service: 'Dental Cleaning', date: 'May 18', time: '02:00 PM' },
    ];

    return (
        <div className="space-y-10">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">Staff Overview</h1>
                    <p className="text-slate-500">Welcome back, {user?.name}. Here&apos;s the clinic status for today.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search patients or records..."
                        className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
                    />
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.name}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Today's Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900">Today&apos;s Schedule</h2>
                        <Link href="/staff/schedule" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center gap-1">
                            Full Calendar <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest"></th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                {todaySchedule.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-slate-900">{item.time}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900">{item.pet}</span>
                                                <span className="text-xs text-slate-400">{item.owner}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600">{item.service}</span>
                                        </td>
                                        <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                item.status === 'Waiting' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.status}
                        </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-300 hover:text-blue-600 transition-colors">
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pending Requests */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">New Requests</h2>
                    <div className="space-y-4">
                        {pendingRequests.map((req) => (
                            <div key={req.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-xl">
                                            <Calendar className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{req.pet}</h4>
                                            <p className="text-xs text-slate-500">{req.owner}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{req.service}</p>
                                    <p className="text-sm text-slate-700">{req.date} at {req.time}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
                                        <Check className="h-4 w-4" /> Approve
                                    </button>
                                    <button className="flex items-center justify-center gap-2 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
                                        <X className="h-4 w-4" /> Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                        {pendingRequests.length === 0 && (
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center">
                                <p className="text-slate-400 text-sm italic">No pending requests</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
