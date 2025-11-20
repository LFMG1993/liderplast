import * as React from 'react';
import {useEffect, useState} from 'react';
import type {PaymentMethod, PaymentMethodCreationData, PaymentMethodUpdateData} from '../../types';
import {Button} from '../general/Button.tsx';
import {X} from 'lucide-react';
import {ImageUploader} from "../general/ImageUploader.tsx";

interface PaymentFormData {
    id: number | null;
    name: string;
    qrCodeUrl: string | null;
    instructions: string | null;
    isActive: boolean;
    imageFile: File | null;
};

const initialState: PaymentFormData = {
    id: null,
    name: '',
    qrCodeUrl: null,
    instructions: null,
    isActive: true,
    imageFile: null,
};

interface PaymentMethodFormProps {
    isOpen: boolean;
    onClose: () => void;
    methodToEdit: PaymentMethod | null;
    onSave: (data: PaymentMethodCreationData | PaymentMethodUpdateData, imageFile: File | null) => void;
    isSubmitting: boolean;
}

export function PaymentMethodForm({isOpen, onClose, methodToEdit, onSave, isSubmitting}: PaymentMethodFormProps) {
    const isEditing = !!methodToEdit;

    const [formData, setFormData] = useState<PaymentFormData>(initialState);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            if (methodToEdit) {
                setFormData({
                    id: methodToEdit.id,
                    name: methodToEdit.name,
                    qrCodeUrl: methodToEdit.qrCodeUrl || null,
                    instructions: methodToEdit.instructions || '',
                    isActive: methodToEdit.isActive,
                    imageFile: null,
                });
            } else {
                setFormData(initialState);
            }
            setErrors({}); // Limpiar errores al abrir
        }
    }, [isOpen, methodToEdit]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value, type} = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (file: File | null) => {
        setFormData(prev => ({...prev, imageFile: file, qrCodeUrl: file ? prev.qrCodeUrl : null}));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name || formData.name.length < 3) {
            newErrors.name = 'El nombre es requerido (mín. 3 caracteres).';
        }
        // La imagen es obligatoria.
        if (!methodToEdit && !formData.imageFile) {
            newErrors.image = 'La imagen del código QR es obligatoria para un nuevo método.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const {imageFile, ...dataToSave} = formData;
            const finalData = {
                ...dataToSave,
                instructions: dataToSave.instructions || null
            };
            onSave(finalData, imageFile);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10"
             onClick={onClose}>
            <div className="bg-[var(--color-card)] text-[var(--color-foreground)] rounded-lg shadow-xl w-full max-w-3xl"
                 onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b border-[var(--color-border)]">
                        <h3
                            className="text-lg font-medium">{isEditing ? `Editando "${methodToEdit.name}"` : 'Nuevo Método de Pago'}</h3>
                        <button type="button" onClick={onClose}
                                className="text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)]">
                            <X className="h-8 w-8"/>
                        </button>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Columna Izquierda: Imagen */}
                        <div className="flex flex-col items-center">
                            <ImageUploader
                                onFileChange={handleFileChange}
                                initialImageUrl={formData.qrCodeUrl}
                                isUploading={isSubmitting}
                            />
                            {errors.image && <p className="mt-2 text-sm text-red-600 text-center">{errors.image}</p>}
                        </div>

                        {/* Columna Derecha: Campos */}
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name"
                                       className="block text-sm font-medium text-[var(--color-foreground)]/80">Nombre</label>
                                <input type="text" id="name" name="name" value={formData.name}
                                       onChange={handleInputChange}
                                       className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary p-2.5"/>
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="instructions"
                                       className="block text-sm font-medium text-[var(--color-foreground)]/80">Instrucciones
                                    (Opcional)</label>
                                <textarea id="instructions" name="instructions" value={formData.instructions || ''}
                                          onChange={handleInputChange} rows={4}
                                          className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary p-2.5"/>
                            </div>
                            <div className="flex items-center pt-2">
                                <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive}
                                       onChange={handleInputChange}
                                       className="h-4 w-4 text-primary border-[var(--color-border)] bg-[var(--color-muted)] rounded focus:ring-primary"/>
                                <label htmlFor="isActive" className="ml-2 block text-sm">Activo</label>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 p-6 border-t border-[var(--color-border)]">
                        <Button type="button" variant="secondary" onClick={onClose}
                                disabled={isSubmitting}>Cancelar</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}