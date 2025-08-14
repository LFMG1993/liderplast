import {createContext, useState, type ReactNode, useEffect, useContext} from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
                const response = await fetch(`${API_BASE_URL}/api/admin/profile`, {
                    credentials: 'include'
                });

                if (!isMounted) return; // Si el componente se desmontó, no hacemos nada.

                if (response.ok) {
                    const data = await response.json();
                    setAuthState({isAuthenticated: true, isLoading: false, user: data.profile});
                } else {
                    setAuthState({isAuthenticated: false, isLoading: false, user: null});
                }
            } catch (error) {
                console.error("Error al verificar la sesión:", error);
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
            const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
                credentials: 'include', // Aseguramos que las cookies se envíen con la solicitud
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
            });
            if (response.ok) {
                const data = await response.json();
                setAuthState({isAuthenticated: true, isLoading: false, user: data.user});
                return {success: true};
            } else {
                const data = await response.json();
                let errorMessage = 'Credenciales inválidas o error desconocido.';
                if (data.error) {
                    errorMessage = data.error;
                } else if (data.errors) {
                    errorMessage = Object.values(data.errors).flat().join(' ');
                }
                return {success: false, error: errorMessage};
            }
        } catch (error) {
            console.error("Error en el login:", error);
            return {success: false, error: 'No se pudo conectar con el servidor.'};
        }
    };

    // Función para cerrar sesión
    const logout = async () => {
        fetch(`${API_BASE_URL}/api/admin/logout`, {method: 'POST', credentials: 'include'})
            .catch(error => console.error("La llamada de logout al backend falló (esto es informativo):", error));

        setAuthState({isAuthenticated: false, isLoading: false, user: null});
    };

    return <AuthContext.Provider value={{authState, login, logout}}>{children}</AuthContext.Provider>;
};