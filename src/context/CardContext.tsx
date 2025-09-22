import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product, VolumeDiscount } from '../types';

// El tipo CartItem refleja la estructura real de los datos.
export interface CartItem {
    productId: number;
    variantId: number;
    name: string;
    variantDescription: string;
    unitOfMeasure: string | null;
    volumeDiscounts: VolumeDiscount[];
    price: number;
    image_url: string | null;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, quantity?: number, variantId?: number) => void;
    removeItem: (variantId: number) => void;
    updateQuantity: (variantId: number, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    // Usamos una función para que esta lógica se ejecute solo una vez, al montar el componente.
    const [items, setItems] = useState<CartItem[]>(() => {
        try {
            const localData = localStorage.getItem('liderplast-cart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Error al cargar el carrito desde localStorage", error);
            return [];
        }
    });

    // Efecto sincroniza el estado del carrito con localStorage cada vez que cambia.
    useEffect(() => {
        localStorage.setItem('liderplast-cart', JSON.stringify(items));
    }, [items]);

    const addItem = (product: Product, quantity: number = 1, variantId?: number) => {
        // Si se proporciona un variantId, lo buscamos. Si no, usamos la primera como fallback.
        const variantToAdd = variantId
            ? product.variants.find(v => v.id === variantId)
            : product.variants?.[0];

        if (!variantToAdd) {
            console.error("El producto no tiene variantes para añadir al carrito.");
            return;
        }

        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.variantId === variantToAdd.id);

            if (existingItem) {
                return prevItems.map(item =>
                    item.variantId === variantToAdd.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            // Construimos la descripción de la variante a partir de sus atributos.
            const variantDescription = variantToAdd.variantValues
                ?.map(vv => vv.attributeValue.value)
                .join(' / ') || '';

            const newItem: CartItem = {
                productId: product.id,
                variantId: variantToAdd.id,
                name: product.name,
                variantDescription,
                unitOfMeasure: variantToAdd.unitOfMeasure,
                volumeDiscounts: variantToAdd.volumeDiscounts || [],
                price: variantToAdd.salePrice || variantToAdd.price,
                image_url: variantToAdd.imageUrl || product.imageUrl,
                quantity,
            };
            return [...prevItems, newItem];
        });
    };

    const removeItem = (variantId: number) => {
        setItems(prevItems => prevItems.filter(item => item.variantId !== variantId));
    };

    const updateQuantity = (variantId: number, quantity: number) => {
        // Si la cantidad es 0 o menos, eliminamos el ítem.
        if (quantity <= 0) {
            removeItem(variantId);
        } else {
            setItems(prevItems => prevItems.map(item =>
                item.variantId === variantId ? { ...item, quantity } : item
            ));
        }
    };

    const clearCart = () => {
        setItems([]);
    };

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};