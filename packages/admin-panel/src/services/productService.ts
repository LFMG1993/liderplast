import type {Product, ProductCreationData, ProductUpdateData} from "../types";
import {apiFetch} from "./api";

// --- Funciones del CRUD de Productos ---

export const productService = {
    getProducts: async (): Promise<Product[]> => {
        const response = await apiFetch('/api/admin/products');
        return response.products;
    },

    getProductById: async (id: number): Promise<Product> => {
        const response = await apiFetch(`/api/admin/products/${id}`);
        return response.product;
    },

    createProduct: async (productData: ProductCreationData): Promise<Product> => {
        const response = await apiFetch('/api/admin/products', {method: 'POST', body: JSON.stringify(productData)});
        return response.product;
    },

    updateProduct: async (id: number, productData: ProductUpdateData): Promise<Product> => {
        const response = await apiFetch(`/api/admin/products/${id}`, {method: 'PUT', body: JSON.stringify(productData)});
        return response.product;
    },

    deleteProduct: async (id: number): Promise<{ success: boolean }> => {
        return apiFetch(`/api/admin/products/${id}`, {method: 'DELETE'});
    },
};