'use client';

import { useQuery } from '@tanstack/react-query';
import { clinicsApi } from './clinics-api';

export const clinicsQueryKeys = {
    all: ['clinics'] as const,
    list: (city?: string) => [...clinicsQueryKeys.all, 'list', city ?? 'all'] as const,
    detail: (id?: string | number) => [...clinicsQueryKeys.all, 'detail', String(id ?? '')] as const,
};

export function useClinics(city?: string) {
    return useQuery({
        queryKey: clinicsQueryKeys.list(city),
        queryFn: () => clinicsApi.getClinics(city),
    });
}

export function useClinic(id?: string | number) {
    return useQuery({
        queryKey: clinicsQueryKeys.detail(id),
        queryFn: () => clinicsApi.getClinic(id as string | number),
        enabled: id !== undefined && id !== null && String(id).length > 0,
    });
}
