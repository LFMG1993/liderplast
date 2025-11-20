import type {Product} from '../../types';
import {FileImage, Cart} from 'react-bootstrap-icons';

interface Props {
    product: Product;
    onAdd: () => void;
    onViewDetails: () => void;
}

export default function ProductCard({product, onAdd, onViewDetails}: Props) {
    const displayVariant = product.variants?.[0];
    const displayPrice = displayVariant?.salePrice || displayVariant?.price;
    // Si el producto tiene más de una variante, el padre abrirá el modal.
    const hasMultipleVariants = product.variants && product.variants.length > 1;
    const addButtonText = hasMultipleVariants ? 'Ver Opciones' : 'Añadir';

    return (
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
            <div className="relative bg-[var(--color-muted)] aspect-square">
                {/* Renderiza la imagen desde la URL de la base de datos, con un fallback. */}
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-contain m-auto p-2"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <FileImage className="w-12 h-12 text-[var(--color-muted-foreground)]/50"/>
                    </div>
                )}
            </div>
            <div className="p-4 text-center flex flex-col flex-grow text-[var(--color-foreground)]">
                <h6 className="font-semibold h-12 line-clamp-2" title={product.name}>{product.name}</h6>
                <div className="text-lg font-medium my-2 h-8 flex items-center justify-center gap-2">
                    {displayVariant && displayVariant.salePrice ? (
                        <>
                            <span
                                className="text-[var(--color-foreground)]/60 line-through">${displayVariant.price.toLocaleString('es-CO')}</span>
                            <span
                                className="text-red-500 font-bold">${displayVariant.salePrice.toLocaleString('es-CO')}</span>
                        </>
                    ) : (
                        <span>${displayPrice?.toLocaleString('es-CO')}</span>
                    )}
                </div>
                {/* Mostramos el primer nivel de descuento por volumen si existe. */}
                <div className="h-6 text-xs text-green-600 dark:text-green-400 font-medium flex items-center justify-center">
                    {displayVariant?.volumeDiscounts && displayVariant.volumeDiscounts.length > 0 && (
                        <span>
                             Desde ${displayVariant.volumeDiscounts[0].price.toLocaleString('es-CO')}
                            (min. {displayVariant.volumeDiscounts[0].minQuantity} {displayVariant.unitOfMeasure || 'unid.'})
                         </span>
                    )}
                </div>
                <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
                    <button
                        className="bg-[var(--color-muted)] text-[var(--color-muted-foreground)] px-3 py-2 text-sm rounded-md transition-colors hover:bg-[var(--color-muted)]/80"
                        onClick={onViewDetails}
                    >
                        Detalles
                    </button>
                    <button
                        className="background-lider text-white flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md transition-colors hover:bg-liderplast-hover disabled:bg-gray-300 disabled:cursor-not-allowed"
                        onClick={onAdd}
                    >
                        {addButtonText}
                        <Cart className="w-4 h-4"/>
                    </button>
                </div>
            </div>
        </div>
    );
}