import { createContext, useContext, useState, ReactNode } from "react";
import type { Product } from "../types.ts";

export  type CartItem = Product & { quantity: number };

type CartContextType = {
    items: CartItem[];
    addItem: (p: Product) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
    updateItemQuantity: (product: Product, quantity: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (product: Product) => {
        setItems((prev) => {
            const idx = prev.findIndex((i) => i.id === product.id);
            if (idx > -1) {
                const copy = [...prev];
                copy[idx].quantity += 1;
                return copy;
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeItem = (id: number) =>
        setItems((prev) => prev.filter((i) => i.id !== id));

    const clearCart = () => setItems([]);
    const updateItemQuantity = (product: Product, quantity: number) => {
        setItems((prev) => {
            const idx = prev.findIndex((i) => i.id === product.id);
            if (quantity <= 0) {
                // si ponen 0 o menos, elimina del carrito
                return prev.filter((i) => i.id !== product.id);
            }
            if (idx > -1) {
                const copy = [...prev];
                copy[idx].quantity = quantity;
                return copy;
            }
            // si no existía, lo añade con la cantidad indicada
            return [...prev, { ...product, quantity }];
        });
    };

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, updateItemQuantity }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be inside CartProvider");
    return ctx;
}
