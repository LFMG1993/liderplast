import {api} from './api';
import {apiPublic} from './apiPublic';
import type {PaymentMethod, PaginatedResponse} from '../types';

type PaymentMethodInput = Omit<PaymentMethod, 'id'>;
type PaymentMethodUpdateInput = Partial<PaymentMethodInput>;

interface ApiPaymentMethodsResponse {
    paymentMethods: PaymentMethod[];
    pagination: {
        totalPages: number;
    };
}

export const paymentMethodService = {
    // --- Admin ---
    listAdmin: async (params: {
        page: number,
        pageSize: number,
        search?: string,
        sortBy?: string,
        sortOrder?: 'asc' | 'desc'
    }): Promise<PaginatedResponse<PaymentMethod>> => {
        const response = await api.get<ApiPaymentMethodsResponse>('/api/admin/payment-methods', {params});
        return {
            data: response.data.paymentMethods,
            pageCount: response.data.pagination.totalPages,
        };
    },

    create: async (data: PaymentMethodInput): Promise<PaymentMethod> => {
        const response = await api.post<{ paymentMethod: PaymentMethod }>('/api/admin/payment-methods', data);
        return response.data.paymentMethod;
    },

    update: async (id: number, data: PaymentMethodUpdateInput): Promise<PaymentMethod> => {
        const response = await api.put<{ paymentMethod: PaymentMethod }>(`/api/admin/payment-methods/${id}`, data);
        return response.data.paymentMethod;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/api/admin/payment-methods/${id}`);
    },

    // --- Público ---
    listPublic: async (): Promise<PaymentMethod[]> => {
        const response = await apiPublic.get<{ paymentMethods: PaymentMethod[] }>('/api/payment-methods');
        return response.data.paymentMethods;
    },
};