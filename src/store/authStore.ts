import {create} from 'zustand';
import {api} from '../services/api';
import type {User} from '../types';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    verifyAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: async (email, password) => {
        try {
            const response = await api.post<{ token: string; user: User }>('/api/admin/login', {email, password});
            const {token, user: userData} = response.data;

            if (token && userData) {
                localStorage.setItem('liderplast-admin-token', token);
                set({user: userData, isAuthenticated: true, isLoading: false});
                return {success: true};
            }
            return {success: false, error: 'Respuesta inesperada del servidor'};
        } catch (error: any) {
            set({isLoading: false});
            return {success: false, error: error.message};
        }
    },

    logout: async () => {
        try {
            // Esperamos a que el backend confirme el cierre de sesión.
            await api.post('/api/admin/logout');
        } catch (error) {
            // Aunque la llamada falle, procedemos a limpiar el estado del frontend.
            console.error("La llamada de logout al backend falló, pero se cerrará la sesión localmente:", error);
        } finally {
            localStorage.removeItem('liderplast-admin-token');
            set({user: null, isAuthenticated: false});
        }
    },

    verifyAuth: async () => {

        try {
            // Verificamos si hay un token antes de hacer la llamada.
            const token = localStorage.getItem('liderplast-admin-token');
            if (!token) {
                set({isAuthenticated: false, isLoading: false});
                return;
            }

            const response = await api.get<any>('/api/admin/profile');
            const userData = response.data.user || response.data.profile;

            if (userData) {
                set({user: userData, isAuthenticated: true, isLoading: false});
            } else {
                // Si la respuesta es 200 pero no viene el usuario, es un estado invalido.
                set({isAuthenticated: false, isLoading: false});
            }
        } catch (error: any) {
            // Si la API devuelve un error (ej. 401 por token inválido), limpiamos el estado.
            localStorage.removeItem('liderplast-admin-token');
            set({user: null, isAuthenticated: false, isLoading: false});
        }
    },
}));