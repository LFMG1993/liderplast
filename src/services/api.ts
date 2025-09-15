import axios from 'axios';

/**
 * Clase de error personalizada para errores de la API, ahora compatible con Axios.
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
 * Instancia de Axios pre-configurada.
 *  Esta será la única forma de comunicarse con el backend.
 */
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, // Importante para las cookies de sesión si se usan
});

/**
 * INTERCEPTOR DE RESPUESTAS: Centraliza el manejo de errores.
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.error || error.message || 'Ocurrió un error desconocido.';
        const status = error.response?.status || 500;
        return Promise.reject(new ApiError(message, status, error.response?.data));
    }
);