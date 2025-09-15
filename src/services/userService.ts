import type {User, UserCreationData, UserUpdateData} from "../types";
import {api} from "./api.ts";

// --- Funciones del servicio de usuarios ---
export const userService = {
    getUsers: async (): Promise<User[]> => {
        const response = await api.get<{ users: User[] }>('/api/admin/users');
        return response.data.users;
    },

    getUserById: async (id: number): Promise<User> => {
        const response = await api.get<{ user: User }>(`/api/admin/users/${id}`);
        return response.data.user;
    },

    createUser: async (userData: UserCreationData): Promise<{ id: number }> => {
        const response = await api.post('/api/admin/users', userData);
        return response.data;
    },

    updateUser: async (id: number, userData: UserUpdateData): Promise<{ success: boolean }> => {
        const response = await api.put(`/api/admin/users/${id}`, userData);
        return response.data;
    },

    deleteUser: async (id: number): Promise<{ success: boolean }> => {
        const response = await api.delete(`/api/admin/users/${id}`);
        return response.data;
    },
};