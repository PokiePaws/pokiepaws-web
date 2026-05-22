import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, animalsApi, clinicAnimalsApi, labOrdersApi, ordersApi, productsApi, vetsApi, vetVisitsApi, visitsApi, warehouseApi } from './api';
import type {
    AnimalRequest,
    ClinicRequest,
    CreateOrderRequest,
    CreatePrescriptionRequest,
    CreateVisitRequest,
    UpdateVisitMedicalDataRequest,
    UserAdminRequest,
    WarehouseStockItemRequest,
} from './api-schemas';

export const apiQueryKeys = {
    adminWarehouses: ['admin', 'warehouses'] as const,
    warehouseMe: ['warehouse', 'me'] as const,
    warehouseStock: (warehouseId?: number) => ['warehouse', 'stock', warehouseId ?? 'all'] as const,
    warehouseOrders: (clinicId?: number, status?: string) => ['warehouse', 'orders', clinicId ?? 'all', status ?? 'all'] as const,
    vetMe: ['vets', 'me'] as const,
    animals: ['animals'] as const,
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
    clinicAnimals: (clinicId?: number) => ['clinicAnimals', clinicId ?? 'none'] as const,
    products: ['products'] as const,
};

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

export function useOwnerUpcomingVisits() {
    return useQuery({
        queryKey: apiQueryKeys.ownerUpcomingVisits,
        queryFn: visitsApi.getOwnerUpcoming,
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

export function useCancelVetVisit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => visitsApi.cancelVet(id),
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

export function useAdminWarehouses() {
    return useQuery({
        queryKey: apiQueryKeys.adminWarehouses,
        queryFn: adminApi.getWarehouses,
    });
}

export function useAdminLogs() {
    return useQuery({
        queryKey: apiQueryKeys.adminLogs,
        queryFn: () => adminApi.getLogs(20),
    });
}

export function useAdminLogStats() {
    return useQuery({
        queryKey: apiQueryKeys.adminLogStats,
        queryFn: adminApi.getLogStats,
    });
}

export function useVetMe() {
    return useQuery({
        queryKey: apiQueryKeys.vetMe,
        queryFn: vetsApi.getMe,
        retry: false,
    });
}

export function useWarehouseMe() {
    return useQuery({
        queryKey: apiQueryKeys.warehouseMe,
        queryFn: warehouseApi.getMe,
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

export function useLabOrders(clinicId?: number) {
    return useQuery({
        queryKey: apiQueryKeys.labOrders(clinicId),
        queryFn: () => labOrdersApi.getByClinic(clinicId!),
        enabled: clinicId != null,
    });
}

export function useLabOrdersByAnimal(animalId?: number) {
    return useQuery({
        queryKey: apiQueryKeys.labOrdersByAnimal(animalId),
        queryFn: () => labOrdersApi.getByAnimal(animalId!),
        enabled: animalId != null,
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

export function useClinicAnimals(clinicId?: number) {
    return useQuery({
        queryKey: apiQueryKeys.clinicAnimals(clinicId),
        queryFn: () => clinicAnimalsApi.getByClinic(clinicId!),
        enabled: clinicId != null,
    });
}

export function useCreateVetVisit() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: { animalId: number; startsAt: string; description?: string }) =>
            vetVisitsApi.createForVet(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['visits'] }),
    });
}

export function useRegisterPatient() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: Parameters<typeof vetVisitsApi.registerPatient>[0]) =>
            vetVisitsApi.registerPatient(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicAnimals'] }),
    });
}

export function useProducts() {
    return useQuery({
        queryKey: apiQueryKeys.products,
        queryFn: productsApi.getAll,
    });
}

export function useUpdateLabOrderStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => labOrdersApi.updateStatus(id, status),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['labOrders'] }),
    });
}
