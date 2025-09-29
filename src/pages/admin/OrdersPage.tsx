import {useState, useEffect} from 'react';
import type {PaymentStatus, Order} from '../../types';
import {Spinner} from '../../components/general/Spinner';
import {OrderList} from '../../components/orders/OrderList.tsx';
import {useNotification} from "../../providers/NotificationProvider.tsx";
import {orderService} from "../../services/orderService.ts";

const statusTabs: { label: string; status: PaymentStatus | null }[] = [
    {label: 'Todos', status: null},
    {label: 'Pendiente de Confirmación', status: 'pending_confirmation'},
    {label: 'Pagados', status: 'paid'},
    {label: 'Cancelados', status: 'cancelled'},
    {label: 'Reembolsados', status: 'refunded'},
];

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeStatus, setActiveStatus] = useState<PaymentStatus | null>('pending_confirmation');
    const [processingOrderId, setProcessingOrderId] = useState<number | null>(null);
    const {showNotification} = useNotification();

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const fetchedOrders = await orderService.listAdmin({paymentStatus: activeStatus ?? undefined});
                setOrders(fetchedOrders);
            } catch (error) {
                showNotification({message: 'Error al cargar las órdenes.', type: 'error'});
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [activeStatus, showNotification]);

    const handleApprove = async (orderId: number) => {
        setProcessingOrderId(orderId);
        try {
            await orderService.approve(orderId);
            showNotification({message: `Orden #${orderId} aprobada con éxito.`, type: 'success'});
            // Actualizamos la lista para reflejar el cambio de estado
            setOrders(prev => prev.filter(o => o.id !== orderId));
        } catch (error) {
            showNotification({message: 'Error al aprobar la orden.', type: 'error'});
        } finally {
            setProcessingOrderId(null);
        }
    };

    const handleReject = async (orderId: number) => {
        setProcessingOrderId(orderId);
        try {
            await orderService.reject(orderId);
            showNotification({message: `Orden #${orderId} rechazada.`, type: 'success'});
            setOrders(prev => prev.filter(o => o.id !== orderId));
        } catch (error) {
            showNotification({message: 'Error al rechazar la orden.', type: 'error'});
        } finally {
            setProcessingOrderId(null);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-4">Gestión de Órdenes</h1>

            <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-6" aria-="Tabs">
                    {statusTabs.map((tab) => (
                        <button
                            key={tab.label}
                            onClick={() => setActiveStatus(tab.status)}
                            className={`${
                                activeStatus === tab.status
                                    ? 'border-liderplast-primary text-liderplast-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-16">
                    <Spinner/>
                </div>
            ) : (
                <OrderList
                    orders={orders}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    processingOrderId={processingOrderId}
                />
            )}
        </div>
    );
}