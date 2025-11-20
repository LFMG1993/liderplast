import {Dialog, Transition} from '@headlessui/react';
import {Fragment, useState, useEffect, useMemo} from 'react';
import type {Product} from '../../types';
import {X} from 'lucide-react';
import {FileImage, Plus, Dash} from 'react-bootstrap-icons';
import {useCart} from '../../context/CardContext';

interface ProductDetailModalProps {
    product: Product | null;
    onClose: () => void;
}

export const ProductDetailModal = ({product, onClose}: ProductDetailModalProps) => {
    const {addItem} = useCart();
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState(1);

    // Agrupamos los atributos y sus valores disponibles para renderizar los swatches.
    const attributeOptions = useMemo(() => {
        if (!product) return {};
        const options: Record<string, Set<string>> = {};
        product.variants.forEach(variant => {
            variant.variantValues.forEach(vv => {
                const attrName = vv.attributeValue.attribute.name;
                if (!options[attrName]) {
                    options[attrName] = new Set();
                }
                options[attrName].add(vv.attributeValue.value);
            });
            if (variant.unitOfMeasure) {
                if (!options['Unidad de Medida']) {
                    options['Unidad de Medida'] = new Set();
                }
                options['Unidad de Medida'].add(variant.unitOfMeasure);
            }
        });
        return options;
    }, [product]);

    useEffect(() => {
        // Pre-selecciona automáticamente los atributos que tienen una sola opción.
        if (!product) return;

        const initialSelection: Record<string, string> = {};
        Object.entries(attributeOptions).forEach(([attributeName, values]) => {
            if (values.size === 1) {
                initialSelection[attributeName] = Array.from(values)[0];
            }
        });

        setSelectedOptions(initialSelection);
        setQuantity(1);

    }, [product, attributeOptions]);

    // Buscamos la variante que coincide con la selección actual del usuario.
    const selectedVariant = useMemo(() => {
        if (!product || Object.keys(selectedOptions).length < Object.keys(attributeOptions).length) return null;

        return product.variants.find(variant =>
            Object.entries(selectedOptions).every(([attrName, value]) => {
                    if (attrName === 'Unidad de Medida') {
                        return variant.unitOfMeasure === value;
                    }
                    return variant.variantValues.some(vv =>
                        vv.attributeValue.attribute.name === attrName && vv.attributeValue.value === value,
                    );
                }
            )
        );
    }, [product, selectedOptions, attributeOptions]);

    if (!product) return null;

    const displayImage = selectedVariant?.imageUrl || product.imageUrl;

    const handleOptionClick = (attributeName: string, value: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [attributeName]: value,
        }));
    };

    const handleAddToCart = () => {
        if (selectedVariant) {
            // Esto garantiza que siempre se pase un `number`, ya que `selectedVariant` ya ha sido validado.
            addItem(product, quantity, selectedVariant.id);
            onClose();
        }
    };

    return (
        <Transition appear show={!!product} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50"/>
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-[var(--color-card)] text-[var(--color-foreground)] p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3"
                                              className="text-2xl font-bold leading-6 flex justify-between items-center">
                                    {product.name}
                                    <button onClick={onClose}
                                            className="p-1 rounded-full hover:bg-[var(--color-muted)]">
                                        <X className="h-6 w-6 text-[var(--color-foreground)]/80"/>
                                    </button>
                                </Dialog.Title>

                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Columna de Imagen */}
                                    <div
                                        className="w-full aspect-square bg-[var(--color-muted)] border border-[var(--color-border)] rounded-lg flex items-center justify-center">
                                        {displayImage ? (
                                            <img src={displayImage} alt={product.name}
                                                 className="w-full h-full object-cover rounded-lg"/>
                                        ) : (
                                            <FileImage className="w-16 h-16 text-[var(--color-muted-foreground)]/60"/>
                                        )}
                                    </div>

                                    {/* Columna de Detalles */}
                                    <div className="flex flex-col">
                                        <p className="text-gray-600 mb-4">{product.description}</p>

                                        {/* Renderizamos los swatches de atributos. */}
                                        <div className="space-y-4">
                                            {Object.entries(attributeOptions).map(([attributeName, values]) => (
                                                <div key={attributeName}>
                                                    <h4 className="font-semibold mb-2">{attributeName}</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {Array.from(values).map(value => (
                                                            <button
                                                                key={value}
                                                                onClick={() => handleOptionClick(attributeName, value)}
                                                                className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                                                                    selectedOptions[attributeName] === value
                                                                        ? 'bg-primary text-primary-foreground border-primary'
                                                                        : 'bg-[var(--color-muted)] border-[var(--color-border)] hover:bg-[var(--color-border)]'
                                                                }`}
                                                            >
                                                                {value}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Precio dinámico */}
                                        <div className="mt-6 text-2xl font-bold">
                                            {selectedVariant ? (
                                                <span>${(selectedVariant.salePrice || selectedVariant.price).toLocaleString('es-CO')}</span>
                                            ) : (
                                                <span className="text-[var(--color-foreground)]/60">Selecciona una opción</span>
                                            )}
                                        </div>
                                        {/* Sección de añadir al carrito, solo visible si se ha seleccionado una variante. */}
                                        {selectedVariant && (
                                            <div className="mt-6 border-t border-[var(--color-border)] pt-4">
                                                <div className="flex items-center gap-4">
                                                    <label htmlFor="quantity"
                                                           className="font-semibold">Cantidad:</label>
                                                    {/*  Controles de cantidad en línea. */}
                                                    <div className="flex items-center">
                                                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                                className="p-2 border border-[var(--color-border)] rounded-md hover:bg-[var(--color-muted)]">
                                                            <Dash className="h-5 w-5"/>
                                                        </button>
                                                        <span className="px-4 font-medium text-lg">{quantity}</span>
                                                        <button onClick={() => setQuantity(q => q + 1)}
                                                                className="p-2 border border-[var(--color-border)] rounded-md hover:bg-[var(--color-muted)]">
                                                            <Plus className="h-5 w-5"/>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    {selectedVariant.volumeDiscounts?.map(d => (
                                                        <p key={d.id}
                                                           className="text-xs text-green-600 dark:text-green-400">
                                                            Lleva {d.minQuantity} o más a
                                                            ${d.price.toLocaleString('es-CO')} c/u
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>

                                <div className="mt-6 flex justify-between items-center">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-[var(--color-muted)] px-4 py-2 text-sm font-medium text-[var(--color-muted-foreground)] hover:bg-[var(--color-border)] focus:outline-none"
                                        onClick={onClose}
                                    >
                                        Cerrar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        disabled={!selectedVariant}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-[#4a3084] px-6 py-2 text-base font-medium text-white shadow-sm hover:bg-[#3b266a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Añadir al Carrito
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
