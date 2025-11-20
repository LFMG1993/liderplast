import type {Product, ProductCreationData, ProductUpdateData, PaginatedResponse} from "../types";
import {api} from "./api.ts";

interface ApiProductsResponse {
    products: Product[];
    pagination: {
        totalPages: number;
    };
}

// --- Funciones del CRUD de Productos ---

export const productService = {
    getProducts: async (params: {
        page: number,
        limit: number,
        search?: string,
        sortBy?: string,
        sortOrder?: 'asc' | 'desc'
    }): Promise<PaginatedResponse<Product>> => {
        const apiParams = {
            page: params.page,
            pageSize: params.limit,
            search: params.search,
            sortBy: params.sortBy,
            sortOrder: params.sortOrder,
        };
        const response = await api.get<ApiProductsResponse>('/api/admin/products', {params: apiParams});
        return {
            data: response.data.products,
            pageCount: response.data.pagination.totalPages,
        };
    },

    getProductById: async (id: number): Promise<Product> => {
        const response = await api.get<{ product: Product }>(`/api/admin/products/${id}`);
        return response.data.product;
    },

    createProduct: async (productData: ProductCreationData): Promise<Product> => {
        const response = await api.post<{ product: Product }>('/api/admin/products', productData);
        return response.data.product;
    },

    updateProduct: async (id: number, productData: ProductUpdateData): Promise<Product> => {
        const response = await api.put<{ product: Product }>(`/api/admin/products/${id}`, productData);
        return response.data.product;
    },

    deleteProduct: async (id: number): Promise<{ success: boolean }> => {
        const response = await api.delete(`/api/admin/products/${id}`);
        return response.data;
    },
};