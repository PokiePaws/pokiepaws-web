import { z } from 'zod';
import { clinicSchema } from './clinics/clinic-schema';

export const animalSchema = z.object({
    id: z.number(),
    name: z.string(),
    species: z.string(),
    breed: z.string().nullable().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'HERMAPHRODITE']),
    color: z.string().nullable().optional(),
    microchipNumber: z.string().nullable().optional(),
    weight: z.number().nullable().optional(),
    birthDate: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
});

export const animalsSchema = z.array(animalSchema);

export const visitSchema = z.object({
    id: z.number(),
    animalId: z.number(),
    clinicId: z.number(),
    vetUserId: z.number(),
    startsAt: z.string(),
    endsAt: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    disease: z.string().nullable().optional(),
    diagnosis: z.string().nullable().optional(),
    recommendations: z.string().nullable().optional(),
    status: z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'DONE', 'CANCELLED']),
    used: z.boolean().nullable().optional(),
});

export const visitsSchema = z.array(visitSchema);

export const vetSchema = z.object({
    userId: z.number(),
    clinic: clinicSchema.nullable().optional(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    npwz: z.string().nullable().optional(),
    specialization: z.string().nullable().optional(),
    active: z.boolean().nullable().optional(),
});

export const vetsSchema = z.array(vetSchema);

export const userAdminSchema = z.object({
    id: z.number(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    email: z.string(),
    role: z.string(),
    clinicId: z.number().nullable().optional(),
    clinicName: z.string().nullable().optional(),
    active: z.boolean().nullable().optional(),
    emailVerified: z.boolean().nullable().optional(),
    npwz: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    specialization: z.string().nullable().optional(),
});

export const usersAdminSchema = z.array(userAdminSchema);

export const activityLogSchema = z.object({
    id: z.number(),
    type: z.string().nullable().optional(),
    userEmail: z.string().nullable().optional(),
    detail: z.string().nullable().optional(),
    clinic: z.string().nullable().optional(),
    time: z.string().nullable().optional(),
});

export const activityLogsSchema = z.array(activityLogSchema);

export const availableSlotsSchema = z.object({
    clinicId: z.number(),
    vetUserId: z.number(),
    date: z.string(),
    slotMinutes: z.number().nullable().optional(),
    workdayStart: z.string().nullable().optional(),
    workdayEnd: z.string().nullable().optional(),
    availableStarts: z.array(z.string()),
});

export type Animal = z.infer<typeof animalSchema>;
export type Visit = z.infer<typeof visitSchema>;
export type Vet = z.infer<typeof vetSchema>;
export type UserAdmin = z.infer<typeof userAdminSchema>;
export type ActivityLog = z.infer<typeof activityLogSchema>;
export type AvailableSlots = z.infer<typeof availableSlotsSchema>;

export type AnimalRequest = {
    name: string;
    species: string;
    breed?: string;
    gender: 'MALE' | 'FEMALE' | 'HERMAPHRODITE';
    color?: string;
    microchipNumber?: string;
    weight?: number;
    birthDate?: string;
    notes?: string;
};

export type CreateVisitRequest = {
    animalId: number;
    clinicId: number;
    vetUserId: number;
    startsAt: string;
    description?: string;
};

export type ClinicRequest = {
    clinicName: string;
    regon?: string;
    nip?: string;
    street: string;
    houseNumber: string;
    apartmentNumber?: string;
    postalCode: string;
    city: string;
    country: string;
    workingHours?: string;
    phone?: string;
    email?: string;
    active: boolean;
};

export type UserAdminRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: string;
    clinicId?: number;
    active?: boolean;
    npwz?: string;
    phone?: string;
    specialization?: string;
};
