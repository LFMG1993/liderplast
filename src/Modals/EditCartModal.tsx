// src/components/EditCartItemModal.tsx
import { useState, useEffect } from "react";
import type { Product } from "../types.ts";
import { ImagesProducts } from "../utils/images";

type Props = {
    show: boolean;
    item: Product & { quantity: number } | null;
    onClose: () => void;
    onSave: (product: Product, quantity: number) => void;
};

export default function EditCartItemModal({
                                              show,
                                              item,
                                              onClose,
                                              onSave,
                                          }: Props) {
    const [qty, setQty] = useState(1);

    // Cada vez que cambie el item, resetea el qty
    useEffect(() => {
        if (item) setQty(item.quantity);
    }, [item]);

    if (!show || !item) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="modal-backdrop fade show"></div>

            {/* Modal */}
            <div
                className="modal fade show d-block"
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{item.title}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                            ></button>
                        </div>
                        <div className="modal-body">
                            {/* Imagen */}
                            <img
                                src={ImagesProducts[item.image]}
                                alt={item.name}
                                className="img-fluid mb-3"
                            />
                            {/* Nombre y descripción */}
                            <p><strong>{item.name}</strong></p>
                            {item.description && <p className="text-muted">{item.description}</p>}

                            {/* Selector de cantidad */}
                            <label htmlFor="editQty" className="form-label">
                                Cantidad
                            </label>
                            <input
                                type="number"
                                id="editQty"
                                className="form-control"
                                min={1}
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                            />
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={onClose}>
                                Cancelar
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    onSave(item, qty);
                                    onClose();
                                }}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
