import {api} from './api';
import {apiClient} from "./apiClient.ts";
import type {Order, PaymentStatus, ShippingStatus, ShipmentCreationData} from '../types';

// Tipos para la creación y confirmación de pedidos del cliente
interface CreateOrderPayload {
    items: { variantId: number; quantity: number }[];
}

interface ConfirmPaymentPayload {
    paymentMethodId: number;
    paymentConfirmationUrl?: string;
}

export const orderService = {
    // --- Admin ---
    listAdmin: async (filters: {
        paymentStatus?: PaymentStatus,
        shippingStatus?: ShippingStatus
    }): Promise<Order[]> => {
        const response = await api.get<{ orders: Order[] }>('/api/admin/orders', {
            params: {
                payment_status: filters.paymentStatus,
                shipping_status: filters.shippingStatus
            },
        });
        return response.data.orders;
    },

    getOrderById: async (orderId: number): Promise<Order> => {
        const response = await api.get<{ order: Order }>(`/api/admin/orders/${orderId}`);
        return response.data.order;
    },

    approve: async (orderId: number): Promise<Order> => {
        const response = await api.post<{ order: Order }>(`/api/admin/orders/${orderId}/approve`);
        return response.data.order;
    },

    reject: async (orderId: number): Promise<Order> => {
        const response = await api.post<{ order: Order }>(`/api/admin/orders/${orderId}/reject`);
        return response.data.order;
    },

    createShipment: async (orderId: number, payload: ShipmentCreationData): Promise<Order> => {
        const response = await api.post<{ order: Order }>(`/api/admin/orders/${orderId}/shipments`, payload);
        return response.data.order;
    },

    // --- Cliente ---
    create: async (payload: CreateOrderPayload): Promise<Order> => {
        const response = await apiClient.post<{ order: Order }>('/api/orders', payload);
        return response.data.order;
    },

    getById: async (orderId: number): Promise<Order> => {
        const response = await apiClient.get<{ order: Order }>(`/api/orders/${orderId}`);
        return response.data.order;
    },

    listForCustomer: async (): Promise<Order[]> => {
        const response = await apiClient.get<{ orders: Order[] }>('/api/orders');
        return response.data.orders;
    },

    confirmPayment: async (orderId: number, payload: ConfirmPaymentPayload): Promise<{
        success: boolean;
        message: string
    }> => {
        const response = await apiClient.post(`/api/orders/${orderId}/confirm-payment`, payload);
        return response.data;
    },
};