import {apiClient} from './apiClient';
import type {CustomerProfile, CustomerProfileUpdateData} from "../types";

export const customerProfileService = {
    /**
     * Obtiene el perfil del cliente autenticado.
     */
    async getProfile(): Promise<CustomerProfile> {
        const response = await apiClient.get<{ profile: CustomerProfile }>('/api/profile');
        return response.data.profile;
    },

    async createOrUpdateProfile(profileData: CustomerProfileUpdateData): Promise<CustomerProfile> {
        const response = await apiClient.put<{ profile: CustomerProfile }>('/api/profile', profileData);
        return response.data.profile;
    },
};