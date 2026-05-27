import Clinic from '../types';
import { httpClient } from '../infrastructure/http/http-client';
import { clinicSchema, clinicsSchema } from './clinics/clinic-schema';
import { API_ENDPOINTS } from './api-endpoints';
import {
    activityLogsSchema,
    animalSchema,
    animalsSchema,
    availableSlotsSchema,
    clinicOrderSchema,
    clinicOrdersSchema,
    labOrderSchema,
    labOrdersSchema,
    ownerProfileSchema,
    prescriptionSchema,
    productsSchema,
    userAdminSchema,
    usersAdminSchema,
    vetListsSchema,
    vetMeResponseSchema,
    vetsSchema,
    visitSchema,
    visitsSchema,
    warehouseStockItemSchema,
    warehouseStockSchema,
    warehouseWorkerMeSchema,
    type ActivityLog,
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
    type OwnerProfile,
    type Prescription,
    type Product,
    type UpdateOwnerAddressRequest,
    type UpdateOwnerPasswordRequest,
    type UpdateOwnerPhoneRequest,
    type UpdateVisitMedicalDataRequest,
    type UserAdmin,
    type UserAdminRequest,
    type Vet,
    type VetList,
    type VetMeResponse,
    type Visit,
    type WarehouseStockItem,
    type WarehouseStockItemRequest,
    type WarehouseWorkerMe,
} from './api-schemas';

export const animalsApi = {
    getMine(): Promise<Animal[]> {
        return httpClient.get<Animal[]>(API_ENDPOINTS.animals.list).then((data) => animalsSchema.parse(data));
    },
    create(payload: AnimalRequest): Promise<Animal> {
        return httpClient.post<Animal>(API_ENDPOINTS.animals.create, payload).then((data) => animalSchema.parse(data));
    },
    update(id: number, payload: AnimalRequest): Promise<Animal> {
        return httpClient.put<Animal>(API_ENDPOINTS.animals.byId(id), payload).then((data) => animalSchema.parse(data));
    },
    delete(id: number): Promise<void> {
        return httpClient.delete<void>(API_ENDPOINTS.animals.byId(id));
    },
};

export const visitsApi = {
    getOwnerUpcoming(): Promise<Visit[]> {
        return httpClient.get<Visit[]>(API_ENDPOINTS.owners.meVisitsUpcoming).then((data) => visitsSchema.parse(data));
    },
    getOwnerRange(from: string, to: string): Promise<Visit[]> {
        return httpClient
            .get<Visit[]>(`${API_ENDPOINTS.owners.meVisits}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
            .then((data) => visitsSchema.parse(data));
    },
    getVetUpcoming(): Promise<Visit[]> {
        return httpClient.get<Visit[]>(API_ENDPOINTS.vets.meVisitsUpcoming).then((data) => visitsSchema.parse(data));
    },
    getVetRange(from: string, to: string): Promise<Visit[]> {
        return httpClient
            .get<Visit[]>(`${API_ENDPOINTS.vets.meVisits}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
            .then((data) => visitsSchema.parse(data));
    },
    create(payload: CreateVisitRequest): Promise<Visit> {
        return httpClient.post<Visit>(API_ENDPOINTS.visits.create, payload).then((data) => visitSchema.parse(data));
    },
    cancel(id: number): Promise<Visit> {
        return httpClient.patch<Visit>(API_ENDPOINTS.visits.cancel(id)).then((data) => visitSchema.parse(data));
    },
    confirmVetVisit(id: number): Promise<Visit> {
        return httpClient.post<Visit>(API_ENDPOINTS.vets.meVisitConfirm(id)).then((data) => visitSchema.parse(data));
    },
    updateMedicalData(id: number, payload: UpdateVisitMedicalDataRequest): Promise<Visit> {
        return httpClient
            .patch<Visit>(API_ENDPOINTS.vets.meVisitMedicalData(id), payload)
            .then((data) => visitSchema.parse(data));
    },
    getPrescription(id: number): Promise<Prescription> {
        return httpClient
            .get<Prescription>(API_ENDPOINTS.visits.prescription(id))
            .then((data) => prescriptionSchema.parse(data));
    },
    createPrescription(id: number, payload: CreatePrescriptionRequest): Promise<Prescription> {
        return httpClient
            .post<Prescription>(API_ENDPOINTS.visits.prescription(id), payload)
            .then((data) => prescriptionSchema.parse(data));
    },
};

export const vetsApi = {
    getAll(): Promise<Vet[]> {
        return httpClient.get<Vet[]>(API_ENDPOINTS.vets.list).then((data) => vetsSchema.parse(data));
    },
    getByClinic(clinicId: number): Promise<VetList[]> {
        return httpClient.get<VetList[]>(API_ENDPOINTS.vets.byClinic(clinicId)).then((data) => vetListsSchema.parse(data));
    },
    getMe(): Promise<VetMeResponse> {
        return httpClient.get<VetMeResponse>(API_ENDPOINTS.vets.me).then((data) => vetMeResponseSchema.parse(data));
    },
    getAvailableSlots(clinicId: number, vetUserId: number, date: string): Promise<AvailableSlots> {
        return httpClient
            .get<AvailableSlots>(
                `${API_ENDPOINTS.clinics.vetAvailableSlots(clinicId, vetUserId)}?date=${encodeURIComponent(date)}`,
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
            .get<ClinicOrder[]>(`${API_ENDPOINTS.orders.list}${qs ? '?' + qs : ''}`)
            .then((data) => clinicOrdersSchema.parse(data));
    },
    create(payload: CreateOrderRequest): Promise<ClinicOrder> {
        return httpClient.post<ClinicOrder>(API_ENDPOINTS.orders.create, payload).then((data) => clinicOrderSchema.parse(data));
    },
    updateStatus(id: number, status: string): Promise<ClinicOrder> {
        return httpClient
            .put<ClinicOrder>(API_ENDPOINTS.orders.updateStatus(id), { status })
            .then((data) => clinicOrderSchema.parse(data));
    },
};

export const warehouseApi = {
    getMe(): Promise<WarehouseWorkerMe> {
        return httpClient.get<WarehouseWorkerMe>(API_ENDPOINTS.warehouse.workerMe).then((data) => warehouseWorkerMeSchema.parse(data));
    },
    getStock(warehouseId?: number): Promise<WarehouseStockItem[]> {
        const url = warehouseId != null
            ? API_ENDPOINTS.warehouse.stockByWarehouse(warehouseId)
            : API_ENDPOINTS.warehouse.stock;
        return httpClient.get<WarehouseStockItem[]>(url).then((data) => warehouseStockSchema.parse(data));
    },
    createStockItem(payload: WarehouseStockItemRequest): Promise<WarehouseStockItem> {
        return httpClient
            .post<WarehouseStockItem>(API_ENDPOINTS.warehouse.stock, payload)
            .then((data) => warehouseStockItemSchema.parse(data));
    },
    updateStockItem(id: number, payload: WarehouseStockItemRequest): Promise<WarehouseStockItem> {
        return httpClient
            .put<WarehouseStockItem>(API_ENDPOINTS.warehouse.stockById(id), payload)
            .then((data) => warehouseStockItemSchema.parse(data));
    },
    deleteStockItem(id: number): Promise<void> {
        return httpClient.delete<void>(API_ENDPOINTS.warehouse.stockById(id));
    },
};

export const vetVisitsApi = {
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

export const ownerApi = {
    getProfile(): Promise<OwnerProfile> {
        return httpClient.get<OwnerProfile>(API_ENDPOINTS.owners.me).then((data) => ownerProfileSchema.parse(data));
    },
    updatePhone(payload: UpdateOwnerPhoneRequest): Promise<void> {
        return httpClient.patch<void>(API_ENDPOINTS.owners.mePhone, payload);
    },
    updatePassword(payload: UpdateOwnerPasswordRequest): Promise<void> {
        return httpClient.patch<void>(API_ENDPOINTS.owners.mePassword, payload);
    },
    updateAddress(payload: UpdateOwnerAddressRequest): Promise<void> {
        return httpClient.patch<void>(API_ENDPOINTS.owners.meAddress, payload);
    },
    deleteAccount(): Promise<void> {
        return httpClient.delete<void>(API_ENDPOINTS.owners.me);
    },
};

export const adminApi = {
    getUsers(): Promise<UserAdmin[]> {
        return httpClient.get<UserAdmin[]>(API_ENDPOINTS.admin.users).then((data) => usersAdminSchema.parse(data));
    },
    createUser(payload: UserAdminRequest): Promise<UserAdmin> {
        return httpClient.post<UserAdmin>(API_ENDPOINTS.admin.users, payload).then((data) => userAdminSchema.parse(data));
    },
    updateUser(id: number, payload: UserAdminRequest): Promise<UserAdmin> {
        return httpClient.put<UserAdmin>(API_ENDPOINTS.admin.userById(id), payload).then((data) => userAdminSchema.parse(data));
    },
    deleteUser(id: number): Promise<void> {
        return httpClient.delete<void>(API_ENDPOINTS.admin.userById(id));
    },
    getClinics(): Promise<Clinic[]> {
        return httpClient.get<Clinic[]>(API_ENDPOINTS.clinics.list).then((data) => clinicsSchema.parse(data));
    },
    createClinic(payload: ClinicRequest): Promise<Clinic> {
        return httpClient.post<Clinic>(API_ENDPOINTS.clinics.create, payload).then((data) => clinicSchema.parse(data));
    },
    updateClinic(id: number, payload: ClinicRequest): Promise<Clinic> {
        return httpClient.put<Clinic>(API_ENDPOINTS.clinics.update(id), payload).then((data) => clinicSchema.parse(data));
    },
    deleteClinic(id: number): Promise<void> {
        return httpClient.delete<void>(API_ENDPOINTS.clinics.delete(id));
    },
    getLogs(type?: string, limit = 100): Promise<ActivityLog[]> {
        const params = new URLSearchParams({ limit: String(limit) });
        if (type) params.set('type', type);
        return httpClient
            .get<ActivityLog[]>(`${API_ENDPOINTS.admin.logs}?${params.toString()}`)
            .then((data) => activityLogsSchema.parse(data));
    },
    getLogStats(): Promise<Record<string, number>> {
        return httpClient.get<Record<string, number>>(API_ENDPOINTS.admin.logStats);
    },
};
