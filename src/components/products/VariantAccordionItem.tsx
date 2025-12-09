import {Fragment, useState} from 'react';
import type {VariantFormData} from './ProductForm';
import type {Attribute} from "../../types";
import {ImageUploader} from '../general/ImageUploader';
import {Button} from '../general/Button';
import {ChevronDown, Plus, Trash2, ChevronsUpDown, Check} from 'lucide-react';
import {Combobox, Transition} from "@headlessui/react";
import {FormattedNumberInput} from '../general/FormattedNumberInput.tsx';

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
    onDiscountChange: (variantIndex: number, discountIndex: number, field: 'minQuantity' | 'price', value: number) => void;
    onRemoveVariant: (variantIndex: number) => void;
    onAddNewAttributeValue: (attribute: Attribute, variantIndex: number) => void;
    canBeRemoved: boolean;
    unitOfMeasureAttribute: Attribute | undefined;
}

export const VariantAccordionItem = (props: VariantAccordionItemProps) => {
    const {
        variant,
        index,
        attributes,
        isSubmitting,
        onVariantChange,
        onVariantFileChange,
        onAttributeChange,
        onAddVolumeDiscount,
        onRemoveVolumeDiscount,
        onDiscountChange,
        onRemoveVariant,
        canBeRemoved,
        onAddNewAttributeValue,
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
        <div className="border border-[var(--color-border)] rounded-md bg-[var(--color-card)]">
            <div className="w-full flex justify-between items-center p-4">
                {/* La parte principal del encabezado ahora es el botón que abre/cierra. */}
                <button type="button" onClick={() => setIsOpen(!isOpen)}
                        className="flex-grow flex items-center text-left">
                    <div className="flex-grow">
                        <p className="font-medium text-[var(--color-foreground)]">{variant.sku || `Variante #${index + 1}`}</p>
                        <p className="text-sm text-[var(--color-foreground)]/60">{summary || 'Sin atributos'}</p>
                    </div>
                    <ChevronDown
                        className={`h-5 w-5 text-[var(--color-foreground)]/60 transition-transform ${isOpen ? 'rotate-180' : ''} ml-4`}/>
                </button>

                {/* El botón de eliminar ahora es un hermano, no un hijo. */}
                <div className="flex items-center">
                    {canBeRemoved && (
                        <button
                            type="button"
                            onClick={() => onRemoveVariant(index)}>
                            {/* Usamos un Button genérico para consistencia */}
                            <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10">
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                        </button>
                    )}
                </div>
            </div>

            {/* Contenido del Acordeón */}
            {isOpen && (
                <div className="p-4 border-t border-[var(--color-border)] space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor={`sku-${index}`}
                                   className="block text-xs font-medium text-[var(--color-foreground)]/80 mb-1">Codigo</label>
                            <input id={`sku-${index}`} type="text" placeholder="Auto-generado" value={variant.sku}
                                   className="w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm cursor-not-allowed"
                                   readOnly/>
                        </div>
                        <div>
                            <label htmlFor={`price-${index}`}
                                   className="block text-xs font-medium text-[var(--color-foreground)]/80 mb-1">Precio
                                Detal</label>
                            <FormattedNumberInput id={`price-${index}`} placeholder="0" value={variant.price}
                                                  onChange={(value) => onVariantChange(index, 'price', value)}
                                                  className="w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm"
                                                  required/>
                        </div>
                        <div>
                            <label htmlFor={`salePrice-${index}`}
                                   className="block text-xs font-medium text-[var(--color-foreground)]/80 mb-1">Precio
                                de Oferta</label>
                            <FormattedNumberInput id={`salePrice-${index}`} placeholder="Opcional"
                                                  value={variant.salePrice}
                                                  onChange={(value) => onVariantChange(index, 'salePrice', value)}
                                                  className="w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor={`stock-${index}`}
                                   className="block text-xs font-medium text-[var(--color-foreground)]/80 mb-1">Cantidad
                                Disponible</label>
                            <FormattedNumberInput id={`stock-${index}`} placeholder="0" value={variant.stock}
                                                  onChange={(value) => onVariantChange(index, 'stock', value)}
                                                  className="w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm"
                                                  required/>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-[var(--color-foreground)]/80 mb-1">Imagen
                                de la
                                Variante</label>
                            <ImageUploader onFileChange={(file) => onVariantFileChange(index, file)}
                                           initialImageUrl={variant.imageUrl} isUploading={isSubmitting}/>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-[var(--color-foreground)]/80">Unidad de
                                    Medida</label>
                                {unitOfMeasureAttribute ? (
                                    <select
                                        value={variant.unitOfMeasure || ''}
                                        onChange={(e) => onVariantChange(index, 'unitOfMeasure', e.target.value)}
                                        className="mt-1 w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm"
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
                                <label className="block text-xs font-medium text-[var(--color-foreground)]/80">Unidades
                                    por Ítem</label>
                                <input type="number" placeholder="Ej: 1000" value={variant.unitsPerItem || ''}
                                       onChange={(e) => onVariantChange(index, 'unitsPerItem', e.target.value === '' ? null : parseInt(e.target.value, 10))}
                                       className="mt-1 w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm"/>
                            </div>
                            <div className="relative flex items-start pt-6">
                                <div className="flex h-6 items-center">
                                    <input
                                        id={`variant-isActive-${index}`}
                                        type="checkbox"
                                        checked={variant.isActive}
                                        onChange={(e) => onVariantChange(index, 'isActive', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor={`variant-isActive-${index}`} className="font-medium text-[var(--color-foreground)]">Variante Activa</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm font-medium text-[var(--color-foreground)]/80 pt-2">Atributos de esta
                        Variante:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {attributes.filter(attr => attr.name.toLowerCase() !== 'unidad de medida')
                            .map(attr => (
                                <div key={attr.id}>
                                    <label
                                        className="block text-xs font-medium text-[var(--color-foreground)]/80 mb-1">{attr.name}</label>
                                    <div className="flex items-center gap-2">
                                        {/*  Combobox buscable para atributos */}
                                        <SearchableSelect
                                            items={attr.values}
                                            selectedValue={variant.selectedAttributes[attr.id]}
                                            onChange={(valueId) => onAttributeChange(index, attr.id, String(valueId))}
                                        /><Button type="button" variant="ghost" size="icon"
                                                  onClick={() => onAddNewAttributeValue(attr, index)}
                                                  title={`Añadir nuevo valor a ${attr.name}`}>
                                        <Plus className="h-4 w-4"/>
                                    </Button>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div>
                        <p className="text-sm font-medium text-[var(--color-foreground)]/80 pt-2">Descuentos por
                            Volumen:</p>
                        <div className="space-y-2 mt-2">
                            {variant.volumeDiscounts.map((discount, dIndex) => (
                                <div key={discount.id || dIndex} className="flex items-center gap-2">
                                    <FormattedNumberInput placeholder="Cantidad Mín." value={discount.minQuantity}
                                                          onChange={(value) => onDiscountChange(index, dIndex, 'minQuantity', value)}
                                                          className="w-full p-2 border border-[var(--color-border)] bg-[var(--color-muted)] rounded-md"/>
                                    <FormattedNumberInput placeholder="Precio" value={discount.price}
                                                          onChange={(value) => onDiscountChange(index, dIndex, 'price', value)}
                                                          className="w-full p-2 border border-[var(--color-border)] bg-[var(--color-muted)] rounded-md"/>
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

// --- Componente interno para el Combobox buscable ---

interface SearchableSelectProps {
    items: { id: number, value: string }[];
    selectedValue: number | undefined;
    onChange: (value: number) => void;
}

const SearchableSelect = ({items, selectedValue, onChange}: SearchableSelectProps) => {
    const [query, setQuery] = useState('');
    const selectedItem = items.find(item => item.id === selectedValue);

    const filteredItems = query === ''
        ? items
        : items.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));

    return (
        <Combobox value={selectedItem || null} onChange={(item) => item && onChange(item.id)} nullable>
            <div className="relative w-full">
                <Combobox.Input
                    className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-muted)] py-2 pl-3 pr-10 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(item: { id: number, value: string } | null) => item?.value || ''}
                    placeholder="Seleccionar..."
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronsUpDown className="h-5 w-5 text-[var(--color-foreground)]/60" aria-hidden="true"/>
                </Combobox.Button>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100"
                            leaveTo="opacity-0">
                    <Combobox.Options
                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-[var(--color-card)] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {filteredItems.map((item) => (
                            <Combobox.Option key={item.id} value={item}
                                             className={({active}) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-primary/80 text-primary-foreground' : ''}`}>
                                {({selected}) => (
                                    <>
                                        <span
                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{item.value}</span>
                                        {selected && <span
                                            className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary"><Check
                                            className="h-5 w-5" aria-hidden="true"/></span>}
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    );
};

// Exportamos los tipos para que el nuevo componente pueda usarlos
export interface AttributeValue {
    id: number;
    value: string;
    attributeId: number;
}