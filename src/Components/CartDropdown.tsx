import {Link} from "react-router-dom";
import {useCart} from "../hooks/CardContext.tsx";
import {ImagesProducts} from "../utils/images.ts";

export default function CartDropdown() {
    const {items, removeItem,} = useCart();
    const count = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <li className="list-inline-item dropdown">
            <a
                className="dropdown-toggle btn-no-link"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i className="bi bi-cart-check me-2"></i> Carrito ({count})
            </a>
            <ul className="dropdown-menu dropdown-menu-end p-2" style={{minWidth: 300}}>
                {items.length === 0 ? (
                    <li className="dropdown-item text-center text-muted">Carrito vacío</li>
                ) : (
                    items.map((it) => (
                        <li key={it.id} className="dropdown-item d-flex justify-content-between">
                            <div className="d-flex align-items-center">
                                {/* 1. Miniatura */}
                                <img
                                    src={ImagesProducts[it.image]}
                                    alt={it.title}
                                    className="img-thumbnail me-2"
                                    style={{
                                        width: 40,
                                        height: 40,
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                            <span>{it.title}×{it.quantity}</span>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(it.id)}>×
                            </button>
                        </li>
                    ))
                )}
                {items.length > 0 && (
                    <>
                        <li>
                            <hr className="dropdown-divider"/>
                        </li>
                        <li className="dropdown-item text-center">
                            <Link to="/cart" className="btn btn-primary w-100">Ver Carrito</Link>
                        </li>
                    </>
                )}
            </ul>
        </li>
    );
}
