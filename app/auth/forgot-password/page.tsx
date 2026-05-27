'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { authApi } from '../../../lib/features/auth/auth-api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await authApi.forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Nie udało się wysłać emaila.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center items-center gap-2 mb-6">
                    <div className="relative w-16 h-16 overflow-hidden rounded-2xl">
                        <Image src="/PokiePaws-logo.png" alt="Logo" fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-2xl font-display font-bold text-slate-900">Pokie Paws</span>
                </Link>
                <h2 className="text-center text-3xl font-display font-bold text-slate-900">Resetuj hasło</h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Podaj swój email — wyślemy link do resetowania hasła.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100"
                >
                    {success ? (
                        <div className="text-center py-8">
                            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Sprawdź skrzynkę!</h3>
                            <p className="text-slate-500 text-sm mb-6">
                                Jeśli konto z adresem <strong>{email}</strong> istnieje, wysłaliśmy link do resetowania hasła.
                            </p>
                            <Link href="/login" className="text-blue-600 font-semibold hover:underline text-sm">
                                Wróć do logowania
                            </Link>
                        </div>
                    ) : (
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        required
                                        type="email"
                                        placeholder="jan@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                                ) : 'Wyślij link'}
                            </button>
                            <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                                <ArrowLeft className="h-4 w-4" /> Wróć do logowania
                            </Link>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
