import {useUserAuth} from "../../context/UserAuthContext.tsx";
import {useNavigate} from 'react-router-dom';
import {useEffect} from 'react';
import {Spinner} from '../../components/general/Spinner.tsx';
import {SEO} from "../../components/general/SEO.tsx";

export default function ProfilePage() {
    const {customer, isAuthenticated, isLoading, logout} = useUserAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Si la carga inicial no ha terminado, no hagas nada.
        if (isLoading) return;
        // Si no está autenticado, redirige al inicio.
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading || !customer) {
        return <div className="flex justify-center items-center h-screen"><Spinner/></div>;
    }

    return (
        <>
            <SEO
                title="Mi Perfil - Liderplast"
                description="Gestiona tu información personal y revisa tu historial de pedidos en tu cuenta de Liderplast."
                canonicalUrl="/perfil"
                noIndex={true}
            />
            <div className="container mx-auto px-6 py-16">
                <h1 className="text-3xl font-bold mb-2">¡Hola, {customer.name}!</h1>
                <p className="text-gray-600 mb-8">Bienvenido a tu espacio personal.</p>

                <div className="bg-white p-8 rounded-lg shadow-md max-w-lg">
                    <h2 className="text-xl font-semibold mb-4">Tus Datos</h2>
                    <p><strong>Nombre:</strong> {customer.name}</p>
                    <p><strong>Email:</strong> {customer.email}</p>
                    <p><strong>Rol:</strong> {customer.rol}</p>
                    <button onClick={logout}
                            className="mt-6 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Cerrar Sesión
                    </button>
                </div>
            </div>
        </>
    );
}