import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {orderService} from '../../services/orderService';
import {
    type Order,
    PaymentStatusLabels,
    PaymentStatusColors,
} from '../../types';
import {Spinner} from '../general/Spinner';
import {useNotification} from "../../context/NotificationContext.tsx";
import {Button} from '../general/Button';
import {Modal} from '../general/Modal';

/** Genera una descripción legible de la variante a partir de sus atributos. */
const getVariantDescription = (variant: Order['items'][0]['variant']): string => {
    if (!variant?.variantValues || variant.variantValues.length === 0) return '';
    return variant.variantValues
        .map(vv => `${vv.attributeValue.attribute.name}: ${vv.attributeValue.value}`)
        .join(', ');
};

const OrderDetailsModal = ({order, onClose}: { order: Order | null; onClose: () => void }) => {
    if (!order) return null;

    return (
        <Modal
            isOpen={!!order}
            onClose={onClose}
            title={order ? `Detalles del Pedido N. ${order.id}` : ''}
            size="lg"
        >
            {order && (
                <div className="space-y-4">
                    {order.items.map(item => {
                        const lineSubtotal = item.price * item.quantity;
                        const variantDescription = getVariantDescription(item.variant);

                        return (
                            <div key={item.id}
                                 className="flex items-start gap-4 border-b border-[var(--color-border)] pb-4 last:border-b-0">
                                <img
                                    // Priorizamos la imagen de la variante, si no, la del producto.
                                    src={item.variant?.imageUrl ?? item.product.imageUrl ?? '/placeholder.png'}
                                    alt={item.product.name}
                                    className="w-20 h-20 object-cover rounded-md bg-[var(--color-muted)]"
                                />
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.product.name}</p>
                                    {/* Mostramos la descripción de la variante si existe */}
                                    {variantDescription &&
                                        <p className="text-sm text-[var(--color-foreground)]/60">{variantDescription}</p>}
                                    <p className="text-sm text-[var(--color-foreground)]/80 mt-1">
                                        {item.quantity} x ${item.price.toLocaleString('es-CO')}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="font-semibold">${lineSubtotal.toLocaleString('es-CO')}</p>
                                </div>
                            </div>
                        );
                    })}
                    <div className="flex justify-end items-center pt-4">
                        <p className="text-lg font-bold">Total:</p>
                        <p className="text-lg font-bold ml-2">${order.total.toLocaleString('es-CO')}</p>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export const OrderHistory = () => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const {addNotification} = useNotification();

    const {data: orders = [], isLoading, isError, error} = useQuery<Order[], any>({
        queryKey: ['customerOrders'],
        queryFn: orderService.listForCustomer,
    });

    useEffect(() => {
        if (isError && error) {
            addNotification(`Error al cargar tus pedidos: ${error.message}`, 'error');
        }
    }, [isError, error, addNotification]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Spinner/></div>;
    }

    if (isError) {
        return <div className="text-center py-10 px-4 bg-red-500/10 text-red-500 rounded-lg">Error al cargar el
            historial de pedidos.</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-10 px-4 bg-[var(--color-card)] text-[var(--color-foreground)] rounded-lg">
                <h3 className="text-lg font-medium">Aún no tienes pedidos</h3>
                <p className="text-[var(--color-foreground)]/60 mt-2">¡Explora nuestra tienda y encuentra los mejores
                    productos!</p>
                <Link to="/tienda" className="mt-4 inline-block">
                    <Button>Ir a la Tienda</Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id}
                         className="bg-[var(--color-card)] text-[var(--color-foreground)] p-4 rounded-lg shadow-sm border border-[var(--color-border)]">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                            <div>
                                <p className="font-semibold">Pedido <span
                                    className="text-primary">N. {order.id}</span></p>
                                <p className="text-sm text-[var(--color-foreground)]/60">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-left md:text-center">
                                <p className="text-sm text-[var(--color-foreground)]/60">Total</p>
                                <p className="font-semibold">${order.total.toLocaleString('es-CO')}</p>
                            </div>
                            <div className="text-left md:text-center">
                                <p className="text-sm text-[var(--color-foreground)]/60">Estado del Pago</p>
                                <span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${PaymentStatusColors[order.paymentStatus]}`}>
                                    {PaymentStatusLabels[order.paymentStatus]}
                                </span>
                            </div>
                            <div className="text-left md:text-right">
                                <Button variant="primary" size="sm" onClick={() => setSelectedOrder(order)}>
                                    Ver Detalles
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)}/>
        </>
    );
};