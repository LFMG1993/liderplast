import type {Category, CategoryCreationData, CategoryUpdateData} from "../types";
import {api} from "./api.ts";

// --- Funciones del CRUD de Categorías ---
export const categoryService = {
    getCategories: async (): Promise<Category[]> => {
        const response = await api.get<{ categories: Category[] }>('/api/admin/categories', {
            params: {page: 1, pageSize: 9999}
        });
        return response.data.categories;
    },
    createCategory: async (data: CategoryCreationData): Promise<Category> => {
        const response = await api.post<{ category: Category }>('/api/admin/categories', data);
        return response.data.category;
    },
    updateCategory: async (id: number, data: CategoryUpdateData): Promise<Category> => {
        const response = await api.put<{ category: Category }>(`/api/admin/categories/${id}`, data);
        return response.data.category;
    },
    deleteCategory: async (id: number): Promise<{ success: boolean }> => {
        const response = await api.delete(`/api/admin/categories/${id}`);
        return response.data;
    },
};