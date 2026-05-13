import { z } from 'zod';

export const clinicSchema = z.object({
    id: z.number(),
    clinicName: z.string(),
    street: z.string(),
    houseNumber: z.string(),
    apartmentNumber: z.string().nullable().optional(),
    postalCode: z.string(),
    city: z.string(),
    country: z.string(),
    workingHours: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    email: z.string().email().nullable().optional(),
    active: z.boolean(),
    imageUrl: z.string().url().nullable().optional(),
});

export const clinicsSchema = z.array(clinicSchema);
