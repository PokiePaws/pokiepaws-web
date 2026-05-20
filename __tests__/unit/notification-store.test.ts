import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useNotificationStore } from '../../store/use-notification-store';

beforeEach(() => {
    // Resetuj store przed każdym testem
    useNotificationStore.setState({ notifications: [] });
});

describe('useNotificationStore', () => {
    it('inicjalizuje się z pustą listą powiadomień', () => {
        const { result } = renderHook(() => useNotificationStore());
        expect(result.current.notifications).toHaveLength(0);
    });

    it('addNotification dodaje powiadomienie z id i timestamp', () => {
        const { result } = renderHook(() => useNotificationStore());

        act(() => {
            result.current.addNotification({ message: 'Test', type: 'info' });
        });

        expect(result.current.notifications).toHaveLength(1);
        expect(result.current.notifications[0].message).toBe('Test');
        expect(result.current.notifications[0].type).toBe('info');
        expect(result.current.notifications[0].id).toBeDefined();
        expect(result.current.notifications[0].timestamp).toBeInstanceOf(Date);
    });

    it('removeNotification usuwa powiadomienie po id', () => {
        const { result } = renderHook(() => useNotificationStore());

        act(() => {
            result.current.addNotification({ message: 'Do usunięcia', type: 'warning' });
        });

        const id = result.current.notifications[0].id;

        act(() => {
            result.current.removeNotification(id);
        });

        expect(result.current.notifications).toHaveLength(0);
    });

    it('removeNotification nie usuwa innych powiadomień', () => {
        const { result } = renderHook(() => useNotificationStore());

        act(() => {
            result.current.addNotification({ message: 'Pierwsze', type: 'info' });
            result.current.addNotification({ message: 'Drugie', type: 'success' });
        });

        const idDrugie = result.current.notifications[0].id; // najnowsze jest pierwsze

        act(() => {
            result.current.removeNotification(idDrugie);
        });

        expect(result.current.notifications).toHaveLength(1);
        expect(result.current.notifications[0].message).toBe('Pierwsze');
    });

    it('przechowuje maksymalnie 5 powiadomień', () => {
        const { result } = renderHook(() => useNotificationStore());

        act(() => {
            for (let i = 0; i < 7; i++) {
                result.current.addNotification({ message: `Powiadomienie ${i}`, type: 'info' });
            }
        });

        expect(result.current.notifications).toHaveLength(5);
    });

    it('najnowsze powiadomienie jest na początku listy', () => {
        const { result } = renderHook(() => useNotificationStore());

        act(() => {
            result.current.addNotification({ message: 'Stare', type: 'info' });
            result.current.addNotification({ message: 'Nowe', type: 'success' });
        });

        expect(result.current.notifications[0].message).toBe('Nowe');
    });
});
