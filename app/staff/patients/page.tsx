'use client';

import { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    PawPrint,
    X,
    Calendar,
    Weight,
    Cpu,
    FlaskConical,
    Pill,
    ChevronDown,
    ChevronUp,
    Clock,
    CheckCircle2,
    XCircle,
    Activity,
    FileText,
    Stethoscope,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, parseISO, differenceInYears, differenceInMonths } from 'date-fns';
import { pl } from 'date-fns/locale';
import { cn } from '../../../lib/utils';
import { useLanguageStore } from '../../../store/use-language-store';
import { translations } from '../../../lib/translations';
import {
    useClinicAnimals,
    useVetVisitsRange,
    usePrescription,
    useLabOrdersByAnimal,
} from '../../../lib/features/api-hooks';
import type { VetPatient, Visit } from '../../../lib/features/api-schemas';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

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
    SCHEDULED: { label: 'Zaplanowana', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    CONFIRMED: { label: 'Potwierdzona', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    IN_PROGRESS: { label: 'W trakcie', icon: Activity, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    DONE: { label: 'Zakończona', icon: CheckCircle2, color: 'text-slate-600 bg-slate-50 border-slate-200' },
    CANCELLED: { label: 'Anulowana', icon: XCircle, color: 'text-red-500 bg-red-50 border-red-200' },
} as const;

// ─── VISIT ENTRY (fetches prescription itself) ────────────────────────────────

function VisitEntry({ visit }: { visit: Visit }) {
    const [open, setOpen] = useState(false);
    const { data: prescription } = usePrescription(visit.id);
    const cfg = STATUS_CONFIG[visit.status] ?? STATUS_CONFIG.SCHEDULED;
    const Icon = cfg.icon;
    const hasMedical = visit.disease || visit.diagnosis || visit.recommendations;

    return (
        <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
            >
                {/* date column */}
                <div className="shrink-0 w-14 text-center">
                    <p className="text-lg font-bold text-slate-900 leading-none">
                        {format(parseISO(visit.startsAt), 'd')}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                        {format(parseISO(visit.startsAt), 'MMM yyyy', { locale: pl })}
                    </p>
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                        {visit.description || visit.diagnosis || visit.disease || 'Wizyta'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {format(parseISO(visit.startsAt), 'HH:mm')}
                        {prescription && ` · recepta #${prescription.id}`}
                    </p>
                </div>

                <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border shrink-0', cfg.color)}>
                    <Icon className="h-3 w-3" />
                    {cfg.label}
                </span>

                {open
                    ? <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />}
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4">
                            {hasMedical ? (
                                <div className="grid md:grid-cols-3 gap-3">
                                    {visit.disease && (
                                        <MedCell label="Choroba" value={visit.disease} />
                                    )}
                                    {visit.diagnosis && (
                                        <MedCell label="Diagnoza" value={visit.diagnosis} />
                                    )}
                                    {visit.recommendations && (
                                        <MedCell label="Zalecenia" value={visit.recommendations} />
                                    )}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 italic">Brak danych klinicznych.</p>
                            )}

                            {prescription && prescription.items.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                                        Recepta #{prescription.id}
                                    </p>
                                    <div className="space-y-1.5">
                                        {prescription.items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-2.5 border border-blue-100">
                                                <Pill className="h-4 w-4 text-blue-400 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800">
                                                        {item.productName ?? `Produkt #${item.productId}`}
                                                    </p>
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

function MedCell({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-sm text-slate-700">{value}</p>
        </div>
    );
}

// ─── MEDICAL RECORD PANEL ────────────────────────────────────────────────────

function MedicalRecordPanel({
    animal,
    visits,
    onClose,
}: {
    animal: VetPatient;
    visits: Visit[];
    onClose: () => void;
}) {
    const [tab, setTab] = useState<'visits' | 'lab'>('visits');
    const { data: labOrders = [] } = useLabOrdersByAnimal(animal.id);

    const animalVisits = useMemo(
        () => [...visits]
            .filter((v) => v.animalId === animal.id)
            .sort((a, b) => b.startsAt.localeCompare(a.startsAt)),
        [visits, animal.id],
    );

    return (
        <>
            {/* backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* slide-in panel */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl bg-white shadow-2xl flex flex-col"
            >
                {/* ── HEADER ── */}
                <div className="shrink-0 px-6 py-5 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                        <PawPrint className="h-7 w-7 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-slate-900 truncate">{animal.name}</h2>
                        <p className="text-sm text-slate-500">
                            {animal.species}{animal.breed ? ` · ${animal.breed}` : ''}
                            {' · '}{GENDER_LABEL[animal.gender] ?? animal.gender}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-slate-200 transition-colors shrink-0"
                    >
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                {/* ── PATIENT METRICS ── */}
                <div className="shrink-0 px-6 py-4 grid grid-cols-4 gap-3 border-b border-slate-100">
                    <MetricCell icon={Calendar} label="Wiek" value={patientAge(animal.birthDate)} />
                    <MetricCell icon={Weight} label="Masa ciała" value={animal.weight ? `${animal.weight} kg` : '—'} />
                    <MetricCell icon={Cpu} label="Chip" value={animal.microchipNumber ?? '—'} />
                    <MetricCell icon={Stethoscope} label="Wizyty" value={String(animalVisits.length)} />
                </div>

                {/* ── OWNER INFO (if returned by API) ── */}
                {(animal.ownerFirstName || animal.ownerLastName || animal.ownerEmail || animal.ownerPhone) && (
                    <div className="shrink-0 mx-6 mt-3 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Właściciel</p>
                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-700">
                            {(animal.ownerFirstName || animal.ownerLastName) && (
                                <span className="font-medium">
                                    {[animal.ownerFirstName, animal.ownerLastName].filter(Boolean).join(' ')}
                                </span>
                            )}
                            {animal.ownerEmail && (
                                <span className="text-slate-500">{animal.ownerEmail}</span>
                            )}
                            {animal.ownerPhone && (
                                <span className="text-slate-500">{animal.ownerPhone}</span>
                            )}
                        </div>
                    </div>
                )}

                {animal.notes && (
                    <div className="shrink-0 mx-6 mt-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800">
                        <span className="font-semibold">Uwagi: </span>{animal.notes}
                    </div>
                )}

                {/* ── TABS ── */}
                <div className="shrink-0 flex gap-1 px-6 pt-4 pb-0">
                    <TabBtn active={tab === 'visits'} onClick={() => setTab('visits')} icon={FileText}>
                        Historia wizyt ({animalVisits.length})
                    </TabBtn>
                    <TabBtn active={tab === 'lab'} onClick={() => setTab('lab')} icon={FlaskConical}>
                        Zlecenia lab ({labOrders.length})
                    </TabBtn>
                </div>

                {/* ── CONTENT ── */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                    {tab === 'visits' && (
                        animalVisits.length === 0
                            ? <EmptySection icon={FileText} text="Brak wizyt w systemie." />
                            : animalVisits.map((v) => <VisitEntry key={v.id} visit={v} />)
                    )}

                    {tab === 'lab' && (
                        labOrders.length === 0
                            ? <EmptySection icon={FlaskConical} text="Brak zleceń laboratoryjnych." />
                            : labOrders.map((order) => (
                                <div key={order.id} className="border border-slate-100 rounded-2xl px-5 py-4 bg-white space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-slate-900 text-sm">{order.testType}</p>
                                        <span className={cn(
                                            'text-xs font-bold px-2.5 py-1 rounded-lg border',
                                            order.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            order.status === 'CANCELLED' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                            order.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            'bg-amber-50 text-amber-700 border-amber-200',
                                        )}>
                                            {order.status === 'COMPLETED' ? 'Zakończone' :
                                             order.status === 'CANCELLED' ? 'Anulowane' :
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
                                        <p className="text-xs text-slate-600 mt-1 bg-slate-50 rounded-lg px-3 py-2">
                                            {order.clinicalReason}
                                        </p>
                                    )}
                                </div>
                            ))
                    )}
                </div>
            </motion.div>
        </>
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

function TabBtn({
    active, onClick, icon: Icon, children,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.FC<{ className?: string }>;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border',
                active
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300',
            )}
        >
            <Icon className="h-4 w-4" />
            {children}
        </button>
    );
}

function EmptySection({ icon: Icon, text }: { icon: React.FC<{ className?: string }>; text: string }) {
    return (
        <div className="py-16 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Icon className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm text-slate-400">{text}</p>
        </div>
    );
}

// ─── PATIENT CARD ────────────────────────────────────────────────────────────

function PatientCard({ animal, lastVisit, onClick }: {
    animal: VetPatient;
    lastVisit?: Visit;
    onClick: () => void;
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onClick}
            className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group cursor-pointer"
        >
            <div className="flex items-start gap-4 mb-4">
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <PawPrint className="h-7 w-7 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-600 transition-colors truncate">
                        {animal.name}
                    </h3>
                    <p className="text-sm text-stone-500 truncate">
                        {animal.species}{animal.breed ? ` · ${animal.breed}` : ''}
                    </p>
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
                        <span className="font-medium">
                            {format(parseISO(lastVisit.startsAt), 'd MMM yyyy', { locale: pl })}
                        </span>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                {animal.microchipNumber
                    ? <span className="text-[10px] font-mono text-stone-400 truncate">{animal.microchipNumber}</span>
                    : <span className="text-[10px] text-stone-300">Brak chipa</span>
                }
                <span className="text-xs font-bold text-emerald-600 group-hover:underline">
                    Otwórz kartotekę →
                </span>
            </div>
        </motion.div>
    );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function PatientsPage() {
    const { language } = useLanguageStore();
    const t = translations[language];

    const { data: animals = [] } = useClinicAnimals();

    const from = format(new Date(new Date().setFullYear(new Date().getFullYear() - 3)), 'yyyy-MM-dd');
    const to = format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 'yyyy-MM-dd');
    const { data: visits = [] } = useVetVisitsRange(from, to);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAnimal, setSelectedAnimal] = useState<VetPatient | null>(null);

    // map animalId → most recent non-cancelled visit
    const lastVisitMap = useMemo(() => {
        const map = new Map<number, Visit>();
        [...visits]
            .filter((v) => v.status !== 'CANCELLED')
            .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
            .forEach((v) => map.set(v.animalId, v));
        return map;
    }, [visits]);

    const filtered = useMemo(() =>
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
        <div className="space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-stone-900">{t.patients.title}</h1>
                    <p className="text-stone-500">{t.patients.subtitle}</p>
                </div>
            </header>

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
                    <Filter className="h-5 w-5" />
                    {t.patients.filters}
                </button>
            </div>

            {filtered.length === 0 ? (
                <div className="py-20 text-center">
                    <div className="bg-stone-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="h-10 w-10 text-stone-400" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">{t.patients.noPatients}</h3>
                    <p className="text-stone-500">{t.patients.noPatientsDesc}</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map((animal) => (
                        <PatientCard
                            key={animal.id}
                            animal={animal}
                            lastVisit={lastVisitMap.get(animal.id)}
                            onClick={() => setSelectedAnimal(animal)}
                        />
                    ))}
                </div>
            )}

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
