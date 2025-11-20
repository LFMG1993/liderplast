import {useEffect, useState} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {addressService} from '../../services/addressService.ts';
import type {Address, AddressCreationData} from '../../types';
import {useNotification} from "../../context/NotificationContext.tsx";
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
    const queryClient = useQueryClient();
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const {addNotification} = useNotification();

    // Estado para el modal de creación/edición
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    const {data: addresses = [], isLoading} = useQuery<Address[], any>({
        queryKey: ['customerAddresses'],
        queryFn: addressService.listAddresses,
        enabled: isOpen, // Solo ejecuta la query cuando el modal está abierto
    });

    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            if (!selectedAddressId) {
                const defaultAddress = addresses.find(a => a.isDefault);
                if (defaultAddress) {
                    setSelectedAddressId(defaultAddress.id);
                }
            }
        }
    }, [addresses, selectedAddressId]);

    useEffect(() => {
        if (isLoading) return; // Evitar notificaciones en la carga inicial
        const queryState = queryClient.getQueryState(['customerAddresses']);
        if (queryState?.error) {
            const error = queryState.error as any;
            if (error.response?.status === 404) {
            } else {
                addNotification(`Error al cargar direcciones: ${error.message}`, 'error');
            }
        }
    }, [isLoading, queryClient, addNotification]);

    const createAddressMutation = useMutation({
        mutationFn: (data: AddressCreationData) => addressService.createAddress(data),
        onSuccess: () => {
            addNotification('Dirección creada con éxito.', 'success');
            queryClient.invalidateQueries({queryKey: ['customerAddresses']});
            setIsFormModalOpen(false);
        },
        onError: (error: any) => {
            addNotification(`Error al guardar la dirección: ${error.message}`, 'error');
        }
    });

    const handleSaveNewAddress = (data: AddressCreationData) => {
        createAddressMutation.mutate(data);
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
                                     className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-primary ring-2 ring-primary' : 'border-[var(--color-border)] hover:border-primary/50'}`}
                                     onClick={() => setSelectedAddressId(addr.id)}
                                >
                                    <div className="flex items-start">
                                        <input type="radio" name="address" checked={selectedAddressId === addr.id}
                                               readOnly
                                               className="mt-1 h-4 w-4 text-primary focus:ring-primary bg-transparent border-[var(--color-border)]"/>
                                        <div className="ml-3 text-sm text-[var(--color-foreground)]">
                                            <p className="font-bold">{addr.recipientName}</p>
                                            <p>{addr.street}, {addr.details}</p>
                                            <p>{addr.city}, {addr.state}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-[var(--color-foreground)]/60 py-4">No tienes direcciones
                                guardadas. ¡Añade una para continuar!</p>
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
                isSaving={createAddressMutation.isPending}
            />
        </>
    );
};