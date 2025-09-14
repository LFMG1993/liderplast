import * as React from "react";
import {type JSX, useEffect, useState} from 'react';
import type {Product, ProductCreationData, Attribute, Category} from '../../types';
import {Button} from '../general/Button';
import {X, PlusCircle, Trash2} from 'lucide-react';
import {ImageUploader} from "../general/ImageUploader";

interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ProductCreationData, imageFile: File | null) => void;
    productToEdit: Product | null;
    attributes: Attribute[];
    categories: Category[];
    isSubmitting: boolean;
}

interface VariantFormData {
    id?: number;
    sku: string;
    price: number;
    stock: number;
    salePrice?: number;
    selectedAttributes: Record<number, number>; // { attributeId: valueId }
}

interface ProductFormData {
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
    selectedAttributes: {}
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
                    variants: productToEdit.variants.map(v => ({
                        id: v.id,
                        sku: v.sku,
                        price: v.price,
                        stock: v.stock,
                        salePrice: v.salePrice || undefined,
                        // TODO: La API `getProductById` necesita devolver los `variantValues` para poblar esto.
                        selectedAttributes: {},
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
        setFormData(prev => ({...prev, imageFile: file}));
        if (!file) {
            setFormData(prev => ({...prev, image_url: null}));
        }
    };


    const handleVariantChange = (index: number, field: string, value: any) => {
        const newVariants = [...formData.variants];
        (newVariants[index] as Record<string, any>)[field] = value;
        setFormData(prev => ({...prev, variants: newVariants}));
    };

    const handleAttributeChange = (variantIndex: number, attributeId: number, valueId: string) => {
        const newVariants = [...formData.variants];
        const currentVariant = newVariants[variantIndex];
        const numericValueId = parseInt(valueId, 10);

        // Actualizamos el mapa de atributos seleccionados para esta variante
        currentVariant.selectedAttributes[attributeId] = numericValueId;

        // Se genera una sugerencia de SKU basada en los atributos seleccionados.
        const productNameAbbr = formData.name.substring(0, 4).toUpperCase().replace(/\s/g, '');
        const selectedValueTexts = Object.keys(currentVariant.selectedAttributes).map(attrId => {
            const attr = attributes.find(a => a.id === parseInt(attrId));
            const val = attr?.values.find(v => v.id === currentVariant.selectedAttributes[parseInt(attrId)]);
            return val ? val.value.substring(0, 3).toUpperCase().replace(/\s/g, '') : '';
        }).filter(Boolean);

        const suggestedSku = [productNameAbbr, ...selectedValueTexts].join('-');

        // Solo actualizamos el SKU si está vacío o si parece autogenerado previamente
        if (!currentVariant.sku || currentVariant.sku.startsWith(productNameAbbr + '-')) {
            currentVariant.sku = suggestedSku;
        }
        setFormData(prev => ({...prev, variants: newVariants}));
    };

    const addVariant = () => {
        setFormData(prev => ({...prev, variants: [...prev.variants, emptyVariant]}));
    };

    const removeVariant = (index: number) => {
        if (formData.variants.length <= 1) return; // No permitir eliminar la última variante
        const newVariants = formData.variants.filter((_, i) => i !== index);
        setFormData(prev => ({...prev, variants: newVariants}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Extraemos las propiedades de la imagen para no enviarlas en el payload inicial.
        const {imageFile, image_url, ...data} = formData;
        const dataToSave: ProductCreationData = {
            ...data,
            image_url: image_url,
            variants: data.variants.map(v => ({
                id: v.id,
                sku: v.sku,
                price: v.price,
                stock: v.stock,
                salePrice: v.salePrice,
                attributeValueIds: Object.values(v.selectedAttributes).filter(id => !isNaN(id)), // Obtenemos los IDs y filtramos selecciones vacías
            })),
        };
        onSave(dataToSave, imageFile);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b">
                        <h3 className="text-lg font-medium text-gray-900">{productToEdit ? `Editando "${productToEdit.name}"` : 'Crear Nuevo Producto'}</h3>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="h-6 w-6"/>
                        </button>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* --- Columna Izquierda: Imagen --- */}
                        <div className="md:col-span-1 flex flex-col items-center">
                            <ImageUploader
                                onFileChange={handleFileChange}
                                initialImageUrl={formData.image_url}
                                isUploading={isSubmitting}
                            />
                        </div>
                        {/* --- Columna Derecha: Campos de Datos --- */}
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input type="text" name="name" id="name" value={formData.name}
                                       onChange={handleInputChange}
                                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700 p-2.5"
                                       required/>
                            </div>
                            <div>
                                <label htmlFor="categoryId"
                                       className="block text-sm font-medium text-gray-700">Categoría</label>
                                <select name="categoryId" id="categoryId" value={formData.categoryId}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700 p-2.5 focus:border-liderplast-primary focus:ring-liderplast-primary"
                                        required>
                                    <option value={0} disabled>Seleccione...</option>
                                    {renderCategoryOptions(categories)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="description"
                                       className="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea name="description" id="description" value={formData.description}
                                          onChange={handleInputChange} rows={3}
                                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700 p-2.5 focus:border-liderplast-primary focus:ring-liderplast-primary"></textarea>
                            </div>
                            <div className="flex items-center">
                                <input id="isFeatured" name="isFeatured" type="checkbox" checked={formData.isFeatured}
                                       onChange={handleInputChange}
                                       className="h-4 w-4 text-liderplast-primary rounded border-gray-300 focus:ring-liderplast-primary"/>
                                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">Marcar como
                                    producto destacado</label>
                            </div>
                        </div>

                    </div>
                    {/* Sección de Variantes */}
                    <div className="p-6 space-y-4 border-t">
                        <h4 className="text-md font-medium text-gray-700">Variantes</h4>
                        {formData.variants.map((variant, index) => (
                            <div key={index} className="p-4 border rounded-md relative bg-gray-50 space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input type="text" placeholder="SKU (auto-generado)" value={variant.sku}
                                           onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                                           className="w-full rounded-md border-gray-300 shadow-sm text-gray-700 p-2.5 focus:border-liderplast-primary focus:ring-liderplast-primary"
                                           required/>
                                    <input type="number" placeholder="Precio" value={variant.price}
                                           onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value))}
                                           className="w-full rounded-md border-gray-300 shadow-sm text-gray-700 p-2.5 focus:border-liderplast-primary focus:ring-liderplast-primary"
                                           required/>
                                    <input type="number" placeholder="Stock" value={variant.stock}
                                           onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value, 10))}
                                           className="w-full rounded-md border-gray-300 shadow-sm text-gray-700 p-2.5 focus:border-liderplast-primary focus:ring-liderplast-primary"
                                           required/>
                                </div>
                                <p className="text-sm font-medium text-gray-600 pt-2">Atributos de esta Variante:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {attributes.map(attr => (
                                        <div key={attr.id}>
                                            <label
                                                className="block text-xs font-medium text-gray-600">{attr.name}</label>
                                            <select
                                                value={variant.selectedAttributes[attr.id] || ''}
                                                onChange={(e) => handleAttributeChange(index, attr.id, e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700 p-2.5"
                                            >
                                                <option value="">Seleccionar...</option>
                                                {attr.values.map(val => <option key={val.id}
                                                                                value={val.id}>{val.value}</option>)}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                                {formData.variants.length > 1 && (
                                    <button type="button" onClick={() => removeVariant(index)}
                                            className="absolute -top-2 -right-2 bg-white rounded-full p-0.5">
                                        <Trash2 className="h-4 w-4 text-red-500"/>
                                    </button>
                                )}
                            </div>
                        ))}
                        <Button type="button" variant="secondary" size="sm" onClick={addVariant}><PlusCircle
                            className="h-4 w-4 mr-2"/>Añadir Variante</Button>
                    </div>

                    <div className="flex justify-end gap-4 p-6 border-t bg-gray-50 rounded-b-lg">
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