import {api} from './api';
import type {Product, Category, Attribute, PaginatedResponse} from '../types';

interface ApiPublicProductsResponse {
    products: Product[];
    pagination: {
        totalPages: number;
    };
}

/**
 * Parámetros para la obtención de productos públicos, incluyendo paginación y filtros.
 */
interface GetPublicProductsParams {
    page: number;
    limit: number;
    search?: string;
    featured?: boolean;
    categoryIds?: number[];
    attributeValueIds?: number[];
    isActive?: boolean;
}

/**
 * Servicio para las llamadas a la API que son públicas (no requieren autenticación).
 */
export const shopService = {
    getPublicProducts: async ({ limit, ...restParams }: GetPublicProductsParams): Promise<PaginatedResponse<Product>> => {
        const apiParams = {
            ...restParams,
            pageSize: limit,
            categoryIds: restParams.categoryIds?.join(','),
            attributeValueIds: restParams.attributeValueIds?.join(','),
            is_active: restParams.isActive,
        };
        const response = await api.get<ApiPublicProductsResponse>('/api/products', {params: apiParams});
        return {
            data: response.data.products,
            pageCount: response.data.pagination.totalPages,
        };
    },

    // Obtiene los detalles completos de un solo producto.
    getPublicProductById: async (id: number): Promise<Product> => {
        const response = await api.get<{ product: Product }>(`/api/products/${id}`);
        return response.data.product;
    },

    getPublicCategories: async (): Promise<Category[]> => {
        const response = await api.get<{ categories: Category[] }>('/api/categories'); // Llama al nuevo endpoint público
        return response.data.categories;
    },

    getPublicAttributes: async (): Promise<Attribute[]> => {
        const response = await api.get<{ attributes: Attribute[] }>('/api/attributes');
        return response.data.attributes;
    },
};