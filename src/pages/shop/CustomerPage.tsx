import {useUserAuth} from "../../context/UserAuthContext.tsx";
import {useNavigate} from 'react-router-dom';
import {useEffect} from 'react';
import {Spinner} from '../../components/general/Spinner.tsx';
import {SEO} from "../../components/general/SEO.tsx";
import {Tabs} from "../../components/general/Tabs.tsx";
import {OrderHistory} from "../../components/customer/OrderHistory.tsx";
import {ShipmentHistory} from "../../components/customer/ShipmentHistory.tsx";
import {ProfileEditor} from "../../components/customer/ProfileEditor.tsx";
import {AddressManager} from "../../components/customer/AddressManager.tsx";

export default function CustomerPage() {
    const {customer, isAuthenticated, isLoading} = useUserAuth();
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

    const tabs = [
        {label: 'Mis Pedidos', content: <OrderHistory/>},
        {label: 'Mis Envíos', content: <ShipmentHistory/>},
        {label: 'Mis Direcciones', content: <AddressManager/>},
        {label: 'Mis Datos', content: <ProfileEditor/>},
    ];


    return (
        <>
            <SEO
                title="Mi Perfil - Liderplast"
                description="Gestiona tu información personal y revisa tu historial de pedidos en tu cuenta de Liderplast."
                canonicalUrl="/perfil"
                noIndex={true}
            />
            <div className="container mx-auto px-6 py-16 bg-[var(--color-background)] text-[var(--color-foreground)]">
                <h1 className="text-3xl font-bold mb-2">¡Hola, {customer.name}!</h1>
                <p className="text-[var(--color-foreground)]/80 mb-8">Bienvenido a tu espacio personal.</p>
                <Tabs tabs={tabs}/>
            </div>
        </>
    );
}