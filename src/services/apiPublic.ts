import axios from 'axios';

/**
 * Instancia de Axios para endpoints públicos que no requieren un token de autenticación.
 * Esto evita enviar cabeceras de autorización a rutas como login, registro, etc.
 */
export const apiPublic = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {'Content-Type': 'application/json'},
});