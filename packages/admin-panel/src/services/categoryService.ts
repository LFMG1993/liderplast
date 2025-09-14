import type {Category, CategoryCreationData, CategoryUpdateData} from "../types";
import {apiFetch} from "./api";

// --- Funciones del CRUD de Categorías ---
export const categoryService = {
    getCategories: async (): Promise<Category[]> => {
        const response = await apiFetch('/api/admin/categories');
        return response.categories;
    },
    createCategory: async (data: CategoryCreationData): Promise<Category> => {
        const response = await apiFetch('/api/admin/categories', {method: 'POST', body: JSON.stringify(data)});
        return response.category;
    },
    updateCategory: async (id: number, data: CategoryUpdateData): Promise<Category> => {
        const response = await apiFetch(`/api/admin/categories/${id}`, {method: 'PUT', body: JSON.stringify(data)});
        return response.category;
    },
    deleteCategory: async (id: number): Promise<{ success: boolean }> => {
        return apiFetch(`/api/admin/categories/${id}`, {method: 'DELETE'});
    },
};