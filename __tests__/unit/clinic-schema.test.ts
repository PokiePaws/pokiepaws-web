import { describe, it, expect } from 'vitest';
import { clinicSchema, clinicsSchema } from '../../lib/features/clinics/clinic-schema';

const validClinic = {
    id: 1,
    clinicName: 'Klinika Łapa',
    street: 'ul. Pszeniczna',
    houseNumber: '12',
    postalCode: '00-001',
    city: 'Warszawa',
    country: 'PL',
    active: true,
};

describe('clinicSchema', () => {
    it('parsuje poprawny obiekt kliniki', () => {
        const result = clinicSchema.safeParse(validClinic);
        expect(result.success).toBe(true);
    });

    it('akceptuje pola opcjonalne jako null', () => {
        const result = clinicSchema.safeParse({
            ...validClinic,
            workingHours: null,
            phone: null,
            email: null,
            imageUrl: null,
            apartmentNumber: null,
        });
        expect(result.success).toBe(true);
    });

    it('akceptuje pola opcjonalne jako undefined (nieobecne)', () => {
        const result = clinicSchema.safeParse(validClinic);
        expect(result.success).toBe(true);
    });

    it('odrzuca klinikę bez wymaganego pola clinicName', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { clinicName: _clinicName, ...withoutName } = validClinic;
        const result = clinicSchema.safeParse(withoutName);
        expect(result.success).toBe(false);
    });

    it('odrzuca klinikę bez id', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, ...withoutId } = validClinic;
        const result = clinicSchema.safeParse(withoutId);
        expect(result.success).toBe(false);
    });

    it('odrzuca email w złym formacie', () => {
        const result = clinicSchema.safeParse({
            ...validClinic,
            email: 'nieemail',
        });
        expect(result.success).toBe(false);
    });
});

describe('clinicsSchema', () => {
    it('parsuje tablicę klinik', () => {
        const result = clinicsSchema.safeParse([validClinic, { ...validClinic, id: 2 }]);
        expect(result.success).toBe(true);
        if (result.success) expect(result.data).toHaveLength(2);
    });

    it('parsuje pustą tablicę', () => {
        const result = clinicsSchema.safeParse([]);
        expect(result.success).toBe(true);
        if (result.success) expect(result.data).toHaveLength(0);
    });

    it('odrzuca tablicę z niepoprawnym elementem', () => {
        const result = clinicsSchema.safeParse([{ id: 'not-a-number' }]);
        expect(result.success).toBe(false);
    });
});
