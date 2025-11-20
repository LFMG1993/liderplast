import {useEffect, useState} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {addressService} from '../../services/addressService';
import type {Address, AddressCreationData} from '../../types';
import {useNotification} from '../../context/NotificationContext.tsx';
import {Spinner} from '../general/Spinner';
import {Button} from '../general/Button';
import {PlusCircle, MapPin, Trash, Edit} from 'lucide-react';
import {AddressFormModal} from "./AddressFormModal.tsx";
import {ConfirmationModal} from "../general/ConfirmationModal.tsx";

export const AddressManager = () => {
    const queryClient = useQueryClient();
    const {addNotification} = useNotification();

    // Estado para los modales
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);

    const {data: addresses = [], isLoading, isError, error} = useQuery<Address[], any>({
        queryKey: ['customerAddresses'],
        queryFn: addressService.listAddresses,
    });

    useEffect(() => {
        if (isError && error) {
            if (error.response && error.response.status === 404) {
            } else {
                addNotification(`Error al cargar direcciones: ${error.message}`, 'error');
            }
        }
    }, [isError, error, addNotification]);

    const saveMutation = useMutation({
        mutationFn: ({data, id}: { data: AddressCreationData, id?: number }) =>
            id ? addressService.updateAddress(id, data) : addressService.createAddress(data),
        onSuccess: (_, {id}) => {
            addNotification(`Dirección ${id ? 'actualizada' : 'creada'} con éxito.`, 'success');
            queryClient.invalidateQueries({queryKey: ['customerAddresses']});
            setIsFormModalOpen(false);
        },
        onError: (error: any) => {
            addNotification(`Error al guardar la dirección: ${error.message}`, 'error');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => addressService.deleteAddress(id),
        onSuccess: () => {
            addNotification('Dirección eliminada.', 'success');
            queryClient.invalidateQueries({queryKey: ['customerAddresses']});
            setDeletingAddressId(null);
        },
        onError: (error: any) => {
            addNotification(`Error al eliminar la dirección: ${error.message}`, 'error');
        }
    });

    const handleSave = (data: AddressCreationData, id?: number) => {
        saveMutation.mutate({data, id});
    };

    const handleDelete = () => {
        if (deletingAddressId) {
            deleteMutation.mutate(deletingAddressId);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Spinner/></div>;
    }

    if (isError) {
        return <div className="text-center p-8 text-red-500">Error: {(error as Error).message}</div>;
    }

    return (
        <div
            className="bg-[var(--color-card)] text-[var(--color-foreground)] p-8 rounded-lg shadow-sm border border-[var(--color-border)] max-w-4xl">
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
                <p className="text-[var(--color-foreground)]/60">Aún no has añadido ninguna dirección.</p>
            ) : (
                <div className="space-y-4">
                    {addresses.map(addr => (
                        <div key={addr.id} className="border rounded-lg p-4 flex justify-between items-start">
                            <div>
                                <div className="flex items-center font-semibold">
                                    <MapPin className="h-5 w-5 mr-2 text-[var(--color-foreground)]/60"/>
                                    <span>{addr.recipientName}</span>
                                    {addr.isDefault && (
                                        <span
                                            className="ml-3 text-xs bg-green-500/10 text-green-600 dark:text-green-400 font-bold px-2 py-1 rounded-full">
                                            Predeterminada
                                        </span>
                                    )}
                                </div>
                                <p className="text-[var(--color-foreground)]/80 ml-7">{addr.street}, {addr.details}</p>
                                <p className="text-[var(--color-foreground)]/80 ml-7">{addr.city}, {addr.state}, {addr.country}</p>
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
                isSaving={saveMutation.isPending}
            />
            <ConfirmationModal isOpen={!!deletingAddressId} onClose={() => setDeletingAddressId(null)}
                               onConfirm={handleDelete}
                               isConfirming={deleteMutation.isPending}
                               title="Confirmar Eliminación"
                               message="¿Estás seguro de que deseas eliminar esta dirección? Esta acción no se puede deshacer."/>
        </div>
    );
};