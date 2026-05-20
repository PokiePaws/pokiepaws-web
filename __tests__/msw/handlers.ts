import { http, HttpResponse } from 'msw';

export const mockClinics = [
    {
        id: 1,
        clinicName: 'Klinika Weterynaryjna Łapa',
        street: 'ul. Pszeniczna',
        houseNumber: '12',
        apartmentNumber: null,
        postalCode: '00-001',
        city: 'Warszawa',
        country: 'PL',
        workingHours: 'Pon-Pt 8:00-20:00',
        phone: '+48 123 456 789',
        email: 'lapa@example.com',
        active: true,
        imageUrl: null,
    },
    {
        id: 2,
        clinicName: 'Gabinet Wet-Med',
        street: 'ul. Zwierzyniecka',
        houseNumber: '5',
        apartmentNumber: null,
        postalCode: '30-001',
        city: 'Kraków',
        country: 'PL',
        workingHours: 'Pon-Sb 9:00-18:00',
        phone: null,
        email: null,
        active: true,
        imageUrl: null,
    },
];

export const mockSession = {
    user: {
        id: 'user@example.com',
        name: 'user@example.com',
        email: 'user@example.com',
        role: 'Client' as const,
    },
};

export const handlers = [
    // Auth: login – sukces
    http.post('/api/auth/login', () => {
        return HttpResponse.json(mockSession);
    }),

    // Auth: session
    http.get('/api/auth/session', () => {
        return HttpResponse.json(mockSession);
    }),

    // Auth: logout
    http.post('/api/auth/logout', () => {
        return new HttpResponse(null, { status: 200 });
    }),

    // Clinics: all
    http.get('/api/backend/api/clinics', () => {
        return HttpResponse.json(mockClinics);
    }),

    // Clinics: by city
    http.get('/api/backend/api/clinics/city/:city', ({ params }) => {
        const city = decodeURIComponent(params.city as string);
        return HttpResponse.json(mockClinics.filter((c) => c.city === city));
    }),

    // Clinics: single
    http.get('/api/backend/api/clinics/:id', ({ params }) => {
        const clinic = mockClinics.find((c) => c.id === Number(params.id));
        if (!clinic) return new HttpResponse(null, { status: 404 });
        return HttpResponse.json(clinic);
    }),
];
