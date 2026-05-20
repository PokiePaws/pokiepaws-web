import type { Page, BrowserContext } from '@playwright/test';

const COOKIES = {
    token: 'pokiepaws_access_token',
    email: 'pokiepaws_user_email',
    role:  'pokiepaws_user_role',
};

export async function loginAs(
    context: BrowserContext,
    role: 'Admin' | 'Staff' | 'Client',
    email = `${role.toLowerCase()}@pokiepaws.pl`,
) {
    await context.addCookies([
        { name: COOKIES.token, value: 'mock-token',    domain: 'localhost', path: '/' },
        { name: COOKIES.email, value: email,           domain: 'localhost', path: '/' },
        { name: COOKIES.role,  value: role,            domain: 'localhost', path: '/' },
    ]);
}

/** Mockuje /api/auth/session zwracając zalogowanego użytkownika */
export async function mockSession(
    page: Page,
    role: 'Admin' | 'Staff' | 'Client',
    email = `${role.toLowerCase()}@pokiepaws.pl`,
) {
    await page.route('**/api/auth/session', (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ user: { id: email, name: email, email, role } }),
        }),
    );
}

/** Mockuje wszystkie endpointy backendu zwracając puste tablice / null */
export async function mockBackendEmpty(page: Page) {
    await page.route('**/api/backend/**', (route) => {
        // Domyślnie zwróć pustą tablicę dla GETów
        if (route.request().method() === 'GET') {
            return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
        }
        return route.fulfill({ status: 200, contentType: 'application/json', body: 'null' });
    });
}

export const MOCK_ADMIN_USERS = [
    {
        id: 1, firstName: 'Jan', lastName: 'Kowalski', email: 'jan@pokiepaws.pl',
        role: 'VET', clinicId: 1, clinicName: 'Klinika Łapa', npwz: '1234567',
        phone: '123456789', specialization: 'Chirurgia', active: true,
    },
];

export const MOCK_ADMIN_CLINICS = [
    {
        id: 1, clinicName: 'Klinika Łapa', street: 'ul. Pszeniczna', houseNumber: '12',
        postalCode: '00-001', city: 'Warszawa', country: 'PL', nip: '1234567890',
        regon: '', workingHours: 'Pon-Pt 8-20', phone: null, email: null, active: true,
    },
];

export const MOCK_VISITS = [
    {
        id: 1, animalId: 10, clinicId: 1, vetUserId: 2,
        startsAt: new Date().toISOString(),
        status: 'SCHEDULED', description: 'Kontrola', disease: null,
        diagnosis: null, recommendations: null,
    },
];
