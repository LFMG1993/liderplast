import * as React from 'react';
import {useEffect, useState} from 'react';
import type {Provider, ProviderCreationData} from '../../types';
import {Button} from '../general/Button.tsx';
import {X} from 'lucide-react';

interface ProviderFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ProviderCreationData) => void;
    providerToEdit: Provider | null;
    isSubmitting: boolean;
}

const initialState: ProviderCreationData = {
    name: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    website: '',
    notes: '',
};

export const ProviderForm = ({isOpen, onClose, onSave, providerToEdit, isSubmitting}: ProviderFormProps) => {
    const [formData, setFormData] = useState<ProviderCreationData>(initialState);

    useEffect(() => {
        if (isOpen) {
            if (providerToEdit) {
                setFormData({
                    name: providerToEdit.name,
                    contactName: providerToEdit.contactName || '',
                    contactEmail: providerToEdit.contactEmail || '',
                    contactPhone: providerToEdit.contactPhone || '',
                    address: providerToEdit.address || '',
                    website: providerToEdit.website || '',
                    notes: providerToEdit.notes || '',
                });
            } else {
                setFormData({...initialState});
            }
        }
    }, [isOpen, providerToEdit]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start pt-10 overflow-y-auto">
            <div className="bg-[var(--color-card)] text-[var(--color-foreground)] rounded-lg shadow-xl w-full max-w-2xl"
                 onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="flex justify-between items-center p-6 border-b border-[var(--color-border)]">
                        <h3 className="text-lg font-medium">{providerToEdit ? `Editando Proveedor` : 'Crear Nuevo Proveedor'}</h3>
                        <button type="button" onClick={onClose}
                                className="text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)]">
                            <X className="h-6 w-6"/>
                        </button>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Columna Izquierda */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name"
                                       className="block text-sm font-medium text-[var(--color-foreground)]/80">Nombre
                                    del
                                    Proveedor</label>
                                <input type="text" name="name" id="name" value={formData.name}
                                       onChange={handleInputChange}
                                       className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary"
                                       required/>
                            </div>
                            <div>
                                <label htmlFor="contactName"
                                       className="block text-sm font-medium text-[var(--color-foreground)]/80">Nombre
                                    de Contacto</label>
                                <input type="text" name="contactName" id="contactName"
                                       value={formData.contactName || ''} onChange={handleInputChange}
                                       className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary"/>
                            </div>
                            <div>
                                <label htmlFor="contactEmail"
                                       className="block text-sm font-medium text-[var(--color-foreground)]/80">Email
                                    de Contacto</label>
                                <input type="email" name="contactEmail" id="contactEmail"
                                       value={formData.contactEmail || ''} onChange={handleInputChange}
                                       className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary"/>
                            </div>
                            <div>
                                <label htmlFor="contactPhone"
                                       className="block text-sm font-medium text-[var(--color-foreground)]/80">Teléfono
                                    de Contacto</label>
                                <input type="tel" name="contactPhone" id="contactPhone"
                                       value={formData.contactPhone || ''} onChange={handleInputChange}
                                       className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary"/>
                            </div>
                        </div>

                        {/* Columna Derecha */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="address"
                                       className="block text-sm font-medium text-[var(--color-foreground)]/80">Dirección</label>
                                <input type="text" name="address" id="address" value={formData.address || ''}
                                       onChange={handleInputChange}
                                       className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary"/>
                            </div>
                            <div>
                                <label htmlFor="website"
                                       className="block text-sm font-medium text-[var(--color-foreground)]/80">Sitio
                                    Web</label>
                                <input type="url" name="website" id="website" value={formData.website || ''}
                                       onChange={handleInputChange}
                                       className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary"/>
                            </div>
                            <div>
                                <label htmlFor="notes"
                                       className="block text-sm font-medium text-[var(--color-foreground)]/80">Notas
                                    Adicionales</label>
                                <textarea name="notes" id="notes" value={formData.notes || ''}
                                          onChange={handleInputChange} rows={4}
                                          className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary"></textarea>
                            </div>
                        </div>
                    </div>

                    <div
                        className="flex justify-end gap-4 p-6 border-t border-[var(--color-border)] bg-[var(--color-card)] rounded-b-lg">
                        <Button type="button" variant="secondary" onClick={onClose}
                                disabled={isSubmitting}>Cancelar</Button>
                        <Button type="submit" variant="primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Guardar Proveedor'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};