import {create} from 'zustand';
import {api} from '../services/api';
import type {User} from '../types';

interface LoginResponse {
    token: string;
    user?: User;
    profile?: User;
}

interface ProfileResponse {
    profile: User;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    verifyAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: async (email, password) => {
        try {
            const response = await api.post<LoginResponse>('/api/admin/login', {email, password});
            const { user, profile} = response.data;
            const userData = user || profile; // ✅ MEJORA: Aceptamos 'user' o 'profile' para ser robustos.

            if (userData) {
                set({user: userData, isAuthenticated: true});
                return {success: true};
            }
            return {success: false, error: 'Respuesta inesperada del servidor (token o usuario no encontrados).'};
        } catch (error: any) {
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
            // Esta lógica se ejecuta siempre, garantizando que el usuario vea el logout.
            set({user: null, isAuthenticated: false});
        }
    },

    verifyAuth: async () => {

        try {
            // El interceptor de axios ya añade el token a la cabecera.
            const response = await api.get<ProfileResponse>('/api/admin/profile');
            const userData = response.data.profile;

            if (userData) {
                set({user: userData, isAuthenticated: true, isLoading: false});
            } else {
                // Si la respuesta es válida pero no tiene el perfil, cerramos sesión.
                get().logout();
                set({isLoading: false});
            }
        } catch (error) {
            // Si el token es inválido, la API devolverá un 401, que el interceptor capturará.
            // Aquí simplemente nos aseguramos de limpiar el estado.
            get().logout();
            set({isLoading: false});
        }
    },
}));

// Inicializamos la verificación de la sesión en cuanto se carga la app.
useAuthStore.getState().verifyAuth();