'use client';

import { useState, useMemo } from 'react';
import { useLanguageStore } from '../../../store/use-language-store';
import { translations } from '../../../lib/translations';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
    Check,
    X,
    MoreVertical,
    CalendarDays,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    eachDayOfInterval,
    parseISO
} from 'date-fns';
import { pl, enUS } from 'date-fns/locale';
import { cn } from '../../../lib/utils';
import {
    useCancelVisit,
    useClinicAnimals,
    useConfirmVetVisit,
    useCreatePrescription,
    useCreateVisit,
    useProducts,
    usePrescription,
    useUpdateVisitMedicalData,
    useVetMe,
    useVetVisitsRange,
} from '../../../lib/features/api-hooks';
import type { Visit } from '../../../lib/features/api-schemas';

interface Appointment {
    id: string;
    patientName: string;
    ownerName: string;
    type: string;
    time: string;
    date: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    visit: Visit;
}

export default function SchedulePage() {
    const { language } = useLanguageStore();
    const t = translations[language];
    const locale = language === 'pl' ? pl : enUS;

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    // state for dropdown menu and reschedule modal
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [rescheduleModal, setRescheduleModal] = useState<Appointment | null>(null);
    const [medicalVisit, setMedicalVisit] = useState<Visit | null>(null);
    const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' });
    const [medicalForm, setMedicalForm] = useState({ disease: '', diagnosis: '', recommendations: '' });
    const [prescriptionForm, setPrescriptionForm] = useState({
        productId: '',
        quantityPackages: '1',
        dosage: '',
        treatmentTime: '',
    });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    const rangeFrom = format(startDate, 'yyyy-MM-dd');
    const rangeTo = format(endDate, 'yyyy-MM-dd');
    const { data: vetMe } = useVetMe();
    const { data: clinicAnimals = [] } = useClinicAnimals();
    const { data: products = [] } = useProducts();
    const { data: apiVisits = [] } = useVetVisitsRange(rangeFrom, rangeTo);
    const createVisit = useCreateVisit();
    const confirmVisit = useConfirmVetVisit();
    const cancelVisit = useCancelVisit();
    const updateMedicalData = useUpdateVisitMedicalData();
    const createPrescription = useCreatePrescription();
    const { data: prescription } = usePrescription(medicalVisit?.id);
    const animalNameMap = useMemo(() => {
        const map = new Map<number, string>();
        clinicAnimals.forEach((a) => map.set(a.id, a.name));
        return map;
    }, [clinicAnimals]);

    const appointments: Appointment[] = apiVisits.map((visit) => {
        const startsAt = parseISO(visit.startsAt);
        const animalName = animalNameMap.get(visit.animalId) ?? `Pacjent #${visit.animalId}`;

        return {
            id: String(visit.id),
            patientName: animalName,
            ownerName: `Właściciel`,
            type: visit.description || visit.diagnosis || 'Wizyta',
            time: format(startsAt, 'HH:mm'),
            date: format(startsAt, 'yyyy-MM-dd'),
            status: visit.status === 'CANCELLED' ? 'cancelled' : visit.status === 'CONFIRMED' ? 'confirmed' : 'pending',
            visit,
        };
    });

    const selectedDayAppointments = useMemo(() => {
        return appointments.filter(app => isSameDay(parseISO(app.date), selectedDate));
    }, [appointments, selectedDate]);

    const handleStatusChange = (id: string, newStatus: 'confirmed' | 'cancelled') => {
        const visitId = Number(id);
        if (newStatus === 'confirmed') {
            confirmVisit.mutate(visitId);
        } else {
            cancelVisit.mutate(visitId);
        }
        setOpenMenuId(null);
    };

    const openReschedule = (app: Appointment) => {
        setRescheduleData({ date: app.date, time: app.time });
        setRescheduleModal(app);
        setOpenMenuId(null);
    };

    const handleReschedule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rescheduleModal || !vetMe?.clinicId || !vetMe?.userId) return;
        const clinicId = vetMe.clinicId;
        const vetUserId = vetMe.userId;
        await cancelVisit.mutateAsync(Number(rescheduleModal.id));
        await createVisit.mutateAsync({
            animalId: rescheduleModal.visit.animalId,
            clinicId,
            vetUserId,
            startsAt: `${rescheduleData.date}T${rescheduleData.time}:00`,
            description: rescheduleModal.visit.description || undefined,
        });
        setRescheduleModal(null);
    };

    const openMedicalData = (app: Appointment) => {
        setMedicalVisit(app.visit);
        setMedicalForm({
            disease: app.visit.disease || '',
            diagnosis: app.visit.diagnosis || '',
            recommendations: app.visit.recommendations || '',
        });
        setPrescriptionForm({ productId: '', quantityPackages: '1', dosage: '', treatmentTime: '' });
        setOpenMenuId(null);
    };

    const handleMedicalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!medicalVisit) return;

        await updateMedicalData.mutateAsync({
            id: medicalVisit.id,
            payload: medicalForm,
        });
        if (prescriptionForm.productId) {
            await createPrescription.mutateAsync({
                visitId: medicalVisit.id,
                payload: {
                    recommendationDate: format(new Date(), 'yyyy-MM-dd'),
                    items: [{
                        productId: Number(prescriptionForm.productId),
                        quantityPackages: Number(prescriptionForm.quantityPackages) || 1,
                        dosage: prescriptionForm.dosage || undefined,
                        treatmentTime: prescriptionForm.treatmentTime || undefined,
                    }],
                },
            });
        }
        setMedicalVisit(null);
    };

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-display font-bold text-stone-900 tracking-tight">
                        {t.schedule.title}
                    </h1>
                    <p className="text-stone-500 mt-1">
                        {t.schedule.subtitle}
                    </p>
                </div>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Calendar Section */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-stone-50 flex items-center justify-between bg-stone-50/30">
                            <h2 className="text-xl font-bold text-stone-900 capitalize">
                                {format(currentMonth, 'MMMM yyyy', { locale })}
                            </h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={prevMonth}
                                    className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-stone-100 shadow-sm"
                                >
                                    <ChevronLeft className="h-5 w-5 text-stone-600" />
                                </button>
                                <button
                                    onClick={() => setCurrentMonth(new Date())}
                                    className="px-4 py-2 text-sm font-bold text-stone-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-stone-100"
                                >
                                    {language === 'pl' ? 'Dzisiaj' : 'Today'}
                                </button>
                                <button
                                    onClick={nextMonth}
                                    className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-stone-100 shadow-sm"
                                >
                                    <ChevronRight className="h-5 w-5 text-stone-600" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 text-center py-4 bg-stone-50/10">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <span key={day} className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                                    {language === 'pl' ? (day === 'Mon' ? 'Pon' : day === 'Tue' ? 'Wt' : day === 'Wed' ? 'Śr' : day === 'Thu' ? 'Czw' : day === 'Fri' ? 'Pt' : day === 'Sat' ? 'Sob' : 'Nie') : day}
                                </span>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-px bg-stone-100">
                            {calendarDays.map((day, idx) => {
                                const isSelected = isSameDay(day, selectedDate);
                                const isCurrentMonth = isSameMonth(day, monthStart);
                                const isToday = isSameDay(day, new Date());
                                const dayAppointments = appointments.filter(app => isSameDay(parseISO(app.date), day));

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedDate(day)}
                                        className={cn(
                                            "min-h-[100px] p-2 bg-white cursor-pointer transition-all hover:bg-stone-50 group relative",
                                            !isCurrentMonth && "bg-stone-50/50 text-stone-300",
                                            isSelected && "ring-2 ring-inset ring-emerald-500 z-10"
                                        )}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className={cn(
                                                "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-all",
                                                isToday ? "bg-emerald-600 text-white" : "text-stone-900",
                                                !isCurrentMonth && "text-stone-300",
                                                isSelected && !isToday && "bg-stone-100"
                                            )}>
                                                {format(day, 'd')}
                                            </span>
                                            {dayAppointments.length > 0 && (
                                                <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-md">
                                                    {dayAppointments.length}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-2 space-y-1">
                                            {dayAppointments.slice(0, 2).map(app => (
                                                <div
                                                    key={app.id}
                                                    className={cn(
                                                        "text-[10px] p-1 rounded-md truncate font-medium",
                                                        app.status === 'confirmed' ? "bg-emerald-50 text-emerald-700" :
                                                            app.status === 'cancelled' ? "bg-red-50 text-red-700" :
                                                                "bg-amber-50 text-amber-700"
                                                    )}
                                                >
                                                    {app.time} {app.patientName}
                                                </div>
                                            ))}
                                            {dayAppointments.length > 2 && (
                                                <div className="text-[9px] text-stone-400 font-bold pl-1">
                                                    + {dayAppointments.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Appointments List Section */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm p-8 h-full min-h-[600px] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-stone-900">
                                    {format(selectedDate, 'EEEE, d MMMM', { locale })}
                                </h3>
                                <p className="text-stone-500 text-sm">
                                    {selectedDayAppointments.length} {language === 'pl' ? 'wizyt zaplanowanych' : 'appointments scheduled'}
                                </p>
                            </div>
                            <div className="p-3 bg-stone-50 rounded-2xl">
                                <CalendarDays className="h-6 w-6 text-stone-400" />
                            </div>
                        </div>

                        <div className="flex-grow space-y-4 overflow-y-auto pr-2">
                            <AnimatePresence mode="popLayout">
                                {selectedDayAppointments.length > 0 ? (
                                    selectedDayAppointments.map((app) => (
                                        <motion.div
                                            key={app.id}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="group bg-white border border-stone-100 p-5 rounded-[2rem] hover:shadow-md transition-all hover:border-emerald-100 relative overflow-hidden"
                                        >
                                            {/* Status Indicator Bar */}
                                            <div className={cn(
                                                "absolute left-0 top-0 bottom-0 w-1.5",
                                                app.status === 'confirmed' ? "bg-emerald-500" :
                                                    app.status === 'cancelled' ? "bg-red-500" :
                                                        "bg-amber-500"
                                            )} />

                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-4">
                                                    <div className="w-12 h-12 bg-stone-50 rounded-2xl flex flex-col items-center justify-center border border-stone-100">
                                                        <Clock className="h-4 w-4 text-stone-400 mb-0.5" />
                                                        <span className="text-[10px] font-bold text-stone-900">{app.time}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-stone-900 group-hover:text-emerald-600 transition-colors">
                                                            {app.patientName}
                                                        </h4>
                                                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                                                            <User className="h-3 w-3" />
                                                            {app.ownerName}
                                                        </p>
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <span className="text-[10px] font-bold px-2 py-1 bg-stone-100 text-stone-600 rounded-lg uppercase tracking-wider">
                                                                {app.type}
                                                            </span>
                                                            <span className={cn(
                                                                "text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider",
                                                                app.status === 'confirmed' ? "bg-emerald-50 text-emerald-600" :
                                                                    app.status === 'cancelled' ? "bg-red-50 text-red-600" :
                                                                        "bg-amber-50 text-amber-600"
                                                            )}>
                                                                {t.schedule[app.status]}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* NEW: Universal dropdown menu for all statuses */}
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === app.id ? null : app.id)}
                                                        className="p-2 text-stone-400 hover:bg-stone-50 rounded-xl transition-all"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>

                                                    {openMenuId === app.id && (
                                                        <>
                                                            <div
                                                                className="fixed inset-0 z-10"
                                                                onClick={() => setOpenMenuId(null)}
                                                            />
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                className="absolute right-0 top-12 z-20 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 w-52 overflow-hidden"
                                                            >
                                                                {app.status !== 'confirmed' && (
                                                                    <button
                                                                        onClick={() => handleStatusChange(app.id, 'confirmed')}
                                                                        className="w-full px-4 py-2.5 text-left text-sm font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition-all"
                                                                    >
                                                                        <Check className="h-4 w-4" />
                                                                        {language === 'pl' ? 'Potwierdź' : 'Confirm'}
                                                                    </button>
                                                                )}

                                                                <button
                                                                    onClick={() => openMedicalData(app)}
                                                                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition-all"
                                                                >
                                                                    <CalendarIcon className="h-4 w-4" />
                                                                    {language === 'pl' ? 'Kartoteka i recepta' : 'Medical record'}
                                                                </button>

                                                                <button
                                                                    onClick={() => openReschedule(app)}
                                                                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-stone-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 transition-all"
                                                                >
                                                                    <CalendarIcon className="h-4 w-4" />
                                                                    {language === 'pl' ? 'Przebookuj' : 'Reschedule'}
                                                                </button>

                                                                {app.status !== 'cancelled' && (
                                                                    <button
                                                                        onClick={() => handleStatusChange(app.id, 'cancelled')}
                                                                        className="w-full px-4 py-2.5 text-left text-sm font-medium text-stone-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-3 transition-all"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                        {language === 'pl' ? 'Anuluj wizytę' : 'Cancel visit'}
                                                                    </button>
                                                                )}
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <div className="w-20 h-20 bg-stone-50 rounded-[2rem] flex items-center justify-center mb-4 border border-stone-100">
                                            <AlertCircle className="h-8 w-8 text-stone-300" />
                                        </div>
                                        <p className="text-stone-400 font-medium">
                                            {t.schedule.noVisits}
                                        </p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Appointment Modal */}
            <AnimatePresence>
                {medicalVisit && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMedicalVisit(null)}
                            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-stone-100"
                        >
                            <div className="p-8 border-b border-stone-50 bg-stone-50/30 flex justify-between gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-stone-900">
                                        {language === 'pl' ? 'Kartoteka wizyty' : 'Visit medical record'}
                                    </h3>
                                    <p className="text-stone-500 text-sm mt-1">
                                        #{medicalVisit.id} · {format(parseISO(medicalVisit.startsAt), 'yyyy-MM-dd HH:mm')}
                                    </p>
                                </div>
                                <button onClick={() => setMedicalVisit(null)} className="p-2 hover:bg-white rounded-full">
                                    <X className="h-6 w-6 text-stone-400" />
                                </button>
                            </div>
                            <form onSubmit={handleMedicalSubmit} className="p-8 space-y-6">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Disease</label>
                                        <input value={medicalForm.disease} onChange={e => setMedicalForm({ ...medicalForm, disease: e.target.value })} className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Diagnosis</label>
                                        <input value={medicalForm.diagnosis} onChange={e => setMedicalForm({ ...medicalForm, diagnosis: e.target.value })} className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Recommendations</label>
                                    <textarea value={medicalForm.recommendations} onChange={e => setMedicalForm({ ...medicalForm, recommendations: e.target.value })} rows={4} className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
                                </div>

                                <div className="rounded-3xl border border-stone-100 p-5 space-y-4">
                                    <div>
                                        <h4 className="font-bold text-stone-900">Recepta</h4>
                                        {prescription?.items?.length ? (
                                            <p className="text-xs text-stone-500 mt-1">{prescription.items.length} lek(i) już przypisany(e).</p>
                                        ) : (
                                            <p className="text-xs text-stone-500 mt-1">Opcjonalnie dobierz lek do wizyty.</p>
                                        )}
                                    </div>
                                    <div className="grid md:grid-cols-4 gap-4">
                                        <select
                                            value={prescriptionForm.productId}
                                            onChange={e => setPrescriptionForm({ ...prescriptionForm, productId: e.target.value })}
                                            className="bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 col-span-1 md:col-span-1"
                                        >
                                            <option value="">— Wybierz lek —</option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>{p.name}{p.unit ? ` (${p.unit})` : ''}</option>
                                            ))}
                                        </select>
                                        <input placeholder="Opakowania" type="number" min="1" value={prescriptionForm.quantityPackages} onChange={e => setPrescriptionForm({ ...prescriptionForm, quantityPackages: e.target.value })} className="bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                                        <input placeholder="Dawkowanie" value={prescriptionForm.dosage} onChange={e => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })} className="bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                                        <input placeholder="Czas leczenia" value={prescriptionForm.treatmentTime} onChange={e => setPrescriptionForm({ ...prescriptionForm, treatmentTime: e.target.value })} className="bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-2">
                                    <button type="button" onClick={() => setMedicalVisit(null)} className="px-6 py-4 rounded-2xl font-bold text-stone-600 hover:bg-stone-50 border border-stone-100">
                                        {language === 'pl' ? 'Anuluj' : 'Cancel'}
                                    </button>
                                    <button disabled={updateMedicalData.isPending || createPrescription.isPending} type="submit" className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100">
                                        {language === 'pl' ? 'Zapisz' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

            </AnimatePresence>

            {/* NEW: Reschedule Modal */}
            <AnimatePresence>
                {rescheduleModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setRescheduleModal(null)}
                            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden border border-stone-100"
                        >
                            <div className="p-8 border-b border-stone-50 bg-stone-50/30">
                                <h3 className="text-2xl font-bold text-stone-900">
                                    {language === 'pl' ? 'Przebookuj wizytę' : 'Reschedule appointment'}
                                </h3>
                                <p className="text-stone-500 text-sm mt-1">
                                    {rescheduleModal.patientName} · {rescheduleModal.ownerName}
                                </p>
                            </div>

                            <form onSubmit={handleReschedule} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">
                                            {language === 'pl' ? 'Nowa data' : 'New date'}
                                        </label>
                                        <input
                                            required
                                            type="date"
                                            value={rescheduleData.date}
                                            onChange={e => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                                            className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">
                                            {language === 'pl' ? 'Nowa godzina' : 'New time'}
                                        </label>
                                        <input
                                            required
                                            type="time"
                                            value={rescheduleData.time}
                                            onChange={e => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                                            className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setRescheduleModal(null)}
                                        className="flex-1 px-6 py-4 rounded-2xl font-bold text-stone-600 hover:bg-stone-50 transition-all border border-stone-100"
                                    >
                                        {language === 'pl' ? 'Anuluj' : 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={cancelVisit.isPending || createVisit.isPending}
                                        className="flex-1 bg-emerald-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-60 flex items-center justify-center gap-2"
                                    >
                                        {(cancelVisit.isPending || createVisit.isPending) && <Loader2 className="h-5 w-5 animate-spin" />}
                                        {language === 'pl' ? 'Przebookuj' : 'Reschedule'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
