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
    warehouseId: z.number().nullable().optional(),
    warehouseName: z.string().nullable().optional(),
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

export const prescriptionItemSchema = z.object({
    id: z.number(),
    productId: z.number(),
    productName: z.string().nullable().optional(),
    quantityPackages: z.number().nullable().optional(),
    dosage: z.string().nullable().optional(),
    treatmentTime: z.string().nullable().optional(),
});

export const prescriptionSchema = z.object({
    id: z.number(),
    visitId: z.number(),
    vetUserId: z.number(),
    clinicId: z.number(),
    recommendationDate: z.string().nullable().optional(),
    creationDate: z.string().nullable().optional(),
    items: z.array(prescriptionItemSchema).default([]),
});

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
export type Prescription = z.infer<typeof prescriptionSchema>;
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

export type UpdateVisitMedicalDataRequest = {
    disease?: string;
    diagnosis?: string;
    recommendations?: string;
};

export type CreatePrescriptionRequest = {
    recommendationDate?: string;
    items: Array<{
        productId: number;
        quantityPackages?: number;
        dosage?: string;
        treatmentTime?: string;
    }>;
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
    warehouseId?: number;
    active?: boolean;
    npwz?: string;
    phone?: string;
    specialization?: string;
};

export const clinicOrderSchema = z.object({
    id: z.number(),
    clinicId: z.number(),
    clinicName: z.string().nullable().optional(),
    name: z.string(),
    amount: z.number(),
    description: z.string().nullable().optional(),
    category: z.string().nullable().optional(),
    status: z.string(),
    unit: z.string().nullable().optional(),
    expiryDate: z.string().nullable().optional(),
});

export const clinicOrdersSchema = z.array(clinicOrderSchema);

export const warehouseStockItemSchema = z.object({
    id: z.number(),
    warehouseId: z.number(),
    name: z.string(),
    assortmentDescription: z.string().nullable().optional(),
    price: z.number().nullable().optional(),
    unit: z.string().nullable().optional(),
    category: z.string().nullable().optional(),
    amount: z.number(),
    expiryDate: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
});

export const warehouseStockSchema = z.array(warehouseStockItemSchema);

export const adminWarehouseSchema = z.object({
    id: z.number(),
    warehouseName: z.string(),
    city: z.string().nullable().optional(),
    street: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    active: z.boolean().nullable().optional(),
});

export const adminWarehousesSchema = z.array(adminWarehouseSchema);

export const warehouseWorkerMeSchema = z.object({
    warehouseId: z.number(),
    warehouseName: z.string(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    email: z.string(),
});

export const vetMeResponseSchema = z.object({
    userId: z.number(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    npwz: z.string().nullable().optional(),
    specialization: z.string().nullable().optional(),
    clinicId: z.number().nullable().optional(),
    clinicName: z.string().nullable().optional(),
});

export const labOrderPrioritySchema = z.enum(['NORMAL', 'HIGH', 'URGENT']);
export const labOrderStatusSchema = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);

export const labOrderSchema = z.object({
    id: z.number(),
    animalId: z.number(),
    animalName: z.string(),
    animalSpecies: z.string().nullable().optional(),
    visitId: z.number().nullable().optional(),
    vetUserId: z.number(),
    vetFirstName: z.string().nullable().optional(),
    vetLastName: z.string().nullable().optional(),
    clinicId: z.number(),
    testType: z.string(),
    clinicalReason: z.string().nullable().optional(),
    priority: labOrderPrioritySchema,
    status: labOrderStatusSchema,
    orderedAt: z.string(),
    completedAt: z.string().nullable().optional(),
});

export const labOrdersSchema = z.array(labOrderSchema);

export const productSchema = z.object({
    id: z.number(),
    name: z.string(),
    unit: z.string().nullable().optional(),
});

export const productsSchema = z.array(productSchema);

export type AdminWarehouse = z.infer<typeof adminWarehouseSchema>;
export type LabOrder = z.infer<typeof labOrderSchema>;
export type LabOrderPriority = z.infer<typeof labOrderPrioritySchema>;
export type LabOrderStatus = z.infer<typeof labOrderStatusSchema>;
export type Product = z.infer<typeof productSchema>;

export type CreateLabOrderRequest = {
    animalId: number;
    testType: string;
    priority: 'NORMAL' | 'HIGH' | 'URGENT';
    clinicalReason?: string;
    visitId?: number;
};

export type ClinicOrder = z.infer<typeof clinicOrderSchema>;
export type WarehouseStockItem = z.infer<typeof warehouseStockItemSchema>;
export type WarehouseWorkerMe = z.infer<typeof warehouseWorkerMeSchema>;
export type VetMeResponse = z.infer<typeof vetMeResponseSchema>;

export type CreateOrderRequest = {
    clinicId: number;
    name: string;
    amount: number;
    description?: string;
    category?: string;
    unit?: string;
    expiryDate?: string;
};

export type WarehouseStockItemRequest = {
    warehouseId: number;
    name: string;
    assortmentDescription?: string;
    price?: number;
    unit?: string;
    category?: string;
    amount: number;
    expiryDate?: string;
    status?: string;
};
