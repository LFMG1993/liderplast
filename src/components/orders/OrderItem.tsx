import type {Order} from '../../types';
import {Button} from '../general/Button.tsx';
import {Check, X, ExternalLink} from 'lucide-react';

interface OrderItemProps {
    order: Order;
    onApprove: (orderId: number) => void;
    onReject: (orderId: number) => void;
    isProcessing: boolean;
}

export function OrderItem({order, onApprove, onReject, isProcessing}: OrderItemProps) {
    const formattedDate = new Date(order.createdAt).toLocaleDateString('es-ES');
    const formattedTotal = new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP'}).format(order.total);

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user.nombre}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formattedDate}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{formattedTotal}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.paymentConfirmationUrl ? (
                    <a href={order.paymentConfirmationUrl} target="_blank" rel="noopener noreferrer"
                       className="text-blue-600 hover:text-blue-800 inline-flex items-center">
                        Ver Comprobante <ExternalLink className="ml-1 h-4 w-4"/>
                    </a>
                ) : (
                    <span className="text-gray-400">N/A</span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {order.paymentStatus === 'pending_confirmation' && (
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onApprove(order.id)}
                            disabled={isProcessing}
                        >
                            <Check className="h-4 w-4 mr-1"/> {isProcessing ? '...' : 'Aprobar'}
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onReject(order.id)}
                            disabled={isProcessing}
                        >
                            <X className="h-4 w-4 mr-1"/> {isProcessing ? '...' : 'Rechazar'}
                        </Button>
                    </div>
                )}
            </td>
        </tr>
    );
}