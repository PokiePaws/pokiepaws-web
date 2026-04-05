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
    Plus,
    Check,
    X,
    MoreVertical,
    CalendarDays,
    Search,
    Filter,
    AlertCircle
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
    addDays,
    eachDayOfInterval,
    parseISO,
    isAfter,
    startOfDay
} from 'date-fns';
import { pl, enUS } from 'date-fns/locale';
import { cn } from '../../../lib/utils';

interface Appointment {
    id: string;
    patientName: string;
    ownerName: string;
    type: string;
    time: string;
    date: string;
    status: 'pending' | 'confirmed' | 'cancelled';
}

const INITIAL_APPOINTMENTS: Appointment[] = [
    {
        id: '1',
        patientName: 'Buddy',
        ownerName: 'John Doe',
        type: 'Vaccination',
        time: '10:00',
        date: format(new Date(), 'yyyy-MM-dd'),
        status: 'confirmed'
    },
    {
        id: '2',
        patientName: 'Luna',
        ownerName: 'Jane Smith',
        type: 'General Check-up',
        time: '11:30',
        date: format(new Date(), 'yyyy-MM-dd'),
        status: 'pending'
    },
    {
        id: '3',
        patientName: 'Max',
        ownerName: 'Robert Brown',
        type: 'Dental Cleaning',
        time: '14:00',
        date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        status: 'pending'
    },
    {
        id: '4',
        patientName: 'Bella',
        ownerName: 'Emily Davis',
        type: 'Surgery Consultation',
        time: '09:00',
        date: format(subMonths(new Date(), 0), 'yyyy-MM-dd'),
        status: 'confirmed'
    }
];

export default function SchedulePage() {
    const { language } = useLanguageStore();
    const t = translations[language];
    const locale = language === 'pl' ? pl : enUS;

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newAppointment, setNewAppointment] = useState({
        patientName: '',
        ownerName: '',
        type: 'General Check-up',
        time: '10:00',
        date: format(new Date(), 'yyyy-MM-dd')
    });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const selectedDayAppointments = useMemo(() => {
        return appointments.filter(app => isSameDay(parseISO(app.date), selectedDate));
    }, [appointments, selectedDate]);

    const handleStatusChange = (id: string, newStatus: 'confirmed' | 'cancelled') => {
        setAppointments(prev => prev.map(app =>
            app.id === id ? { ...app, status: newStatus } : app
        ));
    };

    const handleAddAppointment = (e: React.FormEvent) => {
        e.preventDefault();
        const id = Math.random().toString(36).substr(2, 9);
        setAppointments(prev => [...prev, { ...newAppointment, id, status: 'confirmed' }]);
        setIsAddModalOpen(false);
        setNewAppointment({
            patientName: '',
            ownerName: '',
            type: 'General Check-up',
            time: '10:00',
            date: format(new Date(), 'yyyy-MM-dd')
        });
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
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    {t.schedule.addVisit}
                </button>
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

                                                {app.status === 'pending' && (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleStatusChange(app.id, 'confirmed')}
                                                            className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                            title={t.schedule.approve}
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(app.id, 'cancelled')}
                                                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                            title={t.schedule.reject}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}

                                                {app.status !== 'pending' && (
                                                    <button className="p-2 text-stone-400 hover:bg-stone-50 rounded-xl transition-all">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>
                                                )}
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
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-stone-100"
                        >
                            <div className="p-8 border-b border-stone-50 bg-stone-50/30">
                                <h3 className="text-2xl font-bold text-stone-900">{t.schedule.addVisit}</h3>
                                <p className="text-stone-500 text-sm mt-1">Schedule a new appointment for a patient.</p>
                            </div>

                            <form onSubmit={handleAddAppointment} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">{t.schedule.patientName}</label>
                                        <input
                                            required
                                            type="text"
                                            value={newAppointment.patientName}
                                            onChange={e => setNewAppointment({...newAppointment, patientName: e.target.value})}
                                            className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                                            placeholder="e.g. Buddy"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">{t.schedule.ownerName}</label>
                                        <input
                                            required
                                            type="text"
                                            value={newAppointment.ownerName}
                                            onChange={e => setNewAppointment({...newAppointment, ownerName: e.target.value})}
                                            className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                                            placeholder="e.g. John Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">{t.schedule.visitType}</label>
                                    <select
                                        value={newAppointment.type}
                                        onChange={e => setNewAppointment({...newAppointment, type: e.target.value})}
                                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none appearance-none"
                                    >
                                        <option value="General Check-up">General Check-up</option>
                                        <option value="Vaccination">Vaccination</option>
                                        <option value="Surgery Consultation">Surgery Consultation</option>
                                        <option value="Dental Cleaning">Dental Cleaning</option>
                                        <option value="Lab Results Review">Lab Results Review</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">{t.schedule.date}</label>
                                        <input
                                            required
                                            type="date"
                                            value={newAppointment.date}
                                            onChange={e => setNewAppointment({...newAppointment, date: e.target.value})}
                                            className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">{t.schedule.time}</label>
                                        <input
                                            required
                                            type="time"
                                            value={newAppointment.time}
                                            onChange={e => setNewAppointment({...newAppointment, time: e.target.value})}
                                            className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="flex-1 px-6 py-4 rounded-2xl font-bold text-stone-600 hover:bg-stone-50 transition-all border border-stone-100"
                                    >
                                        {language === 'pl' ? 'Anuluj' : 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-emerald-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                                    >
                                        {t.schedule.addVisit}
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
