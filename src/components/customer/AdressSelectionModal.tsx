import {useEffect, useState} from 'react';
import {addressService} from '../../services/addressService.ts';
import type {Address, AddressCreationData} from '../../types';
import {useNotification} from '../../providers/NotificationProvider.tsx';
import {Spinner} from '../general/Spinner.tsx';
import {Button} from '../general/Button.tsx';
import {PlusCircle} from 'lucide-react';
import {AddressFormModal} from "./AddressFormModal.tsx";
import {Modal} from "../general/Modal.tsx";

interface AddressSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddressSelected: (addressId: number) => void;
}

export const AddressSelectionModal = ({isOpen, onClose, onAddressSelected}: AddressSelectionModalProps) => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const {showNotification} = useNotification();

    // Estado para el modal de creación/edición
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fetchAddresses = async () => {
        setIsLoading(true);
        try {
            const data = await addressService.listAddresses();
            setAddresses(data);
            // Pre-seleccionar la dirección por defecto si existe
            const defaultAddress = data.find(a => a.isDefault);
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress.id);
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                setAddresses([]); // No hay direcciones, es un estado válido.
            } else {
                showNotification({message: `Error al cargar direcciones: ${error.message}`, type: 'error'});
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar direcciones cuando el modal principal se abre
    useEffect(() => {
        if (isOpen) {
            fetchAddresses();
        }
    }, [isOpen]);

    const handleSaveNewAddress = async (data: AddressCreationData) => {
        setIsSaving(true);
        try {
            await addressService.createAddress(data);
            showNotification({message: 'Dirección creada con éxito.', type: 'success'});
            setIsFormModalOpen(false);
            await fetchAddresses(); // Recargar la lista para mostrar la nueva dirección
        } catch (error: any) {
            showNotification({message: `Error al guardar la dirección: ${error.message}`, type: 'error'});
        } finally {
            setIsSaving(false);
        }
    };

    const handleConfirmSelection = () => {
        if (selectedAddressId) {
            onAddressSelected(selectedAddressId);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Selecciona una Dirección de Envío" size="lg">
                {isLoading ? (
                    <div className="flex justify-center p-8"><Spinner/></div>
                ) : (
                    <div className="space-y-4">
                        {addresses.length > 0 ? (
                            addresses.map(addr => (
                                <div key={addr.id}
                                     className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-liderplast-primary ring-2 ring-liderplast-primary' : 'border-gray-300 hover:border-gray-400'}`}
                                     onClick={() => setSelectedAddressId(addr.id)}>
                                    <div className="flex items-start">
                                        <input type="radio" name="address" checked={selectedAddressId === addr.id}
                                               readOnly
                                               className="mt-1 h-4 w-4 text-liderplast-primary focus:ring-liderplast-primary"/>
                                        <div className="ml-3 text-sm">
                                            <p className="font-bold">{addr.recipientName}</p>
                                            <p>{addr.street}, {addr.details}</p>
                                            <p>{addr.city}, {addr.state}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600 py-4">No tienes direcciones guardadas. ¡Añade una
                                para continuar!</p>
                        )}

                        <Button variant="outline" size="md" className="w-full"
                                onClick={() => setIsFormModalOpen(true)}>
                            <PlusCircle className="h-5 w-5 mr-2"/>
                            Añadir Nueva Dirección
                        </Button>

                        <div className="pt-4 flex justify-end gap-3">
                            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                            <Button type="button" onClick={handleConfirmSelection}
                                    disabled={!selectedAddressId || isLoading}>
                                Continuar con esta Dirección
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal para crear una nueva dirección */}
            <AddressFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSave={handleSaveNewAddress}
                isSaving={isSaving}
            />
        </>
    );
};