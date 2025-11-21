import {
    type LucideIcon,
    Home,
    Users,
    Package,
    Truck,
    Warehouse,
    Archive,
    Cylinder,
    Wallet,
    Folders,
    Send,
    Lightbulb
} from 'lucide-react';

export interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

export const dockItems: NavItem[] = [
    {name: 'Inicio', href: 'dashboard', icon: Home},
    {name: 'Usuarios', href: 'users', icon: Users},
    {name: 'Emprende', href: 'emprende', icon: Lightbulb},
    {name: 'Categorías', href: 'categories', icon: Archive},
    {name: 'Atributos', href: 'attributes', icon: Cylinder},
    {name: 'Productos', href: 'products', icon: Package},
    {name: 'Proveedores', href: 'providers', icon: Truck},
    {name: 'Inventario', href: 'inventory', icon: Warehouse},
    {name: 'Pagos', href: 'payment-methods', icon: Wallet},
    {name: 'Pedidos', href: 'orders', icon: Folders},
    {name: 'Envios', href: 'shipments', icon: Send},
];