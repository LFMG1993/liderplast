import {useState} from 'react';
import type {Order, ProductVariant} from '../../types';
import {Button} from '../general/Button.tsx';
import {ChevronDown, ChevronUp, Loader2} from 'lucide-react';
import {orderService} from "../../services/orderService.ts";

interface ShipmentItemProps {
    order: Order;
    onManageShipment: (order: Order) => void;
}

export function ShipmentItem({order, onManageShipment}: ShipmentItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [details, setDetails] = useState<Order | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const formattedTotal = new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP'}).format(order.total)

    // Función auxiliar para mostrar los atributos de la variante de forma legible
    const getVariantAttributes = (variant: ProductVariant | null) => {
        if (!variant || !variant.variantValues) return null;
        return variant.variantValues.map(vv => vv.attributeValue.value).join(' / ');
    };

    const handleToggleExpand = async () => {
        const newIsExpanded = !isExpanded;
        setIsExpanded(newIsExpanded);

        // Si vamos a expandir y aún no hemos cargado los detalles
        if (newIsExpanded && !details) {
            setIsLoadingDetails(true);
            setError(null);
            try {
                // Llamamos al nuevo método del servicio
                const fullOrderDetails = await orderService.getOrderById(order.id);
                setDetails(fullOrderDetails);
            } catch (e) {
                setError('No se pudieron cargar los detalles.');
            } finally {
                setIsLoadingDetails(false);
            }
        }
    };

    return (
        <>
            <tr className={isExpanded ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                    <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.user.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                    {formattedTotal}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button onClick={() => onManageShipment(order)} size="sm">
                        Gestionar Envío
                    </Button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={handleToggleExpand}
                            className="p-1 rounded-full hover:bg-gray-200 transition-colors text-black">
                        {isExpanded ? <ChevronUp className="h-5 w-5"/> : <ChevronDown className="h-5 w-5"/>}
                        <span className="sr-only">Ver detalles</span>
                    </button>
                </td>
            </tr>
            {isExpanded && (
                <tr className="bg-white">
                    <td colSpan={5} className="p-0">
                        <div className="p-4 border-l-4 border-liderplast-primary bg-gray-50/50">
                            <h4 className="font-semibold text-gray-800 mb-3">Productos del Pedido:</h4>
                            <ul className="space-y-3">
                                {isLoadingDetails && (
                                    <li className="flex items-center justify-center p-4 text-sm text-gray-500">
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin"/>
                                        Cargando detalles...
                                    </li>
                                )}
                                {error && <li className="text-sm text-red-500">{error}</li>}
                                {details && details.items.map(item => (
                                    <li key={item.id} className="flex items-center gap-4 text-sm">
                                        <img
                                            src={item.product.imageUrl ?? '/placeholder.png'}
                                            alt={item.product.name}
                                            className="h-12 w-12 rounded object-cover bg-gray-200"
                                        />
                                        <div className="flex-grow">
                                            <p className="font-medium text-gray-900">{item.product.name}
                                                <span
                                                    className="ml-2 text-gray-600 font-normal">({getVariantAttributes(item.variant)})</span>
                                            </p>
                                            <p className="text-gray-500">SKU: {item.variant?.sku || 'N/A'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-600">{item.quantity} x
                                                ${item.price.toLocaleString('es-CO')}</p>
                                            <p className="font-semibold text-gray-800">${(item.quantity * item.price).toLocaleString('es-CO')}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}