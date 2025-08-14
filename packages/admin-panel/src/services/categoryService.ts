const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ MEJORA: El tipo Category es recursivo.
// Una categoría puede tener un array de 'hijos' que también son de tipo Category.
// Esto nos permite manejar jerarquías de cualquier profundidad.
export interface Category {
    id: number;
    name: string;
    description?: string | null;
    parentId?: number | null;
    imageUrl: string | null;
    children?: Category[];
}

export type CategoryCreationData = Omit<Category, 'id' | 'children'>;
export type CategoryUpdateData = Partial<CategoryCreationData>;

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

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {...defaultOptions, ...options});

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({error: 'Error de red o respuesta no válida.'}));
        throw new Error(errorData.error || 'Ocurrió un error desconocido.');
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {success: true};
    }

    return response.json();
}

// --- Funciones del CRUD de Categorías ---

export const categoryService = {
    getCategories: async (): Promise<{ categories: Category[] }> => {
        return apiFetch('/api/admin/categories');
    },
    createCategory: async (data: CategoryCreationData): Promise<Category> => {
        const response = await apiFetch('/api/admin/categories', {method: 'POST', body: JSON.stringify(data)});
        return response.category;
    },
    updateCategory: async (id: number, data: CategoryUpdateData): Promise<Category> => {
        const response = await apiFetch(`/api/admin/categories/${id}`, {method: 'PUT', body: JSON.stringify(data)});
        return response.category;
    },
    deleteCategory: async (id: number): Promise<{ success: boolean }> => {
        return apiFetch(`/api/admin/categories/${id}`, {method: 'DELETE'});
    },
};