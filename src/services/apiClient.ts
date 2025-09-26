import axios from 'axios';

/**
 * Instancia de Axios dedicada a las llamadas de la API del cliente.
 * Automáticamente adjunta el token de autenticación del cliente a cada petición.
 */
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {'Content-Type': 'application/json'},
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('liderplast-customer-token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});