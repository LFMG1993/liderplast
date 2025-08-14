import {Navigate, Outlet} from 'react-router-dom';
import {useAuth} from './AuthContext';

const ProtectedRoute = () => {
    const {authState} = useAuth();

    // Esto previene el "parpadeo" a la página de login al recargar.
    if (authState.isLoading) {
        return <div>Verificando sesión...</div>; // O un componente Spinner
    }

    if (!authState.isAuthenticated) {
        // Si no está autenticado, redirige a la página de login.
        return <Navigate to="/login" replace />;
    }

    // Si está autenticado, permite el acceso a la ruta hija.
    return <Outlet/>;
};

export default ProtectedRoute;