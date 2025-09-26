import {useEffect, useState} from 'react';
import {orderService} from '../../services/orderService';
import type {Order} from '../../types';
import {ShippingStatusLabels, ShippingStatusColors} from '../../types';
import {Spinner} from '../general/Spinner';
import {useNotification} from '../../providers/NotificationProvider';
import {Clipboard} from "react-bootstrap-icons";

const ShipmentCard = ({order}: { order: Order }) => {
    const {shipment, shippingStatus} = order;
    const {showNotification} = useNotification();

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            showNotification({message: 'Número de guía copiado', type: 'success'});
        });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                    <p className="font-semibold text-gray-800">Pedido <span
                        className="text-liderplast-primary">N. {order.id}</span></p>
                    <p className="text-sm text-gray-500">
                        Fecha del pedido: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Estado del Envío</p>
                    <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${ShippingStatusColors[shippingStatus]}`}>
                        {ShippingStatusLabels[shippingStatus]}
                                </span>
                </div>
            </div>
            <div className="mt-4 border-t pt-4 space-y-2 text-sm">
                {shipment ? (
                    <div>
                        <p className="text-gray-600 mb-2"><strong>Fecha de
                            envío:</strong> {new Date(shipment.createdAt).toLocaleDateString()}</p>
                        {shipment.shippingMethod === 'national_shipping' && (
                            <>
                                {shipment.company && <p><strong>Transportadora:</strong> {shipment.company}</p>}
                                {shipment.trackingNumber && (
                                    <div className="flex items-center gap-2">
                                        <p><strong>Guía:</strong> {shipment.trackingNumber}</p>
                                        <button onClick={() => copyToClipboard(shipment.trackingNumber!)}
                                                title="Copiar guía">
                                            <Clipboard
                                                className="h-5 w-5 text-gray-500 hover:text-liderplast-primary"/>
                                        </button>
                                    </div>
                                )}
                                {shipment.trackingUrl &&
                                    <a href={shipment.trackingUrl} target="_blank" rel="noopener noreferrer"
                                       className="text-liderplast-primary hover:underline font-semibold">Rastrear
                                        paquete</a>}
                            </>
                        )}
                        {shipment.shippingMethod === 'local_delivery' && (
                            <>
                                {shipment.driverName && <p><strong>Conductor:</strong> {shipment.driverName}</p>}
                                {shipment.licensePlate && <p><strong>Placa:</strong> {shipment.licensePlate}</p>}
                            </>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">Los detalles del envío aparecerán aquí una vez que sea
                        procesado.</p>
                )}
            </div>
        </div>
    );
};

export const ShipmentHistory = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const {showNotification} = useNotification();

    useEffect(() => {
        orderService.listForCustomer()
            .then(setOrders)
            .catch(error => showNotification({message: `Error al cargar envíos: ${error.message}`, type: 'error'}))
            .finally(() => setIsLoading(false));
    }, [showNotification]);

    if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner/></div>;
    const ordersWithShipmentInfo = orders.filter(order => order.shippingStatus !== 'unfulfilled' || order.shipment);

    if (ordersWithShipmentInfo.length === 0) {
        return (
            <div className="text-center py-10 px-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800">No tienes envíos para mostrar</h3>
                <p className="text-gray-500 mt-2">Cuando tus pedidos sean preparados para el envío, aparecerán en esta
                    sección.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {ordersWithShipmentInfo.map(order => <ShipmentCard key={order.id} order={order}/>)}
        </div>
    );
};