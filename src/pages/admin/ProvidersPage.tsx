import {useState, useMemo, useEffect} from 'react';
import type {Provider, ProviderCreationData, PaginatedResponse} from '../../types';
import {providerService} from '../../services/providerService';
import {useNotification} from '../../context/NotificationContext.tsx';
import {Button} from '../../components/general/Button.tsx';
import {PlusCircle} from 'lucide-react';
import {ProviderTable} from '../../components/providers/ProviderTable.tsx';
import {ProviderForm} from '../../components/providers/ProviderForm.tsx';
import {ConfirmationModal} from '../../components/general/ConfirmationModal.tsx';
import {Spinner} from "../../components/general/Spinner.tsx";
import {useQuery, useMutation, useQueryClient, keepPreviousData} from '@tanstack/react-query';
import type {PaginationState, SortingState} from "@tanstack/react-table";

const ProvidersPage = () => {
    const queryClient = useQueryClient();
    const {addNotification} = useNotification();

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
    const [providerToDelete, setProviderToDelete] = useState<Provider | null>(null);

    // --- Estados para las tablas---
    const [{pageIndex, pageSize}, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [debouncedFilter, setDebouncedFilter] = useState('');

    // Debounce para el filtro de búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilter(globalFilter);
        }, 500); // Espera 500ms después de que el usuario deja de escribir
        return () => clearTimeout(timer);
    }, [globalFilter]);

    // Query para proveedores paginados
    const {
        data: providersData,
        isLoading: isLoadingProviders,
        isError,
        error
    } = useQuery<PaginatedResponse<Provider>, Error>({
        queryKey: ['providers', pageIndex, pageSize, debouncedFilter, sorting],
        queryFn: () => providerService.getProviders({
            page: pageIndex + 1,
            pageSize: pageSize,
            search: debouncedFilter,
            sortBy: sorting[0]?.id,
            sortOrder: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
        }),
        placeholderData: keepPreviousData,
    });

    const providers = useMemo(() => providersData?.data ?? [], [providersData]);
    const pageCount = useMemo(() => providersData?.pageCount ?? -1, [providersData]);


    const handleCreate = () => {
        setEditingProvider(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (provider: Provider) => {
        setEditingProvider(provider);
        setIsFormModalOpen(true);
    };

    const handleDelete = (provider: Provider) => {
        setProviderToDelete(provider);
    };

    const createUpdateMutation = useMutation({
        mutationFn: async (data: ProviderCreationData) => {
            if (editingProvider) {
                return providerService.updateProvider(editingProvider.id, data);
            } else {
                return providerService.createProvider(data);
            }
        },
        onSuccess: () => {
            const successMessage = editingProvider ? 'Proveedor actualizado con éxito.' : 'Proveedor creado con éxito.';
            addNotification(successMessage, 'success');
            queryClient.invalidateQueries({queryKey: ['providers']});
            setIsFormModalOpen(false);
            setEditingProvider(null);
        },
        onError: (err: Error) => {
            addNotification(`Error al guardar: ${err.message}`, 'error');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => providerService.deleteProvider(id),
        onSuccess: () => {
            addNotification('Proveedor eliminado con éxito.', 'success');
            queryClient.invalidateQueries({queryKey: ['providers']});
            setProviderToDelete(null);
        },
        onError: (err: Error) => {
            addNotification(`Error al eliminar: ${err.message}`, 'error');
        },
    });

    const handleSave = (data: ProviderCreationData) => {
        createUpdateMutation.mutate(data);
    };

    const confirmDelete = () => {
        if (providerToDelete) {
            deleteMutation.mutate(providerToDelete.id);
        }
    };

    const isLoading = isLoadingProviders && providersData === undefined;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Gestión de Proveedores</h1>
                <Button onClick={handleCreate} variant="primary">
                    <PlusCircle className="h-5 w-5 mr-2"/>
                    Nuevo Proveedor
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-16">
                    <Spinner/>
                </div>
            ) : isError ? (
                <p className="text-red-500 text-center">Error: {error?.message}</p>
            ) : (
                <ProviderTable
                    providers={providers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    pagination={{pageIndex, pageSize}}
                    setPagination={setPagination}
                    sorting={sorting}
                    setSorting={setSorting}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    pageCount={pageCount}
                />
            )}

            <ProviderForm isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSave={handleSave}
                          providerToEdit={editingProvider} isSubmitting={createUpdateMutation.isPending}/>

            <ConfirmationModal
                isOpen={!!providerToDelete}
                onClose={() => setProviderToDelete(null)}
                onConfirm={confirmDelete}
                isConfirming={deleteMutation.isPending}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar al proveedor "${providerToDelete?.name}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
};

export default ProvidersPage;