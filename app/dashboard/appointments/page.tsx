'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X, PawPrint } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, eachDayOfInterval } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { useNotificationStore } from '../../../store/use-notification-store';
import {
    useAnimals,
    useAvailableSlots,
    useCancelVisit,
    useCreateVisit,
    useOwnerVisitsRange,
    usePrescription,
    useVetsByClinic,
} from '../../../lib/features/api-hooks';
import { useClinics } from '../../../lib/features/clinics/use-clinics';
import type { Visit } from '../../../lib/features/api-schemas';

export default function AppointmentsPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showBooking, setShowBooking] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
    const [booking, setBooking] = useState({
        animalId: '',
        clinicId: '',
        vetUserId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        startsAt: '',
        description: '',
    });
    const addNotification = useNotificationStore(state => state.addNotification);
    const from = format(startOfWeek(startOfMonth(currentDate)), 'yyyy-MM-dd');
    const to = format(endOfWeek(endOfMonth(currentDate)), 'yyyy-MM-dd');
    const { data: appointments = [] } = useOwnerVisitsRange(from, to);
    const { data: pets = [] } = useAnimals();
    const { data: clinics = [] } = useClinics();
    const selectedClinicId = booking.clinicId ? Number(booking.clinicId) : undefined;
    const selectedVetId = booking.vetUserId ? Number(booking.vetUserId) : undefined;
    const { data: vets = [] } = useVetsByClinic(selectedClinicId);
    const { data: slots } = useAvailableSlots(selectedClinicId, selectedVetId, booking.date);
    const createVisit = useCreateVisit();
    const cancelVisit = useCancelVisit();
    const { data: prescription } = usePrescription(selectedVisit?.id);
    const petNameById = new Map(pets.map((pet) => [pet.id, pet.name]));

    const handleCancelVisit = async (id: number) => {
        await cancelVisit.mutateAsync(id);
        addNotification({ message: 'Visit cancelled.', type: 'success' });
    };

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
                            .filter(apt => isSameDay(new Date(apt.startsAt), day))
                            .map(apt => (
                                <div key={apt.id} className="text-[10px] p-1 bg-emerald-100 text-emerald-700 rounded border border-emerald-200 truncate font-medium">
                                    {format(new Date(apt.startsAt), 'HH:mm')} - {petNameById.get(apt.animalId) || `#${apt.animalId}`}
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
                    {appointments.map(apt => {
                        const startsAt = new Date(apt.startsAt);
                        return (
                        <div key={apt.id} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-stone-50 p-3 rounded-xl">
                                    <CalendarIcon className="h-6 w-6 text-stone-400" />
                                </div>
                                <div>
                                    <button onClick={() => setSelectedVisit(apt)} className="font-bold text-stone-900 text-left hover:text-emerald-600">
                                        {apt.description || 'Veterinary visit'}
                                    </button>
                                    <p className="text-sm text-stone-500">for {petNameById.get(apt.animalId) || `Pet #${apt.animalId}`}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right hidden sm:block">
                                    <p className="font-bold text-stone-900">{format(startsAt, 'MMM d, yyyy')}</p>
                                    <p className="text-sm text-stone-500">{format(startsAt, 'h:mm a')}</p>
                                </div>
                                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      apt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {apt.status}
                  </span>
                                    <button onClick={() => handleCancelVisit(apt.id)} disabled={apt.status === 'CANCELLED' || cancelVisit.isPending} className="p-2 text-stone-300 hover:text-red-500 transition-colors disabled:opacity-40">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        );
                    })}
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
                {selectedVisit && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedVisit(null)}
                            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-100"
                        >
                            <div className="p-8 border-b border-stone-100 flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-display font-bold text-stone-900">Visit details</h2>
                                    <p className="text-stone-500 mt-1">
                                        {format(new Date(selectedVisit.startsAt), 'PPpp')} · {selectedVisit.status}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedVisit(null)} className="p-2 hover:bg-stone-50 rounded-full">
                                    <X className="h-6 w-6 text-stone-400" />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="rounded-2xl bg-stone-50 p-4">
                                        <p className="text-[10px] font-bold uppercase text-stone-400">Pet</p>
                                        <p className="font-bold text-stone-900">{petNameById.get(selectedVisit.animalId) || `Pet #${selectedVisit.animalId}`}</p>
                                    </div>
                                    <div className="rounded-2xl bg-stone-50 p-4">
                                        <p className="text-[10px] font-bold uppercase text-stone-400">Reason</p>
                                        <p className="font-bold text-stone-900">{selectedVisit.description || '-'}</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {[
                                        ['Disease', selectedVisit.disease],
                                        ['Diagnosis', selectedVisit.diagnosis],
                                        ['Recommendations', selectedVisit.recommendations],
                                    ].map(([label, value]) => (
                                        <div key={label} className="rounded-2xl border border-stone-100 p-4">
                                            <p className="text-[10px] font-bold uppercase text-stone-400 mb-2">{label}</p>
                                            <p className="text-sm text-stone-700">{value || '-'}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="rounded-2xl border border-stone-100 p-4">
                                    <p className="text-[10px] font-bold uppercase text-stone-400 mb-3">Prescription</p>
                                    {prescription?.items?.length ? (
                                        <div className="space-y-2">
                                            {prescription.items.map((item) => (
                                                <div key={item.id} className="flex justify-between gap-4 text-sm">
                                                    <span className="font-medium text-stone-900">{item.productName || `Product #${item.productId}`}</span>
                                                    <span className="text-stone-500">{item.dosage || '-'} · {item.treatmentTime || '-'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-stone-400">No prescription attached.</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

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

                                <form className="space-y-6" onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (!booking.animalId || !booking.clinicId || !booking.vetUserId || !booking.startsAt) {
                                        addNotification({ message: 'Select pet, clinic, vet and time.', type: 'error' });
                                        return;
                                    }

                                    await createVisit.mutateAsync({
                                        animalId: Number(booking.animalId),
                                        clinicId: Number(booking.clinicId),
                                        vetUserId: Number(booking.vetUserId),
                                        startsAt: booking.startsAt,
                                        description: booking.description || undefined,
                                    });
                                    addNotification({ message: 'Appointment booked successfully!', type: 'success' });
                                    setShowBooking(false);
                                }}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-stone-700 mb-2">Select Pet</label>
                                            <select value={booking.animalId} onChange={(e) => setBooking({ ...booking, animalId: e.target.value })} className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                                                <option value="">Select pet</option>
                                                {pets.map((pet) => (
                                                    <option key={pet.id} value={pet.id}>{pet.name} ({pet.species})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-stone-700 mb-2">Clinic</label>
                                            <select value={booking.clinicId} onChange={(e) => setBooking({ ...booking, clinicId: e.target.value, vetUserId: '', startsAt: '' })} className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                                                <option value="">Select clinic</option>
                                                {clinics.map((clinic) => (
                                                    <option key={clinic.id} value={clinic.id}>{clinic.clinicName} ({clinic.city})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-stone-700 mb-2">Veterinarian</label>
                                            <select value={booking.vetUserId} onChange={(e) => setBooking({ ...booking, vetUserId: e.target.value, startsAt: '' })} className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                                                <option value="">Select vet</option>
                                                {vets.map((vet) => (
                                                    <option key={vet.userId} value={vet.userId}>{vet.firstName} {vet.lastName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-stone-700 mb-2">Date</label>
                                                <input type="date" value={booking.date} onChange={(e) => setBooking({ ...booking, date: e.target.value, startsAt: '' })} className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-stone-700 mb-2">Time</label>
                                                <select value={booking.startsAt} onChange={(e) => setBooking({ ...booking, startsAt: e.target.value })} className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                                                    <option value="">Select time</option>
                                                    {(slots?.availableStarts ?? []).map((slot) => (
                                                        <option key={slot} value={slot}>{format(new Date(slot), 'HH:mm')}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-stone-700 mb-2">Reason</label>
                                            <input value={booking.description} onChange={(e) => setBooking({ ...booking, description: e.target.value })} className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="General checkup" />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={createVisit.isPending}
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
