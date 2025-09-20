import {
    type LucideIcon,
    Home,
    Users,
    Package,
    Truck,
    Warehouse,
    Archive,
    Cylinder
} from 'lucide-react';

export interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

export const dockItems: NavItem[] = [
    {name: 'Inicio', href: 'dashboard', icon: Home},
    {name: 'Usuarios', href: 'users', icon: Users},
    {name: 'Categorías', href: 'categories', icon: Archive},
    {name: 'Atributos', href: 'attributes', icon: Cylinder},
    {name: 'Productos', href: 'products', icon: Package},
    {name: 'Proveedores', href: 'providers', icon: Truck},
    {name: 'Inventario', href: 'inventory', icon: Warehouse},
];