import type {Order} from '../../types';
import {OrderItem} from './OrderItem.tsx';

interface OrderListProps {
    orders: Order[];
    onApprove: (orderId: number) => void;
    onReject: (orderId: number) => void;
    processingOrderId: number | null;
}

export function OrderList({orders, onApprove, onReject, processingOrderId}: OrderListProps) {
    if (orders.length === 0) {
        return <p className="text-center text-gray-500 py-8">No hay órdenes que coincidan con el filtro actual.</p>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comprobante
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {orders.map(order => (
                    <OrderItem key={order.id} order={order} onApprove={onApprove} onReject={onReject}
                               isProcessing={processingOrderId === order.id}/>
                ))}
                </tbody>
            </table>
        </div>
    );
}