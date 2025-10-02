import {useEffect, useState} from 'react';
import {addressService} from '../../services/addressService';
import type {Address, AddressCreationData} from '../../types';
import {useNotification} from '../../providers/NotificationProvider';
import {Spinner} from '../general/Spinner';
import {Button} from '../general/Button';
import {PlusCircle, MapPin, Trash, Edit} from 'lucide-react';
import {AddressFormModal} from "./AddressFormModal.tsx";
import {ConfirmationModal} from "../general/ConfirmationModal.tsx";

export const AddressManager = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const {showNotification} = useNotification();

    // Estado para los modales
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);

    const fetchAddresses = async () => {
        try {
            const data = await addressService.listAddresses();
            setAddresses(data);
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                setAddresses([]);
            } else {
                showNotification({message: `Error al cargar direcciones: ${error.message}`, type: 'error'});
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (data: AddressCreationData, id?: number) => {
        setIsSaving(true);
        try {
            const action = id ? addressService.updateAddress(id, data) : addressService.createAddress(data);
            await action;
            showNotification({message: `Dirección ${id ? 'actualizada' : 'creada'} con éxito.`, type: 'success'});
            setIsFormModalOpen(false);
            fetchAddresses(); // Recargar la lista
        } catch (error: any) {
            showNotification({message: `Error al guardar la dirección: ${error.message}`, type: 'error'});
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingAddressId) return;
        await addressService.deleteAddress(deletingAddressId);
        showNotification({message: 'Dirección eliminada.', type: 'success'});
        setDeletingAddressId(null);
        fetchAddresses(); // Recargar la lista
    };

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const data = await addressService.listAddresses();
                setAddresses(data);
            } catch (error: any) {
                if (error.response && error.response.status === 404) {
                    setAddresses([]); // Nos aseguramos que la lista esté vacía.
                } else {
                    showNotification({message: `Error al cargar direcciones: ${error.message}`, type: 'error'});
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchAddresses();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center p-8"><Spinner/></div>;
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Mis Direcciones de Envío</h2>
                <Button variant="primary" size="md" onClick={() => {
                    setEditingAddress(null);
                    setIsFormModalOpen(true);
                }}>
                    <PlusCircle className="h-5 w-5 mr-2"/>
                    Añadir Dirección
                </Button>
            </div>

            {addresses.length === 0 ? (
                <p className="text-gray-500">Aún no has añadido ninguna dirección.</p>
            ) : (
                <div className="space-y-4">
                    {addresses.map(addr => (
                        <div key={addr.id} className="border rounded-lg p-4 flex justify-between items-start">
                            <div>
                                <div className="flex items-center font-semibold">
                                    <MapPin className="h-5 w-5 mr-2 text-gray-500"/>
                                    <span>{addr.recipientName}</span>
                                    {addr.isDefault && (
                                        <span
                                            className="ml-3 text-xs bg-green-100 text-green-800 font-bold px-2 py-1 rounded-full">
                                            Predeterminada
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600 ml-7">{addr.street}, {addr.details}</p>
                                <p className="text-gray-600 ml-7">{addr.city}, {addr.state}, {addr.country}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" size="sm" onClick={() => {
                                    setEditingAddress(addr);
                                    setIsFormModalOpen(true);
                                }}>
                                    <Edit className="h-4 w-4"/>
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => setDeletingAddressId(addr.id)}>
                                    <Trash className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <AddressFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSave={handleSave}
                initialData={editingAddress}
                isSaving={isSaving}
            />
            <ConfirmationModal isOpen={!!deletingAddressId} onClose={() => setDeletingAddressId(null)}
                               onConfirm={handleDelete} title="Confirmar Eliminación"
                               message="¿Estás seguro de que deseas eliminar esta dirección? Esta acción no se puede deshacer."/>
        </div>
    );
};