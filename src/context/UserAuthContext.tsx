import {createContext, useContext, useState, useEffect, type ReactNode, useCallback} from 'react';
import {jwtDecode} from 'jwt-decode';

    // Define la estructura del payload del token JWT del cliente.
        export interface Customer {
        userId: number;
        email: string;
        name: string;
        rol: 'customer'; // Específico para clientes
    }

    interface UserAuthContextType {
        customer: Customer | null;
        token: string | null;
        isAuthenticated: boolean;
        isLoading: boolean;
        login: (token: string) => void;
        logout: () => void;
    }

    const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

  export const UserAuthProvider = ({children}: { children: ReactNode }) => {
      const [customer, setCustomer] = useState<Customer | null>(null);
      const [token, setToken] = useState<string | null>(null);
      const [isLoading, setIsLoading] = useState(true);

           useEffect(() => {
                   try {
                         // 🔒 Usamos una clave de almacenamiento específica para el cliente.
                       const storedToken = localStorage.getItem('liderplast-customer-token');
                   if (storedToken) {
                           const decodedUser = jwtDecode<Customer>(storedToken);
                           setCustomer(decodedUser);
                           setToken(storedToken);
                       }
                 } catch (error) {
                     console.error("Error al decodificar el token de cliente:", error);
                     localStorage.removeItem('liderplast-customer-token');
                 } finally {
                     setIsLoading(false);
                 }
            }, []);

     const login = useCallback((newToken: string) => {
         try {
                const decodedUser = jwtDecode<Customer>(newToken);
                // 🔒 Guardamos el token del cliente en su propia clave.
                   localStorage.setItem('liderplast-customer-token', newToken);
                setCustomer(decodedUser);
                setToken(newToken);
            } catch (error) {
                console.error("Error al procesar el login del cliente:", error);
            }
     }, []);

     const logout = useCallback(() => {
         localStorage.removeItem('liderplast-customer-token');
         setCustomer(null);
         setToken(null);
     }, []);

     const value = {
           customer,
         token,
         isAuthenticated: !!token,
         isLoading,
         login,
         logout,
     };

            return (
                <UserAuthContext.Provider value={value}>
                        {children}
                    </UserAuthContext.Provider>
            );
   };

    export const useUserAuth = () => {
        const context = useContext(UserAuthContext);
        if (context === undefined) {
                throw new Error('useUserAuth debe ser usado dentro de un UserAuthProvider');
            }
        return context;
    };