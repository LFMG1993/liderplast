import {api} from './api';
import {apiPublic} from './apiPublic';
import type {PaymentMethod} from '../types';

type PaymentMethodInput = Omit<PaymentMethod, 'id'>;
type PaymentMethodUpdateInput = Partial<PaymentMethodInput>;

export const paymentMethodService = {
    // --- Admin ---
    listAdmin: async (): Promise<PaymentMethod[]> => {
        const response = await api.get<{ paymentMethods: PaymentMethod[] }>('/api/admin/payment-methods');
        return response.data.paymentMethods;
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