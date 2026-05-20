'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/use-auth-store';
import { useNotificationStore } from '../store/use-notification-store';
import { notificationsApi } from '../lib/features/notifications/notifications-api';
import { getApiBaseUrl } from '../lib/config/env';

const RECONNECT_DELAY_MS = 5000;

export default function RealtimeNotificationsProvider() {
    const user = useAuthStore((state) => state.user);
    const addNotification = useNotificationStore((state) => state.addNotification);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!user) return;

        let active = true;

        async function connect() {
            if (!active || !user) return;

            const [token, subscriptions] = await Promise.all([
                notificationsApi.getRealtimeToken(),
                notificationsApi.getSubscriptions(user.role),
            ]);

            if (!active || !token) return;

            const baseUrl = getApiBaseUrl().replace(/^http/, 'ws');
            const ws = new WebSocket(`${baseUrl}/ws-native?token=${token}`);
            wsRef.current = ws;

            ws.onopen = () => {
                // STOMP CONNECT frame
                ws.send('CONNECT\naccept-version:1.2\nheart-beat:0,0\n\n\0');
            };

            ws.onmessage = (event: MessageEvent<string>) => {
                const frame = event.data;

                if (frame.startsWith('CONNECTED')) {
                    // Subscribe to each topic
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
                        const message = payload.message ?? payload.content ?? body;
                        if (typeof message === 'string') {
                            addNotification({ message, type: 'info' });
                            if (Notification.permission === 'granted') {
                                new Notification('PokiePaws', { body: message });
                            }
                        }
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

        // Request notification permission then connect
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
    }, [user, addNotification]);

    return null;
}
