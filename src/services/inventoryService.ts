import {api} from './api';
import type {InventoryItem, InventoryUpdateData, PaginatedResponse} from '../types';

interface ApiInventoryResponse {
    inventory: InventoryItem[];
    pagination: {
        totalPages: number;
    };
}

export const inventoryService = {
    getInventory: async (params: {
        page: number,
        pageSize: number,
        search?: string,
        sortBy?: string,
        sortOrder?: 'asc' | 'desc'
    }): Promise<PaginatedResponse<InventoryItem>> => {
        const response = await api.get<ApiInventoryResponse>('/api/admin/inventory', {params});
        return {
            data: response.data.inventory,
            pageCount: response.data.pagination.totalPages,
        };
    },

    updateVariantInventory: async (variantId: number, data: InventoryUpdateData): Promise<InventoryItem> => {
        const response = await api.patch<{ variant: InventoryItem }>(`/api/admin/inventory/${variantId}`, data);
        return response.data.variant;
    },
};