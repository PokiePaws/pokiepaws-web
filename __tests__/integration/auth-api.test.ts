import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../msw/server';
import { authApi } from '../../lib/features/auth/auth-api';
import { isMfaPendingSession } from '../../lib/features/auth/auth-types';

describe('authApi.login', () => {
    it('zwraca AuthSession przy poprawnych danych', async () => {
        const result = await authApi.login('user@example.com', 'Password123!');

        expect(isMfaPendingSession(result)).toBe(false);
        if (!isMfaPendingSession(result)) {
            expect(result.user.email).toBe('user@example.com');
            expect(result.user.role).toBe('Client');
        }
    });

    it('zwraca MfaPendingSession gdy backend wymaga 2FA', async () => {
        server.use(
            http.post('/api/auth/login', () => {
                return HttpResponse.json(
                    { mfaRequired: true, email: 'mfa@example.com', message: 'Sprawdź email.' },
                    { status: 202 },
                );
            }),
        );

        const result = await authApi.login('mfa@example.com', 'Password123!');

        expect(isMfaPendingSession(result)).toBe(true);
        if (isMfaPendingSession(result)) {
            expect(result.email).toBe('mfa@example.com');
        }
    });

    it('rzuca błąd przy niepoprawnych danych (401)', async () => {
        server.use(
            http.post('/api/auth/login', () => {
                return HttpResponse.json({ message: 'Nieprawidłowy email lub hasło.' }, { status: 401 });
            }),
        );

        await expect(authApi.login('wrong@example.com', 'WrongPass1!')).rejects.toThrow(
            'Nieprawidłowy email lub hasło.',
        );
    });

    it('rzuca ogólny błąd przy awarii serwera (500)', async () => {
        server.use(
            http.post('/api/auth/login', () => {
                return new HttpResponse(null, { status: 500 });
            }),
        );

        await expect(authApi.login('user@example.com', 'Password123!')).rejects.toThrow();
    });
});

describe('authApi.getSession', () => {
    it('zwraca sesję zalogowanego użytkownika', async () => {
        const session = await authApi.getSession();

        expect(session).not.toBeNull();
        expect(session?.user.email).toBe('user@example.com');
    });

    it('zwraca null gdy brak sesji', async () => {
        server.use(
            http.get('/api/auth/session', () => {
                return HttpResponse.json(null);
            }),
        );

        const session = await authApi.getSession();
        expect(session).toBeNull();
    });
});

describe('authApi.logout', () => {
    it('wykonuje logout bez błędu', async () => {
        await expect(authApi.logout()).resolves.toBeUndefined();
    });
});
