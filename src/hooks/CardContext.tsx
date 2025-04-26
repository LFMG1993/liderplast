import { createContext, useContext, useState, ReactNode } from "react";
import type { Product } from "../types.ts";

type CartItem = Product & { quantity: number };

type CartContextType = {
    items: CartItem[];
    addItem: (p: Product) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
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

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be inside CartProvider");
    return ctx;
}
