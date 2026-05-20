'use client';

import { useMemo, useState } from 'react';
import { format, subMonths, addMonths, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
    FileText,
    Plus,
    X,
    Pill,
    CheckCircle2,
    Clock,
    ChevronDown,
    ChevronUp,
    User,
    CalendarDays,
    Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from 'lib/utils';
import { useNotificationStore } from 'store/use-notification-store';
import { useLanguageStore } from 'store/use-language-store';
import { translations } from 'lib/translations';
import {
    useCreatePrescription,
    usePrescription,
    useVetMe,
    useClinicAnimals,
    useProducts,
    useVetVisitsRange,
} from 'lib/features/api-hooks';
import type { Visit, Product } from 'lib/features/api-schemas';

// ─── PRESCRIPTION STATUS CELL ─────────────────────────────────────────────────

function PrescriptionStatus({ visit }: { visit: Visit }) {
    const { data: prescription, isLoading, isError } = usePrescription(visit.id);

    if (isLoading) {
        return <span className="inline-flex items-center gap-1.5 text-xs text-slate-400"><Clock className="h-3 w-3" /> Sprawdzam…</span>;
    }
    if (isError || !prescription) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200">
                <Clock className="h-3 w-3" />
                Brak recepty
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Recepta #{prescription.id} &middot; {prescription.items.length} lek(i)
        </span>
    );
}

// ─── VISIT ROW ────────────────────────────────────────────────────────────────

function VisitRow({
    visit,
    animalName,
    onIssue,
}: {
    visit: Visit;
    animalName: string;
    onIssue: (visit: Visit) => void;
}) {
    const { data: prescription } = usePrescription(visit.id);
    const [open, setOpen] = useState(false);
    const hasPrescription = !!prescription;

    return (
        <div className={cn(
            'border-l-4 bg-white rounded-xl shadow-sm overflow-hidden transition-shadow hover:shadow-md',
            hasPrescription ? 'border-l-emerald-400' : 'border-l-amber-400',
        )}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full text-left px-5 py-4 flex items-center gap-4"
            >
                <span className="shrink-0 w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                    #{visit.id}
                </span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-slate-900 text-sm">{animalName}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {visit.description || visit.diagnosis || 'Wizyta'} &middot;{' '}
                        {format(parseISO(visit.startsAt), 'd MMM yyyy, HH:mm', { locale: pl })}
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <PrescriptionStatus visit={visit} />
                    {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </div>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <MetaCell icon={User} label="Pacjent" value={animalName} />
                                <MetaCell icon={CalendarDays} label="Data wizyty" value={format(parseISO(visit.startsAt), 'd MMMM yyyy, HH:mm', { locale: pl })} />
                                {visit.disease && <MetaCell icon={FileText} label="Choroba" value={visit.disease} />}
                                {visit.diagnosis && <MetaCell icon={FileText} label="Diagnoza" value={visit.diagnosis} />}
                            </div>

                            {!hasPrescription && (
                                <button
                                    onClick={() => onIssue(visit)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Wystaw receptę
                                </button>
                            )}

                            {hasPrescription && prescription && prescription.items.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Przepisane leki</p>
                                    <div className="space-y-1.5">
                                        {prescription.items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
                                                <Pill className="h-4 w-4 text-blue-400 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800">{item.productName ?? `Produkt #${item.productId}`}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {[
                                                            item.quantityPackages && `${item.quantityPackages} op.`,
                                                            item.dosage,
                                                            item.treatmentTime,
                                                        ].filter(Boolean).join(' · ')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MetaCell({ icon: Icon, label, value }: { icon: React.FC<{ className?: string }>; label: string; value: string }) {
    return (
        <div className="flex items-start gap-2">
            <Icon className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm text-slate-700 font-medium">{value}</p>
            </div>
        </div>
    );
}

// ─── PRESCRIPTION MODAL ───────────────────────────────────────────────────────

type PrescriptionItem = {
    productId: string;
    quantityPackages: string;
    dosage: string;
    treatmentTime: string;
};

const emptyItem = (): PrescriptionItem => ({
    productId: '',
    quantityPackages: '1',
    dosage: '',
    treatmentTime: '',
});

function PrescriptionModal({
    visit,
    animalName,
    products,
    onClose,
}: {
    visit: Visit;
    animalName: string;
    products: Product[];
    onClose: () => void;
}) {
    const createPrescription = useCreatePrescription();
    const addNotification = useNotificationStore((s) => s.addNotification);
    const [items, setItems] = useState<PrescriptionItem[]>([emptyItem()]);

    const INPUT = 'w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all';
    const LABEL = 'block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5';

    const updateItem = (idx: number, field: keyof PrescriptionItem, value: string) => {
        setItems((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
    };

    const addItem = () => setItems((prev) => [...prev, emptyItem()]);
    const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validItems = items.filter((i) => i.productId);
        if (validItems.length === 0) return;

        try {
            await createPrescription.mutateAsync({
                visitId: visit.id,
                payload: {
                    recommendationDate: format(new Date(), 'yyyy-MM-dd'),
                    items: validItems.map((i) => ({
                        productId: Number(i.productId),
                        quantityPackages: Number(i.quantityPackages) || 1,
                        dosage: i.dosage || undefined,
                        treatmentTime: i.treatmentTime || undefined,
                    })),
                },
            });
            addNotification({ message: 'Recepta wystawiona pomyślnie', type: 'success' });
            onClose();
        } catch {
            addNotification({ message: 'Błąd wystawiania recepty', type: 'error' });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
            >
                {/* header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Nowa recepta</h2>
                            <p className="text-xs text-slate-500">
                                Wizyta #{visit.id} &middot; <span className="font-medium text-slate-700">{animalName}</span>
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {/* items */}
                        {items.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Pill className="h-3.5 w-3.5" />
                                        Lek {idx + 1}
                                    </span>
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(idx)}
                                            className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                {/* product select */}
                                <div>
                                    <label className={LABEL}>Nazwa leku *</label>
                                    <select
                                        required
                                        value={item.productId}
                                        onChange={(e) => updateItem(idx, 'productId', e.target.value)}
                                        className={INPUT}
                                    >
                                        <option value="">— Wybierz lek —</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}{p.unit ? ` (${p.unit})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className={LABEL}>Ilość opakowań</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantityPackages}
                                            onChange={(e) => updateItem(idx, 'quantityPackages', e.target.value)}
                                            className={INPUT}
                                        />
                                    </div>
                                    <div>
                                        <label className={LABEL}>Dawkowanie</label>
                                        <input
                                            value={item.dosage}
                                            onChange={(e) => updateItem(idx, 'dosage', e.target.value)}
                                            placeholder="np. 2×1 tabletka"
                                            className={INPUT}
                                        />
                                    </div>
                                    <div>
                                        <label className={LABEL}>Czas leczenia</label>
                                        <input
                                            value={item.treatmentTime}
                                            onChange={(e) => updateItem(idx, 'treatmentTime', e.target.value)}
                                            placeholder="np. 7 dni"
                                            className={INPUT}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* add another medication */}
                        <button
                            type="button"
                            onClick={addItem}
                            className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Dodaj kolejny lek
                        </button>
                    </div>

                    {/* footer actions */}
                    <div className="flex gap-3 px-6 py-4 border-t border-slate-100 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                        >
                            Anuluj
                        </button>
                        <button
                            type="submit"
                            disabled={createPrescription.isPending}
                            className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-60 shadow-lg shadow-blue-100"
                        >
                            {createPrescription.isPending ? 'Wystawianie…' : 'Wystaw receptę'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function PrescriptionsPage() {
    const { language } = useLanguageStore();
    const t = translations[language];

    const from = format(subMonths(new Date(), 6), 'yyyy-MM-dd');
    const to = format(addMonths(new Date(), 6), 'yyyy-MM-dd');

    const { data: vetMe } = useVetMe();
    const { data: visits = [], isLoading } = useVetVisitsRange(from, to);
    const { data: animals = [] } = useClinicAnimals(vetMe?.clinicId ?? undefined);
    const { data: products = [] } = useProducts();

    const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

    // map animalId → name for quick lookup
    const animalNameMap = useMemo(() => {
        const map = new Map<number, string>();
        animals.forEach((a) => map.set(a.id, a.name));
        return map;
    }, [animals]);

    const candidates = useMemo(
        () => visits.filter((v) => v.status !== 'CANCELLED'),
        [visits],
    );

    const getAnimalName = (animalId: number) =>
        animalNameMap.get(animalId) ?? `Pacjent #${animalId}`;


    return (
        <div className="space-y-6">
            {/* header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">{t.prescriptions.title}</h1>
                    <p className="text-slate-500 mt-1">{t.prescriptions.subtitle}</p>
                </div>
            </div>

            {/* summary */}
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border bg-blue-50 border-blue-100 p-4 flex items-center gap-4">
                    <FileText className="h-6 w-6 text-blue-500 shrink-0" />
                    <div>
                        <p className="text-2xl font-bold text-blue-700">{candidates.length}</p>
                        <p className="text-xs font-medium text-blue-600 opacity-75">Wizyty w systemie</p>
                    </div>
                </div>
                <div className="rounded-2xl border bg-emerald-50 border-emerald-100 p-4 flex items-center gap-4">
                    <Package className="h-6 w-6 text-emerald-500 shrink-0" />
                    <div>
                        <p className="text-2xl font-bold text-emerald-700">{products.length}</p>
                        <p className="text-xs font-medium text-emerald-600 opacity-75">Dostępne leki</p>
                    </div>
                </div>
            </div>

            {/* visits accordion list */}
            {isLoading ? (
                <div className="py-20 text-center text-slate-400">Ładowanie wizyt…</div>
            ) : candidates.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-slate-100">
                    <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <FileText className="h-7 w-7 text-slate-400" />
                    </div>
                    <p className="font-semibold text-slate-700">Brak wizyt</p>
                    <p className="text-sm text-slate-400 mt-1">Nie znaleziono wizyt w wybranym zakresie dat.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {candidates.map((visit) => (
                        <VisitRow
                            key={visit.id}
                            visit={visit}
                            animalName={getAnimalName(visit.animalId)}
                            onIssue={setSelectedVisit}
                        />
                    ))}
                </div>
            )}

            {/* prescription modal */}
            <AnimatePresence>
                {selectedVisit && (
                    <PrescriptionModal
                        visit={selectedVisit}
                        animalName={getAnimalName(selectedVisit.animalId)}
                        products={products}
                        onClose={() => setSelectedVisit(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
