import { api } from './api';
import type { Product } from '../types';

/**
 * Servicio para las llamadas a la API que son públicas (no requieren autenticación).
 */
export const shopService = {
    getPublicProducts: async (): Promise<Product[]> => {
        const response = await api.get<{ products: Product[] }>('/api/products');
        return response.data.products;
    },

    // Obtiene los detalles completos de un solo producto.
    getPublicProductById: async (id: number): Promise<Product> => {
        const response = await api.get<{ product: Product }>(`/api/products/${id}`);
        return response.data.product;
    },
};