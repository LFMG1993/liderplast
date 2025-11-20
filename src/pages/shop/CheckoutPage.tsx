import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useQuery, useMutation} from '@tanstack/react-query';
import {orderService} from '../../services/orderService';
import {paymentMethodService} from '../../services/paymentMethodService';
import {uploadCustomerImage} from "../../services/imageCustomerService.ts";
import {useCart} from "../../context/CardContext.tsx";
import {useNotification} from "../../context/NotificationContext.tsx";
import {Spinner} from '../../components/general/Spinner';
import {ImageUploader} from '../../components/general/ImageUploader';
import {Button} from '../../components/general/Button';

export default function CheckoutPage() {
    const {orderId} = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const {clearCart} = useCart();
    const {addNotification} = useNotification();

    const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
    const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);

    const {data, isLoading, isError, error} = useQuery({
        queryKey: ['checkoutData', orderId],
        queryFn: async () => {
            if (!orderId) throw new Error("ID de orden no válido.");
            const orderData = await orderService.getById(Number(orderId));
            const methodsData = await paymentMethodService.listPublic();
            return {order: orderData, paymentMethods: methodsData};
        },
        enabled: !!orderId,
        retry: false,
    });

    useEffect(() => {
        if (isError && error) {
            addNotification(`Error al cargar datos: ${error.message}`, 'error');
            navigate('/perfil');
        }
    }, [isError, error, addNotification, navigate]);

    const {order, paymentMethods} = data || {order: null, paymentMethods: []};

    const confirmPaymentMutation = useMutation({
        mutationFn: async ({imageUrl}: { imageUrl: string }) => {
            if (!orderId || !selectedMethodId) throw new Error("Faltan datos para confirmar el pago.");
            return orderService.confirmPayment(Number(orderId), {
                paymentMethodId: selectedMethodId,
                paymentConfirmationUrl: imageUrl,
            });
        },
        onSuccess: () => {
            addNotification('¡Gracias! Hemos recibido tu comprobante.', 'success');
            clearCart();
            navigate(`/orden-confirmada/${orderId}`);
        },
        onError: (error: any) => {
            addNotification(`Error al enviar el comprobante: ${error.message}`, 'error');
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId) {
            navigate('/perfil');
            return;
        }

        if (!selectedMethodId || !paymentProofFile) {
            addNotification('Por favor, selecciona un método de pago y sube tu comprobante.', 'error');
            return;
        }

        try {
            const entityName = `payment-confirmation/order-${orderId}`;
            const imageUrl = await uploadCustomerImage(paymentProofFile, entityName);

            confirmPaymentMutation.mutate({imageUrl});

        } catch (error: any) {
            addNotification(`Error al subir la imagen: ${error.message}`, 'error');
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Spinner/></div>;
    }

    if (isError) {
        return <div className="text-center p-10 text-red-500">Ocurrió un error al cargar los datos de la orden.</div>;
    }

    if (!order || paymentMethods.length === 0) {
        return <div className="text-center p-10">No se encontró la orden.</div>;
    }

    return (
        <div
            className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-[var(--color-background)] text-[var(--color-foreground)]">
            <h1 className="text-3xl font-bold mb-6">Confirmar Pago del Pedido #{order.id}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Columna Izquierda: Métodos de Pago */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">1. Realiza tu pago</h2>
                    <p className="text-[var(--color-foreground)]/80 mb-4">Total a pagar: <span
                        className="font-bold text-lg">${(order.total || 0).toLocaleString('es-CO')}</span></p>
                    <div className="space-y-6">
                        {paymentMethods.map((method) => (
                            <div key={method.id}
                                 className={`border rounded-lg p-4 transition-all ${selectedMethodId === method.id ? 'border-primary ring-2 ring-primary' : 'border-[var(--color-border)]'}`}>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        className="h-4 w-4 text-primary focus:ring-primary bg-transparent border-[var(--color-border)]"
                                        onChange={() => setSelectedMethodId(method.id)}
                                    />
                                    <span className="ml-3 font-medium">{method.name}</span>
                                </label>
                                {method.qrCodeUrl && (
                                    <div className="mt-4 pl-7">
                                        <img src={method.qrCodeUrl} alt={`QR para ${method.name}`}
                                             className="w-48 h-48 object-contain border border-[var(--color-border)] rounded"/>
                                        {method.instructions &&
                                            <p className="text-sm text-[var(--color-foreground)]/60 mt-2">{method.instructions}</p>}
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
                            <p className="text-[var(--color-foreground)]/80 mb-2">Sube una captura de pantalla o foto de
                                tu comprobante.</p>
                            <ImageUploader
                                onFileChange={setPaymentProofFile}
                                isUploading={confirmPaymentMutation.isPending}
                            />
                        </div>
                        <Button type="submit"
                                disabled={confirmPaymentMutation.isPending || !selectedMethodId || !paymentProofFile}
                                className="w-full">
                            {confirmPaymentMutation.isPending ? 'Enviando...' : 'Confirmar y Enviar Comprobante'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}