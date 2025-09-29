import type {Order} from '../../types';
import {ShipmentItem} from './ShipmentItem.tsx';

interface ShipmentListProps {
    orders: Order[];
    onManageShipment: (order: Order) => void;
}

export function ShipmentList({orders, onManageShipment}: ShipmentListProps) {
    if (orders.length === 0) {
        return (
            <div className="text-center py-16 px-6 bg-gray-800 rounded-lg shadow-md">
                <svg
                    className="mx-auto h-12 w-12 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                <h3 className="mt-2 text-lg font-medium text-white">¡Todo al día!</h3>
                <p className="mt-1 text-sm text-gray-400">No hay pedidos pendientes de envío en este momento.</p>
            </div>
        );
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