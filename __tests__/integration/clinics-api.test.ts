import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../msw/server';
import { clinicsApi } from '../../lib/features/clinics/clinics-api';
import { mockClinics } from '../msw/handlers';

describe('clinicsApi.getClinics', () => {
    it('zwraca listę wszystkich klinik', async () => {
        const clinics = await clinicsApi.getClinics();

        expect(clinics).toHaveLength(2);
        expect(clinics[0].clinicName).toBe('Klinika Weterynaryjna Łapa');
        expect(clinics[0].city).toBe('Warszawa');
    });

    it('zwraca kliniki filtrowane po mieście', async () => {
        const clinics = await clinicsApi.getClinics('Kraków');

        expect(clinics).toHaveLength(1);
        expect(clinics[0].city).toBe('Kraków');
    });

    it('zwraca pustą tablicę gdy brak klinik', async () => {
        server.use(
            http.get('/api/backend/api/clinics', () => {
                return HttpResponse.json([]);
            }),
        );

        const clinics = await clinicsApi.getClinics();
        expect(clinics).toHaveLength(0);
    });

    it('rzuca błąd przy awarii API', async () => {
        server.use(
            http.get('/api/backend/api/clinics', () => {
                return new HttpResponse(null, { status: 500 });
            }),
        );

        await expect(clinicsApi.getClinics()).rejects.toThrow();
    });

    it('parsuje pola opcjonalne jako null', async () => {
        const clinics = await clinicsApi.getClinics();
        // mockClinics[0].imageUrl === null
        expect(clinics[0].imageUrl).toBeNull();
    });
});

describe('clinicsApi.getClinic', () => {
    it('zwraca pojedynczą klinikę po id', async () => {
        const clinic = await clinicsApi.getClinic(1);

        expect(clinic.id).toBe(1);
        expect(clinic.clinicName).toBe('Klinika Weterynaryjna Łapa');
    });

    it('rzuca błąd gdy klinika nie istnieje (404)', async () => {
        await expect(clinicsApi.getClinic(9999)).rejects.toThrow();
    });

    it('parsuje dane przez Zod schema', async () => {
        server.use(
            http.get('/api/backend/api/clinics/:id', () => {
                return HttpResponse.json(mockClinics[1]);
            }),
        );

        const clinic = await clinicsApi.getClinic(2);
        expect(clinic.city).toBe('Kraków');
        expect(clinic.active).toBe(true);
    });
});
