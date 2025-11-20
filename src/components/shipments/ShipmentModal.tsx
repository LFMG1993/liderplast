import React, {useState, useEffect} from 'react';
import {Modal} from '../general/Modal';
import {Button} from '../general/Button';
import type {ShipmentFormData, Shipment} from '../../types';

const initialState: ShipmentFormData = {
    shippingMethod: 'national_shipping',
    company: '',
    trackingNumber: '',
    trackingUrl: '',
    driverName: '',
    licensePlate: '',
};

interface ShipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ShipmentFormData) => void;
    orderId: number;
    shipmentToEdit?: Shipment | null;
    isSubmitting: boolean;
}

export const ShipmentModal = ({
                                  isOpen,
                                  onClose,
                                  onSubmit,
                                  orderId,
                                  shipmentToEdit,
                                  isSubmitting
                              }: ShipmentModalProps) => {
        const [formData, setFormData] = useState<ShipmentFormData>(initialState);
        const [errors, setErrors] = useState<Record<string, string>>({});

        useEffect(() => {
            if (isOpen) {
                if (shipmentToEdit) {
                    // Modo Edición: Cargar datos del envío existente
                    setFormData({
                        shippingMethod: shipmentToEdit.shippingMethod,
                        company: shipmentToEdit.company || '',
                        trackingNumber: shipmentToEdit.trackingNumber || '',
                        trackingUrl: shipmentToEdit.trackingUrl || '',
                        driverName: shipmentToEdit.driverName || '',
                        licensePlate: shipmentToEdit.licensePlate || '',
                    });
                } else {
                    // Modo Creación: Usar estado inicial
                    setFormData(initialState);
                }
                setErrors({});
            }
        }, [isOpen, shipmentToEdit]);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const {name, value} = e.target;
            // Si estamos cambiando el método de envío, reseteamos los campos específicos
            if (name === 'shippingMethod') {
                setFormData({
                    ...initialState, // Resetea a los valores por defecto
                    shippingMethod: value as ShipmentFormData['shippingMethod'], // Mantiene el nuevo método seleccionado
                });
            } else {
                setFormData(prev => ({...prev, [name]: value}));
            }
        };

        const validate = () => {
            const newErrors: Record<string, string> = {};
            if (formData.shippingMethod === 'national_shipping') {
                if (!formData.company?.trim()) {
                    newErrors.company = 'La transportadora es requerida.';
                }
                if (!formData.trackingNumber?.trim()) {
                    newErrors.trackingNumber = 'El número de guía es requerido.';
                }
            }
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (validate()) {
                onSubmit(formData);
            }
        };

        const modalTitle = shipmentToEdit ? `Editar Envío para Pedido #${orderId}` : `Gestionar Envío para Pedido #${orderId}`;

        return (
            <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="shippingMethod"
                               className="block text-sm font-medium text-[var(--color-foreground)]/80">Método de
                            Envío</label>
                        <select
                            id="shippingMethod"
                            name="shippingMethod"
                            value={formData.shippingMethod}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm focus:border-primary focus:ring-primary p-2.5"
                        >
                            <option value="national_shipping">Envío Nacional</option>
                            <option value="local_delivery">Entrega Local</option>
                        </select>
                    </div>

                    {formData.shippingMethod === 'national_shipping' && (
                        <div
                            className="space-y-4 p-4 border border-[var(--color-border)] rounded-md bg-[var(--color-muted)]/50">
                            <h4 className="font-medium">Detalles de Envío Nacional</h4>
                            <div>
                                <label htmlFor="company"
                                       className="block text-sm font-medium text-[var(--color-foreground)]/80">Transportadora</label>
                                <input id="company" name="company"
                                       className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm p-2.5"
                                       value={formData.company || ''}
                                       onChange={handleInputChange} placeholder="Ej: Servientrega, Interrapidísimo..."/>
                                {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                            </div>
                            <div>
                                <label htmlFor="trackingNumber"
                                       className="block text-sm font-medium text-[var(--color-foreground)]/80">Número de
                                    Guía</label>
                                <input id="trackingNumber" name="trackingNumber"
                                       className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm p-2.5"
                                       value={formData.trackingNumber || ''}
                                       onChange={handleInputChange} placeholder="Número de seguimiento"/>
                                {errors.trackingNumber &&
                                    <p className="text-red-500 text-sm mt-1">{errors.trackingNumber}</p>}
                            </div>
                            <div>
                                <label htmlFor="trackingUrl"
                                       className="block text-sm font-medium text-[var(--color-foreground)]/80">URL de
                                    Rastreo (Opcional)</label>
                                <input id="trackingUrl" name="trackingUrl"
                                       className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm p-2.5"
                                       value={formData.trackingUrl || ''}
                                       onChange={handleInputChange} placeholder="https://..."/>
                            </div>
                        </div>
                    )}

                    {formData.shippingMethod === 'local_delivery' && (
                        <div
                            className="space-y-4 p-4 border border-[var(--color-border)] rounded-md bg-[var(--color-muted)]/50">
                            <h4 className="font-medium">Detalles de Entrega Local</h4>
                            <div>
                                <label htmlFor="driverName"
                                       className="block text-sm font-medium text-[var(--color-foreground)]/80">Nombre del
                                    Conductor</label>
                                <input id="driverName" name="driverName"
                                       className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm p-2.5"
                                       value={formData.driverName || ''}
                                       onChange={handleInputChange}/>
                            </div>
                            <div>
                                <label htmlFor="licensePlate"
                                       className="block text-sm font-medium text-[var(--color-foreground)]/80">Placa del
                                    Vehículo</label>
                                <input id="licensePlate" name="licensePlate"
                                       className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm p-2.5"
                                       value={formData.licensePlate || ''}
                                       onChange={handleInputChange}/>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4 border-t border-[var(--color-border)] mt-6">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Guardar Envío'}
                        </Button>
                    </div>
                </form>
            </Modal>
        );
    }
;
