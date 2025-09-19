import * as React from "react";
import {type JSX, useEffect, useState, useMemo} from 'react';
import type {Product, Attribute, Category, VolumeDiscount} from '../../types';
import {Button} from '../general/Button.tsx';
import {X, PlusCircle} from 'lucide-react';
import {VariantAccordionItem} from './VariantAccordionItem.tsx';
import {ImageUploader} from "../general/ImageUploader.tsx";

interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: ProductFormData) => void;
    productToEdit: Product | null;
    attributes: Attribute[];
    categories: Category[];
    isSubmitting: boolean;
}

export interface VariantFormData {
    id?: number;
    sku: string;
    price: number;
    stock: number;
    salePrice?: number | null;
    imageUrl: string | null;
    imageFile: File | null;
    unitOfMeasure: string | null;
    unitsPerItem: number | null;
    volumeDiscounts: VolumeDiscount[];
    selectedAttributes: Record<number, number>; // { attributeId: valueId }
}

export interface ProductFormData {
    name: string;
    description: string;
    categoryId: number;
    isFeatured: boolean;
    variants: VariantFormData[];
    image_url: string | null;
    imageFile: File | null;
}

const emptyVariant: VariantFormData = {
    sku: '',
    price: 0,
    stock: 0,
    selectedAttributes: {},
    imageUrl: null,
    imageFile: null,
    unitOfMeasure: '',
    unitsPerItem: 1,
    volumeDiscounts: [],
};

const initialState: ProductFormData = {
    name: '',
    description: '',
    categoryId: 0,
    isFeatured: false,
    variants: [emptyVariant],
    image_url: null,
    imageFile: null,
};

// Reutilizamos la misma lógica del formulario de categorías para una experiencia consistente.
const renderCategoryOptions = (categories: Category[], level = 0): JSX.Element[] => {
    let options: JSX.Element[] = [];
    for (const category of categories) {
        options.push(
            <option key={category.id} value={category.id}>
                {'— '.repeat(level)}{category.name}
            </option>
        );
        if (category.children) {
            options = options.concat(renderCategoryOptions(category.children, level + 1));
        }
    }
    return options;
};

export function ProductForm({
                                isOpen,
                                onClose,
                                onSave,
                                productToEdit,
                                attributes,
                                categories,
                                isSubmitting
                            }: ProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>(initialState);

    const unitOfMeasureAttribute = useMemo(
        () => attributes.find(attr => attr.name.toLowerCase() === 'unidad de medida'),
        [attributes]
    );

    useEffect(() => {
        if (isOpen) {
            if (productToEdit) {
                // Mapeamos los datos del producto a editar al formato del formulario.
                setFormData({
                    name: productToEdit.name,
                    description: productToEdit.description || '',
                    categoryId: productToEdit.category.id,
                    isFeatured: productToEdit.isFeatured,
                    image_url: productToEdit.image_url || null,
                    imageFile: null,
                    variants: productToEdit.variants.map(v => ({ // Para cada variante que viene de la API...
                        ...v, // ...copiamos todas sus propiedades (id, sku, price, imageUrl, etc.)
                        imageFile: null, // ✅ CORRECCIÓN 1: Añadimos la propiedad 'imageFile' que faltaba.
                        // ✅ CORRECCIÓN 2: La función `reduce` ahora solo se encarga de construir `selectedAttributes`.
                        // Se eliminó la sintaxis incorrecta que causaba el error TS2695.
                        selectedAttributes: (v.variantValues ?? []).reduce((acc: Record<number, number>, vv) => {
                            // La API nos da vv.attributeValue = { id, value, attributeId }
                            if (vv.attributeValue && vv.attributeValue.attributeId) {
                                acc[vv.attributeValue.attributeId] = vv.attributeValue.id;
                            }
                            return acc;
                        }, {}),
                    })),
                });
            } else {
                setFormData(initialState);
            }
        }
    }, [productToEdit, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target;
        const isCheckbox = type === 'checkbox';
        const finalValue = isCheckbox ? (e.target as HTMLInputElement).checked : (name === 'categoryId' ? Number(value) : value);
        setFormData(prev => ({...prev, [name]: finalValue}));
    };

    const handleFileChange = (file: File | null) => {
        // Combinamos las actualizaciones de estado en una sola llamada.
        setFormData(prev => ({
            ...prev,
            imageFile: file,
            image_url: file ? prev.image_url : null // Si no hay archivo, reseteamos la URL.
        }));
    };

    const handleVariantChange = (index: number, field: string, value: any) => {
        const newVariants = [...formData.variants];
        (newVariants[index] as Record<string, any>)[field] = value;
        // Si cambia la unidad de medida, regeneramos el SKU.
        if (field === 'unitOfMeasure') {
            regenerateSkuOnDraft(newVariants[index], newVariants, index);
        }

        setFormData(prev => ({...prev, variants: newVariants}));
    };

    const handleVariantFileChange = (index: number, file: File | null) => {
        const newVariants = [...formData.variants];
        newVariants[index].imageFile = file;
        setFormData(prev => ({...prev, variants: newVariants}));
    };

    // Función centralizada que SOLO calcula y actualiza el SKU en el borrador (draft).
    const regenerateSkuOnDraft = (variant: VariantFormData, allVariants: VariantFormData[], variantIndex: number) => {
        const productNameAbbr = formData.name.substring(0, 4).toUpperCase().replace(/\s/g, '');

        const attributeValueTexts = Object.values(variant.selectedAttributes).map(valueId => {
            for (const attr of attributes) {
                const val = attr.values.find(v => v.id === valueId);
                if (val) return val.value.substring(0, 3).toUpperCase().replace(/\s/g, '');
            }
            return '';
        }).filter(Boolean);

        // Añadimos la abreviatura de la unidad de medida al SKU.
        const unitOfMeasureText = variant.unitOfMeasure
            ? variant.unitOfMeasure.substring(0, 3).toUpperCase().replace(/\s/g, '')
            : '';

        const skuParts = [productNameAbbr, ...attributeValueTexts];
        if (unitOfMeasureText) {
            skuParts.push(unitOfMeasureText);
        }

        let suggestedSku = skuParts.join('-');

        // Lógica de unicidad para evitar SKUs duplicados en el mismo formulario.
        let counter = 2;
        const originalSku = suggestedSku;
        while (allVariants.some((v, i) => i !== variantIndex && v.sku === suggestedSku)) {
            suggestedSku = `${originalSku}-${counter}`;
            counter++;
        }

        if (!variant.sku || variant.sku.startsWith(productNameAbbr + '-')) {
            variant.sku = suggestedSku;
        }
    };


    const handleAttributeChange = (variantIndex: number, attributeId: number, valueId: string) => {
        const newVariants = [...formData.variants];
        const currentVariant = newVariants[variantIndex];
        const numericValueId = parseInt(valueId, 10);

        // Actualizamos el mapa de atributos seleccionados para esta variante
        currentVariant.selectedAttributes[attributeId] = numericValueId;

        // Llamamos a la función centralizada para regenerar el SKU.
        regenerateSkuOnDraft(currentVariant, newVariants, variantIndex);

        setFormData(prev => ({...prev, variants: newVariants}));
    };

    const addVolumeDiscount = (variantIndex: number) => {
        const newVariants = [...formData.variants];
        newVariants[variantIndex].volumeDiscounts.push({quantity: 0, price: 0});
        setFormData(prev => ({...prev, variants: newVariants}));
    };

    const removeVolumeDiscount = (variantIndex: number, discountIndex: number) => {
        const newVariants = [...formData.variants];
        newVariants[variantIndex].volumeDiscounts.splice(discountIndex, 1);
        setFormData(prev => ({...prev, variants: newVariants}));
    };

    const handleDiscountChange = (variantIndex: number, discountIndex: number, field: 'quantity' | 'price', value: number) => {
        const newVariants = [...formData.variants];
        newVariants[variantIndex].volumeDiscounts[discountIndex][field] = value;
        setFormData(prev => ({...prev, variants: newVariants}));
    };

    const addVariant = () => {
        const newVariantInstance = {
            ...emptyVariant,
            selectedAttributes: {},
            volumeDiscounts: [],
        };
        setFormData(prev => ({...prev, variants: [...prev.variants, newVariantInstance]}));
    };

    const removeVariant = (index: number) => {
        if (formData.variants.length <= 1) return; // No permitir eliminar la última variante
        const newVariants = formData.variants.filter((_, i) => i !== index);
        setFormData(prev => ({...prev, variants: newVariants}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // El componente padre se encargará de la lógica de subida de imágenes y construcción del payload final.
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-30 background-lider bg-opacity-50 z-50 flex flex-col text-black rounded-b-md border-purple-700 ">
            <div className="bg-white shadow-xl w-full h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-6 border-b">
                        <h3 className="text-lg font-medium text-gray-900">{productToEdit ? `Editando "${productToEdit.name}"` : 'Crear Nuevo Producto'}</h3>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="h-6 w-6"/>
                        </button>
                    </div>

                    {/* Contenido Principal con Scroll */}
                    <div className="flex-grow overflow-y-auto p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            <div className="md:col-span-1 flex flex-col items-center">
                                <ImageUploader onFileChange={handleFileChange} initialImageUrl={formData.image_url}
                                               isUploading={isSubmitting}/>
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <div>
                                    <label htmlFor="name"
                                           className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input type="text" name="name" id="name" value={formData.name}
                                           onChange={handleInputChange}
                                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required/>
                                </div>
                                <div>
                                    <label htmlFor="categoryId"
                                           className="block text-sm font-medium text-gray-700">Categoría</label>
                                    <select name="categoryId" id="categoryId" value={formData.categoryId}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                                        <option value={0} disabled>Seleccione...</option>
                                        {renderCategoryOptions(categories)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="description"
                                           className="block text-sm font-medium text-gray-700">Descripción</label>
                                    <textarea name="description" id="description" value={formData.description}
                                              onChange={handleInputChange} rows={3}
                                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                                </div>
                                <div className="flex items-center">
                                    <input id="isFeatured" name="isFeatured" type="checkbox"
                                           checked={formData.isFeatured} onChange={handleInputChange}
                                           className="h-4 w-4 text-liderplast-primary rounded border-gray-300"/>
                                    <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">Marcar como
                                        producto destacado</label>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h4 className="text-md font-medium text-gray-700 mb-4">Variantes</h4>
                            <div className="space-y-4">
                                {formData.variants.map((variant, index) => (
                                    <VariantAccordionItem
                                        key={variant.id || index}
                                        variant={variant}
                                        index={index}
                                        attributes={attributes}
                                        isSubmitting={isSubmitting}
                                        onVariantChange={handleVariantChange}
                                        onVariantFileChange={handleVariantFileChange}
                                        onAttributeChange={handleAttributeChange}
                                        onAddVolumeDiscount={addVolumeDiscount}
                                        onRemoveVolumeDiscount={removeVolumeDiscount}
                                        onDiscountChange={handleDiscountChange}
                                        onRemoveVariant={removeVariant}
                                        unitOfMeasureAttribute={unitOfMeasureAttribute}
                                        canBeRemoved={formData.variants.length > 1}
                                    />
                                ))}
                            </div>
                            <Button type="button" variant="secondary" size="sm" onClick={addVariant}
                                    className="mt-4"><PlusCircle className="h-4 w-4 mr-2"/>Añadir Variante</Button>
                        </div>
                    </div>

                    <div className="flex-shrink-0 flex justify-end gap-4 p-6 border-t bg-gray-50">
                        <Button type="button" variant="secondary" onClick={onClose}
                                disabled={isSubmitting}>Cancelar</Button>
                        <Button type="submit"
                                disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}