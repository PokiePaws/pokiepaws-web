import Clinic from '../types';
import { httpClient } from '../infrastructure/http/http-client';
import { clinicSchema, clinicsSchema } from './clinics/clinic-schema';
import {
    activityLogsSchema,
    adminWarehousesSchema,
    animalSchema,
    animalsSchema,
    availableSlotsSchema,
    clinicOrderSchema,
    clinicOrdersSchema,
    labOrderSchema,
    labOrdersSchema,
    prescriptionSchema,
    productsSchema,
    userAdminSchema,
    usersAdminSchema,
    vetMeResponseSchema,
    vetsSchema,
    visitSchema,
    visitsSchema,
    warehouseStockItemSchema,
    warehouseStockSchema,
    warehouseWorkerMeSchema,
    type ActivityLog,
    type AdminWarehouse,
    type Animal,
    type AnimalRequest,
    type AvailableSlots,
    type ClinicOrder,
    type ClinicRequest,
    type CreateLabOrderRequest,
    type CreateOrderRequest,
    type CreatePrescriptionRequest,
    type CreateVisitRequest,
    type LabOrder,
    type Prescription,
    type Product,
    type UpdateVisitMedicalDataRequest,
    type UserAdmin,
    type UserAdminRequest,
    type Vet,
    type Visit,
    type WarehouseStockItem,
    type WarehouseStockItemRequest,
    type VetMeResponse,
    type WarehouseWorkerMe,
} from './api-schemas';

export const animalsApi = {
    getMine(): Promise<Animal[]> {
        return httpClient.get<Animal[]>('/api/animals').then((data) => animalsSchema.parse(data));
    },
    create(payload: AnimalRequest): Promise<Animal> {
        return httpClient.post<Animal>('/api/animals', payload).then((data) => animalSchema.parse(data));
    },
};

export const visitsApi = {
    getOwnerUpcoming(): Promise<Visit[]> {
        return httpClient.get<Visit[]>('/api/owners/me/visits/upcoming').then((data) => visitsSchema.parse(data));
    },
    getOwnerRange(from: string, to: string): Promise<Visit[]> {
        return httpClient
            .get<Visit[]>(`/api/owners/me/visits?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
            .then((data) => visitsSchema.parse(data));
    },
    getVetUpcoming(): Promise<Visit[]> {
        return httpClient.get<Visit[]>('/api/vets/me/visits/upcoming').then((data) => visitsSchema.parse(data));
    },
    getVetRange(from: string, to: string): Promise<Visit[]> {
        return httpClient
            .get<Visit[]>(`/api/vets/me/visits?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
            .then((data) => visitsSchema.parse(data));
    },
    create(payload: CreateVisitRequest): Promise<Visit> {
        return httpClient.post<Visit>('/api/visits', payload).then((data) => visitSchema.parse(data));
    },
    cancel(id: number): Promise<Visit> {
        return httpClient.patch<Visit>(`/api/visits/${id}/cancel`).then((data) => visitSchema.parse(data));
    },
    cancelVet(id: number): Promise<Visit> {
        return httpClient.patch<Visit>(`/api/vets/me/visits/${id}/cancel`).then((data) => visitSchema.parse(data));
    },
    confirmVetVisit(id: number): Promise<Visit> {
        return httpClient.post<Visit>(`/api/vets/me/visits/${id}/confirm`).then((data) => visitSchema.parse(data));
    },
    updateMedicalData(id: number, payload: UpdateVisitMedicalDataRequest): Promise<Visit> {
        return httpClient
            .patch<Visit>(`/api/vets/me/visits/${id}/medical-data`, payload)
            .then((data) => visitSchema.parse(data));
    },
    getPrescription(id: number): Promise<Prescription> {
        return httpClient
            .get<Prescription>(`/api/visits/${id}/prescription`)
            .then((data) => prescriptionSchema.parse(data));
    },
    createPrescription(id: number, payload: CreatePrescriptionRequest): Promise<Prescription> {
        return httpClient
            .post<Prescription>(`/api/visits/${id}/prescription`, payload)
            .then((data) => prescriptionSchema.parse(data));
    },
};

export const vetsApi = {
    getAll(): Promise<Vet[]> {
        return httpClient.get<Vet[]>('/api/vets').then((data) => vetsSchema.parse(data));
    },
    getByClinic(clinicId: number): Promise<Vet[]> {
        return httpClient.get<Vet[]>(`/api/vets/clinic/${clinicId}`).then((data) => vetsSchema.parse(data));
    },
    getMe(): Promise<VetMeResponse> {
        return httpClient.get<VetMeResponse>('/api/vets/me').then((data) => vetMeResponseSchema.parse(data));
    },
    getAvailableSlots(clinicId: number, vetUserId: number, date: string): Promise<AvailableSlots> {
        return httpClient
            .get<AvailableSlots>(
                `/api/clinics/${clinicId}/vets/${vetUserId}/available-slots?date=${encodeURIComponent(date)}`,
            )
            .then((data) => availableSlotsSchema.parse(data));
    },
};

export const ordersApi = {
    getAll(clinicId?: number, status?: string): Promise<ClinicOrder[]> {
        const params = new URLSearchParams();
        if (clinicId != null) params.set('clinicId', String(clinicId));
        if (status) params.set('status', status);
        const qs = params.toString();
        return httpClient
            .get<ClinicOrder[]>(`/api/orders${qs ? '?' + qs : ''}`)
            .then((data) => clinicOrdersSchema.parse(data));
    },
    create(payload: CreateOrderRequest): Promise<ClinicOrder> {
        return httpClient.post<ClinicOrder>('/api/orders', payload).then((data) => clinicOrderSchema.parse(data));
    },
    updateStatus(id: number, status: string): Promise<ClinicOrder> {
        return httpClient
            .put<ClinicOrder>(`/api/orders/${id}/status`, { status })
            .then((data) => clinicOrderSchema.parse(data));
    },
};

export const warehouseApi = {
    getMe(): Promise<WarehouseWorkerMe> {
        return httpClient.get<WarehouseWorkerMe>('/api/warehouse-workers/me').then((data) => warehouseWorkerMeSchema.parse(data));
    },
    getStock(warehouseId?: number): Promise<WarehouseStockItem[]> {
        const url = warehouseId != null
            ? `/api/warehouse/stock/warehouse/${warehouseId}`
            : '/api/warehouse/stock';
        return httpClient.get<WarehouseStockItem[]>(url).then((data) => warehouseStockSchema.parse(data));
    },
    createStockItem(payload: WarehouseStockItemRequest): Promise<WarehouseStockItem> {
        return httpClient
            .post<WarehouseStockItem>('/api/warehouse/stock', payload)
            .then((data) => warehouseStockItemSchema.parse(data));
    },
    updateStockItem(id: number, payload: WarehouseStockItemRequest): Promise<WarehouseStockItem> {
        return httpClient
            .put<WarehouseStockItem>(`/api/warehouse/stock/${id}`, payload)
            .then((data) => warehouseStockItemSchema.parse(data));
    },
    deleteStockItem(id: number): Promise<void> {
        return httpClient.delete<void>(`/api/warehouse/stock/${id}`);
    },
};

export const vetVisitsApi = {
    createForVet(payload: { animalId: number; startsAt: string; description?: string }): Promise<Visit> {
        return httpClient.post<Visit>('/api/vets/me/visits', payload).then((data) => visitSchema.parse(data));
    },
    registerPatient(payload: {
        ownerEmail: string;
        ownerFirstName: string;
        ownerLastName: string;
        ownerPhone?: string;
        animalName: string;
        animalSpecies: string;
        animalBreed?: string;
        animalGender: string;
        animalColor?: string;
        animalMicrochipNumber?: string;
        animalWeight?: number;
        animalBirthDate?: string;
        animalNotes?: string;
    }): Promise<Animal> {
        return httpClient.post<Animal>('/api/vets/me/patients', payload).then((data) => animalSchema.parse(data));
    },
};

export const clinicAnimalsApi = {
    getByClinic(clinicId: number): Promise<Animal[]> {
        return httpClient
            .get<Animal[]>(`/api/animals/clinic/${clinicId}`)
            .then((data) => animalsSchema.parse(data));
    },
};

export const productsApi = {
    getAll(): Promise<Product[]> {
        return httpClient.get<Product[]>('/api/products').then((data) => productsSchema.parse(data));
    },
};

export const labOrdersApi = {
    getByClinic(clinicId: number): Promise<LabOrder[]> {
        return httpClient
            .get<LabOrder[]>(`/api/clinics/${clinicId}/lab-orders`)
            .then((data) => labOrdersSchema.parse(data));
    },
    getByAnimal(animalId: number): Promise<LabOrder[]> {
        return httpClient
            .get<LabOrder[]>(`/api/animals/${animalId}/lab-orders`)
            .then((data) => labOrdersSchema.parse(data));
    },
    create(animalId: number, payload: Omit<CreateLabOrderRequest, 'animalId'>): Promise<LabOrder> {
        return httpClient
            .post<LabOrder>(`/api/animals/${animalId}/lab-orders`, payload)
            .then((data) => labOrderSchema.parse(data));
    },
    updateStatus(id: number, status: string): Promise<LabOrder> {
        return httpClient
            .patch<LabOrder>(`/api/lab-orders/${id}/status`, { status })
            .then((data) => labOrderSchema.parse(data));
    },
};

export const adminApi = {
    getUsers(): Promise<UserAdmin[]> {
        return httpClient.get<UserAdmin[]>('/api/admin/users').then((data) => usersAdminSchema.parse(data));
    },
    createUser(payload: UserAdminRequest): Promise<UserAdmin> {
        return httpClient.post<UserAdmin>('/api/admin/users', payload).then((data) => userAdminSchema.parse(data));
    },
    updateUser(id: number, payload: UserAdminRequest): Promise<UserAdmin> {
        return httpClient.put<UserAdmin>(`/api/admin/users/${id}`, payload).then((data) => userAdminSchema.parse(data));
    },
    deleteUser(id: number): Promise<void> {
        return httpClient.delete<void>(`/api/admin/users/${id}`);
    },
    getClinics(): Promise<Clinic[]> {
        return httpClient.get<Clinic[]>('/api/clinics').then((data) => clinicsSchema.parse(data));
    },
    createClinic(payload: ClinicRequest): Promise<Clinic> {
        return httpClient.post<Clinic>('/api/clinics', payload).then((data) => clinicSchema.parse(data));
    },
    updateClinic(id: number, payload: ClinicRequest): Promise<Clinic> {
        return httpClient.put<Clinic>(`/api/clinics/${id}`, payload).then((data) => clinicSchema.parse(data));
    },
    deleteClinic(id: number): Promise<void> {
        return httpClient.delete<void>(`/api/clinics/${id}`);
    },
    getWarehouses(): Promise<AdminWarehouse[]> {
        return httpClient
            .get<AdminWarehouse[]>('/api/admin/warehouses')
            .then((data) => adminWarehousesSchema.parse(data));
    },
    getLogs(limit = 20): Promise<ActivityLog[]> {
        return httpClient
            .get<ActivityLog[]>(`/api/admin/logs?limit=${limit}`)
            .then((data) => activityLogsSchema.parse(data));
    },
    getLogStats(): Promise<Record<string, number>> {
        return httpClient.get<Record<string, number>>('/api/admin/logs/stats');
    },
};
