import type {User, UserCreationData, UserUpdateData} from "../types";
import {apiFetch} from "./api";

// --- Funciones del servicio de usuarios ---
export const userService = {
    getUsers: async (): Promise<User[]> => {
        const response = await apiFetch('/api/admin/users');
        return response.users;
    },

    getUserById: async (id: number): Promise<User> => {
        const response = await apiFetch(`/api/admin/users/${id}`);
        return response.user;
    },

    createUser: async (userData: UserCreationData): Promise<{ id: number }> => {
        return apiFetch('/api/admin/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    updateUser: async (id: number, userData: UserUpdateData): Promise<{ success: boolean }> => {
        return apiFetch(`/api/admin/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    },

    deleteUser: async (id: number): Promise<{ success: boolean }> => {
        return apiFetch(`/api/admin/users/${id}`, {
            method: 'DELETE',
        });
    },
};