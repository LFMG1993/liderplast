import type {Product, ProductVariant} from "./product.types.ts";

export type PaymentStatus =
    'pending_payment'
    | 'pending_confirmation'
    | 'paid'
    | 'refunded'
    | 'cancelled'

export type ShippingStatus =
    'unfulfilled'
    | 'processing'
    | 'shipped'
    | 'delivered';

export type ShippingMethod = 'local_delivery' | 'national_shipping';

export interface PaymentMethod {
    id: number;
    name: string;
    qrCodeUrl: string | null;
    instructions?: string | null;
    isActive: boolean;
}

export interface Shipment {
    id: number;
    orderId: number;
    shippingMethod: ShippingMethod;
    company?: string | null;
    trackingNumber?: string | null;
    trackingUrl?: string | null;
    driverName?: string | null;
    licensePlate?: string | null;
    createdAt: string;
}


export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    // Relaciones que vienen del backend
    product: Product;
    variant: ProductVariant | null;
}

export interface Order {
    id: number;
    userId: number;
    paymentStatus: PaymentStatus;
    shippingStatus: ShippingStatus;
    total: number;
    paymentMethodId?: number | null;
    paymentConfirmationUrl?: string | null;
    createdAt: string; // O Date, si se transforma
    updatedAt?: string | null; // O Date
    // Relaciones que vienen del backend
    user: { id: number; nombre: string; email: string; }; // Asumiendo la estructura del usuario en el pedido
    items: OrderItem[];
    paymentMethod?: PaymentMethod | null;
    shipment?: Shipment | null;
}

export type PaymentMethodCreationData = Omit<PaymentMethod, 'id'>;
export type PaymentMethodUpdateData = Partial<PaymentMethodCreationData>;
export type ShipmentCreationData = Omit<Shipment, 'id' | 'orderId' | 'createdAt'>;

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
    pending_payment: "Pendiente de pago",
    pending_confirmation: "Pendiente de confirmación",
    paid: "Pagado",
    refunded: "Reembolsado",
    cancelled: "Cancelado"
};

export const ShippingStatusLabels: Record<ShippingStatus, string> = {
    unfulfilled: "Por preparar",
    processing: "Procesando",
    shipped: "Enviado",
    delivered: "Entregado"
};

export const PaymentStatusColors: Record<PaymentStatus, string> = {
    pending_payment: "text-yellow-600 bg-yellow-100",
    pending_confirmation: "text-blue-600 bg-blue-100",
    paid: "text-green-700 bg-green-100",
    refunded: "text-gray-600 bg-gray-100",
    cancelled: "text-red-700 bg-red-100"
};

export const ShippingStatusColors: Record<ShippingStatus, string> = {
    unfulfilled: "text-gray-600 bg-gray-100",
    processing: "text-indigo-600 bg-indigo-100",
    shipped: "text-cyan-700 bg-cyan-100",
    delivered: "text-green-700 bg-green-100"
}