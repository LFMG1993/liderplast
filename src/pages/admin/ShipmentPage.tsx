import {useState, useEffect, useCallback} from 'react';
import type {Order, Shipment, ShipmentFormData} from '../../types';
import {Spinner} from '../../components/general/Spinner';
import {useNotification} from "../../providers/NotificationProvider.tsx";
import {orderService} from "../../services/orderService.ts";
import {ShipmentList} from "../../components/shipments/ShipmentList.tsx";
import {ShipmentModal} from "../../components/shipments/ShipmentModal.tsx";
import {Tabs} from "../../components/general/Tabs.tsx";
import {shipmentService} from "../../services/shipmentService.ts";
import {ExistingShipmentList} from "../../components/shipments/ExistingShipmentList.tsx";

const PendingShipmentsView = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {showNotification} = useNotification();

    const fetchShippableOrders = useCallback(async () => {
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
        }, [showNotification] // La función solo se recreará si showNotification cambia (lo cual es muy raro)
    );

    useEffect(() => {
        fetchShippableOrders();
    }, [fetchShippableOrders]);

    const handleOpenModal = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
        setIsModalOpen(false);
    };

    const handleCreateShipment = async (data: ShipmentFormData) => {
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
            <p className="text-gray-400 mb-6">
                Pedidos que han sido pagados y están listos para ser preparados y enviados.
            </p>
            {isLoading ? (
                <div className="flex justify-center items-center py-16"><Spinner/></div>
            ) : (
                <ShipmentList orders={orders} onManageShipment={handleOpenModal}/>
            )}

            {selectedOrder && (
                <ShipmentModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleCreateShipment} // Llama a la función de crear
                    orderId={selectedOrder.id}
                    isSubmitting={isSubmitting}
                />
            )}
        </>
    );
}

// --- Vista para Envíos Existentes ---
const ExistingShipmentsView = () => {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {showNotification} = useNotification();

    const fetchShipments = useCallback(async () => {
            setIsLoading(true);
            try {
                const fetchedShipments = await shipmentService.listShipment();
                setShipments(fetchedShipments);
            } catch (error) {
                showNotification({message: 'Error al cargar los envíos.', type: 'error'});
            } finally {
                setIsLoading(false);
            }
        }, [showNotification] // La función solo se recreará si showNotification cambia
    );

    useEffect(() => {
        fetchShipments();
    }, [fetchShipments]);

    const handleOpenModal = (shipment: Shipment) => {
        setSelectedShipment(shipment);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedShipment(null);
        setIsModalOpen(false);
    };

    const handleUpdateShipment = async (data: ShipmentFormData) => {
        if (!selectedShipment) return;
        // Limpiamos el payload para la actualización
        const cleanedData: Partial<ShipmentFormData> = {
            shippingMethod: data.shippingMethod,
        };

        if (data.shippingMethod === 'national_shipping') {
            cleanedData.company = data.company;
            cleanedData.trackingNumber = data.trackingNumber;
            cleanedData.trackingUrl = data.trackingUrl;
        } else if (data.shippingMethod === 'local_delivery') {
            cleanedData.driverName = data.driverName;
            cleanedData.licensePlate = data.licensePlate;
        }
        setIsSubmitting(true);
        try {
            await shipmentService.updateShipment(selectedShipment.id, cleanedData);
            showNotification({message: `Envío #${selectedShipment.id} actualizado.`, type: 'success'});
            handleCloseModal();
            await fetchShipments(); // Recargar lista
        } catch (error) {
            showNotification({message: 'Error al actualizar el envío.', type: 'error'});
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <p className="text-gray-400 mb-6">
                Todos los envíos que han sido creados. Desde aquí puedes editar la información de seguimiento.
            </p>
            {isLoading ? (
                <div className="flex justify-center items-center py-16"><Spinner/></div>
            ) : (
                <ExistingShipmentList shipments={shipments} onUpdateShipment={handleOpenModal}/>
            )}
            {selectedShipment && (
                <ShipmentModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleUpdateShipment} // Llama a la función de actualizar
                    orderId={selectedShipment.orderId}
                    shipmentToEdit={selectedShipment} // Pasa el envío para entrar en modo edición
                    isSubmitting={isSubmitting}
                />
            )}
        </>
    );
};


// --- Componente Principal de la Página ---
export default function ShipmentsPage() {
    const tabs = [
        {label: 'Pendientes de Envío', content: <PendingShipmentsView/>},
        {label: 'Envíos Realizados', content: <ExistingShipmentsView/>},
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-4">Gestión de Envíos</h1>
            <Tabs tabs={tabs}/>
        </div>
    );
}