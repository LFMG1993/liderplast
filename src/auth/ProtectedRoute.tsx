import {Navigate, Outlet} from 'react-router-dom';
import {useAuthStore} from "../store/authStore.ts";
import {Spinner} from "../components/general/Spinner.tsx";

const ProtectedRoute = () => {
    const {isAuthenticated, isLoading} = useAuthStore();
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <Spinner/>
                <p className="mt-4 text-lg text-gray-600">Cargando...</p>
            </div>
        );
    }

    return isAuthenticated ? <Outlet/> : <Navigate to="/admin/login" replace/>;
};

export default ProtectedRoute;