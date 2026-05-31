'use client';

import { useMemo, useState } from 'react';
import { format, subMonths, addMonths, parseISO, differenceInYears, differenceInMonths } from 'date-fns';
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
    Search,
    Filter,
    PawPrint,
    Calendar,
    Weight,
    Cpu,
    FlaskConical,
    Activity,
    XCircle,
    Stethoscope,
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
    useLabOrdersByAnimal,
} from 'lib/features/api-hooks';
import type { Visit, Product, Animal } from 'lib/features/api-schemas';

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────

function patientAge(birthDate?: string | null): string {
    if (!birthDate) return '—';
    const birth = parseISO(birthDate);
    const years = differenceInYears(new Date(), birth);
    if (years >= 1) return `${years} ${years === 1 ? 'rok' : years < 5 ? 'lata' : 'lat'}`;
    const months = differenceInMonths(new Date(), birth);
    return `${months} mies.`;
}

const GENDER_LABEL: Record<string, string> = {
    MALE: 'Samiec',
    FEMALE: 'Samica',
    HERMAPHRODITE: 'Obojniak',
};

const STATUS_CONFIG = {
    SCHEDULED:   { label: 'Zaplanowana',  icon: Clock,         color: 'text-amber-600 bg-amber-50 border-amber-200' },
    CONFIRMED:   { label: 'Potwierdzona', icon: CheckCircle2,   color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    IN_PROGRESS: { label: 'W trakcie',    icon: Activity,       color: 'text-blue-600 bg-blue-50 border-blue-200' },
    DONE:        { label: 'Zakończona',   icon: CheckCircle2,   color: 'text-slate-600 bg-slate-50 border-slate-200' },
    CANCELLED:   { label: 'Anulowana',    icon: XCircle,        color: 'text-red-500 bg-red-50 border-red-200' },
} as const;

// ─── PRESCRIPTIONS TAB ────────────────────────────────────────────────────────

function PrescriptionStatus({ visit }: { visit: Visit }) {
    const { data: prescription, isLoading, isError } = usePrescription(visit.id);
    if (isLoading) return (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-3 w-3" /> Sprawdzam…
        </span>
    );
    if (isError || !prescription) return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="h-3 w-3" /> Brak recepty
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Recepta #{prescription.id} &middot; {prescription.items.length} lek(i)
        </span>
    );
}

function VisitRow({ visit, animalName, onIssue }: {
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
            <button onClick={() => setOpen((v) => !v)} className="w-full text-left px-5 py-4 flex items-center gap-4">
                <span className="shrink-0 w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                    #{visit.id}
                </span>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{animalName}</p>
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
                                {visit.disease   && <MetaCell icon={FileText} label="Choroba"  value={visit.disease} />}
                                {visit.diagnosis && <MetaCell icon={FileText} label="Diagnoza" value={visit.diagnosis} />}
                            </div>

                            {!hasPrescription && (
                                <button
                                    onClick={() => onIssue(visit)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                                >
                                    <Plus className="h-3.5 w-3.5" /> Wystaw receptę
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
                                                        {[item.quantityPackages && `${item.quantityPackages} op.`, item.dosage, item.treatmentTime].filter(Boolean).join(' · ')}
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

type PrescriptionItem = { productId: string; quantityPackages: string; dosage: string; treatmentTime: string; };
const emptyItem = (): PrescriptionItem => ({ productId: '', quantityPackages: '1', dosage: '', treatmentTime: '' });

function PrescriptionModal({ visit, animalName, products, onClose }: {
    visit: Visit; animalName: string; products: Product[]; onClose: () => void;
}) {
    const createPrescription = useCreatePrescription();
    const addNotification = useNotificationStore((s) => s.addNotification);
    const [items, setItems] = useState<PrescriptionItem[]>([emptyItem()]);

    const INPUT = 'w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all';
    const LABEL = 'block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5';

    const updateItem = (idx: number, field: keyof PrescriptionItem, value: string) =>
        setItems((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));

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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Nowa recepta</h2>
                            <p className="text-xs text-slate-500">Wizyta #{visit.id} &middot; <span className="font-medium text-slate-700">{animalName}</span></p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {items.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Pill className="h-3.5 w-3.5" /> Lek {idx + 1}
                                    </span>
                                    {items.length > 1 && (
                                        <button type="button" onClick={() => setItems((p) => p.filter((_, i) => i !== idx))}
                                            className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <div>
                                    <label className={LABEL}>Nazwa leku *</label>
                                    <select required value={item.productId} onChange={(e) => updateItem(idx, 'productId', e.target.value)} className={INPUT}>
                                        <option value="">— Wybierz lek —</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name}{p.unit ? ` (${p.unit})` : ''}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className={LABEL}>Ilość opakowań</label>
                                        <input type="number" min="1" value={item.quantityPackages}
                                            onChange={(e) => updateItem(idx, 'quantityPackages', e.target.value)} className={INPUT} />
                                    </div>
                                    <div>
                                        <label className={LABEL}>Dawkowanie</label>
                                        <input value={item.dosage} onChange={(e) => updateItem(idx, 'dosage', e.target.value)}
                                            placeholder="np. 2×1 tabletka" className={INPUT} />
                                    </div>
                                    <div>
                                        <label className={LABEL}>Czas leczenia</label>
                                        <input value={item.treatmentTime} onChange={(e) => updateItem(idx, 'treatmentTime', e.target.value)}
                                            placeholder="np. 7 dni" className={INPUT} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={() => setItems((p) => [...p, emptyItem()])}
                            className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                            <Plus className="h-4 w-4" /> Dodaj kolejny lek
                        </button>
                    </div>
                    <div className="flex gap-3 px-6 py-4 border-t border-slate-100 shrink-0">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                            Anuluj
                        </button>
                        <button type="submit" disabled={createPrescription.isPending}
                            className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-60 shadow-lg shadow-blue-100">
                            {createPrescription.isPending ? 'Wystawianie…' : 'Wystaw receptę'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

// ─── KARTOTEKA TAB ────────────────────────────────────────────────────────────

function VisitEntry({ visit }: { visit: Visit }) {
    const [open, setOpen] = useState(false);
    const { data: prescription } = usePrescription(visit.id);
    const cfg = STATUS_CONFIG[visit.status] ?? STATUS_CONFIG.SCHEDULED;
    const Icon = cfg.icon;
    const hasMedical = visit.disease || visit.diagnosis || visit.recommendations;

    return (
        <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
            <button onClick={() => setOpen((v) => !v)}
                className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="shrink-0 w-14 text-center">
                    <p className="text-lg font-bold text-slate-900 leading-none">{format(parseISO(visit.startsAt), 'd')}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{format(parseISO(visit.startsAt), 'MMM yyyy', { locale: pl })}</p>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{visit.description || visit.diagnosis || visit.disease || 'Wizyta'}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {format(parseISO(visit.startsAt), 'HH:mm')}
                        {prescription && ` · recepta #${prescription.id}`}
                    </p>
                </div>
                <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border shrink-0', cfg.color)}>
                    <Icon className="h-3 w-3" />{cfg.label}
                </span>
                {open ? <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />}
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18, ease: 'easeInOut' }} className="overflow-hidden">
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4">
                            {hasMedical ? (
                                <div className="grid md:grid-cols-3 gap-3">
                                    {visit.disease        && <MedCell label="Choroba"   value={visit.disease} />}
                                    {visit.diagnosis      && <MedCell label="Diagnoza"  value={visit.diagnosis} />}
                                    {visit.recommendations && <MedCell label="Zalecenia" value={visit.recommendations} />}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 italic">Brak danych klinicznych.</p>
                            )}
                            {prescription && prescription.items.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Recepta #{prescription.id}</p>
                                    <div className="space-y-1.5">
                                        {prescription.items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-2.5 border border-blue-100">
                                                <Pill className="h-4 w-4 text-blue-400 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800">{item.productName ?? `Produkt #${item.productId}`}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {[item.quantityPackages && `${item.quantityPackages} op.`, item.dosage, item.treatmentTime].filter(Boolean).join(' · ')}
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

function MedCell({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-sm text-slate-700">{value}</p>
        </div>
    );
}

function MetricCell({ icon: Icon, label, value }: { icon: React.FC<{ className?: string }>; label: string; value: string }) {
    return (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
            <Icon className="h-4 w-4 text-slate-400 mx-auto mb-1" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5 truncate">{value}</p>
        </div>
    );
}

function MedicalRecordPanel({ animal, visits, onClose }: { animal: Animal; visits: Visit[]; onClose: () => void }) {
    const [tab, setTab] = useState<'visits' | 'lab'>('visits');
    const { data: labOrders = [] } = useLabOrdersByAnimal(animal.id);

    const animalVisits = useMemo(
        () => [...visits].filter((v) => v.animalId === animal.id).sort((a, b) => b.startsAt.localeCompare(a.startsAt)),
        [visits, animal.id],
    );

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl bg-white shadow-2xl flex flex-col"
            >
                <div className="shrink-0 px-6 py-5 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                        <PawPrint className="h-7 w-7 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-slate-900 truncate">{animal.name}</h2>
                        <p className="text-sm text-slate-500">
                            {animal.species}{animal.breed ? ` · ${animal.breed}` : ''} · {GENDER_LABEL[animal.gender] ?? animal.gender}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-200 transition-colors shrink-0">
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                <div className="shrink-0 px-6 py-4 grid grid-cols-4 gap-3 border-b border-slate-100">
                    <MetricCell icon={Calendar}    label="Wiek"       value={patientAge(animal.birthDate)} />
                    <MetricCell icon={Weight}      label="Masa ciała" value={animal.weight ? `${animal.weight} kg` : '—'} />
                    <MetricCell icon={Cpu}         label="Chip"       value={animal.microchipNumber ?? '—'} />
                    <MetricCell icon={Stethoscope} label="Wizyty"     value={String(animalVisits.length)} />
                </div>

                {animal.notes && (
                    <div className="shrink-0 mx-6 mt-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800">
                        <span className="font-semibold">Uwagi: </span>{animal.notes}
                    </div>
                )}

                <div className="shrink-0 flex gap-1 px-6 pt-4 pb-0">
                    {(['visits', 'lab'] as const).map((t) => (
                        <button key={t} onClick={() => setTab(t)}
                            className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border',
                                tab === t ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300')}>
                            {t === 'visits' ? <><FileText className="h-4 w-4" /> Historia wizyt ({animalVisits.length})</>
                                           : <><FlaskConical className="h-4 w-4" /> Zlecenia lab ({labOrders.length})</>}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                    {tab === 'visits' && (
                        animalVisits.length === 0
                            ? <EmptyState icon={FileText} text="Brak wizyt w systemie." />
                            : animalVisits.map((v) => <VisitEntry key={v.id} visit={v} />)
                    )}
                    {tab === 'lab' && (
                        labOrders.length === 0
                            ? <EmptyState icon={FlaskConical} text="Brak zleceń laboratoryjnych." />
                            : labOrders.map((order) => (
                                <div key={order.id} className="border border-slate-100 rounded-2xl px-5 py-4 bg-white space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-slate-900 text-sm">{order.testType}</p>
                                        <span className={cn('text-xs font-bold px-2.5 py-1 rounded-lg border',
                                            order.status === 'COMPLETED'  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            order.status === 'CANCELLED'  ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                            order.status === 'IN_PROGRESS'? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                             'bg-amber-50 text-amber-700 border-amber-200')}>
                                            {order.status === 'COMPLETED' ? 'Zakończone' : order.status === 'CANCELLED' ? 'Anulowane' :
                                             order.status === 'IN_PROGRESS' ? 'W trakcie' : 'Oczekujące'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        {format(parseISO(order.orderedAt), 'd MMM yyyy, HH:mm', { locale: pl })}
                                        {order.priority !== 'NORMAL' && (
                                            <span className={cn('ml-2 font-bold', order.priority === 'URGENT' ? 'text-red-500' : 'text-amber-500')}>
                                                {order.priority === 'URGENT' ? '⚠ PILNE' : '↑ Wysoki priorytet'}
                                            </span>
                                        )}
                                    </p>
                                    {order.clinicalReason && (
                                        <p className="text-xs text-slate-600 mt-1 bg-slate-50 rounded-lg px-3 py-2">{order.clinicalReason}</p>
                                    )}
                                </div>
                            ))
                    )}
                </div>
            </motion.div>
        </>
    );
}

function PatientCard({ animal, lastVisit, onClick }: { animal: Animal; lastVisit?: Visit; onClick: () => void }) {
    return (
        <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            onClick={onClick}
            className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group cursor-pointer"
        >
            <div className="flex items-start gap-4 mb-4">
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <PawPrint className="h-7 w-7 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-600 transition-colors truncate">{animal.name}</h3>
                    <p className="text-sm text-stone-500 truncate">{animal.species}{animal.breed ? ` · ${animal.breed}` : ''}</p>
                </div>
            </div>
            <div className="space-y-2 text-sm text-stone-600">
                <div className="flex justify-between">
                    <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider">Wiek</span>
                    <span className="font-medium">{patientAge(animal.birthDate)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider">Masa</span>
                    <span className="font-medium">{animal.weight ? `${animal.weight} kg` : '—'}</span>
                </div>
                {lastVisit && (
                    <div className="flex justify-between">
                        <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider">Ostatnia wizyta</span>
                        <span className="font-medium">{format(parseISO(lastVisit.startsAt), 'd MMM yyyy', { locale: pl })}</span>
                    </div>
                )}
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                {animal.microchipNumber
                    ? <span className="text-[10px] font-mono text-stone-400 truncate">{animal.microchipNumber}</span>
                    : <span className="text-[10px] text-stone-300">Brak chipa</span>}
                <span className="text-xs font-bold text-emerald-600 group-hover:underline">Otwórz kartotekę →</span>
            </div>
        </motion.div>
    );
}

function EmptyState({ icon: Icon, text }: { icon: React.FC<{ className?: string }>; text: string }) {
    return (
        <div className="py-16 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Icon className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm text-slate-400">{text}</p>
        </div>
    );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function PrescriptionsPage() {
    const { language } = useLanguageStore();
    const t = translations[language];

    const from = format(subMonths(new Date(), 6), 'yyyy-MM-dd');
    const to   = format(addMonths(new Date(), 6), 'yyyy-MM-dd');

    // shared data
    useVetMe();
    const { data: visits = [], isLoading } = useVetVisitsRange(from, to);
    const { data: animals = [] }           = useClinicAnimals();
    const { data: products = [] }          = useProducts();

    // recepty state
    const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

    // kartoteka state
    const [searchTerm, setSearchTerm]         = useState('');
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

    const [activeTab, setActiveTab] = useState<'recepty' | 'kartoteka'>('recepty');

    const animalNameMap = useMemo(() => {
        const map = new Map<number, string>();
        animals.forEach((a) => map.set(a.id, a.name));
        return map;
    }, [animals]);

    const candidates = useMemo(() => visits.filter((v) => v.status !== 'CANCELLED'), [visits]);

    const lastVisitMap = useMemo(() => {
        const map = new Map<number, Visit>();
        [...visits]
            .filter((v) => v.status !== 'CANCELLED')
            .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
            .forEach((v) => map.set(v.animalId, v));
        return map;
    }, [visits]);

    const filteredAnimals = useMemo(() =>
        animals.filter((a) => {
            const q = searchTerm.toLowerCase();
            return (
                a.name.toLowerCase().includes(q) ||
                a.species.toLowerCase().includes(q) ||
                (a.breed ?? '').toLowerCase().includes(q) ||
                (a.microchipNumber ?? '').toLowerCase().includes(q)
            );
        }),
        [animals, searchTerm],
    );

    return (
        <div className="space-y-6">
            {/* header */}
            <div>
                <h1 className="text-3xl font-display font-bold text-slate-900">{t.prescriptions.title}</h1>
                <p className="text-slate-500 mt-1">{t.prescriptions.subtitle}</p>
            </div>

            {/* tab switcher */}
            <div className="flex gap-2 border-b border-slate-100 pb-0">
                {(['recepty', 'kartoteka'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            'flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-t-xl border-b-2 transition-all',
                            activeTab === tab
                                ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50',
                        )}
                    >
                        {tab === 'recepty'
                            ? <><FileText className="h-4 w-4" /> Recepty</>
                            : <><PawPrint className="h-4 w-4" /> Kartoteka</>}
                    </button>
                ))}
            </div>

            {/* ── RECEPTY ── */}
            {activeTab === 'recepty' && (
                <>
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
                                    animalName={animalNameMap.get(visit.animalId) ?? `Pacjent #${visit.animalId}`}
                                    onIssue={setSelectedVisit}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* ── KARTOTEKA ── */}
            {activeTab === 'kartoteka' && (
                <>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                            <input
                                type="text"
                                placeholder={t.patients.searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-stone-200 rounded-2xl text-stone-600 font-medium hover:bg-stone-50 transition-all">
                            <Filter className="h-5 w-5" /> {t.patients.filters}
                        </button>
                    </div>

                    {filteredAnimals.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="bg-stone-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="h-10 w-10 text-stone-400" />
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 mb-2">{t.patients.noPatients}</h3>
                            <p className="text-stone-500">{t.patients.noPatientsDesc}</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredAnimals.map((animal) => (
                                <PatientCard
                                    key={animal.id}
                                    animal={animal}
                                    lastVisit={lastVisitMap.get(animal.id)}
                                    onClick={() => setSelectedAnimal(animal)}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* prescription modal */}
            <AnimatePresence>
                {selectedVisit && (
                    <PrescriptionModal
                        visit={selectedVisit}
                        animalName={animalNameMap.get(selectedVisit.animalId) ?? `Pacjent #${selectedVisit.animalId}`}
                        products={products}
                        onClose={() => setSelectedVisit(null)}
                    />
                )}
            </AnimatePresence>

            {/* medical record panel */}
            <AnimatePresence>
                {selectedAnimal && (
                    <MedicalRecordPanel
                        animal={selectedAnimal}
                        visits={visits}
                        onClose={() => setSelectedAnimal(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
