import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, animalsApi, vetsApi, visitsApi } from './api';
import type { AnimalRequest, ClinicRequest, CreateVisitRequest, UserAdminRequest } from './api-schemas';

export const apiQueryKeys = {
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

export function useConfirmVetVisit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => visitsApi.confirmVetVisit(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['visits'] }),
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

export function useAdminLogs() {
    return useQuery({
        queryKey: apiQueryKeys.adminLogs,
        queryFn: () => adminApi.getLogs(20),
    });
}
