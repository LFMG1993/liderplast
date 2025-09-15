import type {
    Attribute,
    AttributeCreationData,
    AttributeUpdateData,
    AttributeValueCreationData,
    AttributeValueUpdateData,
    AttributeValue
} from "../types";
import {api} from "./api.ts";

// --- Funciones del Servicio de Atributos ---
export const attributeService = {
    getAttributesWithValues: async (): Promise<Attribute[]> => {
        const response = await api.get<{ attributes: Attribute[] }>('/api/admin/attributes');
        return response.data.attributes;
    },

    createAttribute: async (data: AttributeCreationData): Promise<Attribute> => {
        const response = await api.post<{ attribute: Attribute }>('/api/admin/attributes', data);
        return response.data.attribute;
    },

    updateAttribute: async (id: number, data: AttributeUpdateData): Promise<Attribute> => {
        const response = await api.put<{ attribute: Attribute }>(`/api/admin/attributes/${id}`, data);
        return response.data.attribute;
    },

    deleteAttribute: async (id: number): Promise<{ success: boolean }> => {
        return api.delete(`/api/admin/attributes/${id}`);
    },

    // --- Valores de Atributos ---
    createAttributeValue: async (data: AttributeValueCreationData): Promise<AttributeValue> => {
        const response = await api.post<{
            value: AttributeValue
        }>(`/api/admin/attributes/${data.attributeId}/values`, {value: data.value});
        return response.data.value;
    },

    updateAttributeValue: async (attributeId: number, valueId: number, data: AttributeValueUpdateData): Promise<AttributeValue> => {
        const response = await api.put<{
            value: AttributeValue
        }>(`/api/admin/attributes/${attributeId}/values/${valueId}`, data);
        return response.data.value;
    },

    deleteAttributeValue: async (attributeId: number, valueId: number): Promise<{ success: boolean }> => {
        return api.delete(`/api/admin/attributes/${attributeId}/values/${valueId}`);
    },
};