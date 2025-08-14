const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Esto nos da autocompletado y seguridad de tipos en todo el frontend.
export interface User {
    id: number;
    nombre: string;
    email: string;
    rol: 'admin' | 'user';
    created_at: string;
}

export type UserCreationData = Omit<User, 'id' | 'created_at'> & { password?: string };
export type UserUpdateData = Omit<User, 'id' | 'created_at' | 'password'>;

/**
 * Realiza una petición fetch estandarizada, manejando las credenciales y los errores comunes.
 * @param endpoint El endpoint de la API al que se llamará.
 * @param options Las opciones de la petición fetch.
 * @returns La respuesta en formato JSON.
 * @throws Un error con un mensaje útil si la respuesta no es OK.
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

    // Si la respuesta no tiene contenido (ej. DELETE), devolvemos un objeto de éxito.
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { success: true };
    }

    return response.json();
}

// --- Funciones del CRUD ---

export const userService = {
    getUsers: async (): Promise<{ users: User[] }> => {
        return apiFetch('/api/admin/users');
    },

    getUserById: async (id: number): Promise<{ user: User }> => {
        return apiFetch(`/api/admin/users/${id}`);
    },

    createUser: async (userData: UserCreationData): Promise<{ id: number }> => {
        return apiFetch('/api/admin/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    updateUser: async (id: number, userData: UserUpdateData): Promise<{ success: boolean }> => {
        return apiFetch(`/api/admin/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    },

    deleteUser: async (id: number): Promise<{ success: boolean }> => {
        return apiFetch(`/api/admin/users/${id}`, {
            method: 'DELETE',
        });
    },
};