// src/components/EditCartItemModal.tsx
import {useState, useEffect} from "react";
import type {Product} from "../types.ts";
import {ImagesProducts} from "../utils/images.ts";

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
        // Contenedor principal del modal que ocupa toda la pantalla
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            aria-modal="true"
            role="dialog"
        >
            {/* Panel del Modal */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
                {/* ANTES: modal-header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    {/* ANTES: modal-title */}
                    <h5 className="text-xl font-semibold text-gray-800">{item.title}</h5>
                    {/* ANTES: btn-close */}
                    <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600"
                        onClick={onClose}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                {/* ANTES: modal-body */}
                <div className="p-6">
                    <img
                        src={ImagesProducts[item.image]}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <p className="font-bold text-lg">{item.name}</p>
                    {item.description && <p className="text-gray-600 mb-4">{item.description}</p>}

                    <label htmlFor="editQty" className="block text-sm font-medium text-gray-700 mb-1">
                        Cantidad
                    </label>
                    {/* ANTES: form-control */}
                    <input
                        type="number"
                        id="editQty"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-liderplast-primary focus:border-liderplast-primary"
                        min={1}
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                    />
                </div>
                {/* ANTES: modal-footer */}
                <div className="flex justify-end items-center p-4 border-t border-gray-200 space-x-2">
                    {/* ANTES: btn btn-secondary */}
                    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            onClick={onClose}>
                        Cancelar
                    </button>
                    {/* ANTES: btn btn-primary */}
                    <button
                        className="px-4 py-2 bg-liderplast-primary text-white rounded-md hover:bg-liderplast-hover"
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
    );
}
