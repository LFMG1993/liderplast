import type {Order} from '../../types';
import {ShipmentItem} from './ShipmentItem.tsx';

interface ShipmentListProps {
    orders: Order[];
    onManageShipment: (order: Order) => void;
}

export function ShipmentList({orders, onManageShipment}: ShipmentListProps) {
    if (orders.length === 0) {
        return <div className="text-center py-10 bg-gray-50 rounded-lg">No hay pedidos pendientes de envío.</div>;
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pedido
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Detalles
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {orders.map(order => <ShipmentItem key={order.id} order={order} onManageShipment={onManageShipment}/>)}
                </tbody>
            </table>
        </div>
    );
}