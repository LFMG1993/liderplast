import {api} from './api';
import type {Provider, ProviderCreationData, PaginatedResponse} from '../types';

interface ApiProvidersResponse {
    providers: Provider[];
    pagination: {
        totalPages: number;
    };
}

/**
 * Servicio para gestionar las operaciones CRUD de los proveedores.
 */
export const providerService = {
    getProviders: async (params: {
        page: number,
        pageSize: number,
        search?: string,
        sortBy?: string,
        sortOrder?: 'asc' | 'desc'
    }): Promise<PaginatedResponse<Provider>> => {
        const response = await api.get<ApiProvidersResponse>('/api/admin/providers', {params});
        return {
            data: response.data.providers,
            pageCount: response.data.pagination.totalPages,
        };
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