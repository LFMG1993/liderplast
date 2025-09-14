import type {
    Attribute,
    AttributeCreationData,
    AttributeUpdateData,
    AttributeValueCreationData,
    AttributeValueUpdateData,
    AttributeValue
} from "../types";
import {apiFetch} from "./api";

// --- Funciones del Servicio de Atributos ---
export const attributeService = {
        getAttributesWithValues: async (): Promise<Attribute[]> => {
            const response = await apiFetch('/api/admin/attributes');
            return response.attributes;
    },

    createAttribute: async (data: AttributeCreationData): Promise<Attribute> => {
        const response = await apiFetch('/api/admin/attributes', {method: 'POST', body: JSON.stringify(data)});
        return response.attribute;
    },

    updateAttribute: async (id: number, data: AttributeUpdateData): Promise<Attribute> => {
        const response = await apiFetch(`/api/admin/attributes/${id}`, {method: 'PUT', body: JSON.stringify(data)});
        return response.attribute;
    },

    deleteAttribute: async (id: number): Promise<{ success: boolean }> => {
        return apiFetch(`/api/admin/attributes/${id}`, {method: 'DELETE'});
    },

    // --- Valores de Atributos ---
    createAttributeValue: async (data: AttributeValueCreationData): Promise<AttributeValue> => {
        const response = await apiFetch(`/api/admin/attributes/${data.attributeId}/values`, {
            method: 'POST',
            body: JSON.stringify({value: data.value})
        });
        return response.value;
    },

    updateAttributeValue: async (attributeId: number, valueId: number, data: AttributeValueUpdateData): Promise<AttributeValue> => {
        const response = await apiFetch(`/api/admin/attributes/${attributeId}/values/${valueId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return response.value;
    },

    deleteAttributeValue: async (attributeId: number, valueId: number): Promise<{ success: boolean }> => {
        return apiFetch(`/api/admin/attributes/${attributeId}/values/${valueId}`, {method: 'DELETE'});
    },
};