import React, {useState, useEffect} from 'react';
import {Modal} from '../general/Modal';
import {Button} from '../general/Button';
import type {Order, ShipmentCreationData} from '../../types';

const initialState: ShipmentCreationData = {
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
    onSubmit: (data: ShipmentCreationData) => void;
    order: Order;
    isSubmitting: boolean;
}

export const ShipmentModal = ({isOpen, onClose, onSubmit, order, isSubmitting}: ShipmentModalProps) => {
    const [formData, setFormData] = useState<ShipmentCreationData>(initialState);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData(initialState);
            setErrors({});
        }
    }, [isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
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

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Gestionar Envío para Pedido #${order.id}`} size="lg">
            <form onSubmit={handleSubmit} className="space-y-6 text-gray-500">
                <div>
                    <label htmlFor="shippingMethod" className="text-black">Método de Envío</label>
                    <select
                        id="shippingMethod"
                        name="shippingMethod"
                        value={formData.shippingMethod}
                        onChange={handleInputChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-liderplast-primary focus:border-liderplast-primary sm:text-sm rounded-md"
                    >
                        <option value="national_shipping">Envío Nacional</option>
                        <option value="local_delivery">Entrega Local</option>
                    </select>
                </div>

                {formData.shippingMethod === 'national_shipping' && (
                    <div className="space-y-4 p-4 border rounded-md bg-gray-50">
                        <h4 className="font-medium text-black">Detalles de Envío Nacional</h4>
                        <div>
                            <label htmlFor="company">Transportadora: </label>
                            <input id="company" name="company" className="border border-black rounded-md p-2" value={formData.company || ''}
                                   onChange={handleInputChange} placeholder="empresa transportadora aqui..."/>
                            {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                        </div>
                        <div>
                            <label htmlFor="trackingNumber">Número de Guía: </label>
                            <input id="trackingNumber" name="trackingNumber" className="border border-black rounded-md p-2" value={formData.trackingNumber || ''}
                                   onChange={handleInputChange} placeholder="Numero de guia aqui..."/>
                            {errors.trackingNumber &&
                                <p className="text-red-500 text-sm mt-1">{errors.trackingNumber}</p>}
                        </div>
                        <div>
                            <label htmlFor="trackingUrl">URL de Rastreo: </label>
                            <input id="trackingUrl" name="trackingUrl" className="border border-black rounded-md p-2" value={formData.trackingUrl || ''}
                                   onChange={handleInputChange} placeholder="https://..."/>
                        </div>
                    </div>
                )}

                {formData.shippingMethod === 'local_delivery' && (
                    <div className="space-y-4 p-4 border rounded-md bg-gray-50">
                        <h4 className="font-medium text-gray-700">Detalles de Entrega Local</h4>
                        <div>
                            <label htmlFor="driverName">Nombre del Conductor: </label>
                            <input id="driverName" name="driverName" className="border border-black rounded-md p-2" value={formData.driverName || ''}
                                   onChange={handleInputChange}/>
                        </div>
                        <div>
                            <label htmlFor="licensePlate">Placa del Vehículo: </label>
                            <input id="licensePlate" name="licensePlate" className="border border-black rounded-md p-2" value={formData.licensePlate || ''}
                                   onChange={handleInputChange}/>
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
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
};
