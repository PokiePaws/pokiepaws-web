'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { authApi } from '../../../lib/features/auth/auth-api';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') ?? '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Brak tokenu resetowania. Użyj linku z emaila.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Hasła nie są zgodne.');
            return;
        }

        setIsLoading(true);
        try {
            await authApi.resetPassword(token, newPassword);
            setSuccess(true);
            setTimeout(() => router.push('/login'), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Nie udało się zresetować hasła.');
        } finally {
            setIsLoading(false);
        }
    };

    const INPUT_CLS = 'block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center items-center gap-2 mb-6">
                    <div className="relative w-16 h-16 overflow-hidden rounded-2xl">
                        <Image src="/PokiePaws-logo.png" alt="Logo" fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-2xl font-display font-bold text-slate-900">Pokie Paws</span>
                </Link>
                <h2 className="text-center text-3xl font-display font-bold text-slate-900">Nowe hasło</h2>
                <p className="mt-2 text-center text-sm text-slate-600">Podaj nowe hasło dla swojego konta.</p>
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
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Hasło zostało zmienione!</h3>
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
                            {!token && (
                                <div className="bg-amber-50 border border-amber-100 text-amber-700 px-4 py-3 rounded-xl text-sm">
                                    Brak tokenu. Użyj linku z emaila do resetowania hasła.
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nowe hasło</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        required
                                        type="password"
                                        placeholder="Min. 8 znaków"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        className={INPUT_CLS}
                                        minLength={8}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Powtórz hasło</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        required
                                        type="password"
                                        placeholder="Powtórz hasło"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        className={INPUT_CLS}
                                        minLength={8}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !token}
                                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                                ) : 'Zapisz nowe hasło'}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetPasswordForm />
        </Suspense>
    );
}
