import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {orderService} from '../../services/orderService';
import {paymentMethodService} from '../../services/paymentMethodService';
import {uploadCustomerImage} from "../../services/imageCustomerService.ts";
import type {Order, PaymentMethod} from '../../types';
import {useCart} from "../../context/CardContext.tsx";
import {useNotification} from '../../providers/NotificationProvider';
import {Spinner} from '../../components/general/Spinner';
import {ImageUploader} from '../../components/general/ImageUploader';
import {Button} from '../../components/general/Button';

export default function CheckoutPage() {
    const {orderId} = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const {clearCart} = useCart();
    const {showNotification} = useNotification();

    const [order, setOrder] = useState<Order | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
    const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);

    useEffect(() => {
        if (!orderId) {
            navigate('/perfil');
            return;
        }

        const loadData = async () => {
            try {
                setIsLoading(true);
                const orderData = await orderService.getById(Number(orderId));
                const methodsData = await paymentMethodService.listPublic();
                setOrder(orderData);
                setPaymentMethods(methodsData);
            } catch (error: any) {
                showNotification({message: `Error al cargar datos: ${error.message}`, type: 'error'});
                navigate('/perfil');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [orderId, navigate, showNotification]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId || !selectedMethodId || !paymentProofFile) {
            showNotification({
                message: 'Por favor, selecciona un método de pago y sube tu comprobante.',
                type: 'error'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            // Estrategia "Subir Primero":
            const entityName = `payment-confirmation/order-${orderId}`;
            const imageUrl = await uploadCustomerImage(paymentProofFile, entityName);

            await orderService.confirmPayment(Number(orderId), {
                paymentMethodId: selectedMethodId,
                paymentConfirmationUrl: imageUrl,
            });

            showNotification({message: '¡Gracias! Hemos recibido tu comprobante.', type: 'success'});
            clearCart();
            navigate(`/orden-confirmada/${orderId}`);

        } catch (error: any) {
            showNotification({message: `Error al enviar el comprobante: ${error.message}`, type: 'error'});
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Spinner/></div>;
    }

    if (!order) {
        return <div className="text-center p-10">No se encontró la orden.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Confirmar Pago del Pedido #{order.id}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Columna Izquierda: Métodos de Pago */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">1. Realiza tu pago</h2>
                    <p className="text-gray-600 mb-4">Total a pagar: <span
                        className="font-bold text-lg">${order.total.toFixed(2)}</span></p>
                    <div className="space-y-6">
                        {paymentMethods.map((method) => (
                            <div key={method.id}
                                 className={`border rounded-lg p-4 ${selectedMethodId === method.id ? 'border-liderplast-primary ring-2 ring-liderplast-primary' : 'border-gray-300'}`}>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        className="h-4 w-4 text-liderplast-primary focus:ring-liderplast-primary"
                                        onChange={() => setSelectedMethodId(method.id)}
                                    />
                                    <span className="ml-3 font-medium text-gray-800">{method.name}</span>
                                </label>
                                {method.qrCodeUrl && (
                                    <div className="mt-4 pl-7">
                                        <img src={method.qrCodeUrl} alt={`QR para ${method.name}`}
                                             className="w-48 h-48 object-contain border rounded"/>
                                        {method.instructions &&
                                            <p className="text-sm text-gray-600 mt-2">{method.instructions}</p>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Columna Derecha: Subir Comprobante */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">2. Notifica tu pago</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <p className="text-gray-600 mb-2">Sube una captura de pantalla o foto de tu comprobante.</p>
                            <ImageUploader
                                onFileChange={setPaymentProofFile}
                                isUploading={isSubmitting}
                            />
                        </div>
                        <Button type="submit" disabled={isSubmitting || !selectedMethodId || !paymentProofFile}
                                className="w-full">
                            {isSubmitting ? 'Enviando...' : 'Confirmar y Enviar Comprobante'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}