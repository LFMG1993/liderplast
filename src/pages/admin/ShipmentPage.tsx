import {useState, useEffect} from 'react';
import type {Order, ShipmentCreationData} from '../../types';
import {Spinner} from '../../components/general/Spinner';
import {useNotification} from "../../providers/NotificationProvider.tsx";
import {orderService} from "../../services/orderService.ts";
import {ShipmentList} from "../../components/shipments/ShipmentList.tsx";
import {ShipmentModal} from "../../components/shipments/ShipmentModal.tsx";

export default function ShipmentsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {showNotification} = useNotification();

    const fetchShippableOrders = async () => {
        setIsLoading(true);
        try {
            // Buscamos pedidos pagados y por preparar
            const fetchedOrders = await orderService.listAdmin({
                paymentStatus: 'paid',
                shippingStatus: 'unfulfilled'
            });
            setOrders(fetchedOrders);
        } catch (error) {
            showNotification({message: 'Error al cargar los pedidos para envío.', type: 'error'});
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchShippableOrders();
    }, [showNotification]);

    const handleOpenModal = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
        setIsModalOpen(false);
    };

    const handleCreateShipment = async (data: ShipmentCreationData) => {
        if (!selectedOrder) return;
        setIsSubmitting(true);

        try {
            await orderService.createShipment(selectedOrder.id, data);
            showNotification({message: `Envío para el pedido #${selectedOrder.id} creado con éxito.`, type: 'success'});
            handleCloseModal();
            // Volvemos a cargar los pedidos para que el recién gestionado desaparezca de la lista
            await fetchShippableOrders();
        } catch (error) {
            showNotification({message: 'Error al crear el envío.', type: 'error'});
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-white">Gestión de Envíos</h1>
                    {/* Aquí podríamos agregar filtros en el futuro */}
                </div>

                <p className="text-gray-600 mb-6">
                    Aquí se listan los pedidos que han sido pagados y están listos para ser preparados y enviados.
                </p>

                {isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <Spinner/>
                    </div>
                ) : (
                    <ShipmentList
                        orders={orders}
                        onManageShipment={handleOpenModal}
                    />
                )}
            </div>

            {selectedOrder && (
                <ShipmentModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleCreateShipment}
                    order={selectedOrder}
                    isSubmitting={isSubmitting}
                />
            )}
        </>
    );
}