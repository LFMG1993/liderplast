import {useUserAuth} from "../../context/UserAuthContext.tsx";
import {useNavigate} from 'react-router-dom';
import {useEffect} from 'react';
import {Spinner} from '../../components/general/Spinner.tsx';
import {SEO} from "../../components/general/SEO.tsx";
import {Tabs} from "../../components/general/Tabs.tsx";
import {OrderHistory} from "../../components/customer/OrderHistory.tsx";
import {ShipmentHistory} from "../../components/customer/ShipmentHistory.tsx";

export default function CustomerPage() {
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

    const profileTabContent = (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Tus Datos</h2>
            <div className="space-y-2">
                <p><strong>Nombre:</strong> {customer.name}</p>
                <p><strong>Email:</strong> {customer.email}</p>
            </div>
            <button onClick={logout}
                    className="mt-6 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
                Cerrar Sesión
            </button>
        </div>
    );

    const tabs = [
        {label: 'Mis Pedidos', content: <OrderHistory/>},
        {label: 'Mis Envíos', content: <ShipmentHistory/>},
        {label: 'Mis Datos', content: profileTabContent},
    ];


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

                <Tabs tabs={tabs}/>
            </div>
        </>
    );
}