import {api} from './api';
import type {Shipment, ShipmentUpdateData} from '../types';

interface ListShipmentsFilters {
    // Aquí puedes añadir filtros si tu backend los soporta en el futuro
    // por ejemplo: shippingMethod?: ShippingMethod;
}

export const shipmentService = {
    /**
     * Lista todos los envíos existentes.
     */
    listShipment: async (filters: ListShipmentsFilters = {}): Promise<Shipment[]> => {
        const response = await api.get<{ shipments: Shipment[] }>('/api/admin/shipments', {params: filters});
        return response.data.shipments;
    },

    updateShipment: async (shipmentId: number, payload: ShipmentUpdateData): Promise<Shipment> => {
        const response = await api.put<{ shipment: Shipment }>(`/api/admin/shipments/${shipmentId}`, payload);
        return response.data.shipment;
    }
};