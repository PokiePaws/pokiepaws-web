'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import AuthSessionProvider from './auth-session-provider';
import RealtimeNotificationsProvider from './realtime-notifications-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <AuthSessionProvider>
                <RealtimeNotificationsProvider />
                {children}
            </AuthSessionProvider>
        </QueryClientProvider>
    );
}
