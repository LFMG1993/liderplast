import {Navigate, Outlet} from 'react-router-dom';
import {useAuthStore} from "../store/authStore.ts";

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuthStore();

    // Esto previene el "parpadeo" a la página de login al recargar.
    if (isLoading) {
        return <div>Verificando sesión...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;