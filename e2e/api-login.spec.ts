import { test, expect } from '@playwright/test';

test.describe('API route POST /api/auth/login', () => {
    test('zwraca 400 przy pustym body', async ({ request }) => {
        const res = await request.post('/api/auth/login', { data: {} });
        expect(res.status()).toBe(400);
        const body = await res.json();
        expect(body).toHaveProperty('message');
    });

    test('zwraca 400 przy złym formacie email', async ({ request }) => {
        const res = await request.post('/api/auth/login', {
            data: { email: 'nieemail', password: 'Password123!' },
        });
        expect(res.status()).toBe(400);
    });

    test('zwraca 400 przy haśle krótszym niż 8 znaków', async ({ request }) => {
        const res = await request.post('/api/auth/login', {
            data: { email: 'user@example.com', password: '1234' },
        });
        expect(res.status()).toBe(400);
    });

    test('zwraca błąd (nie 400) przy poprawnym formacie, ale złych danych', async ({ request }) => {
        const res = await request.post('/api/auth/login', {
            data: { email: 'nouser@example.com', password: 'ValidPass123!' },
        });
        // Format OK → Zod przepuszcza, backend zwraca 401/403/502
        expect(res.status()).not.toBe(400);
        const body = await res.json();
        expect(body).toHaveProperty('message');
    });
});
