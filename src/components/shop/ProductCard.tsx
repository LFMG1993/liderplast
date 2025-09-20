import type {Product} from '../../types';
import {FileImage} from 'react-bootstrap-icons';

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
    const addButtonText = hasMultipleVariants ? 'Ver Opciones' : 'Añadir al Carrito';

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
            <div className="bg-gray-100 flex items-center justify-center aspect-square">
                {/* Renderiza la imagen desde la URL de la base de datos, con un fallback. */}
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <FileImage className="w-12 h-12 text-gray-400"/>
                    </div>
                )}
            </div>
            <div className="p-4 text-center flex flex-col flex-grow">
                <h6 className="font-semibold text-gray-800">{product.name}</h6>
                <div className="text-lg font-medium my-2 h-8 flex items-center justify-center gap-2">
                    {displayVariant && displayVariant.salePrice ? (
                        <>
                            <span
                                className="text-gray-400 line-through">${displayVariant.price.toLocaleString('es-CO')}</span>
                            <span
                                className="text-red-400 font-bold">${displayVariant.salePrice.toLocaleString('es-CO')}</span>
                        </>
                    ) : (
                        <span className="text-gray-600">${displayPrice?.toLocaleString('es-CO')}</span>
                    )}
                </div>
                {/* Mostramos el primer nivel de descuento por volumen si existe. */}
                <div className="h-6 text-xs text-green-700 font-medium flex items-center justify-center">
                    {displayVariant?.volumeDiscounts && displayVariant.volumeDiscounts.length > 0 && (
                        <span>
                             Desde ${displayVariant.volumeDiscounts[0].price.toLocaleString('es-CO')}
                            (min. {displayVariant.volumeDiscounts[0].minQuantity} {displayVariant.unitOfMeasure || 'unid.'})
                         </span>
                    )}
                </div>
                <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
                    <button
                        className="bg-gray-200 text-gray-800 px-3 py-2 text-sm rounded-md transition-colors hover:bg-gray-300"
                        onClick={onViewDetails}
                    >
                        Ver detalles
                    </button>
                    <button
                        className="background-lider text-white px-3 py-2 text-sm rounded-md transition-colors hover:bg-liderplast-hover disabled:bg-gray-300 disabled:cursor-not-allowed"
                        onClick={onAdd}
                    >
                        {addButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
}