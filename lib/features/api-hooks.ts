import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/use-auth-store';
import {
    adminApi,
    animalsApi,
    labOrdersApi,
    ordersApi,
    ownerApi,
    productsApi,
    vetsApi,
    vetVisitsApi,
    visitsApi,
    warehouseApi,
} from './api';
import type {
    AnimalRequest,
    ClinicRequest,
    CreateOrderRequest,
    CreatePrescriptionRequest,
    CreateVisitRequest,
    UpdateOwnerAddressRequest,
    UpdateOwnerPasswordRequest,
    UpdateOwnerPhoneRequest,
    UpdateVisitMedicalDataRequest,
    UserAdminRequest,
    WarehouseStockItemRequest,
} from './api-schemas';

export const apiQueryKeys = {
    warehouseMe: ['warehouse', 'me'] as const,
    warehouseStock: (warehouseId?: number) => ['warehouse', 'stock', warehouseId ?? 'all'] as const,
    warehouseOrders: (clinicId?: number, status?: string) => ['warehouse', 'orders', clinicId ?? 'all', status ?? 'all'] as const,
    vetMe: ['vets', 'me'] as const,
    vetPatients: ['vets', 'me', 'patients'] as const,
    animals: ['animals'] as const,
    ownerProfile: ['owner', 'profile'] as const,
    ownerUpcomingVisits: ['visits', 'owner', 'upcoming'] as const,
    ownerRangeVisits: (from: string, to: string) => ['visits', 'owner', 'range', from, to] as const,
    vetUpcomingVisits: ['visits', 'vet', 'upcoming'] as const,
    vetRangeVisits: (from: string, to: string) => ['visits', 'vet', 'range', from, to] as const,
    vets: ['vets'] as const,
    vetsByClinic: (clinicId?: number) => ['vets', 'clinic', clinicId ?? 'none'] as const,
    slots: (clinicId?: number, vetUserId?: number, date?: string) =>
        ['slots', clinicId ?? 'none', vetUserId ?? 'none', date ?? 'none'] as const,
    adminUsers: ['admin', 'users'] as const,
    adminClinics: ['admin', 'clinics'] as const,
    adminLogs: ['admin', 'logs'] as const,
    adminLogStats: ['admin', 'logs', 'stats'] as const,
    prescription: (visitId?: number) => ['visits', visitId ?? 'none', 'prescription'] as const,
    labOrders: (clinicId?: number) => ['labOrders', clinicId ?? 'all'] as const,
    labOrdersByAnimal: (animalId?: number) => ['labOrders', 'animal', animalId ?? 'all'] as const,
    products: ['products'] as const,
};

// ─── ANIMALS (owner) ─────────────────────────────────────────────────────────

export function useAnimals() {
    return useQuery({
        queryKey: apiQueryKeys.animals,
        queryFn: animalsApi.getMine,
    });
}

export function useCreateAnimal() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: AnimalRequest) => animalsApi.create(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: apiQueryKeys.animals }),
    });
}

export function useUpdateAnimal() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: AnimalRequest }) => animalsApi.update(id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: apiQueryKeys.animals }),
    });
}

export function useDeleteAnimal() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => animalsApi.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: apiQueryKeys.animals }),
    });
}

// ─── VET PATIENTS (clinic animals) ───────────────────────────────────────────

/**
 * Derives the vet's patient list from their visit history.
 * GET /api/vets/me/patients does NOT exist in the API — we fetch a wide date range
 * of visits, extract unique animalIds, then load each animal individually.
 */
export function useClinicAnimals() {
    const wideFrom = useMemo(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 3);
        return d.toISOString().slice(0, 10);
    }, []);
    const wideTo = useMemo(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        return d.toISOString().slice(0, 10);
    }, []);

    const { data: visits = [] } = useQuery({
        queryKey: ['vets', 'me', 'visits', 'wide', wideFrom, wideTo],
        queryFn: () => visitsApi.getVetRange(wideFrom, wideTo),
        staleTime: 5 * 60 * 1000,
        retry: false,
    });

    const animalIds = useMemo(
        () => [...new Set(visits.map((v) => v.animalId))].sort((a, b) => a - b),
        [visits],
    );

    return useQuery({
        queryKey: [...apiQueryKeys.vetPatients, ...animalIds],
        queryFn: () => animalsApi.getManyByIds(animalIds),
        enabled: animalIds.length > 0,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
}

// ─── VISITS ──────────────────────────────────────────────────────────────────

export function useOwnerUpcomingVisits() {
    return useQuery({
        queryKey: apiQueryKeys.ownerUpcomingVisits,
        queryFn: visitsApi.getOwnerUpcoming,
    });
}

export function useVetUpcomingVisits() {
    return useQuery({
        queryKey: apiQueryKeys.vetUpcomingVisits,
        queryFn: visitsApi.getVetUpcoming,
        retry: false,
    });
}

export function useOwnerVisitsRange(from: string, to: string) {
    return useQuery({
        queryKey: apiQueryKeys.ownerRangeVisits(from, to),
        queryFn: () => visitsApi.getOwnerRange(from, to),
    });
}

export function useVetVisitsRange(from: string, to: string) {
    return useQuery({
        queryKey: apiQueryKeys.vetRangeVisits(from, to),
        queryFn: () => visitsApi.getVetRange(from, to),
    });
}

export function useCreateVisit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateVisitRequest) => visitsApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['visits'] });
        },
    });
}

export function useCancelVisit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => visitsApi.cancel(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['visits'] }),
    });
}

export function useConfirmVetVisit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => visitsApi.confirmVetVisit(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['visits'] }),
    });
}

export function useUpdateVisitMedicalData() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateVisitMedicalDataRequest }) =>
            visitsApi.updateMedicalData(id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['visits'] }),
    });
}

export function usePrescription(visitId?: number) {
    return useQuery({
        queryKey: apiQueryKeys.prescription(visitId),
        queryFn: () => visitsApi.getPrescription(visitId as number),
        enabled: typeof visitId === 'number',
        retry: false,
    });
}

export function useCreatePrescription() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ visitId, payload }: { visitId: number; payload: CreatePrescriptionRequest }) =>
            visitsApi.createPrescription(visitId, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: apiQueryKeys.prescription(variables.visitId) });
            queryClient.invalidateQueries({ queryKey: ['visits'] });
        },
    });
}

// ─── VETS ─────────────────────────────────────────────────────────────────────

export function useVets() {
    return useQuery({
        queryKey: apiQueryKeys.vets,
        queryFn: vetsApi.getAll,
    });
}

export function useVetsByClinic(clinicId?: number) {
    return useQuery({
        queryKey: apiQueryKeys.vetsByClinic(clinicId),
        queryFn: () => vetsApi.getByClinic(clinicId as number),
        enabled: typeof clinicId === 'number',
    });
}

export function useAvailableSlots(clinicId?: number, vetUserId?: number, date?: string) {
    return useQuery({
        queryKey: apiQueryKeys.slots(clinicId, vetUserId, date),
        queryFn: () => vetsApi.getAvailableSlots(clinicId as number, vetUserId as number, date as string),
        enabled: typeof clinicId === 'number' && typeof vetUserId === 'number' && !!date,
    });
}

export function useVetMe() {
    return useQuery({
        queryKey: apiQueryKeys.vetMe,
        queryFn: vetsApi.getMe,
        retry: false,
    });
}

/**
 * Derives vet clinic context from available API endpoints.
 * /api/vets/me does not exist — clinicId is extracted from visits instead.
 * Priority: upcoming visits → range visits (last 12 months + next 12 months).
 */
export function useVetContext() {
    const { data: vetMe } = useVetMe();
    const { data: upcoming = [], isLoading: loadingUpcoming } = useVetUpcomingVisits();

    const today = new Date();
    const rangeFrom = new Date(today);
    rangeFrom.setFullYear(rangeFrom.getFullYear() - 1);
    const rangeTo = new Date(today);
    rangeTo.setFullYear(rangeTo.getFullYear() + 1);
    const fromStr = rangeFrom.toISOString().slice(0, 10);
    const toStr = rangeTo.toISOString().slice(0, 10);

    const { data: rangeVisits = [], isLoading: loadingRange } = useVetVisitsRange(fromStr, toStr);

    const clinicId: number | null = useMemo(() => {
        if (vetMe?.clinicId) return vetMe.clinicId;
        if (upcoming[0]?.clinicId) return upcoming[0].clinicId;
        if (rangeVisits[0]?.clinicId) return rangeVisits[0].clinicId;
        return null;
    }, [vetMe, upcoming, rangeVisits]);

    const vetUserId: number | null = useMemo(() => {
        if (vetMe?.userId) return vetMe.userId;
        if (upcoming[0]?.vetUserId) return upcoming[0].vetUserId;
        if (rangeVisits[0]?.vetUserId) return rangeVisits[0].vetUserId;
        return null;
    }, [vetMe, upcoming, rangeVisits]);

    return {
        clinicId,
        vetUserId,
        clinicName: vetMe?.clinicName ?? (clinicId ? `Klinika #${clinicId}` : null),
        isLoading: loadingUpcoming || loadingRange,
    };
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────

export function useAdminUsers() {
    return useQuery({
        queryKey: apiQueryKeys.adminUsers,
        queryFn: adminApi.getUsers,
    });
}

export function useCreateAdminUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UserAdminRequest) => adminApi.createUser(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: apiQueryKeys.adminUsers }),
    });
}

export function useUpdateAdminUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UserAdminRequest }) => adminApi.updateUser(id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: apiQueryKeys.adminUsers }),
    });
}

export function useDeleteAdminUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => adminApi.deleteUser(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: apiQueryKeys.adminUsers }),
    });
}

export function useAdminClinics() {
    return useQuery({
        queryKey: apiQueryKeys.adminClinics,
        queryFn: adminApi.getClinics,
    });
}

export function useCreateAdminClinic() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: ClinicRequest) => adminApi.createClinic(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: apiQueryKeys.adminClinics }),
    });
}

export function useUpdateAdminClinic() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: ClinicRequest }) => adminApi.updateClinic(id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: apiQueryKeys.adminClinics }),
    });
}

export function useDeleteAdminClinic() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => adminApi.deleteClinic(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: apiQueryKeys.adminClinics }),
    });
}

export function useAdminLogs(type?: string, limit = 100) {
    return useQuery({
        queryKey: [...apiQueryKeys.adminLogs, type ?? 'all', limit],
        queryFn: () => adminApi.getLogs(type, limit),
    });
}

export function useAdminLogStats() {
    return useQuery({
        queryKey: apiQueryKeys.adminLogStats,
        queryFn: adminApi.getLogStats,
    });
}

// ─── WAREHOUSE ────────────────────────────────────────────────────────────────

export function useWarehouseMe() {
    const apiRole = useAuthStore((s) => s.user?.apiRole);
    return useQuery({
        queryKey: apiQueryKeys.warehouseMe,
        queryFn: warehouseApi.getMe,
        enabled: apiRole === 'WAREHOUSE',
        retry: false,
    });
}

export function useWarehouseStock(warehouseId?: number) {
    return useQuery({
        queryKey: apiQueryKeys.warehouseStock(warehouseId),
        queryFn: () => warehouseApi.getStock(warehouseId),
        enabled: warehouseId != null,
    });
}

export function useWarehouseStockAll() {
    return useQuery({
        queryKey: apiQueryKeys.warehouseStock(undefined),
        queryFn: () => warehouseApi.getStock(undefined),
    });
}

export function useCreateStockItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: WarehouseStockItemRequest) => warehouseApi.createStockItem(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouse', 'stock'] }),
    });
}

export function useUpdateStockItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: WarehouseStockItemRequest }) =>
            warehouseApi.updateStockItem(id, payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouse', 'stock'] }),
    });
}

export function useDeleteStockItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => warehouseApi.deleteStockItem(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouse', 'stock'] }),
    });
}

export function useWarehouseOrders(clinicId?: number, status?: string) {
    return useQuery({
        queryKey: apiQueryKeys.warehouseOrders(clinicId, status),
        queryFn: () => ordersApi.getAll(clinicId, status),
        retry: false,
    });
}

export function useCreateOrder() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateOrderRequest) => ordersApi.create(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouse', 'orders'] }),
    });
}

export function useUpdateOrderStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => ordersApi.updateStatus(id, status),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouse', 'orders'] }),
    });
}

// ─── LAB ORDERS ───────────────────────────────────────────────────────────────

export function useLabOrders(clinicId?: number) {
    return useQuery({
        queryKey: apiQueryKeys.labOrders(clinicId),
        queryFn: () => labOrdersApi.getByClinic(clinicId!),
        enabled: clinicId != null,
        retry: false,
    });
}

export function useLabOrdersByAnimal(animalId?: number) {
    return useQuery({
        queryKey: apiQueryKeys.labOrdersByAnimal(animalId),
        queryFn: () => labOrdersApi.getByAnimal(animalId!),
        enabled: animalId != null,
        retry: false,
    });
}

export function useCreateLabOrder() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ animalId, ...payload }: { animalId: number; testType: string; priority: string; clinicalReason?: string; visitId?: number }) =>
            labOrdersApi.create(animalId, payload as Parameters<typeof labOrdersApi.create>[1]),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['labOrders'] }),
    });
}

export function useUpdateLabOrderStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => labOrdersApi.updateStatus(id, status),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['labOrders'] }),
    });
}

// ─── VET PATIENTS / REGISTER ──────────────────────────────────────────────────

export function useRegisterPatient() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: Parameters<typeof vetVisitsApi.registerPatient>[0]) =>
            vetVisitsApi.registerPatient(payload),
        onSuccess: () => {
            // Invalidate both owner animals and vet patients caches
            qc.invalidateQueries({ queryKey: apiQueryKeys.animals });
            qc.invalidateQueries({ queryKey: apiQueryKeys.vetPatients });
        },
    });
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

export function useProducts() {
    return useQuery({
        queryKey: apiQueryKeys.products,
        queryFn: productsApi.getAll,
    });
}

// ─── OWNER PROFILE ────────────────────────────────────────────────────────────

export function useOwnerProfile() {
    return useQuery({
        queryKey: apiQueryKeys.ownerProfile,
        queryFn: ownerApi.getProfile,
        retry: false,
    });
}

export function useUpdateOwnerPhone() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateOwnerPhoneRequest) => ownerApi.updatePhone(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: apiQueryKeys.ownerProfile }),
    });
}

export function useUpdateOwnerPassword() {
    return useMutation({
        mutationFn: (payload: UpdateOwnerPasswordRequest) => ownerApi.updatePassword(payload),
    });
}

export function useUpdateOwnerAddress() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateOwnerAddressRequest) => ownerApi.updateAddress(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: apiQueryKeys.ownerProfile }),
    });
}

export function useDeleteOwnerAccount() {
    return useMutation({
        mutationFn: () => ownerApi.deleteAccount(),
    });
}
