import type {Product, ProductCreationData, ProductUpdateData} from "../types";
import {api} from "./api.ts";

// --- Funciones del CRUD de Productos ---

export const productService = {
    getProducts: async (): Promise<Product[]> => {
        const response = await api.get<{ products: Product[] }>('/api/admin/products');
        return response.data.products;
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