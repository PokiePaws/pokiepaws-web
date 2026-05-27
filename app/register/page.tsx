'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { authApi } from '../../lib/features/auth/auth-api';

const INPUT_CLS = 'block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all';
const INPUT_CLS_NO_ICON = 'block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        street: '',
        houseNumber: '',
        apartmentNumber: '',
        postalCode: '',
        city: '',
        country: 'Polska',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Hasła nie są zgodne.');
            return;
        }

        setIsLoading(true);
        try {
            await authApi.register({
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                password: form.password,
                phoneNumber: form.phoneNumber,
                street: form.street,
                houseNumber: form.houseNumber,
                apartmentNumber: form.apartmentNumber || undefined,
                postalCode: form.postalCode,
                city: form.city,
                country: form.country,
            });
            setSuccess(true);
            setTimeout(() => router.push('/login'), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Rejestracja nie powiodła się.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                <Link href="/" className="flex justify-center items-center gap-2 mb-6">
                    <div className="relative w-16 h-16 overflow-hidden rounded-2xl">
                        <Image src="/PokiePaws-logo.png" alt="Logo" fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-2xl font-display font-bold text-slate-900">Pokie Paws</span>
                </Link>
                <h2 className="text-center text-3xl font-display font-bold text-slate-900">Utwórz konto</h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Masz już konto?{' '}
                    <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">Zaloguj się</Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100"
                >
                    {success ? (
                        <div className="text-center py-8">
                            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Konto zostało utworzone!</h3>
                            <p className="text-slate-500 text-sm">Za chwilę zostaniesz przekierowany na stronę logowania.</p>
                        </div>
                    ) : (
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Imię</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input required placeholder="Jan" className={INPUT_CLS} value={form.firstName} onChange={set('firstName')} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nazwisko</label>
                                    <input required placeholder="Kowalski" className={INPUT_CLS_NO_ICON} value={form.lastName} onChange={set('lastName')} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input required type="email" placeholder="jan@example.com" className={INPUT_CLS} value={form.email} onChange={set('email')} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input required placeholder="+48 123 456 789" className={INPUT_CLS} value={form.phoneNumber} onChange={set('phoneNumber')} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Hasło</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input required type="password" placeholder="Min. 8 znaków" className={INPUT_CLS} value={form.password} onChange={set('password')} minLength={8} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Powtórz hasło</label>
                                    <input required type="password" placeholder="Powtórz hasło" className={INPUT_CLS_NO_ICON} value={form.confirmPassword} onChange={set('confirmPassword')} minLength={8} />
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> Adres
                                </p>
                                <div className="grid grid-cols-3 gap-3 mb-3">
                                    <div className="col-span-2">
                                        <input required placeholder="Ulica" className={INPUT_CLS_NO_ICON} value={form.street} onChange={set('street')} />
                                    </div>
                                    <input required placeholder="Nr domu" className={INPUT_CLS_NO_ICON} value={form.houseNumber} onChange={set('houseNumber')} />
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <input placeholder="Nr lokalu" className={INPUT_CLS_NO_ICON} value={form.apartmentNumber} onChange={set('apartmentNumber')} />
                                    <input required placeholder="Kod pocztowy" pattern="\d{2}-\d{3}" className={INPUT_CLS_NO_ICON} value={form.postalCode} onChange={set('postalCode')} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input required placeholder="Miasto" className={INPUT_CLS_NO_ICON} value={form.city} onChange={set('city')} />
                                    <input required placeholder="Kraj" className={INPUT_CLS_NO_ICON} value={form.country} onChange={set('country')} />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                                ) : 'Utwórz konto'}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
