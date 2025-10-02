import {apiClient} from './apiClient';
import type {Address, AddressCreationData, AddressUpdateData} from "../types";

export const addressService = {
    /**
     * Obtiene todas las direcciones del cliente autenticado.
     */
    async listAddresses(): Promise<Address[]> {
        const response = await apiClient.get<{ addresses: Address[] }>('/api/addresses');
        return response.data.addresses;
    },

    async createAddress(addressData: AddressCreationData): Promise<Address> {
        const response = await apiClient.post<{ address: Address }>('/api/addresses', addressData);
        return response.data.address;
    },

    async updateAddress(id: number, addressData: AddressUpdateData): Promise<Address> {
        const response = await apiClient.put<{ address: Address }>(`/api/addresses/${id}`, addressData);
        return response.data.address;
    },

    async deleteAddress(id: number): Promise<{ success: boolean }> {
        const response = await apiClient.delete(`/api/addresses/${id}`);
        return response.data;
    },
};