// src/pages/CartPage.tsx
import {useCart} from "../hooks/CardContext.tsx";
import {ImagesProducts} from "../utils/images.ts";

export default function CartPage() {
    const {items, clearCart} = useCart();
    const phone = "573242940464";

    const whatsappLink = () => {
        const header = "🛒 *Mi Pedido*%0A%0A";
        // 2. Construye la lista numerada
        const lines = items.map(
            (it, idx) => `${idx + 1}. ${it.quantity}× ${it.title}`
        );
        // 3. Une las líneas con saltos de línea URL-encoded
        const body = lines.join("%0A");
        // 4. Ensambla el texto completo
        const text = header + body;
        // 5. Genera la URL
        return `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;
    };

    return (
        <div className="container py-5">
            <h2>Tu Carrito</h2>
            {items.length === 0 ? (
                <p className="text-muted">No hay productos.</p>
            ) : (
                <ul className="list-group mb-4">
                    {items.map((it) => (
                        <li key={it.id} className="list-group-item d-flex justify-content-between">
                            <div className="d-flex align-items-center">
                                <img
                                    src={ImagesProducts[it.image]}
                                    alt={it.title}
                                    className="img-thumbnail me-2"
                                    style={{
                                        width: 80,
                                        height: 80,
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                            <span>{it.title} × {it.quantity}</span>
                        </li>
                    ))}
                </ul>
            )}
            <div className="d-flex gap-2">
                <a href={whatsappLink()} target="_blank" className="btn btn-success">
                    Enviar pedido por WhatsApp
                </a>
                <button className="btn btn-outline-danger" onClick={clearCart}>
                    Vaciar Carrito
                </button>
            </div>
        </div>
    );
}
