import {createContext, useState, type ReactNode, useEffect, useContext} from 'react';
import {apiFetch} from "../services/api";

// Definimos la forma de los datos del usuario
interface User {
    id: number;
    name: string;
    email: string;
}

// Definimos la forma de nuestro contexto de autenticación
interface AuthContextType {
    authState: {
        isAuthenticated: boolean;
        isLoading: boolean;
        user: User | null;
    };
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

// Creamos el contexto con un valor inicial por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
    }
    return context;
};
// Creamos el "Proveedor" del contexto. Este componente envolverá nuestra aplicación.
export const AuthProvider = ({children}: { children: ReactNode }) => {
    // Estado unificado para manejar la autenticación
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        isLoading: true,
        user: null as User | null,
    });
    // Esta función verifica la sesión contra el backend y actualiza el estado.
    useEffect(() => {
        let isMounted = true;
        const verifyAuth = async () => {
            try {
                const data = await apiFetch('/api/admin/profile');

                if (!isMounted) return; // Si el componente se desmontó, no hacemos nada.

                setAuthState({isAuthenticated: true, isLoading: false, user: data.profile});
            } catch (error: any) {
                if (isMounted) {
                    setAuthState({isAuthenticated: false, isLoading: false, user: null});
                }
            }
        };
        verifyAuth();
        return () => {
            isMounted = false; // Limpiamos la bandera al desmontar el componente
        };
    }, []);

    // Función para iniciar sesión
    const login = async (email: string, password: string) => {
        try {
            const data = await apiFetch('/api/admin/login', {
                method: 'POST', body: JSON.stringify({email, password})
            });

            if (data.token && data.user) {
                // ✅ CORRECCIÓN CRÍTICA: Guardamos el token en localStorage.
                // Ahora, todas las futuras llamadas con `apiFetch` estarán autenticadas.
                localStorage.setItem('authToken', data.token);
                setAuthState({isAuthenticated: true, isLoading: false, user: data.user});
                return {success: true};
            }
            return {success: false, error: 'Respuesta inesperada del servidor.'};
        } catch (error: any) {
            return {success: false, error: error.message || 'No se pudo conectar con el servidor.'};
        }
    };

    // Función para cerrar sesión
    const logout = async () => {
        localStorage.removeItem('authToken');
        setAuthState({isAuthenticated: false, isLoading: false, user: null});
        try {
            await apiFetch('/api/admin/logout', {method: 'POST'});
        } catch (error) {
            // No hacer nada. El logout en el frontend es lo más importante.
        }
    };

    return <AuthContext.Provider value={{authState, login, logout}}>{children}</AuthContext.Provider>;
};