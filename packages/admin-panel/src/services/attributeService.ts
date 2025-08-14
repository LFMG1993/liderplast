const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Interfaces de Tipos para Atributos ---

export interface AttributeValue {
    id: number;
    attributeId: number;
    value: string;
}

export interface Attribute {
    id: number;
    name: string;
    values: AttributeValue[];
}
// --- Tipos para Creación y Actualización ---
export type AttributeCreationData = Pick<Attribute, 'name'>;
export type AttributeUpdateData = Partial<AttributeCreationData>;
export type AttributeValueCreationData = Pick<AttributeValue, 'value' | 'attributeId'>;
export type AttributeValueUpdateData = Partial<Pick<AttributeValue, 'value'>>;

/**
 * NOTA: Esta función es idéntica a la de otros servicios.
 * A futuro, podría moverse a un archivo `lib/api.ts` compartido.
 */
async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const defaultOptions: RequestInit = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...defaultOptions, ...options });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error de red o respuesta no válida.' }));
        throw new Error(errorData.error || 'Ocurrió un error desconocido.');
    }
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { success: true };
    }
    return response.json();
}

// --- Funciones del Servicio de Atributos ---

export const attributeService = {
    getAttributesWithValues: async (): Promise<{ attributes: Attribute[] }> => {
        return apiFetch('/api/admin/attributes');
    },
    createAttribute: async (data: AttributeCreationData): Promise<{ attribute: Attribute }> => {
        return apiFetch('/api/admin/attributes', { method: 'POST', body: JSON.stringify(data) });
    },
    updateAttribute: async (id: number, data: AttributeUpdateData): Promise<{ attribute: Attribute }> => {
        return apiFetch(`/api/admin/attributes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    },
    deleteAttribute: async (id: number): Promise<{ success: boolean }> => {
        return apiFetch(`/api/admin/attributes/${id}`, { method: 'DELETE' });
    },

    // --- Valores de Atributos ---
    createAttributeValue: async (data: AttributeValueCreationData): Promise<{ value: AttributeValue }> => {
        return apiFetch(`/api/admin/attributes/${data.attributeId}/values`, { method: 'POST', body: JSON.stringify({ value: data.value }) });
    },
    updateAttributeValue: async (attributeId: number, valueId: number, data: AttributeValueUpdateData): Promise<{ value: AttributeValue }> => {
        return apiFetch(`/api/admin/attributes/${attributeId}/values/${valueId}`, { method: 'PUT', body: JSON.stringify(data) });
    },
    deleteAttributeValue: async (attributeId: number, valueId: number): Promise<{ success: boolean }> => {
        return apiFetch(`/api/admin/attributes/${attributeId}/values/${valueId}`, { method: 'DELETE' });
    },
};