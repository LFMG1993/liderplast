const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Interfaces de Tipos para Productos ---
// ✅ MEJORA: Definimos tipos detallados que coinciden con las respuestas de nuestra API.
// Esto nos dará una increíble seguridad y autocompletado en todo el frontend.

export interface ProductVariant {
    id: number;
    sku: string;
    price: number;
    stock: number;
    salePrice?: number | null;
    // En el futuro, aquí podríamos tener los detalles de los valores de atributo.
}

export interface Product {
    id: number;
    name: string;
    description?: string | null;
    isFeatured: boolean;
    category: {
        id: number;
        name: string;
    };
    variants: ProductVariant[];
    // ... y cualquier otro campo que devuelva la API de getProductById
}

export interface ProductCreationData {
    name: string;
    description?: string;
    categoryId: number;
    isFeatured?: boolean;
    variants: {
        sku: string;
        price: number;
        stock: number;
        salePrice?: number;
        attributeValueIds: number[];
    }[];
}

export type ProductUpdateData = Partial<ProductCreationData>;


/**
 * Realiza una petición fetch estandarizada.
 * NOTA: A futuro, esta función podría moverse a un archivo compartido (ej: `src/lib/api.ts`)
 * para ser reutilizada por todos los servicios.
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

// --- Funciones del CRUD de Productos ---

export const productService = {
    getProducts: async (): Promise<{ products: Product[] }> => {
        return apiFetch('/api/admin/products');
    },

    getProductById: async (id: number): Promise<{ product: Product }> => {
        return apiFetch(`/api/admin/products/${id}`);
    },

    createProduct: async (productData: ProductCreationData): Promise<{ product: { id: number } }> => {
        return apiFetch('/api/admin/products', { method: 'POST', body: JSON.stringify(productData) });
    },

    updateProduct: async (id: number, productData: ProductUpdateData): Promise<{ success: boolean }> => {
        return apiFetch(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) });
    },

    deleteProduct: async (id: number): Promise<{ success: boolean }> => {
        return apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    },
};