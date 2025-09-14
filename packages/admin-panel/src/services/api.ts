/**
 * Clase de error personalizada para errores de la API.
 * Esto nos permite capturar y manejar errores de la API de forma más granular,
 * incluyendo el código de estado HTTP.
 */
export class ApiError extends Error {
    status: number;
    info: any;

    constructor(message: string, status: number, info: any = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.info = info;
    }
}

/**
 * Realiza una petición fetch estandarizada y segura a nuestra API.
 * Esta función centraliza la lógica de construcción de URL, cabeceras,
 * credenciales y, lo más importante, el manejo de errores.
 *
 * @param endpoint El endpoint de la API.
 * @param options Opciones adicionales para la petición fetch.
 * @returns La respuesta en formato JSON.
 * @throws {ApiError} Si la respuesta de la red no es OK.
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const defaultOptions: RequestInit = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {...defaultOptions, ...options});

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(errorData.error || 'Ocurrió un error en el servidor.', response.status, errorData);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {success: true};
    }

    return response.json();
}