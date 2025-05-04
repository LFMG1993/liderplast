import {Link} from "react-router-dom";
import {useCart} from "../hooks/CardContext.tsx";
import {ImagesProducts} from "../utils/images.ts";

export default function CartDropdown() {
    const {items, removeItem,} = useCart();
    const count = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <li className="list-inline-item dropdown">
            <button
                className="dropdown-toggle btn-no-link p-0 position-relative"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label={"Carrito de compras"}
            >
                <i className="bi bi-cart-check fs-4"></i> {count > 0 && (
                <span
                    className="badge bg-danger text-white rounded-circle position-absolute"
                    style={{
                        top: "-7px",
                        right: "-5px",
                        minWidth: "20px",
                        height: "20px",
                        lineHeight: "13px",
                        fontSize: "0.65rem",
                    }}
                >
            {count}
          </span>
            )}
            </button>
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
                                    className="img-thumbnail me-5"
                                    style={{
                                        width: 40,
                                        height: 40,
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                            <span>{it.title}×{it.quantity}</span>
                            <button className="btn btn-outline-danger ms-2" onClick={() => removeItem(it.id)}>
                                <i className="bi bi-trash"></i>
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
