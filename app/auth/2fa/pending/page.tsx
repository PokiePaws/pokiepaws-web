'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Mail, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { authApi } from '../../../../lib/features/auth/auth-api';

function MfaPendingContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') ?? '';
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleResend = async () => {
        if (!email || status === 'sending') return;
        setStatus('sending');
        try {
            await authApi.resendMfa(email);
            setStatus('sent');
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center items-center gap-2 mb-6">
                    <div className="relative w-20 h-20 overflow-hidden rounded-2xl">
                        <Image src="/PokiePaws-logo.png" alt="Logo" fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-3xl font-display font-bold text-slate-900">Pokie Paws</span>
                </Link>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100 text-center"
                >
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                        <Mail className="h-7 w-7" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Sprawdź skrzynkę</h2>
                    <p className="text-slate-600 text-sm mb-1">Wysłaliśmy link weryfikacyjny na adres:</p>
                    <p className="font-semibold text-slate-900 mb-6">{email}</p>
                    <p className="text-slate-500 text-xs mb-8">
                        Kliknij w link w wiadomości e-mail, aby zakończyć logowanie. Link jest ważny przez 15 minut.
                    </p>

                    {status === 'sent' && (
                        <p className="mb-4 text-sm text-green-600">Link został wysłany ponownie.</p>
                    )}
                    {status === 'error' && (
                        <p className="mb-4 text-sm text-red-600">Nie udało się wysłać. Spróbuj ponownie.</p>
                    )}

                    <button
                        onClick={handleResend}
                        disabled={status === 'sending' || status === 'sent'}
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className={`h-4 w-4 ${status === 'sending' ? 'animate-spin' : ''}`} />
                        Wyślij ponownie
                    </button>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <Link href="/login" className="text-sm text-slate-500 hover:text-slate-700">
                            Wróć do logowania
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function MfaPendingPage() {
    return (
        <Suspense>
            <MfaPendingContent />
        </Suspense>
    );
}
