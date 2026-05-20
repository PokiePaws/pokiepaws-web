import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useAuthStore } from '../../store/use-auth-store';
import type { User } from '../../lib/features/auth/auth-types';

const mockUser: User = {
    id: 'jan@example.com',
    name: 'jan@example.com',
    email: 'jan@example.com',
    role: 'Client',
};

beforeEach(() => {
    useAuthStore.setState({
        user: null,
        isAuthenticated: false,
        isSessionResolved: false,
    });
});

describe('useAuthStore', () => {
    it('inicjalizuje się bez zalogowanego użytkownika', () => {
        const { result } = renderHook(() => useAuthStore());
        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.isSessionResolved).toBe(false);
    });

    it('setUser ustawia użytkownika i isAuthenticated na true', () => {
        const { result } = renderHook(() => useAuthStore());

        act(() => {
            result.current.setUser(mockUser);
        });

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.isSessionResolved).toBe(true);
    });

    it('setUser(null) czyści użytkownika', () => {
        const { result } = renderHook(() => useAuthStore());

        act(() => {
            result.current.setUser(mockUser);
        });

        act(() => {
            result.current.setUser(null);
        });

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
    });

    it('setSessionResolved ustawia flagę', () => {
        const { result } = renderHook(() => useAuthStore());

        act(() => {
            result.current.setSessionResolved(true);
        });

        expect(result.current.isSessionResolved).toBe(true);
    });

    it('logout resetuje stan użytkownika', async () => {
        const { result } = renderHook(() => useAuthStore());

        act(() => {
            result.current.setUser(mockUser);
        });

        // Mockujemy window.location.href (jsdom nie obsługuje nawigacji)
        const locationSpy = vi.spyOn(window, 'location', 'get').mockReturnValue({
            ...window.location,
            href: '',
        } as Location);

        await act(async () => {
            await result.current.logout();
        });

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.isSessionResolved).toBe(true);

        locationSpy.mockRestore();
    });
});
