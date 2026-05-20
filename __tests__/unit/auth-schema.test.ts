import { describe, it, expect } from 'vitest';
import { loginRequestSchema } from '../../lib/features/auth/auth-schema';

describe('loginRequestSchema', () => {
    it('przepuszcza poprawne dane', () => {
        const result = loginRequestSchema.safeParse({
            email: 'user@example.com',
            password: 'Password123!',
        });
        expect(result.success).toBe(true);
    });

    it('odrzuca niepoprawny email', () => {
        const result = loginRequestSchema.safeParse({
            email: 'nieemail',
            password: 'Password123!',
        });
        expect(result.success).toBe(false);
    });

    it('odrzuca hasło krótsze niż 8 znaków', () => {
        const result = loginRequestSchema.safeParse({
            email: 'user@example.com',
            password: '1234567',
        });
        expect(result.success).toBe(false);
    });

    it('odrzuca puste pola', () => {
        const result = loginRequestSchema.safeParse({});
        expect(result.success).toBe(false);
    });

    it('odrzuca brakujące hasło', () => {
        const result = loginRequestSchema.safeParse({ email: 'user@example.com' });
        expect(result.success).toBe(false);
    });

    it('akceptuje hasło o minimalnej długości 8 znaków', () => {
        const result = loginRequestSchema.safeParse({
            email: 'user@example.com',
            password: '12345678',
        });
        expect(result.success).toBe(true);
    });
});
