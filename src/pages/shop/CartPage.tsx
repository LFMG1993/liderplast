import {useState, useCallback, useEffect} from "react";
import {useCart} from "../../context/CardContext.tsx";
import {FileImage, Plus, Trash, Dash, Whatsapp, CreditCard} from "react-bootstrap-icons";
import {SEO} from "../../components/general/SEO.tsx";
import {Link, useNavigate} from "react-router-dom";
import {ConfirmationModal} from "../../components/general/ConfirmationModal.tsx";
import {useUserAuth} from "../../context/UserAuthContext.tsx";
import {AuthModal} from "../../components/auth/AuthModal.tsx";
import {orderService} from "../../services/orderService.ts";
import {useNotification} from "../../providers/NotificationProvider.tsx";
import {AddressSelectionModal} from "../../components/customer/AdressSelectionModal.tsx";

export default function CartPage() {
    const {items, removeItem, clearCart, updateQuantity} = useCart();
    const {isAuthenticated} = useUserAuth();
    const navigate = useNavigate();
    const [isConfirmingClear, setIsConfirmingClear] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCheckoutIntent, setIsCheckoutIntent] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const {showNotification} = useNotification();
    const phone = "573242940464";

    // Genera el link de WhatsApp
    const whatsappLink = () => {
        const header = "🛒 *Hola, Deseo hacer el siguiente pedido*%0A%0A";
        const lines = items.map((it, idx) => {
            const applicableDiscount = it.volumeDiscounts
                ?.sort((a, b) => b.minQuantity - a.minQuantity)
                .find(d => it.quantity >= d.minQuantity);
            const effectivePrice = applicableDiscount ? applicableDiscount.price : it.price;
            const lineTotal = (effectivePrice * it.quantity).toLocaleString('es-CO');
            const fullDescription = [it.variantDescription, it.unitOfMeasure].filter(Boolean).join(' - ');

            return `${idx + 1}. ${it.quantity}x *${it.name}* (${fullDescription}) = *$${lineTotal}*`;
        });
        const body = lines.join("%0A%0A");
        const footer = `%0A%0A--------------------%0A*Total del Pedido: $${subtotal.toLocaleString('es-CO')}*`;
        return `https://api.whatsapp.com/send?phone=${phone}&text=${header + body + footer}`;
    };

    const handleConfirmClearCart = () => {
        clearCart();
        setIsConfirmingClear(false);
    };

    const startCheckoutProcess = useCallback(() => {
        if (!isAuthenticated) {
            setIsCheckoutIntent(true);
            setIsAuthModalOpen(true);
            return;
        }
        // Si ya está autenticado, abre directamente el modal de direcciones.
        setIsAddressModalOpen(true);
    }, [isAuthenticated]);

    // Se ejecuta DESPUÉS de seleccionar una dirección.
    const handleAddressSelected = useCallback(async (addressId: number) => {
        setIsAddressModalOpen(false); // Cierra el modal de direcciones
        setIsProcessing(true);
        try {
            // 1. Preparamos el payload para crear la orden
            const payload = {
                items: items.map(item => {
                    // Reutilizamos la misma lógica de cálculo de precio que en el resto de la página.
                    const applicableDiscount = item.volumeDiscounts
                        ?.sort((a, b) => b.minQuantity - a.minQuantity)
                        .find(d => item.quantity >= d.minQuantity);
                    const effectivePrice = applicableDiscount ? applicableDiscount.price : item.price;

                    return {
                        variantId: item.variantId, quantity: item.quantity, unitPrice: effectivePrice
                    };
                }),
                shippingAddressId: addressId, // <-- Incluimos el ID de la dirección
            };
            // 2. Llamamos al servicio para crear la orden
            const newOrder = await orderService.create(payload);
            // 3. Navegamos a la página de checkout CON el ID de la nueva orden
            navigate(`/checkout/${newOrder.id}`);
        } catch (error: any) {
            showNotification({message: `Error al crear el pedido: ${error.message}`, type: 'error'});
        } finally {
            setIsProcessing(false);
        }
    }, [isAuthenticated, items, navigate, showNotification]);

    useEffect(() => {
        if (isAuthenticated && isCheckoutIntent) {
            // Cerramos el modal y reiniciamos la intención...
            setIsAuthModalOpen(false);
            setIsCheckoutIntent(false);
            setIsAddressModalOpen(true);
        }
    }, [isAuthenticated, isCheckoutIntent]);


    const subtotal = items.reduce((sum, item) => {
        const applicableDiscount = item.volumeDiscounts
            ?.sort((a, b) => b.minQuantity - a.minQuantity)
            .find(d => item.quantity >= d.minQuantity);
        const effectivePrice = applicableDiscount ? applicableDiscount.price : item.price;
        return sum + (effectivePrice * item.quantity);
    }, 0);

    return (
        <>
            <SEO
                title="Tu Carrito de Compras"
                description="Revisa y finaliza tu pedido en Liderplast."
                canonicalUrl="/carrito"
            />
            <div className="container mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Tu Carrito</h1>

                {/* Layout de dos columnas para una mejor organización. */}
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
                    {/* Columna Izquierda: Lista de Productos */}
                    <div className="lg:col-span-2">
                        {items.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50 rounded-lg">
                                <p className="text-gray-500 text-lg mb-4">No hay productos en tu carrito.</p>
                                {/* Usamos un Link estilizado como botón para la navegación. */}
                                <Link to="/tienda"
                                      className="inline-block background-lider text-white px-6 py-3 rounded-md shadow-sm text-base font-medium hover:bg-liderplast-hover">
                                    Explorar productos
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={item.variantId}
                                        className="flex items-center bg-white p-4 rounded-lg shadow-sm border"
                                    >
                                        <div
                                            className="h-24 w-24 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.name}
                                                     className="h-full w-full object-cover rounded-md"/>
                                            ) : (
                                                <FileImage className="h-10 w-10 text-gray-400"/>
                                            )}
                                        </div>
                                        <div className="ml-4 flex-grow">
                                            <p className="font-semibold text-gray-800">{item.name}</p>
                                            <p className="text-sm text-gray-500">{item.variantDescription} {item.unitOfMeasure ? `(${item.unitOfMeasure})` : ''}</p>
                                            {/*  Lógica de precios dinámicos. */}
                                            <div className="text-sm">
                                                {(() => {
                                                    const applicableDiscount = item.volumeDiscounts
                                                        ?.sort((a, b) => b.minQuantity - a.minQuantity)
                                                        .find(d => item.quantity >= d.minQuantity);
                                                    const effectivePrice = applicableDiscount ? applicableDiscount.price : item.price;

                                                    return effectivePrice < item.price ? (
                                                        <p>
                                                            <span
                                                                className="text-gray-400 line-through mr-2">${item.price.toLocaleString('es-CO')}</span>
                                                            <span
                                                                className="font-bold text-green-600">${effectivePrice.toLocaleString('es-CO')}</span>
                                                        </p>
                                                    ) : <p>${item.price.toLocaleString('es-CO')}</p>
                                                })()}
                                            </div>
                                            {/* Controles de cantidad en línea. */}
                                            <div className="flex items-center mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                                    className="p-1 border rounded-md hover:bg-gray-100">
                                                    <Dash className="h-5 w-5"/>
                                                </button>
                                                <span className="px-4 font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                                    className="p-1 border rounded-md hover:bg-gray-100">
                                                    <Plus className="h-5 w-5"/>
                                                </button>
                                            </div>
                                            {/*  Burbuja de sugerencia para descuentos por volumen. */}
                                            {(() => {
                                                // Ordenamos los descuentos de menor a mayor cantidad.
                                                const sortedDiscounts = [...(item.volumeDiscounts || [])].sort((a, b) => a.minQuantity - b.minQuantity);
                                                // Buscamos el próximo descuento que el usuario aún no ha alcanzado.
                                                const nextDiscount = sortedDiscounts.find(d => item.quantity < d.minQuantity);

                                                if (nextDiscount) {
                                                    const needed = nextDiscount.minQuantity - item.quantity;
                                                    // Mostramos la burbuja solo si le faltan 5 o menos unidades para el descuento.
                                                    if (needed > 0 && needed <= 100) {
                                                        return (
                                                            <div
                                                                className="mt-2 text-xs bg-yellow-100 text-yellow-800 p-2 rounded-lg">
                                                                ¡Añade <b>{needed} {needed > 1 ? 'unidades más' : 'unidad más'}</b> y
                                                                paga <b>${nextDiscount.price.toLocaleString('es-CO')}</b> por
                                                                cada una!
                                                            </div>
                                                        );
                                                    }
                                                }
                                                return null;
                                            })()}
                                        </div>
                                        <div className="text-right">
                                            {/* El total por ítem usa el precio efectivo. */}
                                            <p className="font-semibold text-lg">
                                                ${(() => {
                                                const applicableDiscount = item.volumeDiscounts
                                                    ?.sort((a, b) => b.minQuantity - a.minQuantity)
                                                    .find(d => item.quantity >= d.minQuantity);
                                                return ((applicableDiscount?.price || item.price) * item.quantity).toLocaleString('es-CO');
                                            })()}
                                            </p>
                                            <button
                                                className="mt-2 text-red-500 hover:text-red-700 text-sm inline-flex items-center gap-1"
                                                onClick={() => removeItem(item.variantId)}>
                                                <Trash className="h-4 w-4"/>
                                                <span>Eliminar</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-4 border-t mt-4">
                                    <button className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                                            onClick={() => setIsConfirmingClear(true)}>
                                        Vaciar Carrito
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Columna Derecha: Resumen del Pedido */}
                    {items.length > 0 && (
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-md border lg:sticky lg:top-28">
                                <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
                                <div className="flex justify-between mb-2">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toLocaleString('es-CO')}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 text-sm mb-4">
                                    <span>Envío</span>
                                    <span>Calculado en el siguiente paso</span>
                                </div>

                                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${subtotal.toLocaleString('es-CO')}</span>
                                </div>
                                <div className="mt-6 space-y-3">
                                    <button
                                        onClick={startCheckoutProcess}
                                        disabled={isProcessing}
                                        className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white background-lider hover:bg-liderplast-hover disabled:bg-gray-400">
                                        <CreditCard className="h-5 w-5 mr-2"/>
                                        {isProcessing ? 'Procesando Pedido...' : 'Proceder al Pago'}
                                    </button>
                                    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"
                                       className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700">
                                        <Whatsapp className="h-5 w-5 mr-2"/>
                                        Enviar por WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
            <ConfirmationModal
                isOpen={isConfirmingClear}
                onClose={() => setIsConfirmingClear(false)}
                onConfirm={handleConfirmClearCart}
                title="Confirmar Acción"
                message="¿Estás seguro de que deseas vaciar tu carrito? Todos los productos serán eliminados."
            />
            <AddressSelectionModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onAddressSelected={handleAddressSelected}
            />
        </>
    );
}
