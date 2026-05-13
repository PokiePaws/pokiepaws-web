import Clinic from '../../types';
import { httpClient, type HttpClient } from '../../infrastructure/http/http-client';
import { clinicSchema, clinicsSchema } from './clinic-schema';

export interface ClinicsApi {
    getClinics(city?: string): Promise<Clinic[]>;
    getClinic(id: string | number): Promise<Clinic>;
}

function createClinicsApi(client: HttpClient): ClinicsApi {
    return {
        getClinics(city) {
            const endpoint = city ? `/api/clinics/city/${encodeURIComponent(city)}` : '/api/clinics';
            return client.get<Clinic[]>(endpoint).then((clinics) => clinicsSchema.parse(clinics));
        },
        getClinic(id) {
            return client
                .get<Clinic>(`/api/clinics/${encodeURIComponent(id)}`)
                .then((clinic) => clinicSchema.parse(clinic));
        },
    };
}

export const clinicsApi = createClinicsApi(httpClient);
