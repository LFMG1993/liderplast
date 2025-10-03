import {api} from './api';
import type {InventoryItem, InventoryUpdateData} from '../types';

export const inventoryService = {
    getInventory: async (): Promise<InventoryItem[]> => {
        const response = await api.get<{ inventory: InventoryItem[] }>('/api/admin/inventory');
        return response.data.inventory;
    },

    updateVariantInventory: async (variantId: number, data: InventoryUpdateData): Promise<InventoryItem> => {
        const response = await api.patch<{ variant: InventoryItem }>(`/api/admin/inventory/${variantId}`, data);
        return response.data.variant;
    },
};