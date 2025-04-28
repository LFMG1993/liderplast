// src/pages/CartPage.tsx
import { useState } from "react";
import { useCart, CartItem } from "../hooks/CardContext.tsx";
import { ImagesProducts } from "../utils/images";
import EditCartItemModal from "../Modals/EditCartModal.tsx";

export default function CartPage() {
    const { items, removeItem, clearCart, updateItemQuantity } = useCart();
    const [editingItem, setEditingItem] = useState<CartItem | null>(null);
    const phone = "573242940464";

    // Genera el link de WhatsApp como antes…
    const whatsappLink = () => {
        const header = "🛒 *Mi Pedido*%0A%0A";
        const lines = items.map((it, idx) => `${idx + 1}. ${it.quantity}× ${it.title}`);
        const body = lines.join("%0A");
        return `https://api.whatsapp.com/send?phone=${phone}&text=${header + body}`;
    };

    return (
        <div className="container py-5">
            <h2>Tu Carrito</h2>

            {items.length === 0 ? (
                <p className="text-muted">No hay productos.</p>
            ) : (
                <ul className="list-group mb-4">
                    {items.map((it) => (
                        <li
                            key={it.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <div className="d-flex align-items-center">
                                {/* Miniatura */}
                                <img
                                    src={ImagesProducts[it.image]}
                                    alt={it.title}
                                    className="img-thumbnail me-2"
                                    style={{ width: 80, height: 80, objectFit: "cover" }}
                                />
                                {/* Título y cantidad */}
                                <span>{it.title} × {it.quantity}</span>
                            </div>

                            <div className="btn-group btn-group-sm">
                                {/* 1. Botón de editar: abre el modal */}
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setEditingItem(it)}
                                >
                                    <i className="bi bi-pencil"></i>
                                </button>
                                {/* 2. Botón de eliminar */}
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={() => removeItem(it.id)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Modal para editar cantidad / ver detalles */}
            <EditCartItemModal
                show={!!editingItem}
                item={editingItem}
                onClose={() => setEditingItem(null)}
                onSave={(product, newQty) => {
                    updateItemQuantity(product, newQty);
                    setEditingItem(null);
                }}
            />

            {/* Acciones finales */}
            {items.length > 0 && (
                <div className="d-flex gap-2">
                    <a href={whatsappLink()} target="_blank" className="btn btn-success">
                        Enviar pedido por WhatsApp
                    </a>
                    <button className="btn btn-outline-danger" onClick={clearCart}>
                        Vaciar Carrito
                    </button>
                </div>
            )}
        </div>
    );
}
