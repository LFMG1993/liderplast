import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {orderService} from '../../services/orderService';
import {
    type Order,
    PaymentStatusLabels,
    PaymentStatusColors,
} from '../../types';
import {Spinner} from '../general/Spinner';
import {useNotification} from '../../providers/NotificationProvider';
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
                            <div key={item.id} className="flex items-start gap-4 border-b pb-4">
                                <img
                                    // Priorizamos la imagen de la variante, si no, la del producto.
                                    src={item.variant?.imageUrl ?? item.product.imageUrl ?? '/placeholder.png'}
                                    alt={item.product.name}
                                    className="w-20 h-20 object-cover rounded-md"
                                />
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800">{item.product.name}</p>
                                    {/* Mostramos la descripción de la variante si existe */}
                                    {variantDescription &&
                                        <p className="text-sm text-gray-500">{variantDescription}</p>}
                                    <p className="text-sm text-gray-600 mt-1">
                                        {item.quantity} x ${item.price.toLocaleString('es-CO')}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="font-semibold text-gray-800">${lineSubtotal.toLocaleString('es-CO')}</p>
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
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const {showNotification} = useNotification();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const customerOrders = await orderService.listForCustomer();
                setOrders(customerOrders);
            } catch (error: any) {
                showNotification({message: `Error al cargar tus pedidos: ${error.message}`, type: 'error'});
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Spinner/></div>;
    }
    if (orders.length === 0) {
        return (
            <div className="text-center py-10 px-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800">Aún no tienes pedidos</h3>
                <p className="text-gray-500 mt-2">¡Explora nuestra tienda y encuentra los mejores productos!</p>
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
                    <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                            <div>
                                <p className="font-semibold text-gray-800">Pedido <span
                                    className="text-liderplast-primary">N. {order.id}</span></p>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-left md:text-center">
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="font-semibold text-gray-800">${order.total.toLocaleString('es-CO')}</p>
                            </div>
                            <div className="text-left md:text-center">
                                <p className="text-sm text-gray-500">Estado del Pago</p>
                                <span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${PaymentStatusColors[order.paymentStatus]}`}>
                                    {PaymentStatusLabels[order.paymentStatus]}
                                </span>
                            </div>
                            <div className="text-left md:text-right">
                                <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
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