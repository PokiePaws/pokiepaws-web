'use client';

import { useState } from 'react';
import {
    FlaskConical,
    Plus,
    X,
    ChevronDown,
    ChevronUp,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Activity,
    User,
    Stethoscope,
    CalendarDays,
    FileText,
    ShieldCheck,
    Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { cn } from 'lib/utils';
import { useNotificationStore } from 'store/use-notification-store';
import { useLanguageStore } from 'store/use-language-store';
import { translations } from 'lib/translations';
import { useVetMe, useClinicAnimals, useLabOrders, useCreateLabOrder, useUpdateLabOrderStatus } from 'lib/features/api-hooks';
import type { LabOrder } from 'lib/features/api-schemas';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG = {
    NORMAL: { label: { pl: 'Normalny', en: 'Normal' }, classes: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
    HIGH: { label: { pl: 'Wysoki', en: 'High' }, classes: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    URGENT: { label: { pl: 'Pilny', en: 'Urgent' }, classes: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
} as const;

const STATUS_CONFIG = {
    PENDING: {
        label: { pl: 'Oczekujące', en: 'Pending' },
        classes: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: Clock,
        rowBorder: 'border-l-amber-400',
    },
    CONFIRMED: {
        label: { pl: 'Potwierdzone', en: 'Confirmed' },
        classes: 'bg-violet-50 text-violet-700 border-violet-200',
        icon: ShieldCheck,
        rowBorder: 'border-l-violet-400',
    },
    IN_PROGRESS: {
        label: { pl: 'W trakcie', en: 'In Progress' },
        classes: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: Activity,
        rowBorder: 'border-l-blue-400',
    },
    COMPLETED: {
        label: { pl: 'Zakończone', en: 'Completed' },
        classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: CheckCircle2,
        rowBorder: 'border-l-emerald-400',
    },
    CANCELLED: {
        label: { pl: 'Anulowane', en: 'Cancelled' },
        classes: 'bg-slate-100 text-slate-500 border-slate-200',
        icon: XCircle,
        rowBorder: 'border-l-slate-300',
    },
} as const;

const LAB_TEST_TYPES = [
    'Morfologia krwi (CBC)',
    'Biochemia krwi',
    'Badanie moczu (UA)',
    'Badanie kału',
    'Posiew bakteriologiczny',
    'Antybiogram',
    'Badanie cytologiczne',
    'Badanie histopatologiczne',
    'Poziom glukozy',
    'Profil tarczycy (T3, T4, TSH)',
    'Poziom kortyzolu',
    'Serologia (testy przeciwciał)',
    'PCR – diagnostyka wirusowa',
    'Panel alergiczny',
    'Badanie krwi utajonej w kale',
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function PriorityBadge({ priority }: { priority: keyof typeof PRIORITY_CONFIG }) {
    const cfg = PRIORITY_CONFIG[priority];
    return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border', cfg.classes)}>
            <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dot)} />
            {priority === 'URGENT' ? cfg.label.pl : cfg.label.pl}
        </span>
    );
}

function StatusBadge({ status }: { status: keyof typeof STATUS_CONFIG }) {
    const cfg = STATUS_CONFIG[status];
    const Icon = cfg.icon;
    return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border', cfg.classes)}>
            <Icon className="h-3 w-3" />
            {cfg.label.pl}
        </span>
    );
}

// ─── ACCORDION ROW ────────────────────────────────────────────────────────────

function LabOrderRow({ order, onStatusChange, isPending }: {
    order: LabOrder;
    onStatusChange: (id: number, status: string) => void;
    isPending: boolean;
}) {
    const [open, setOpen] = useState(false);
    const cfg = STATUS_CONFIG[order.status];

    return (
        <div className={cn('border-l-4 bg-white rounded-xl shadow-sm overflow-hidden transition-shadow hover:shadow-md', cfg.rowBorder)}>
            {/* collapsed header */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full text-left px-5 py-4 flex items-center gap-4"
            >
                {/* ID badge */}
                <span className="shrink-0 w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                    #{order.id}
                </span>

                {/* main info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-slate-900 text-sm">{order.testType}</p>
                        <PriorityBadge priority={order.priority} />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                        <span className="font-medium text-slate-700">{order.animalName}</span>
                        {order.animalSpecies && <> &middot; {order.animalSpecies}</>}
                        {' '}&middot;{' '}
                        {format(parseISO(order.orderedAt), 'd MMM yyyy, HH:mm', { locale: pl })}
                    </p>
                </div>

                {/* status + chevron */}
                <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={order.status} />
                    {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </div>
            </button>

            {/* expanded details */}
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
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-5">
                            {/* metadata grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <MetaCell icon={User} label="Pacjent" value={`${order.animalName}${order.animalSpecies ? ` (${order.animalSpecies})` : ''}`} />
                                <MetaCell icon={Stethoscope} label="Weterynarz" value={order.vetFirstName && order.vetLastName ? `lek. wet. ${order.vetFirstName} ${order.vetLastName}` : `ID ${order.vetUserId}`} />
                                <MetaCell icon={CalendarDays} label="Data zlecenia" value={format(parseISO(order.orderedAt), 'd MMMM yyyy, HH:mm', { locale: pl })} />
                                {order.completedAt && (
                                    <MetaCell icon={CheckCircle2} label="Data zakończenia" value={format(parseISO(order.completedAt), 'd MMMM yyyy, HH:mm', { locale: pl })} />
                                )}
                                {order.visitId && (
                                    <MetaCell icon={FileText} label="Nr wizyty" value={`#${order.visitId}`} />
                                )}
                            </div>

                            {/* clinical reason */}
                            {order.clinicalReason && (
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Powód kliniczny</p>
                                    <p className="text-sm text-slate-700">{order.clinicalReason}</p>
                                </div>
                            )}

                            {/* warehouse order link */}
                            {order.warehouseOrderId && (
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Package className="h-3.5 w-3.5 text-slate-400" />
                                    <span>Zamówienie magazynowe: <span className="font-semibold text-slate-700">#{order.warehouseOrderId}</span></span>
                                </div>
                            )}

                            {/* status history */}
                            {order.statusHistory && order.statusHistory.length > 0 && (
                                <div className="space-y-1.5">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Historia statusów</p>
                                    <div className="space-y-1">
                                        {order.statusHistory.map((h) => (
                                            <div key={h.id} className="flex items-center gap-2 text-xs text-slate-600">
                                                <span className="text-slate-400">{format(h.changedAt.endsWith('Z') ? new Date(h.changedAt) : new Date(h.changedAt + 'Z'), 'd MMM HH:mm', { locale: pl })}</span>
                                                <span className="text-slate-300">→</span>
                                                {h.previousStatus
                                                    ? <><span className="font-medium">{STATUS_CONFIG[h.previousStatus as keyof typeof STATUS_CONFIG]?.label.pl ?? h.previousStatus}</span><span className="text-slate-300 mx-1">→</span></>
                                                    : null}
                                                <span className="font-semibold text-slate-800">{STATUS_CONFIG[h.newStatus as keyof typeof STATUS_CONFIG]?.label.pl ?? h.newStatus}</span>
                                                {h.changedByEmail && <span className="text-slate-400 ml-auto">{h.changedByEmail}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* status actions */}
                            {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                                <div className="flex flex-wrap gap-2">
                                    {order.status === 'PENDING' && (
                                        <ActionButton
                                            onClick={() => onStatusChange(order.id, 'CONFIRMED')}
                                            disabled={isPending}
                                            variant="violet"
                                            icon={ShieldCheck}
                                        >
                                            Potwierdź zlecenie
                                        </ActionButton>
                                    )}
                                    {order.status === 'CONFIRMED' && (
                                        <ActionButton
                                            onClick={() => onStatusChange(order.id, 'IN_PROGRESS')}
                                            disabled={isPending}
                                            variant="blue"
                                            icon={Activity}
                                        >
                                            Rozpocznij badanie
                                        </ActionButton>
                                    )}
                                    {order.status === 'IN_PROGRESS' && (
                                        <ActionButton
                                            onClick={() => onStatusChange(order.id, 'COMPLETED')}
                                            disabled={isPending}
                                            variant="green"
                                            icon={CheckCircle2}
                                        >
                                            Zakończ badanie
                                        </ActionButton>
                                    )}
                                    <ActionButton
                                        onClick={() => onStatusChange(order.id, 'CANCELLED')}
                                        disabled={isPending}
                                        variant="red"
                                        icon={XCircle}
                                    >
                                        Anuluj zlecenie
                                    </ActionButton>
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

function ActionButton({ children, onClick, disabled, variant, icon: Icon }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
    variant: 'blue' | 'green' | 'red' | 'violet';
    icon: React.FC<{ className?: string }>;
}) {
    const variants = {
        blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
        green: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200',
        red: 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200',
        violet: 'bg-violet-50 text-violet-700 hover:bg-violet-100 border-violet-200',
    };
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-colors disabled:opacity-50',
                variants[variant],
            )}
        >
            <Icon className="h-3.5 w-3.5" />
            {children}
        </button>
    );
}

// ─── NEW ORDER MODAL ──────────────────────────────────────────────────────────

function NewOrderModal({ onClose }: { onClose: () => void }) {
    const { data: animals = [] } = useClinicAnimals();
    const createLabOrder = useCreateLabOrder();
    const addNotification = useNotificationStore((s) => s.addNotification);

    const [form, setForm] = useState({
        animalId: '',
        testType: '',
        customTestType: '',
        priority: 'NORMAL' as 'NORMAL' | 'HIGH' | 'URGENT',
        clinicalReason: '',
    });

    const effectiveTestType = form.testType === '__custom__' ? form.customTestType : form.testType;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.animalId || !effectiveTestType) return;
        try {
            await createLabOrder.mutateAsync({
                animalId: Number(form.animalId),
                testType: effectiveTestType,
                priority: form.priority,
                clinicalReason: form.clinicalReason || undefined,
            });
            addNotification({ message: 'Zlecenie zostało wysłane', type: 'success' });
            onClose();
        } catch {
            addNotification({ message: 'Błąd tworzenia zlecenia', type: 'error' });
        }
    };

    const INPUT = 'w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all';
    const LABEL = 'block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5';

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
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
            >
                {/* modal header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
                            <FlaskConical className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Nowe zlecenie laboratoryjne</h2>
                            <p className="text-xs text-slate-500">Wypełnij poniższy formularz</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* patient */}
                    <div>
                        <label className={LABEL}>Pacjent *</label>
                        <select
                            required
                            value={form.animalId}
                            onChange={(e) => setForm({ ...form, animalId: e.target.value })}
                            className={INPUT}
                        >
                            <option value="">— Wybierz pacjenta —</option>
                            {animals.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.name} ({a.species}{a.breed ? `, ${a.breed}` : ''})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* test type */}
                    <div>
                        <label className={LABEL}>Rodzaj badania *</label>
                        <select
                            required={form.testType !== '__custom__'}
                            value={form.testType}
                            onChange={(e) => setForm({ ...form, testType: e.target.value, customTestType: '' })}
                            className={INPUT}
                        >
                            <option value="">— Wybierz badanie —</option>
                            {LAB_TEST_TYPES.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                            <option value="__custom__">Inne (wpisz ręcznie)</option>
                        </select>
                        {form.testType === '__custom__' && (
                            <input
                                required
                                type="text"
                                placeholder="Wpisz nazwę badania"
                                value={form.customTestType}
                                onChange={(e) => setForm({ ...form, customTestType: e.target.value })}
                                className={cn(INPUT, 'mt-2')}
                            />
                        )}
                    </div>

                    {/* priority */}
                    <div>
                        <label className={LABEL}>Priorytet</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['NORMAL', 'HIGH', 'URGENT'] as const).map((p) => {
                                const cfg = PRIORITY_CONFIG[p];
                                const selected = form.priority === p;
                                return (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setForm({ ...form, priority: p })}
                                        className={cn(
                                            'flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all',
                                            selected ? cn(cfg.classes, 'border-current') : 'border-slate-200 text-slate-500 hover:border-slate-300',
                                        )}
                                    >
                                        <span className={cn('h-2 w-2 rounded-full', cfg.dot)} />
                                        {cfg.label.pl}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* clinical reason */}
                    <div>
                        <label className={LABEL}>Powód kliniczny / Uwagi</label>
                        <textarea
                            rows={3}
                            placeholder="Wyjaśnij dlaczego to badanie jest potrzebne..."
                            value={form.clinicalReason}
                            onChange={(e) => setForm({ ...form, clinicalReason: e.target.value })}
                            className={cn(INPUT, 'resize-none')}
                        />
                    </div>

                    {/* actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                        >
                            Anuluj
                        </button>
                        <button
                            type="submit"
                            disabled={createLabOrder.isPending}
                            className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-60 shadow-lg shadow-blue-100"
                        >
                            {createLabOrder.isPending ? 'Wysyłanie…' : 'Wyślij zlecenie'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

type FilterStatus = 'ALL' | 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export default function LabOrdersPage() {
    const { language } = useLanguageStore();
    const t = translations[language];
    const addNotification = useNotificationStore((s) => s.addNotification);

    const { data: vetMe } = useVetMe();
    const { data: orders = [], isLoading, isError } = useLabOrders(vetMe?.clinicId ?? undefined);
    const updateStatus = useUpdateLabOrderStatus();

    const [showModal, setShowModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
    const [filterPriority, setFilterPriority] = useState<'ALL' | 'NORMAL' | 'HIGH' | 'URGENT'>('ALL');

    const filtered = orders.filter((o) => {
        if (filterStatus !== 'ALL' && o.status !== filterStatus) return false;
        if (filterPriority !== 'ALL' && o.priority !== filterPriority) return false;
        return true;
    });

    const counts = {
        PENDING: orders.filter((o) => o.status === 'PENDING').length,
        CONFIRMED: orders.filter((o) => o.status === 'CONFIRMED').length,
        IN_PROGRESS: orders.filter((o) => o.status === 'IN_PROGRESS').length,
        COMPLETED: orders.filter((o) => o.status === 'COMPLETED').length,
    };

    const handleStatusChange = async (id: number, status: string) => {
        try {
            await updateStatus.mutateAsync({ id, status });
            addNotification({ message: 'Status zaktualizowany', type: 'success' });
        } catch {
            addNotification({ message: 'Błąd aktualizacji statusu', type: 'error' });
        }
    };

    return (
        <div className="space-y-6">
            {/* header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">{t.labOrders.title}</h1>
                    <p className="text-slate-500 mt-1">{t.labOrders.subtitle}</p>
                </div>
                {vetMe?.clinicId && !isError && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                    >
                        <Plus className="h-4 w-4" />
                        {t.labOrders.newOrder}
                    </button>
                )}
            </div>

            {/* API not available banner */}
            {isError && (
                <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-amber-800 text-sm">
                            Moduł zleceń laboratoryjnych jest tymczasowo niedostępny
                        </p>
                        <p className="text-amber-700 text-xs mt-1">
                            Endpointy API dla zleceń laboratoryjnych nie są jeszcze zaimplementowane po stronie serwera.
                            Funkcjonalność zostanie włączona automatycznie po udostępnieniu przez backend.
                        </p>
                    </div>
                </div>
            )}

            {/* summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <SummaryCard label="Oczekujące" count={counts.PENDING} color="amber" icon={Clock} />
                <SummaryCard label="Potwierdzone" count={counts.CONFIRMED} color="violet" icon={ShieldCheck} />
                <SummaryCard label="W trakcie" count={counts.IN_PROGRESS} color="blue" icon={Activity} />
                <SummaryCard label="Zakończone" count={counts.COMPLETED} color="emerald" icon={CheckCircle2} />
            </div>

            {/* filters */}
            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-1">Status:</span>
                {(['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as FilterStatus[]).map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                            filterStatus === s
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300',
                        )}
                    >
                        {s === 'ALL' ? 'Wszystkie' : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG].label.pl}
                    </button>
                ))}
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4 mr-1">Priorytet:</span>
                {(['ALL', 'URGENT', 'HIGH', 'NORMAL'] as const).map((p) => (
                    <button
                        key={p}
                        onClick={() => setFilterPriority(p)}
                        className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                            filterPriority === p
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300',
                        )}
                    >
                        {p === 'ALL' ? 'Wszystkie' : PRIORITY_CONFIG[p].label.pl}
                    </button>
                ))}
            </div>

            {/* orders list */}
            {isLoading ? (
                <div className="py-20 text-center text-slate-400">Ładowanie zleceń…</div>
            ) : isError ? (
                <EmptyState
                    icon={FlaskConical}
                    title="Brak danych"
                    description="Zlecenia laboratoryjne będą widoczne tutaj po uruchomieniu API."
                />
            ) : !vetMe?.clinicId ? (
                <EmptyState
                    icon={AlertCircle}
                    title="Brak przypisanej kliniki"
                    description="Twoje konto nie ma przypisanej kliniki. Skontaktuj się z administratorem."
                />
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={FlaskConical}
                    title={orders.length === 0 ? 'Brak zleceń laboratoryjnych' : 'Brak wyników dla wybranych filtrów'}
                    description={orders.length === 0
                        ? 'Utwórz pierwsze zlecenie klikając przycisk powyżej.'
                        : 'Zmień filtry, aby zobaczyć więcej zleceń.'}
                />
            ) : (
                <div className="space-y-3">
                    {filtered.map((order) => (
                        <LabOrderRow
                            key={order.id}
                            order={order}
                            onStatusChange={handleStatusChange}
                            isPending={updateStatus.isPending}
                        />
                    ))}
                </div>
            )}

            {/* modal */}
            <AnimatePresence>
                {showModal && vetMe?.clinicId && (
                    <NewOrderModal onClose={() => setShowModal(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}

function SummaryCard({ label, count, color, icon: Icon }: {
    label: string;
    count: number;
    color: 'amber' | 'blue' | 'emerald' | 'violet';
    icon: React.FC<{ className?: string }>;
}) {
    const colors = {
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        violet: 'bg-violet-50 text-violet-600 border-violet-100',
    };
    const iconColors = {
        amber: 'text-amber-500',
        blue: 'text-blue-500',
        emerald: 'text-emerald-500',
        violet: 'text-violet-500',
    };
    return (
        <div className={cn('rounded-2xl border p-4 flex items-center gap-4', colors[color])}>
            <Icon className={cn('h-6 w-6 shrink-0', iconColors[color])} />
            <div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs font-medium opacity-75">{label}</p>
            </div>
        </div>
    );
}

function EmptyState({ icon: Icon, title, description }: {
    icon: React.FC<{ className?: string }>;
    title: string;
    description: string;
}) {
    return (
        <div className="py-20 text-center bg-white rounded-2xl border border-slate-100">
            <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Icon className="h-7 w-7 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700">{title}</p>
            <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">{description}</p>
        </div>
    );
}
