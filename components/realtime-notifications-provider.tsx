'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/use-auth-store';
import { useNotificationStore } from '../store/use-notification-store';
import { notificationsApi } from '../lib/features/notifications/notifications-api';
import { getApiBaseUrl } from '../lib/config/env';

const RECONNECT_DELAY_MS = 5000;

// Maps backend RealtimeEventType to a human-readable Polish message
function buildMessage(type: string, details: Record<string, unknown>): string {
    switch (type) {
        case 'VISIT_CREATED':
            return `Nowa wizyta zaplanowana${details.startsAt ? ` na ${String(details.startsAt).slice(0, 16).replace('T', ' ')}` : ''}`;
        case 'VISIT_CONFIRMED':
            return 'Wizyta została potwierdzona';
        case 'VISIT_CANCELLED':
            return `Wizyta anulowana${details.startsAt ? ` (${String(details.startsAt).slice(0, 16).replace('T', ' ')})` : ''}`;
        case 'VISIT_MEDICAL_DATA_UPDATED':
            return 'Dane medyczne wizyty zostały zaktualizowane';
        case 'PRESCRIPTION_CREATED':
            return 'Nowa recepta została wystawiona';
        case 'ORDER_CREATED':
            return `Nowe zamówienie: ${details.name ?? ''} ×${details.amount ?? ''}`;
        case 'ORDER_STATUS_UPDATED':
            return `Zamówienie "${details.name ?? ''}" — status: ${details.status ?? ''}`;
        case 'CLINIC_STOCK_UPDATED':
            return 'Stan asortymentu kliniki został zaktualizowany';
        case 'LAB_ORDER_CREATED':
            return `Nowe zlecenie laboratoryjne: ${details.testType ?? ''}`;
        case 'LAB_ORDER_STATUS_UPDATED':
            return `Wynik badania — status: ${details.status ?? ''}`;
        case 'ACTIVITY_LOG_CREATED':
            return `Zdarzenie systemowe: ${details.type ?? ''}`;
        default:
            return type;
    }
}

// Which TanStack Query cache keys to invalidate for each event type
function getInvalidationKeys(type: string): string[][] {
    switch (type) {
        case 'VISIT_CREATED':
        case 'VISIT_CONFIRMED':
        case 'VISIT_CANCELLED':
        case 'VISIT_MEDICAL_DATA_UPDATED':
            return [['visits']];
        case 'ORDER_CREATED':
        case 'ORDER_STATUS_UPDATED':
            return [['warehouse', 'orders']];
        case 'CLINIC_STOCK_UPDATED':
            return [['warehouse', 'stock'], ['products']];
        case 'LAB_ORDER_CREATED':
        case 'LAB_ORDER_STATUS_UPDATED':
            return [['labOrders']];
        case 'PRESCRIPTION_CREATED':
            return [['prescription']];
        default:
            return [];
    }
}

export default function RealtimeNotificationsProvider() {
    const user = useAuthStore((state) => state.user);
    const addNotification = useNotificationStore((state) => state.addNotification);
    const queryClient = useQueryClient();
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!user) return;

        let active = true;

        async function connect() {
            if (!active || !user) return;

            const [token, subscriptions] = await Promise.all([
                notificationsApi.getRealtimeToken(),
                notificationsApi.getSubscriptions(user.role, user.apiRole),
            ]);

            if (!active || !token) return;

            const baseUrl = getApiBaseUrl().replace(/^http/, 'ws');
            const ws = new WebSocket(`${baseUrl}/ws-native?token=${token}`);
            wsRef.current = ws;

            ws.onopen = () => {
                // STOMP CONNECT frame — Authorization header required by JwtStompChannelInterceptor
                ws.send(`CONNECT\naccept-version:1.2\nheart-beat:0,0\nAuthorization:Bearer ${token}\n\n\0`);
            };

            ws.onmessage = (event: MessageEvent<string>) => {
                const frame = event.data;

                if (frame.startsWith('CONNECTED')) {
                    subscriptions.forEach((sub, i) => {
                        ws.send(`SUBSCRIBE\nid:sub-${i}\ndestination:${sub.topic}\n\n\0`);
                    });
                    return;
                }

                if (frame.startsWith('MESSAGE')) {
                    const bodyStart = frame.indexOf('\n\n');
                    if (bodyStart === -1) return;
                    const body = frame.slice(bodyStart + 2).replace(/\0$/, '');
                    try {
                        const payload = JSON.parse(body);
                        const eventType: string = payload.type ?? '';
                        const details: Record<string, unknown> = payload.details ?? {};

                        // Build human-readable message
                        const message = buildMessage(eventType, details) || payload.message || body;

                        // Show UI notification
                        addNotification({ message, type: 'info' });

                        // Browser push notification
                        if (Notification.permission === 'granted') {
                            new Notification('PokiePaws', { body: message });
                        }

                        // Invalidate relevant cache keys so UI refreshes automatically
                        getInvalidationKeys(eventType).forEach((key) => {
                            queryClient.invalidateQueries({ queryKey: key });
                        });
                    } catch {
                        // non-JSON message — ignore
                    }
                }
            };

            ws.onclose = () => {
                if (!active) return;
                reconnectTimerRef.current = setTimeout(connect, RECONNECT_DELAY_MS);
            };

            ws.onerror = () => {
                ws.close();
            };
        }

        if (Notification.permission === 'default') {
            Notification.requestPermission().finally(connect);
        } else {
            connect();
        }

        return () => {
            active = false;
            if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
            if (wsRef.current) {
                wsRef.current.onclose = null;
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [user, addNotification, queryClient]);

    return null;
}
