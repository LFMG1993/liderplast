import {Link, useParams} from 'react-router-dom';
import {CheckCircle} from 'lucide-react';
import {Button} from '../../components/general/Button';

export default function OrderConfirmationPage() {
    const {orderId} = useParams<{ orderId: string }>();

    return (
        <div
            className="flex flex-col items-center justify-center text-center p-8 min-h-[60vh] bg-[var(--color-background)] text-[var(--color-foreground)]">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4"/>
            <h1 className="text-3xl font-bold">¡Gracias por tu compra!</h1>
            <p className="mt-2 text-lg text-[var(--color-foreground)]/80">
                Hemos recibido la notificación de tu pago para el pedido <span
                className="font-semibold">#{orderId}</span>.
            </p>
            <p className="mt-2 text-[var(--color-foreground)]/80">
                Lo verificaremos pronto. Puedes ver el estado de tu pedido en tu perfil.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/perfil">
                    <Button variant="primary">
                        Ir a Mi Perfil
                    </Button>
                </Link>
                <Link to="/tienda">
                    <Button variant="secondary">Seguir Comprando</Button>
                </Link>
            </div>
        </div>
    );
}