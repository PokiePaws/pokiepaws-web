'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuthStore } from '../../../store/use-auth-store';
import { getRedirectPath } from '../../../lib/features/auth/auth-types';

function VerifyMfaContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setErrorMessage('Brak tokenu weryfikacyjnego.');
            return;
        }

        let active = true;

        fetch('/api/auth/2fa/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        })
            .then(async (res) => {
                if (!active) return;
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data?.error ?? 'Weryfikacja nie powiodła się.');
                }
                return res.json();
            })
            .then((data) => {
                if (!active || !data) return;
                setUser(data.user);
                setStatus('success');
                setTimeout(() => router.push(getRedirectPath(data.user.role)), 1500);
            })
            .catch((err: unknown) => {
                if (!active) return;
                setStatus('error');
                setErrorMessage(err instanceof Error ? err.message : 'Weryfikacja nie powiodła się.');
            });

        return () => {
            active = false;
        };
    }, [token, router, setUser]);

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
                    {status === 'verifying' && (
                        <>
                            <div className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                            <p className="text-slate-600">Weryfikacja&hellip;</p>
                        </>
                    )}
                    {status === 'success' && (
                        <>
                            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Zalogowano!</h2>
                            <p className="text-slate-500 text-sm">Przekierowuję do panelu&hellip;</p>
                        </>
                    )}
                    {status === 'error' && (
                        <>
                            <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Błąd weryfikacji</h2>
                            <p className="text-slate-600 text-sm mb-6">{errorMessage}</p>
                            <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                Wróć do logowania
                            </Link>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

export default function VerifyMfaPage() {
    return (
        <Suspense>
            <VerifyMfaContent />
        </Suspense>
    );
}
