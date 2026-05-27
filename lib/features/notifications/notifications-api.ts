import type { UserRole } from '../auth/auth-types';

export interface NotificationSubscription {
    topic: string;
}

const notificationsApi = {
    async getSubscriptions(role: UserRole): Promise<NotificationSubscription[]> {
        const path = role === 'Admin' ? 'admin' : 'vets/me';
        const res = await fetch(`/api/backend/api/${path}/notifications/subscriptions`, {
            cache: 'no-store',
        });
        if (!res.ok) return [];
        return res.json();
    },

    async getRealtimeToken(): Promise<string | null> {
        const res = await fetch('/api/auth/realtime-token', { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        return data.token ?? null;
    },
};

export { notificationsApi };
