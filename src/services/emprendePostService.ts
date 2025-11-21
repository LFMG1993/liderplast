import { api } from './api';
import {apiPublic} from "./apiPublic";
import type { PaginatedResponse, EmprendePost, EmprendePostCreationData, EmprendePostUpdateData  } from '../types';

interface ApiEmprendePostsResponse {
    posts: EmprendePost[];
    pagination: {
        totalPages: number;
    };
}

export const emprendePostService = {
    // --- Administrador ---
    listAdmin: async (params: {
        page: number,
        pageSize: number,
        search?: string,
        sortBy?: string,
        sortOrder?: 'asc' | 'desc'
    }): Promise<PaginatedResponse<EmprendePost>> => {
        const response = await api.get<ApiEmprendePostsResponse>('/api/admin/emprende', { params });
        return {
            data: response.data.posts,
            pageCount: response.data.pagination.totalPages,
        };
    },

    getById: async (id: number): Promise<EmprendePost> => {
        const response = await api.get<{ post: EmprendePost }>(`/api/admin/emprende/${id}`);
        return response.data.post;
    },

    create: async (data: EmprendePostCreationData): Promise<EmprendePost> => {
        const response = await api.post<{ post: EmprendePost }>('/api/admin/emprende', data);
        return response.data.post;
    },

    update: async (id: number, data: EmprendePostUpdateData): Promise<{ success: boolean }> => {
        const response = await api.put(`/api/admin/emprende/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<{ success: boolean }> => {
        const response = await api.delete(`/api/admin/emprende/${id}`);
        return response.data;
    },

    // --- Publico ---
    listPublic: async (params: {
        page: number,
        pageSize: number,
    }): Promise<PaginatedResponse<EmprendePost>> => {
        const response = await apiPublic.get<ApiEmprendePostsResponse>('/api/emprende', { params });
        return {
            data: response.data.posts,
            pageCount: response.data.pagination.totalPages,
        };
    },

    getPublicById: async (id: number): Promise<EmprendePost> => {
        const response = await apiPublic.get<{ post: EmprendePost }>(`/api/emprende/${id}`);
        return response.data.post;
    },
};
