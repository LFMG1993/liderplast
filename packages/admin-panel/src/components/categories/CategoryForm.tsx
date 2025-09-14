import * as React from "react";
import {type JSX, useEffect, useState} from 'react';
import type {Category, CategoryCreationData, CategoryUpdateData} from "../../types";
import {Button} from '../general/Button';
import {X} from 'lucide-react';
import {ImageUploader} from "../general/ImageUploader";

interface CategoryFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CategoryCreationData | CategoryUpdateData, imageFile: File | null) => void;
    categoryToEdit: Category | null;
    allCategories: Category[]; // Necesitamos todas las categorías para el selector de padre
    isSubmitting: boolean;
}

interface CategoryFormData {
    id: number | null;
    name: string;
    description: string;
    parentId: string | null;
    imageUrl: string | null;
    imageFile: File | null;
}

const initialState: CategoryFormData = {
    id: null,
    name: '',
    description: '',
    parentId: null,
    imageUrl: null,
    imageFile: null
};

// Muestra la jerarquía visualmente para que el usuario entienda dónde está colocando la nueva categoría.
const renderCategoryOptions = (categories: Category[], level = 0, categoryToEditId: number | null) => {
    let options: JSX.Element[] = [];
    for (const category of categories) {
        // Una categoría no puede ser su propio padre.
        if (category.id === categoryToEditId) continue;

        options.push(
            <option key={category.id} value={category.id}>
                {'— '.repeat(level)}{category.name}
            </option>
        );
        if (category.children) {
            options = options.concat(renderCategoryOptions(category.children, level + 1, categoryToEditId));
        }
    }
    return options;
};

// Esta función puede encontrar una categoría por su ID en cualquier nivel de la jerarquía,
const findCategoryById = (categories: Category[], id: number): Category | undefined => {
    for (const category of categories) {
        if (category.id === id) {
            return category;
        }
        if (category.children) {
            const found = findCategoryById(category.children, id);
            if (found) return found;
        }
    }
    return undefined;
};

export function CategoryForm({
                                 isOpen,
                                 onClose,
                                 onSave,
                                 categoryToEdit,
                                 allCategories,
                                 isSubmitting
                             }: CategoryFormProps) {
    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (isOpen) {
            if (categoryToEdit) {
                setFormData({
                    id: categoryToEdit.id,
                    name: categoryToEdit.name,
                    description: categoryToEdit.description || '',
                    parentId: categoryToEdit.parentId ? String(categoryToEdit.parentId) : null,
                    imageUrl: categoryToEdit.imageUrl || null,
                    imageFile: null,
                });
            } else {
                setFormData(initialState);
            }
        }
    }, [categoryToEdit, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value === '' ? null : value}));
    };

    const handleFileChange = (file: File | null) => {
        setFormData(prev => ({...prev, imageFile: file}));
        // Si se elimina el archivo, también eliminamos la URL existente.
        if (!file) {
            setFormData(prev => ({...prev, imageUrl: null}));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const {imageFile, ...dataToSave} = formData;
        const finalData = {
            ...dataToSave,
            parentId: formData.parentId ? Number(formData.parentId) : null,
        };
        onSave(finalData, imageFile);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-6 border-b">
                        <h3 className="text-lg font-medium text-gray-900">
                            {categoryToEdit ? `Editando "${categoryToEdit.name}"` : 'Crear Nueva Categoría'}
                        </h3>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="h-8 w-8"/>
                        </button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
                        {/* --- Columna Izquierda: Imagen --- */}
                        <div className="flex flex-col items-center">
                            <ImageUploader
                                onFileChange={handleFileChange}
                                initialImageUrl={formData.imageUrl}
                                isUploading={isSubmitting}
                            />
                        </div>
                        {/* --- Columna Derecha: Campos de Datos --- */}
                        <div className="space-y-8">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre de
                                    la Categoría</label>
                                <input type="text" name="name" id="name" value={formData.name}
                                       onChange={handleInputChange}
                                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary text-gray-700 p-2.5"
                                       required/>
                            </div>
                            <div>
                                <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">Ubicación
                                    en la Jerarquía</label>
                                {categoryToEdit?.parentId && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Actualmente es una subcategoría
                                        de: <strong>{findCategoryById(allCategories, categoryToEdit.parentId)?.name || 'Categoría no encontrada'}</strong>
                                    </p>
                                )}
                                <select name="parentId" id="parentId" value={formData.parentId || ''}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary p-2.5 text-gray-700">
                                    <option value="">Ninguna (Será una Categoría Principal)</option>
                                    {renderCategoryOptions(allCategories, 0, categoryToEdit?.id || null)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="description"
                                       className="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea name="description" id="description" value={formData.description || ''}
                                          onChange={handleInputChange} rows={4}
                                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary text-gray-700"></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 p-6 border-t bg-gray-50">
                        <Button type="button" variant="secondary" onClick={onClose}
                                disabled={isSubmitting}>Cancelar</Button>
                        <Button type="submit"
                                disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}