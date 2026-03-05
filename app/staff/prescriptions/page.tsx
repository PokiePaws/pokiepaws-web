'use client';

import { useState } from 'react';
import { useAuthStore } from '../../../store/use-auth-store';
import { ClipboardList, Plus, Search, User, PawPrint, Pill, Calendar, Clock, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockMedicines, mockDiagnoses } from '../../../lib/mock-data';
import { useNotificationStore } from '../../../store/use-notification-store';

export default function PrescriptionsPage() {
    const [showForm, setShowForm] = useState(false);
    const { user } = useAuthStore();
    const addNotification = useNotificationStore(state => state.addNotification);

    const [formData, setFormData] = useState({
        patientId: '1',
        diagnosisCode: '',
        medicineId: '',
        dosage: '',
        frequency: '',
        notes: ''
    });

    const prescriptions = [
        { id: 'p1', patient: 'Buddy', medicine: 'Amoxicillin', dosage: '250mg', frequency: '2x daily', date: '2024-05-10', status: 'Active' },
        { id: 'p2', patient: 'Luna', medicine: 'Carprofen', dosage: '20mg', frequency: '1x daily', date: '2024-05-12', status: 'Active' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addNotification({ message: 'Prescription issued successfully', type: 'success' });
        setShowForm(false);
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">Prescriptions</h1>
                    <p className="text-slate-500">Issue and manage medications for your patients.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                    <Plus className="h-5 w-5" />
                    New Prescription
                </button>
            </header>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medication</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dosage</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {prescriptions.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <span className="text-sm font-bold text-slate-900">{p.patient}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm text-slate-600">{p.medicine}</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-sm text-slate-900">{p.dosage}</span>
                                    <span className="text-xs text-slate-400">{p.frequency}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm text-slate-500">{p.date}</span>
                            </td>
                            <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    {p.status}
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
                                    <h2 className="text-2xl font-display font-bold text-slate-900">New Prescription</h2>
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
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Diagnosis (ICD Code)</label>
                                            <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                                {mockDiagnoses.map(d => (
                                                    <option key={d.code} value={d.code}>{d.code} - {d.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Medication</label>
                                                <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                                    {mockMedicines.map(m => (
                                                        <option key={m.id} value={m.id}>{m.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Dosage</label>
                                                <input type="text" placeholder="e.g. 250mg" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Frequency & Instructions</label>
                                            <input type="text" placeholder="e.g. 2x daily after food" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Examination Notes / Diagnosis Description</label>
                                            <textarea rows={4} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" placeholder="Describe the symptoms and diagnosis details..."></textarea>
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
                                            Issue Prescription
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
