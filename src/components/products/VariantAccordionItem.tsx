import {useState} from 'react';
import type {VariantFormData} from './ProductForm';
import type {Attribute} from "../../types";
import {ImageUploader} from '../general/ImageUploader';
import {Button} from '../general/Button';
import {ChevronDown, Trash2} from 'lucide-react';

interface VariantAccordionItemProps {
    variant: VariantFormData;
    index: number;
    attributes: Attribute[];
    isSubmitting: boolean;
    onVariantChange: (index: number, field: string, value: any) => void;
    onVariantFileChange: (index: number, file: File | null) => void;
    onAttributeChange: (variantIndex: number, attributeId: number, valueId: string) => void;
    onAddVolumeDiscount: (variantIndex: number) => void;
    onRemoveVolumeDiscount: (variantIndex: number, discountIndex: number) => void;
    onDiscountChange: (variantIndex: number, discountIndex: number, field: 'quantity' | 'price', value: number) => void;
    onRemoveVariant: (index: number) => void;
    canBeRemoved: boolean;
    unitOfMeasureAttribute: Attribute | undefined;
}

export const VariantAccordionItem = (props: VariantAccordionItemProps) => {
    const {
        variant, index, attributes, isSubmitting, onVariantChange,
        onVariantFileChange, onAttributeChange, onAddVolumeDiscount,
        onRemoveVolumeDiscount, onDiscountChange, onRemoveVariant, canBeRemoved,
        unitOfMeasureAttribute
    } = props;

    const [isOpen, setIsOpen] = useState(false);

    const summary = Object.values(variant.selectedAttributes)
        .map(valueId => {
            for (const attr of attributes) {
                const val = attr.values.find(v => v.id === valueId);
                if (val) return val.value;
            }
            return '';
        })
        .filter(Boolean)
        .join(' / ');

    return (
        <div className="border rounded-md bg-gray-50">
            {/* ✅ CORRECCIÓN: Se reemplaza el <button> contenedor por un <div> para evitar anidamiento ilegal. */}
            <div className="w-full flex justify-between items-center p-4">
                {/* La parte principal del encabezado ahora es el botón que abre/cierra. */}
                <button type="button" onClick={() => setIsOpen(!isOpen)}
                        className="flex-grow flex items-center text-left">
                    <div className="flex-grow">
                        <p className="font-medium text-gray-800">{variant.sku || `Variante #${index + 1}`}</p>
                        <p className="text-sm text-gray-500">{summary || 'Sin atributos'}</p>
                    </div>
                    <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''} ml-4`}/>
                </button>

                {/* El botón de eliminar ahora es un hermano, no un hijo. */}
                <div className="flex items-center">
                    {canBeRemoved && (
                        <button
                            type="button"
                            onClick={() => onRemoveVariant(index)}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-full mr-2"
                        >
                            <Trash2 className="h-4 w-4"/>
                        </button>
                    )}
                </div>
            </div>

            {/* Contenido del Acordeón */}
            {isOpen && (
                <div className="p-4 border-t space-y-4 text-black">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-black">
                        <input type="text" placeholder="SKU (auto-generado)" value={variant.sku}
                               onChange={(e) => onVariantChange(index, 'sku', e.target.value)}
                               className="w-full rounded-md border-gray-300 shadow-sm text-black cursor-not-allowed"
                               readOnly/>
                        <input type="number" placeholder="Precio" value={variant.price}
                               onChange={(e) => onVariantChange(index, 'price', parseFloat(e.target.value))}
                               className="w-full rounded-md border-gray-300 shadow-sm" step="any" required/>
                        <input type="number" placeholder="Precio de Oferta" value={variant.salePrice ?? ''}
                               onChange={(e) => onVariantChange(index, 'salePrice', e.target.value === '' ? null : parseFloat(e.target.value))}
                               className="w-full rounded-md border-gray-300 shadow-sm" step="any"/>
                        <input type="number" placeholder="Stock" value={variant.stock}
                               onChange={(e) => onVariantChange(index, 'stock', parseInt(e.target.value, 10))}
                               className="w-full rounded-md border-gray-300 shadow-sm" required/>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Imagen de la
                                Variante</label>
                            <ImageUploader onFileChange={(file) => onVariantFileChange(index, file)}
                                           initialImageUrl={variant.imageUrl} isUploading={isSubmitting}/>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600">Unidad de Medida</label>
                                {unitOfMeasureAttribute ? (
                                    <select
                                        value={variant.unitOfMeasure || ''}
                                        onChange={(e) => onVariantChange(index, 'unitOfMeasure', e.target.value)}
                                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {unitOfMeasureAttribute.values.map(val => (
                                            <option key={val.id} value={val.value}>{val.value}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input type="text" placeholder="Ej: Caja, Millar"
                                           value={variant.unitOfMeasure || ''}
                                           onChange={(e) => onVariantChange(index, 'unitOfMeasure', e.target.value)}
                                           className="mt-1 w-full rounded-md border-gray-300 shadow-sm"/>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600">Unidades por Ítem</label>
                                <input type="number" placeholder="Ej: 1000" value={variant.unitsPerItem || ''}
                                       onChange={(e) => onVariantChange(index, 'unitsPerItem', e.target.value === '' ? null : parseInt(e.target.value, 10))}
                                       className="mt-1 w-full rounded-md border-gray-300 shadow-sm"/>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm font-medium text-gray-600 pt-2">Atributos de esta Variante:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                        {attributes.filter(attr => attr.name.toLowerCase() !== 'unidad de medida')
                            .map(attr => (
                            <div key={attr.id}>
                                <label className="block text-xs font-medium text-gray-600">{attr.name}</label>
                                <select value={variant.selectedAttributes[attr.id] || ''}
                                        onChange={(e) => onAttributeChange(index, attr.id, e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <option value="">Seleccionar...</option>
                                    {attr.values.map(val => <option key={val.id} value={val.id}>{val.value}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-600 pt-2">Descuentos por Volumen:</p>
                        <div className="space-y-2 mt-2">
                            {variant.volumeDiscounts.map((discount, dIndex) => (
                                <div key={discount.id || dIndex} className="flex items-center gap-2">
                                    <input type="number" placeholder="Cantidad Mín." value={discount.quantity}
                                           onChange={(e) => onDiscountChange(index, dIndex, 'quantity', parseInt(e.target.value))}
                                           className="w-full p-2 border rounded-md text-black"/>
                                    <input type="number" placeholder="Precio" value={discount.price}
                                           onChange={(e) => onDiscountChange(index, dIndex, 'price', parseFloat(e.target.value))}
                                           className="w-full p-2 border rounded-md" step="any"/>
                                    <button type="button" onClick={() => onRemoveVolumeDiscount(index, dIndex)}>
                                        <Trash2 className="h-4 w-4 text-red-500"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="outline" size="sm" className="mt-2"
                                onClick={() => onAddVolumeDiscount(index)}>
                            Añadir Descuento
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Exportamos los tipos para que el nuevo componente pueda usarlos
export type {VariantFormData, Attribute};