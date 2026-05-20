'use client';

import { useState } from 'react';
import { User, Mail, Phone, PawPrint, CheckCircle2, ArrowLeft, Ruler, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { cn } from 'lib/utils';
import { useNotificationStore } from 'store/use-notification-store';
import { useRegisterPatient } from 'lib/features/api-hooks';

const SPECIES_OPTIONS = ['Pies', 'Kot', 'Królik', 'Chomik', 'Świnka morska', 'Ptak', 'Gad', 'Inne'];
const GENDER_OPTIONS = [
    { value: 'MALE', label: 'Samiec' },
    { value: 'FEMALE', label: 'Samica' },
    { value: 'HERMAPHRODITE', label: 'Hermafrodyta' },
] as const;

const INPUT = 'w-full px-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all';
const LABEL = 'block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2';

export default function ClientRegistrationPage() {
    const addNotification = useNotificationStore((s) => s.addNotification);
    const registerPatient = useRegisterPatient();
    const [done, setDone] = useState<{ ownerName: string; animalName: string } | null>(null);

    const [form, setForm] = useState({
        // owner
        ownerFirstName: '',
        ownerLastName: '',
        ownerEmail: '',
        ownerPhone: '',
        // animal
        animalName: '',
        animalSpecies: '',
        animalBreed: '',
        animalGender: 'MALE' as 'MALE' | 'FEMALE' | 'HERMAPHRODITE',
        animalColor: '',
        animalMicrochipNumber: '',
        animalBirthDate: '',
        animalWeight: '',
        animalNotes: '',
    });

    const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerPatient.mutateAsync({
                ownerEmail: form.ownerEmail,
                ownerFirstName: form.ownerFirstName,
                ownerLastName: form.ownerLastName,
                ownerPhone: form.ownerPhone || undefined,
                animalName: form.animalName,
                animalSpecies: form.animalSpecies,
                animalBreed: form.animalBreed || undefined,
                animalGender: form.animalGender,
                animalColor: form.animalColor || undefined,
                animalMicrochipNumber: form.animalMicrochipNumber || undefined,
                animalWeight: form.animalWeight ? Number(form.animalWeight) : undefined,
                animalBirthDate: form.animalBirthDate || undefined,
                animalNotes: form.animalNotes || undefined,
            });
            setDone({ ownerName: `${form.ownerFirstName} ${form.ownerLastName}`, animalName: form.animalName });
        } catch (err: unknown) {
            const msg = (err as { message?: string })?.message ?? 'Błąd rejestracji';
            addNotification({ message: msg, type: 'error' });
        }
    };

    const reset = () => {
        setDone(null);
        setForm({
            ownerFirstName: '', ownerLastName: '', ownerEmail: '', ownerPhone: '',
            animalName: '', animalSpecies: '', animalBreed: '', animalGender: 'MALE',
            animalColor: '', animalMicrochipNumber: '', animalBirthDate: '', animalWeight: '', animalNotes: '',
        });
    };

    if (done) {
        return (
            <div className="max-w-2xl mx-auto py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-12 rounded-[2.5rem] border border-stone-100 shadow-xl text-center"
                >
                    <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-stone-900 mb-3">Zarejestrowano!</h2>
                    <p className="text-stone-500 mb-2">
                        <span className="font-semibold text-stone-700">{done.animalName}</span> został(a) dodany/a do systemu.
                    </p>
                    <p className="text-stone-400 text-sm mb-10">
                        Właściciel: {done.ownerName}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/staff/patients"
                            className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                        >
                            Lista pacjentów
                        </Link>
                        <button
                            onClick={reset}
                            className="bg-stone-100 text-stone-600 px-8 py-4 rounded-2xl font-bold hover:bg-stone-200 transition-all"
                        >
                            Zarejestruj kolejnego
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <Link
                href="/staff/patients"
                className="inline-flex items-center gap-2 text-stone-500 hover:text-emerald-600 font-medium transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Powrót do listy pacjentów
            </Link>

            <header>
                <h1 className="text-3xl font-display font-bold text-stone-900">Rejestracja nowego pacjenta</h1>
                <p className="text-stone-500 mt-1">Dane właściciela i zwierzęcia zostaną zapisane w systemie</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* OWNER SECTION */}
                <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm space-y-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <h2 className="font-bold text-stone-900">Dane właściciela</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className={LABEL}>Imię *</label>
                            <input required value={form.ownerFirstName} onChange={set('ownerFirstName')} placeholder="Jan" className={INPUT} />
                        </div>
                        <div>
                            <label className={LABEL}>Nazwisko *</label>
                            <input required value={form.ownerLastName} onChange={set('ownerLastName')} placeholder="Kowalski" className={INPUT} />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className={cn(LABEL, 'flex items-center gap-1.5')}><Mail className="h-3 w-3" /> Email *</label>
                            <input required type="email" value={form.ownerEmail} onChange={set('ownerEmail')} placeholder="jan@example.com" className={INPUT} />
                        </div>
                        <div>
                            <label className={cn(LABEL, 'flex items-center gap-1.5')}><Phone className="h-3 w-3" /> Telefon</label>
                            <input type="tel" value={form.ownerPhone} onChange={set('ownerPhone')} placeholder="+48 123 456 789" className={INPUT} />
                        </div>
                    </div>
                </div>

                {/* ANIMAL SECTION */}
                <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm space-y-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <PawPrint className="h-4 w-4 text-emerald-600" />
                        </div>
                        <h2 className="font-bold text-stone-900">Dane zwierzęcia</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className={LABEL}>Imię *</label>
                            <input required value={form.animalName} onChange={set('animalName')} placeholder="Burek" className={INPUT} />
                        </div>
                        <div>
                            <label className={LABEL}>Gatunek *</label>
                            <select required value={form.animalSpecies} onChange={set('animalSpecies')} className={INPUT}>
                                <option value="">— Wybierz —</option>
                                {SPECIES_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className={LABEL}>Rasa</label>
                            <input value={form.animalBreed} onChange={set('animalBreed')} placeholder="np. Labrador" className={INPUT} />
                        </div>
                        <div>
                            <label className={LABEL}>Płeć *</label>
                            <div className="grid grid-cols-3 gap-2">
                                {GENDER_OPTIONS.map(({ value, label }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setForm((f) => ({ ...f, animalGender: value }))}
                                        className={cn(
                                            'py-3 rounded-xl border-2 text-xs font-bold transition-all',
                                            form.animalGender === value
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                : 'border-stone-200 text-stone-500 hover:border-stone-300',
                                        )}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                            <label className={cn(LABEL, 'flex items-center gap-1.5')}><Ruler className="h-3 w-3" /> Masa (kg)</label>
                            <input type="number" step="0.1" min="0" value={form.animalWeight} onChange={set('animalWeight')} placeholder="5.2" className={INPUT} />
                        </div>
                        <div>
                            <label className={cn(LABEL, 'flex items-center gap-1.5')}><Calendar className="h-3 w-3" /> Data urodzenia</label>
                            <input type="date" value={form.animalBirthDate} onChange={set('animalBirthDate')} className={INPUT} />
                        </div>
                        <div>
                            <label className={LABEL}>Kolor / umaszczenie</label>
                            <input value={form.animalColor} onChange={set('animalColor')} placeholder="np. czarny" className={INPUT} />
                        </div>
                    </div>

                    <div>
                        <label className={LABEL}>Nr mikroczipu</label>
                        <input value={form.animalMicrochipNumber} onChange={set('animalMicrochipNumber')} placeholder="985XXXXXXXXXXXXXXX" className={INPUT} />
                    </div>

                    <div>
                        <label className={LABEL}>Uwagi / notatki</label>
                        <textarea
                            rows={3}
                            value={form.animalNotes}
                            onChange={set('animalNotes')}
                            placeholder="Alergie, choroby przewlekłe, specjalne wymagania..."
                            className={cn(INPUT, 'resize-none')}
                        />
                    </div>
                </div>

                {/* SUBMIT */}
                <div className="flex gap-4">
                    <Link
                        href="/staff/patients"
                        className="flex-1 py-4 border border-stone-200 text-stone-600 rounded-2xl font-bold text-center hover:bg-stone-50 transition-all"
                    >
                        Anuluj
                    </Link>
                    <button
                        type="submit"
                        disabled={registerPatient.isPending}
                        className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-60"
                    >
                        {registerPatient.isPending ? 'Rejestrowanie…' : 'Zarejestruj pacjenta'}
                    </button>
                </div>
            </form>
        </div>
    );
}
