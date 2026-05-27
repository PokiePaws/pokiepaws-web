import Clinic from '../../types';
import { httpClient, type HttpClient } from '../../infrastructure/http/http-client';
import { clinicSchema, clinicsSchema } from './clinic-schema';
import { API_ENDPOINTS } from '../api-endpoints';

export interface ClinicsApi {
    getClinics(city?: string): Promise<Clinic[]>;
    getClinic(id: string | number): Promise<Clinic>;
}

function createClinicsApi(client: HttpClient): ClinicsApi {
    return {
        getClinics(city) {
            const endpoint = city
                ? API_ENDPOINTS.clinics.byCity(encodeURIComponent(city))
                : API_ENDPOINTS.clinics.list;
            return client.get<Clinic[]>(endpoint).then((clinics) => clinicsSchema.parse(clinics));
        },
        getClinic(id) {
            return client
                .get<Clinic>(API_ENDPOINTS.clinics.byId(encodeURIComponent(String(id))))
                .then((clinic) => clinicSchema.parse(clinic));
        },
    };
}

export const clinicsApi = createClinicsApi(httpClient);
