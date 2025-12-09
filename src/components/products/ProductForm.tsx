import * as React from "react";
import {useMemo, useState, Fragment} from 'react';
import type {Product, Attribute, Category, VolumeDiscount} from '../../types';
import {Button} from '../general/Button.tsx';
import {X, PlusCircle, ChevronsUpDown, Check} from 'lucide-react';
import {Combobox, Transition} from '@headlessui/react';
import {VariantAccordionItem, type AttributeValue} from './VariantAccordionItem.tsx';
import {ImageUploader} from "../general/ImageUploader.tsx";
import {AttributeForm} from "../attributes/AttributeForm.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {attributeService} from "../../services/attributeService.ts";
import {useNotification} from "../../context/NotificationContext.tsx";

interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: ProductFormData) => void;
    productToEdit: Product | null;
    attributes: Attribute[];
    categories: Category[];
    isSubmitting: boolean;
    formData: ProductFormData;
    setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export interface VariantFormData {
    id?: number;
    sku: string;
    price: number | '';
    stock: number | '';
    salePrice?: number | null;
    isActive: boolean;
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
    isActive: boolean;
    variants: VariantFormData[];
    image_url: string | null;
    imageFile: File | null;
}

const createEmptyVariant = (): VariantFormData => ({
    sku: '',
    price: '',
    stock: '',
    selectedAttributes: {},
    imageUrl: null,
    isActive: true,
    imageFile: null,
    unitOfMeasure: '',
    unitsPerItem: 1,
    volumeDiscounts: [],
});

export const createInitialProductState = (): ProductFormData => ({
    name: '',
    description: '',
    categoryId: 0,
    isFeatured: false,
    variants: [createEmptyVariant()],
    isActive: true,
    image_url: null,
    imageFile: null,
});

export function ProductForm({
                                isOpen,
                                onClose,
                                onSave,
                                productToEdit,
                                attributes,
                                categories,
                                isSubmitting,
                                formData,
                                setFormData
                            }: ProductFormProps) {
    const queryClient = useQueryClient();
    const {addNotification} = useNotification();
    const [isAttributeValueModalOpen, setIsAttributeValueModalOpen] = useState(false);
    const [addingValueToAttribute, setAddingValueToAttribute] = useState<Attribute | null>(null);
    const [newAttributeValue, setNewAttributeValue] = useState('');
    const [categoryQuery, setCategoryQuery] = useState('');

    const unitOfMeasureAttribute = useMemo(
        () => attributes.find(attr => attr.name.toLowerCase() === 'unidad de medida'),
        [attributes]
    );

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

        const uniqueSuffix = !variant.id ? `-${Date.now().toString().slice(-5)}` : '';

        const skuParts = [productNameAbbr, ...attributeValueTexts];

        if (unitOfMeasureText) {
            skuParts.push(unitOfMeasureText);
        }

        let suggestedSku = skuParts.join('-');
        suggestedSku += uniqueSuffix;
        // Lógica de unicidad para evitar SKUs duplicados en el mismo formulario.
        let counter = 2;
        const originalSku = suggestedSku;
        while (allVariants.some((v, i) => i !== variantIndex && v.sku === suggestedSku)) {
            suggestedSku = `${originalSku}-${counter}`;
            counter++;
        }

        if (!variant.id) {
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
        newVariants[variantIndex].volumeDiscounts.push({minQuantity: 0, price: 0});
        setFormData(prev => ({...prev, variants: newVariants}));
    };

    const removeVolumeDiscount = (variantIndex: number, discountIndex: number) => {
        const newVariants = [...formData.variants];
        newVariants[variantIndex].volumeDiscounts.splice(discountIndex, 1);
        setFormData(prev => ({...prev, variants: newVariants}));
    };

    const handleDiscountChange = (variantIndex: number, discountIndex: number, field: 'minQuantity' | 'price', value: number) => {
        const newVariants = [...formData.variants];
        newVariants[variantIndex].volumeDiscounts[discountIndex][field] = value;
        setFormData(prev => ({...prev, variants: newVariants}));
    };

    const addVariant = () => {
        const newVariantInstance = createEmptyVariant();
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

    // --- Lógica para el modal de creación rápida de valores de atributo ---
    const openNewAttributeValueModal = (attribute: Attribute, variantIndex: number) => {
        setAddingValueToAttribute(attribute);
        setNewAttributeValue('');
        setIsAttributeValueModalOpen(true);
        (attribute as any)._variantIndex = variantIndex;
    };

    const saveAttributeValueMutation = useMutation({
        mutationFn: (data: {
            attributeId: number,
            value: string
        }) => attributeService.createAttributeValue(data) as Promise<AttributeValue>,
        onSuccess: (newAttributeValue) => {
            addNotification('Valor de atributo creado con éxito.', 'success');
            queryClient.invalidateQueries({queryKey: ['attributes']}); // Invalida para recargar los atributos
            setIsAttributeValueModalOpen(false);
            const variantIndex = (addingValueToAttribute as any)?._variantIndex;
            if (variantIndex !== undefined) {
                handleAttributeChange(variantIndex, newAttributeValue.attributeId, String(newAttributeValue.id));
            }
        },
        onError: (err: Error) => addNotification(`Error: ${err.message}`, 'error'),
    });

    const handleSaveAttributeValue = (e: React.FormEvent) => {
        e.preventDefault();
        if (!addingValueToAttribute) return;
        saveAttributeValueMutation.mutate({attributeId: addingValueToAttribute.id, value: newAttributeValue});
    };

    // --- Lógica para el Combobox de Categorías ---
    const flattenedCategories = useMemo(() => {
        const flatten = (cats: Category[], level = 0): { id: number, name: string, level: number }[] => {
            let result: { id: number, name: string, level: number }[] = [];
            for (const category of cats) {
                result.push({id: category.id, name: category.name, level});
                if (category.children) {
                    result = result.concat(flatten(category.children, level + 1));
                }
            }
            return result;
        };
        return flatten(categories);
    }, [categories]);

    const filteredCategories = categoryQuery === ''
        ? flattenedCategories
        : flattenedCategories.filter(cat =>
            cat.name.toLowerCase().includes(categoryQuery.toLowerCase())
        );

    const selectedCategory = useMemo(() =>
        flattenedCategories.find(c => c.id === formData.categoryId), [formData.categoryId, flattenedCategories]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
            <div
                className="bg-[var(--color-card)] text-[var(--color-foreground)] rounded-lg shadow-xl w-full h-full max-w-6xl flex flex-col"
                onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-6 border-b border-[var(--color-border)]">
                        <h3 className="text-lg font-medium">{productToEdit ? `Editando "${productToEdit.name}"` : 'Crear Nuevo Producto'}</h3>
                        <button type="button" onClick={onClose}
                                className="text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)]">
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
                                           className="block text-sm font-medium text-[var(--color-foreground)]/80">Nombre</label>
                                    <input type="text" name="name" id="name" value={formData.name}
                                           onChange={handleInputChange}
                                           className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm"
                                           required/>
                                </div>
                                <div>
                                    <label htmlFor="categoryId"
                                           className="block text-sm font-medium text-[var(--color-foreground)]/80">Categoría</label>
                                    {/* Combobox buscable para categorías */}
                                    <Combobox value={selectedCategory || null}
                                              onChange={(category) => category && handleInputChange({
                                                  target: {
                                                      name: 'categoryId',
                                                      value: String(category.id),
                                                      type: 'select'
                                                  }
                                              } as any)}>
                                        <div className="relative mt-1">
                                            <Combobox.Input
                                                className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-muted)] py-2 pl-3 pr-10 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                                onChange={(event) => setCategoryQuery(event.target.value)}
                                                displayValue={(category: {
                                                    name: string
                                                } | null) => category?.name || ''}
                                                placeholder="Busca una categoría..."
                                            />
                                            <Combobox.Button
                                                className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronsUpDown className="h-5 w-5 text-[var(--color-foreground)]/60"
                                                                aria-hidden="true"/>
                                            </Combobox.Button>
                                            <Transition as={Fragment} leave="transition ease-in duration-100"
                                                        leaveFrom="opacity-100" leaveTo="opacity-0">
                                                <Combobox.Options
                                                    className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-[var(--color-card)] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    {filteredCategories.map((cat) => (
                                                        <Combobox.Option key={cat.id} value={cat}
                                                                         className={({active}) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-primary/80 text-primary-foreground' : ''}`}>
                                                            {({selected}) => (
                                                                <>
                                                                     <span style={{paddingLeft: `${cat.level * 1}rem`}}
                                                                           className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{cat.name}</span>
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
                                </div>
                                <div>
                                    <label htmlFor="description"
                                           className="block text-sm font-medium text-[var(--color-foreground)]/80">Descripción</label>
                                    <textarea name="description" id="description" value={formData.description}
                                              onChange={handleInputChange} rows={3}
                                              className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm"></textarea>
                                </div>
                                <div className="space-y-4">
                                    <div className="relative flex items-start">
                                        <div className="flex h-6 items-center">
                                            <input id="isFeatured" name="isFeatured" type="checkbox"
                                                   checked={formData.isFeatured} onChange={handleInputChange}
                                                   className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="isFeatured" className="font-medium">Marcar como destacado</label>
                                            <p className="text-[var(--color-foreground)]/60">El producto aparecerá en la página principal.</p>
                                        </div>
                                    </div>
                                    <div className="relative flex items-start">
                                        <div className="flex h-6 items-center">
                                            <input id="isActive" name="isActive" type="checkbox"
                                                   checked={formData.isActive} onChange={handleInputChange}
                                                   className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="isActive" className="font-medium">Producto Activo</label>
                                            <p className="text-[var(--color-foreground)]/60">Si se desactiva, no será visible para los clientes.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h4 className="text-md font-medium mb-4">Variantes</h4>
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
                                        onAddNewAttributeValue={openNewAttributeValueModal}
                                        unitOfMeasureAttribute={unitOfMeasureAttribute}
                                        canBeRemoved={formData.variants.length > 1}
                                    />
                                ))}
                            </div>
                            <Button type="button" variant="secondary" size="sm" onClick={addVariant}
                                    className="mt-4"><PlusCircle className="h-4 w-4 mr-2"/>Añadir Variante</Button>
                        </div>
                    </div>

                    <div className="flex-shrink-0 flex justify-end gap-4 p-6 border-t border-[var(--color-border)]">
                        <Button type="button" variant="secondary" onClick={onClose}
                                disabled={isSubmitting}>Cancelar</Button>
                        <Button type="submit"
                                disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</Button>
                    </div>
                </form>
                {/* Modal para creación rápida de valores de atributo */}
                <AttributeForm
                    title={`Añadir valor a "${addingValueToAttribute?.name}"`}
                    isOpen={isAttributeValueModalOpen}
                    onClose={() => setIsAttributeValueModalOpen(false)}
                    onSubmit={handleSaveAttributeValue}
                    isSubmitting={saveAttributeValueMutation.isPending}
                >
                    <label htmlFor="newValueName"
                           className="block text-sm font-medium text-[var(--color-foreground)]/80">Nuevo Valor</label>
                    <input type="text" id="newValueName" value={newAttributeValue}
                           onChange={(e) => setNewAttributeValue(e.target.value)}
                           className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] shadow-sm p-2.5"
                           required/>
                </AttributeForm>
            </div>
        </div>
    );
}