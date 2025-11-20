import {useEffect} from 'react';
import {useQuery} from '@tanstack/react-query';
import {orderService} from '../../services/orderService';
import type {Order} from '../../types';
import {ShippingStatusLabels, ShippingStatusColors} from '../../types';
import {Spinner} from '../general/Spinner';
import {useNotification} from "../../context/NotificationContext.tsx";
import {Clipboard, PinMapFill} from "react-bootstrap-icons";

const ShipmentCard = ({order}: { order: Order }) => {
    const {shipment, shippingStatus, shippingAddress} = order;
    const {addNotification} = useNotification();

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            addNotification('Número de guía copiado', 'success');
        });
    };

    return (
        <div
            className="bg-[var(--color-card)] text-[var(--color-foreground)] p-4 rounded-lg shadow-sm border border-[var(--color-border)]">
            <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                    <p className="font-semibold">Pedido <span
                        className="text-primary">N. {order.id}</span></p>
                    <p className="text-sm text-[var(--color-foreground)]/60">
                        Fecha del pedido: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-[var(--color-foreground)]/60">Estado del Envío</p>
                    <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${ShippingStatusColors[shippingStatus]}`}>
                        {ShippingStatusLabels[shippingStatus]}
                                </span>
                </div>
            </div>
            {shippingAddress && (
                <div className="mt-4 border-t border-[var(--color-border)] pt-4">
                    <h4 className="font-semibold mb-2 flex items-center">
                        <PinMapFill className="h-5 w-5 mr-2 text-[var(--color-foreground)]/60"/>
                        Enviado a
                    </h4>
                    <div className="text-sm text-[var(--color-foreground)]/80 pl-7">
                        <p><strong>{shippingAddress.recipientName}</strong></p>
                        <p>{shippingAddress.street}, {shippingAddress.details}</p>
                        <p>{shippingAddress.city}, {shippingAddress.state}</p>
                    </div>
                </div>
            )}
            <div className="mt-4 border-t border-[var(--color-border)] pt-4 space-y-2 text-sm">
                {shipment ? (
                    <div>
                        <p className="text-[var(--color-foreground)]/80 mb-2"><strong>Fecha de
                            envío:</strong> {new Date(shipment.createdAt).toLocaleDateString()}</p>
                        {shipment.shippingMethod === 'national_shipping' && (
                            <>
                                {shipment.company && <p><strong>Transportadora:</strong> {shipment.company}</p>}
                                {shipment.trackingNumber && (
                                    <div className="flex items-center gap-2">
                                        <p><strong>Guía:</strong> {shipment.trackingNumber}</p>
                                        <button onClick={() => copyToClipboard(shipment.trackingNumber!)}
                                                title="Copiar guía"
                                                className="text-[var(--color-foreground)]/60 hover:text-primary">
                                            <Clipboard
                                                className="h-5 w-5"/>
                                        </button>
                                    </div>
                                )}
                                {shipment.trackingUrl &&
                                    <a href={shipment.trackingUrl} target="_blank" rel="noopener noreferrer"
                                       className="text-primary hover:underline font-semibold">Rastrear
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
                    <p className="text-sm text-[var(--color-foreground)]/60">Los detalles del envío aparecerán aquí una
                        vez que sea procesado.</p>
                )}
            </div>
        </div>
    );
};

export const ShipmentHistory = () => {
    const {addNotification} = useNotification();

    const {data: orders = [], isLoading, isError, error} = useQuery<Order[], any>({
        queryKey: ['customerShipments'],
        queryFn: orderService.listForCustomer,
    });

    useEffect(() => {
        if (isError && error) {
            addNotification(`Error al cargar envíos: ${error.message}`, 'error');
        }
    }, [isError, error, addNotification]);


    if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner/></div>;
    if (isError) return <div className="text-center py-10 px-4 bg-red-500/10 text-red-500 rounded-lg">Error al cargar el
        historial de envíos.</div>;

    const ordersWithShipmentInfo = orders.filter(order => order.shippingStatus !== 'unfulfilled' || order.shipment);

    if (ordersWithShipmentInfo.length === 0) {
        return (
            <div className="text-center py-10 px-4 bg-[var(--color-card)] text-[var(--color-foreground)] rounded-lg">
                <h3 className="text-lg font-medium">No tienes envíos para mostrar</h3>
                <p className="text-[var(--color-foreground)]/60 mt-2">Cuando tus pedidos sean preparados para el envío,
                    aparecerán en esta
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