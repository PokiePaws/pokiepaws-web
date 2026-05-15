import Clinic from '../types';
import { httpClient } from '../infrastructure/http/http-client';
import { clinicSchema, clinicsSchema } from './clinics/clinic-schema';
import {
    activityLogsSchema,
    animalSchema,
    animalsSchema,
    availableSlotsSchema,
    prescriptionSchema,
    userAdminSchema,
    usersAdminSchema,
    vetsSchema,
    visitSchema,
    visitsSchema,
    type ActivityLog,
    type Animal,
    type AnimalRequest,
    type AvailableSlots,
    type ClinicRequest,
    type CreatePrescriptionRequest,
    type CreateVisitRequest,
    type Prescription,
    type UpdateVisitMedicalDataRequest,
    type UserAdmin,
    type UserAdminRequest,
    type Vet,
    type Visit,
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
    getAvailableSlots(clinicId: number, vetUserId: number, date: string): Promise<AvailableSlots> {
        return httpClient
            .get<AvailableSlots>(
                `/api/clinics/${clinicId}/vets/${vetUserId}/available-slots?date=${encodeURIComponent(date)}`,
            )
            .then((data) => availableSlotsSchema.parse(data));
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
    getLogs(limit = 20): Promise<ActivityLog[]> {
        return httpClient
            .get<ActivityLog[]>(`/api/admin/logs?limit=${limit}`)
            .then((data) => activityLogsSchema.parse(data));
    },
    getLogStats(): Promise<Record<string, number>> {
        return httpClient.get<Record<string, number>>('/api/admin/logs/stats');
    },
};
