'use client';

import { useMemo, useState } from 'react';
import { format, subMonths, addMonths, parseISO } from 'date-fns';
import { FileText, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguageStore } from '../../../store/use-language-store';
import { translations } from '../../../lib/translations';
import { useNotificationStore } from '../../../store/use-notification-store';
import {
    useCreatePrescription,
    usePrescription,
    useVetVisitsRange,
} from '../../../lib/features/api-hooks';
import type { Visit } from '../../../lib/features/api-schemas';

function PrescriptionStatus({ visit }: { visit: Visit }) {
    const { data: prescription, isLoading, isError } = usePrescription(visit.id);

    if (isLoading) return <span className="text-xs text-slate-400">Checking...</span>;
    if (isError || !prescription) return <span className="text-xs font-bold text-amber-600">No prescription</span>;

    return (
        <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-600">Prescription #{prescription.id}</span>
            <p className="text-xs text-slate-500">{prescription.items.length} item(s)</p>
        </div>
    );
}

export default function PrescriptionsPage() {
    const { language } = useLanguageStore();
    const t = translations[language];
    const addNotification = useNotificationStore((state) => state.addNotification);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        visitId: '',
        productId: '',
        quantityPackages: '1',
        dosage: '',
        treatmentTime: '',
    });

    const from = format(subMonths(new Date(), 6), 'yyyy-MM-dd');
    const to = format(addMonths(new Date(), 6), 'yyyy-MM-dd');
    const { data: visits = [], isLoading } = useVetVisitsRange(from, to);
    const createPrescription = useCreatePrescription();

    const prescriptionCandidates = useMemo(
        () => visits.filter((visit) => visit.status !== 'CANCELLED'),
        [visits],
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createPrescription.mutateAsync({
            visitId: Number(formData.visitId),
            payload: {
                recommendationDate: format(new Date(), 'yyyy-MM-dd'),
                items: [
                    {
                        productId: Number(formData.productId),
                        quantityPackages: Number(formData.quantityPackages) || 1,
                        dosage: formData.dosage || undefined,
                        treatmentTime: formData.treatmentTime || undefined,
                    },
                ],
            },
        });

        addNotification({ message: t.prescriptions.successNotification, type: 'success' });
        setShowForm(false);
        setFormData({ visitId: '', productId: '', quantityPackages: '1', dosage: '', treatmentTime: '' });
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">{t.prescriptions.title}</h1>
                    <p className="text-slate-500">{t.prescriptions.subtitle}</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                    <Plus className="h-5 w-5" />
                    {t.prescriptions.newPrescription}
                </button>
            </header>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visit</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.prescriptions.table.patient}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.prescriptions.table.date}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.prescriptions.table.status}</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {prescriptionCandidates.map((visit) => (
                        <tr key={visit.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <span className="text-sm font-bold text-slate-900">#{visit.id}</span>
                                <p className="text-xs text-slate-500">{visit.description || visit.diagnosis || 'Visit'}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">Patient #{visit.animalId}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">{format(parseISO(visit.startsAt), 'yyyy-MM-dd HH:mm')}</td>
                            <td className="px-6 py-4"><PrescriptionStatus visit={visit} /></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {!isLoading && prescriptionCandidates.length === 0 && (
                    <div className="p-10 text-center text-slate-500">No visits available for prescriptions.</div>
                )}
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
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-6 w-6 text-blue-600" />
                                        <h2 className="text-2xl font-display font-bold text-slate-900">{t.prescriptions.newPrescription}</h2>
                                    </div>
                                    <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                        <X className="h-6 w-6 text-slate-400" />
                                    </button>
                                </div>

                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Visit</label>
                                            <select
                                                required
                                                value={formData.visitId}
                                                onChange={(e) => setFormData({ ...formData, visitId: e.target.value })}
                                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            >
                                                <option value="">Select visit</option>
                                                {prescriptionCandidates.map((visit) => (
                                                    <option key={visit.id} value={visit.id}>
                                                        #{visit.id} - Patient #{visit.animalId} - {format(parseISO(visit.startsAt), 'yyyy-MM-dd HH:mm')}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Product ID</label>
                                            <input
                                                required
                                                type="number"
                                                min="1"
                                                value={formData.productId}
                                                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-3 gap-6">
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.quantityPackages}
                                            onChange={(e) => setFormData({ ...formData, quantityPackages: e.target.value })}
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="Packages"
                                        />
                                        <input
                                            value={formData.dosage}
                                            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder={t.prescriptions.form.dosage}
                                        />
                                        <input
                                            value={formData.treatmentTime}
                                            onChange={(e) => setFormData({ ...formData, treatmentTime: e.target.value })}
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="Treatment time"
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                                        >
                                            {t.prescriptions.form.cancel}
                                        </button>
                                        <button
                                            disabled={createPrescription.isPending}
                                            type="submit"
                                            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-60"
                                        >
                                            {t.prescriptions.form.submit}
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
