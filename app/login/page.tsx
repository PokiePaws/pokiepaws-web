'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ChevronRight, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguageStore } from '../../store/use-language-store';
import { translations } from '../../lib/translations';
import { authApi } from '../../lib/features/auth/auth-api';
import { getRedirectPath, isMfaPendingSession } from '../../lib/features/auth/auth-types';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionExpired = searchParams.get('reason') === 'session_expired';
    const { language } = useLanguageStore();

    const t = translations[language];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const session = await authApi.login(email, password);
            if (isMfaPendingSession(session)) {
                router.push(`/auth/2fa/pending?email=${encodeURIComponent(session.email)}`);
                return;
            }
            window.location.href = getRedirectPath(session.user.role);
        } catch (error) {
            setError(error instanceof Error ? error.message : t.login.error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center items-center gap-2 mb-6">
                    <div className="relative w-20 h-20 overflow-hidden rounded-2xl">
                        <Image
                            src="/PokiePaws-logo.png"
                            alt="Logo"
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    <span className="text-3xl font-display font-bold text-slate-900">Pokie Paws</span>
                </Link>
                <h2 className="text-center text-3xl font-display font-bold text-slate-900">
                    {t.login.title}
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    {t.login.subtitle}
                </p>
            </div>


            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100"
                >
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {sessionExpired && !error && (
                            <div className="bg-amber-50 border border-amber-100 text-amber-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                                <Clock className="h-5 w-5 flex-shrink-0" />
                                <p>{language === 'pl' ? 'Sesja wygasła. Zaloguj się ponownie.' : 'Your session expired. Please sign in again.'}</p>
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                                {t.login.email}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                                {t.login.password}
                            </label>
                            <div className="mt-1">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                                Remember me
                            </label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                    {t.login.button}
                                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                                )}
                            </button>
                        </div>
                    </form>

                </motion.div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
