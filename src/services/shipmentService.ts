import {api} from './api';
import type {Shipment, ShipmentUpdateData, PaginatedResponse} from '../types';

interface ApiShipmentsResponse {
    shipments: Shipment[];
    pagination: {
        totalPages: number;
    };
}

export const shipmentService = {
    /**
     * Lista todos los envíos existentes de forma paginada.
     */
    listShipments: async (params: {
        page: number,
        pageSize: number,
        search?: string,
        sortBy?: string,
        sortOrder?: 'asc' | 'desc'
    }): Promise<PaginatedResponse<Shipment>> => {
        const response = await api.get<ApiShipmentsResponse>('/api/admin/shipments', { params });
        return {
            data: response.data.shipments,
            pageCount: response.data.pagination.totalPages,
        };
    },

    updateShipment: async (shipmentId: number, payload: ShipmentUpdateData): Promise<Shipment> => {
        const response = await api.put<{ shipment: Shipment }>(`/api/admin/shipments/${shipmentId}`, payload);
        return response.data.shipment;
    }
};