import { api } from './api';
import type { Provider, ProviderCreationData } from '../types';

/**
 * Servicio para gestionar las operaciones CRUD de los proveedores.
 */
export const providerService = {
    getProviders: async (): Promise<Provider[]> => {
        const response = await api.get<{ providers: Provider[] }>('/api/admin/providers');
        return response.data.providers;
    },

    createProvider: async (data: ProviderCreationData): Promise<Provider> => {
        const response = await api.post<{ provider: Provider }>('/api/admin/providers', data);
        return response.data.provider;
    },

    updateProvider: async (id: number, data: Partial<ProviderCreationData>): Promise<Provider> => {
        const response = await api.put<{ provider: Provider }>(`/api/admin/providers/${id}`, data);
        return response.data.provider;
    },

    deleteProvider: async (id: number): Promise<{ success: boolean }> => {
        const response = await api.delete(`/api/admin/providers/${id}`);
        return response.data;
    },
};