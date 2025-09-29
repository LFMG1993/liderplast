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
});

/**
 * INTERCEPTOR DE PETICIONES: Centraliza la inyección del token de autenticación.
 */
api.interceptors.request.use(
    (config) => {
        // Obtenemos el token desde localStorage en cada petición.
        const token = localStorage.getItem('liderplast-admin-token');

        // Si el token existe, lo añadimos a la cabecera 'Authorization'.
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config; // Devolvemos la configuración modificada para que la petición continúe.
    },
    (error) => Promise.reject(error)
);

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