import {useEffect, useState} from 'react';
import type {Provider, ProviderCreationData} from '../../types';
import {providerService} from '../../services/providerService';
import {useNotification} from '../../providers/NotificationProvider.tsx';
import {Button} from '../../components/general/Button.tsx';
import {PlusCircle} from 'lucide-react';
import {ProviderTable} from '../../components/providers/ProviderTable.tsx';
import {ProviderForm} from '../../components/providers/ProviderForm.tsx';
import {ConfirmationModal} from '../../components/general/ConfirmationModal.tsx';
import {Spinner} from "../../components/general/Spinner.tsx";

const ProvidersPage = () => {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
    const [providerToDelete, setProviderToDelete] = useState<Provider | null>(null);
    const {showNotification} = useNotification();

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await providerService.getProviders();
            setProviders(data);
        } catch (err: any) {
            showNotification({message: `Error al cargar proveedores: ${err.message}`, type: 'error'});
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = () => {
        setEditingProvider(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (id: number) => {
        const provider = providers.find(p => p.id === id);
        if (provider) {
            setEditingProvider(provider);
            setIsFormModalOpen(true);
        }
    };

    const handleDelete = (provider: Provider) => {
        setProviderToDelete(provider);
    };

    const confirmDelete = async () => {
        if (providerToDelete) {
            try {
                await providerService.deleteProvider(providerToDelete.id);
                showNotification({message: 'Proveedor eliminado con éxito.', type: 'success'});
                setProviderToDelete(null);
                await fetchData();
            } catch (err: any) {
                showNotification({message: `Error al eliminar: ${err.message}`, type: 'error'});
            }
        }
    };

    const handleSave = async (data: ProviderCreationData) => {
        setIsSubmitting(true);
        try {
            if (editingProvider) {
                await providerService.updateProvider(editingProvider.id, data);
            } else {
                await providerService.createProvider(data);
            }
            const successMessage = editingProvider ? 'Proveedor actualizado con éxito.' : 'Proveedor creado con éxito.';
            showNotification({message: successMessage, type: 'success'});
            setIsFormModalOpen(false);
            setEditingProvider(null);
            await fetchData();
        } catch (err: any) {
            showNotification({message: `Error al guardar: ${err.message}`, type: 'error'});
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Proveedores</h1>
                <Button onClick={handleCreate} variant="primary">
                    <PlusCircle className="h-5 w-5 mr-2"/>
                    Nuevo Proveedor
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-16">
                    <Spinner/>
                </div>
            ) : (
                <ProviderTable providers={providers} onEdit={handleEdit} onDelete={handleDelete}/>
            )}

            <ProviderForm isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSave={handleSave}
                          providerToEdit={editingProvider} isSubmitting={isSubmitting}/>

            <ConfirmationModal
                isOpen={!!providerToDelete}
                onClose={() => setProviderToDelete(null)}
                onConfirm={confirmDelete}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar al proveedor "${providerToDelete?.name}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
};

export default ProvidersPage;