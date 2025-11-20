import {useState, useEffect} from "react";
import type {CartItem} from "../../context/CardContext.tsx";
import {FileImage} from 'react-bootstrap-icons';

type Props = {
    show: boolean;
    item: CartItem | null;
    onClose: () => void;
    onSave: (variantId: number, quantity: number) => void;
};

export default function EditCartItemModal({
                                              show,
                                              item,
                                              onClose,
                                              onSave,
                                          }: Props) {
    const [quantity, setQuantity] = useState(1);

    // Cada vez que cambie el item, resetea el qty
    useEffect(() => {
        if (item) {
            setQuantity(item.quantity);
        }
    }, [item]);

    if (!show || !item) return null;
    const handleSave = () => {
        onSave(item.variantId, quantity);
        onClose();
    };

    return (
        // Contenedor principal del modal que ocupa toda la pantalla
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            aria-modal="true"
            role="dialog"
        >
            {/* Panel del Modal */}
            <div
                className="bg-[var(--color-card)] text-[var(--color-foreground)] rounded-lg shadow-xl w-full max-w-md m-4">
                <div className="flex justify-between items-center p-4 border-b border-[var(--color-border)]">
                    <h5 className="text-xl font-semibold">{item.name}</h5>
                    <button
                        type="button"
                        className="text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)]"
                        onClick={onClose}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="p-6">
                    <div
                        className="w-full h-48 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-md mb-4 flex items-center justify-center">
                        {item.image_url ? (
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FileImage className="w-12 h-12 text-[var(--color-muted-foreground)]/60"/>
                        )}
                    </div>
                    <p className="font-bold text-lg">{item.name}</p>

                    <label htmlFor="editQty"
                           className="block text-sm font-medium text-[var(--color-foreground)]/80 mb-1">
                        Cantidad
                    </label>
                    <input
                        type="number"
                        id="editQty"
                        className="w-full border border-[var(--color-border)] bg-[var(--color-muted)] rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                </div>
                <div className="flex justify-end items-center p-4 border-t border-[var(--color-border)] space-x-2">
                    <button
                        className="px-4 py-2 bg-[var(--color-muted)] text-[var(--color-muted-foreground)] rounded-md hover:bg-[var(--color-muted)]/80"
                        onClick={onClose}>
                        Cancelar
                    </button>
                    <button
                        className="px-4 py-2 background-lider text-white rounded-md hover:bg-liderplast-hover"
                        onClick={handleSave}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
