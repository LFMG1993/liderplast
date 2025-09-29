import type {Shipment} from "../../types";
import {ShippingMethodLabels, ShippingStatusColors, ShippingStatusLabels} from "../../types";
import {StatusBadge} from "../general/StatusBadge.tsx";

interface ExistingShipmentListProps {
    shipments: Shipment[];
    onUpdateShipment: (shipment: Shipment) => void;
}

export const ExistingShipmentList = ({shipments, onUpdateShipment}: ExistingShipmentListProps) => {
    if (shipments.length === 0) {
        return <p className="text-center text-gray-500 py-8">No se encontraron envíos.</p>;
    }

    return (
        <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-750">
                <tr>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Pedido #
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Método
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Detalles de Envío
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Estado
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Editar</span>
                    </th>
                </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                {shipments.map((shipment) => (
                    <tr key={shipment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{shipment.orderId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ShippingMethodLabels[shipment.shippingMethod]}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {shipment.shippingMethod === 'national_shipping' ? (
                                <>
                                    {shipment.company && <p>{shipment.company}</p>}
                                    {shipment.trackingNumber &&
                                        <p className="text-xs text-gray-400">{shipment.trackingNumber}</p>}
                                </>
                            ) : (
                                <>
                                    {shipment.driverName && <p>{shipment.driverName}</p>}
                                    {shipment.licensePlate &&
                                        <p className="text-xs text-gray-400">{shipment.licensePlate}</p>}
                                </>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <StatusBadge
                                label={ShippingStatusLabels[shipment.order.shippingStatus]}
                                colorClasses={ShippingStatusColors[shipment.order.shippingStatus]}
                            />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                                onClick={() => onUpdateShipment(shipment)}
                                className="text-liderplast-primary hover:text-liderplast-secondary"
                            >
                                Editar
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};