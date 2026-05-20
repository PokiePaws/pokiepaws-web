import { describe, it, expect } from 'vitest';
import {
    mapApiRole,
    getRedirectPath,
    isMfaPendingSession,
    type LoginResult,
} from '../../lib/features/auth/auth-types';

describe('mapApiRole', () => {
    it('ADMIN → Admin', () => {
        expect(mapApiRole('ADMIN')).toBe('Admin');
    });

    it('VET → Staff', () => {
        expect(mapApiRole('VET')).toBe('Staff');
    });

    it('WAREHOUSE → Staff', () => {
        expect(mapApiRole('WAREHOUSE')).toBe('Staff');
    });

    it('OWNER → Client', () => {
        expect(mapApiRole('OWNER')).toBe('Client');
    });

    it('GUEST → Client', () => {
        expect(mapApiRole('GUEST')).toBe('Client');
    });
});

describe('getRedirectPath', () => {
    it('Admin → /admin', () => {
        expect(getRedirectPath('Admin')).toBe('/admin');
    });

    it('SuperAdmin → /admin', () => {
        expect(getRedirectPath('SuperAdmin')).toBe('/admin');
    });

    it('Staff → /staff', () => {
        expect(getRedirectPath('Staff')).toBe('/staff');
    });

    it('Client → /dashboard', () => {
        expect(getRedirectPath('Client')).toBe('/dashboard');
    });
});

describe('isMfaPendingSession', () => {
    it('zwraca true dla sesji MFA', () => {
        const mfaSession: LoginResult = {
            mfaRequired: true,
            email: 'user@example.com',
        };
        expect(isMfaPendingSession(mfaSession)).toBe(true);
    });

    it('zwraca false dla normalnej sesji', () => {
        const authSession: LoginResult = {
            user: {
                id: '1',
                name: 'Jan',
                email: 'jan@example.com',
                role: 'Client',
            },
        };
        expect(isMfaPendingSession(authSession)).toBe(false);
    });
});
