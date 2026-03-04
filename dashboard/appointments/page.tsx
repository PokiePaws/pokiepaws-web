'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, ChevronLeft, ChevronRight, Plus, Check, X, AlertCircle, PawPrint } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, eachDayOfInterval } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { useNotificationStore } from '@/store/use-notification-store';

export default function AppointmentsPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showBooking, setShowBooking] = useState(false);
    const addNotification = useNotificationStore(state => state.addNotification);

    const appointments = [
        { id: '1', pet: 'Buddy', service: 'Vaccination', date: new Date(2024, 4, 15, 10, 0), status: 'Confirmed', doctor: 'Dr. Smith' },
        { id: '2', pet: 'Luna', service: 'Dental Cleaning', date: new Date(2024, 4, 20, 14, 30), status: 'Pending', doctor: 'Dr. Wilson' },
    ];

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-stone-900">Appointments</h1>
                    <p className="text-stone-500">Manage and schedule your pet visits.</p>
                </div>
                <button
                    onClick={() => setShowBooking(true)}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                >
                    <Plus className="h-5 w-5" />
                    Book Appointment
                </button>
            </div>
        );
    };

    const renderCalendar = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const days = eachDayOfInterval({ start: startDate, end: endDate });

        const rows: React.ReactNode[] = [];
        let dayRow: React.ReactNode[] = [];

        days.forEach((day, i) => {
            dayRow.push(
                <div
                    key={day.toString()}
                    onClick={() => setSelectedDate(day)}
                    className={`h-24 sm:h-32 border-r border-b border-stone-100 p-2 transition-all cursor-pointer relative ${
                        !isSameMonth(day, monthStart) ? 'bg-stone-50 text-stone-300' : 'bg-white text-stone-700'
                    } ${isSameDay(day, selectedDate) ? 'bg-emerald-50/50 ring-2 ring-emerald-500 ring-inset z-10' : ''}`}
                >
          <span className={`text-xs font-bold ${isSameDay(day, new Date()) ? 'bg-emerald-600 text-white h-6 w-6 flex items-center justify-center rounded-full' : ''}`}>
            {format(day, 'd')}
          </span>

                    <div className="mt-2 space-y-1">
                        {appointments
                            .filter(apt => isSameDay(apt.date, day))
                            .map(apt => (
                                <div key={apt.id} className="text-[10px] p-1 bg-emerald-100 text-emerald-700 rounded border border-emerald-200 truncate font-medium">
                                    {format(apt.date, 'HH:mm')} - {apt.pet}
                                </div>
                            ))}
                    </div>
                </div>
            );

            if ((i + 1) % 7 === 0) {
                rows.push(<div key={i} className="grid grid-cols-7">{dayRow}</div>);
                dayRow = [];
            }
        });

        return (
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-stone-100">
                    <h2 className="text-xl font-bold text-stone-900">{format(currentDate, 'MMMM yyyy')}</h2>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
                            <ChevronLeft className="h-5 w-5 text-stone-600" />
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
                            <ChevronRight className="h-5 w-5 text-stone-600" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-7 bg-stone-50 border-b border-stone-100">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-stone-400">
                            {d}
                        </div>
                    ))}
                </div>
                {rows}
            </div>
        );
    };

    const renderAppointmentList = () => {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-emerald-600" />
                    Upcoming Visits
                </h3>
                <div className="grid gap-4">
                    {appointments.map(apt => (
                        <div key={apt.id} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-stone-50 p-3 rounded-xl">
                                    <CalendarIcon className="h-6 w-6 text-stone-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-stone-900">{apt.service}</h4>
                                    <p className="text-sm text-stone-500">for {apt.pet} with {apt.doctor}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right hidden sm:block">
                                    <p className="font-bold text-stone-900">{format(apt.date, 'MMM d, yyyy')}</p>
                                    <p className="text-sm text-stone-500">{format(apt.date, 'h:mm a')}</p>
                                </div>
                                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {apt.status}
                  </span>
                                    <button className="p-2 text-stone-300 hover:text-red-500 transition-colors">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-12">
            {renderHeader()}

            <div className="grid xl:grid-cols-3 gap-12">
                <div className="xl:col-span-2 space-y-8">
                    {renderCalendar()}
                </div>
                <div className="space-y-8">
                    {renderAppointmentList()}

                    <div className="bg-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                            <p className="text-emerald-200 text-sm mb-6">Our support team is available 24/7 for emergency cases.</p>
                            <button className="bg-white text-emerald-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors">
                                Contact Support
                            </button>
                        </div>
                        <PawPrint className="absolute -bottom-4 -right-4 h-32 w-32 text-emerald-800 opacity-50 rotate-12" />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showBooking && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowBooking(false)}
                            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-100"
                        >
                            <div className="p-8 sm:p-12">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-display font-bold text-stone-900">Book Appointment</h2>
                                    <button onClick={() => setShowBooking(false)} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                                        <X className="h-6 w-6 text-stone-400" />
                                    </button>
                                </div>

                                <form className="space-y-6" onSubmit={(e) => {
                                    e.preventDefault();
                                    addNotification({ message: 'Appointment request sent successfully!', type: 'success' });
                                    setShowBooking(false);
                                }}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-stone-700 mb-2">Select Pet</label>
                                            <select className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                                                <option>Buddy (Golden Retriever)</option>
                                                <option>Luna (Siamese)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-stone-700 mb-2">Service Type</label>
                                            <select className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                                                <option>General Checkup</option>
                                                <option>Vaccination</option>
                                                <option>Dental Cleaning</option>
                                                <option>Surgery Consultation</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-stone-700 mb-2">Date</label>
                                                <input type="date" className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-stone-700 mb-2">Time</label>
                                                <select className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                                                    <option>09:00 AM</option>
                                                    <option>10:30 AM</option>
                                                    <option>02:00 PM</option>
                                                    <option>04:30 PM</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 mt-4"
                                    >
                                        Confirm Booking
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
