'use client';

import { useState } from 'react';
import { Microscope, Plus, Search, X, Check, FileText, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockLabTests } from '../../../lib/mock-data';
import { useNotificationStore } from '../../../store/use-notification-store';

export default function LabOrdersPage() {
    const [showForm, setShowForm] = useState(false);
    const addNotification = useNotificationStore(state => state.addNotification);

    const orders = [
        { id: 'o1', patient: 'Buddy', test: 'Complete Blood Count', date: '2024-05-14', status: 'Pending', priority: 'Normal' },
        { id: 'o2', patient: 'Luna', test: 'X-Ray (Chest)', date: '2024-05-14', status: 'In Progress', priority: 'High' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addNotification({ message: 'Lab order submitted successfully', type: 'success' });
        setShowForm(false);
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">Lab Orders</h1>
                    <p className="text-slate-500">Order and track diagnostic tests for your patients.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                    <Plus className="h-5 w-5" />
                    New Lab Order
                </button>
            </header>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Test Type</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <span className="text-sm font-bold text-slate-900">{o.patient}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm text-slate-600">{o.test}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm text-slate-500">{o.date}</span>
                            </td>
                            <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      o.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {o.priority}
                  </span>
                            </td>
                            <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      o.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {o.status}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowForm(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
                        >
                            <div className="p-8 sm:p-12">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-display font-bold text-slate-900">New Lab Order</h2>
                                    <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                        <X className="h-6 w-6 text-slate-400" />
                                    </button>
                                </div>

                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Select Patient</label>
                                            <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                                <option>Buddy (Golden Retriever)</option>
                                                <option>Luna (Siamese)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
                                            <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                                <option>Normal</option>
                                                <option>High</option>
                                                <option>Urgent</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Test Type</label>
                                            <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                                {mockLabTests.map(t => (
                                                    <option key={t.id} value={t.id}>{t.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Clinical Reason / Notes</label>
                                            <textarea rows={4} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" placeholder="Explain why this test is needed..."></textarea>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                                        >
                                            Submit Order
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
