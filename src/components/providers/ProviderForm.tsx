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
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="flex justify-between items-center p-6 border-b">
                        <h3 className="text-lg font-medium text-gray-900">{providerToEdit ? `Editando Proveedor` : 'Crear Nuevo Proveedor'}</h3>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="h-6 w-6"/>
                        </button>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
                        {/* Columna Izquierda */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del
                                    Proveedor</label>
                                <input type="text" name="name" id="name" value={formData.name}
                                       onChange={handleInputChange}
                                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required/>
                            </div>
                            <div>
                                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">Nombre
                                    de Contacto</label>
                                <input type="text" name="contactName" id="contactName"
                                       value={formData.contactName || ''} onChange={handleInputChange}
                                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
                            </div>
                            <div>
                                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Email
                                    de Contacto</label>
                                <input type="email" name="contactEmail" id="contactEmail"
                                       value={formData.contactEmail || ''} onChange={handleInputChange}
                                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
                            </div>
                            <div>
                                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Teléfono
                                    de Contacto</label>
                                <input type="tel" name="contactPhone" id="contactPhone"
                                       value={formData.contactPhone || ''} onChange={handleInputChange}
                                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
                            </div>
                        </div>

                        {/* Columna Derecha */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="address"
                                       className="block text-sm font-medium text-gray-700">Dirección</label>
                                <input type="text" name="address" id="address" value={formData.address || ''}
                                       onChange={handleInputChange}
                                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
                            </div>
                            <div>
                                <label htmlFor="website" className="block text-sm font-medium text-gray-700">Sitio
                                    Web</label>
                                <input type="url" name="website" id="website" value={formData.website || ''}
                                       onChange={handleInputChange}
                                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
                            </div>
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notas
                                    Adicionales</label>
                                <textarea name="notes" id="notes" value={formData.notes || ''}
                                          onChange={handleInputChange} rows={4}
                                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 p-6 border-t bg-gray-50 rounded-b-lg">
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