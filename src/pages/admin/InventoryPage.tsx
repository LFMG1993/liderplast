import {useEffect, useState, useMemo} from 'react';
import type {InventoryItem, InventoryUpdateData, PaginatedResponse} from '../../types';
import {inventoryService} from '../../services/inventoryService';
import {useNotification} from '../../context/NotificationContext.tsx';
import {Spinner} from '../../components/general/Spinner.tsx';
import {InventoryTable} from '../../components/inventory/InventoryTable.tsx';
import {ConfirmationModal} from "../../components/general/ConfirmationModal.tsx";
import {useQuery, useMutation, useQueryClient, keepPreviousData} from '@tanstack/react-query';
import type {PaginationState, SortingState} from "@tanstack/react-table";

const InventoryPage = () => {
    const queryClient = useQueryClient();
    const {addNotification} = useNotification();

    const [updateToConfirm, setUpdateToConfirm] = useState<{
        variantId: number;
        data: InventoryUpdateData
    } | null>(null);

    // --- Estados para TanStack Table ---
    const [{pageIndex, pageSize}, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [debouncedFilter, setDebouncedFilter] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilter(globalFilter);
        }, 500);
        return () => clearTimeout(timer);
    }, [globalFilter]);

    // Query para el inventario paginado
    const {
        data: inventoryData,
        isLoading: isLoadingInventory,
        isError,
        error
    } = useQuery<PaginatedResponse<InventoryItem>, Error>({
        queryKey: ['inventory', pageIndex, pageSize, debouncedFilter, sorting],
        queryFn: () => inventoryService.getInventory({
            page: pageIndex + 1,
            pageSize: pageSize,
            search: debouncedFilter,
            sortBy: sorting[0]?.id,
            sortOrder: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
        }),
        placeholderData: keepPreviousData,
    });

    const inventoryItems = useMemo(() => inventoryData?.data ?? [], [inventoryData]);
    const pageCount = useMemo(() => inventoryData?.pageCount ?? -1, [inventoryData]);

    const requestUpdateInventory = (variantId: number, data: InventoryUpdateData) => {
        setUpdateToConfirm({variantId, data});
    };

    const updateMutation = useMutation({
        mutationFn: ({variantId, data}: { variantId: number, data: InventoryUpdateData }) =>
            inventoryService.updateVariantInventory(variantId, data),
        onSuccess: (updatedVariant) => {
            addNotification('Inventario actualizado con éxito.', 'success');
            // Actualización optimista de la caché para una respuesta instantánea en la UI
            queryClient.setQueryData<PaginatedResponse<InventoryItem>>(
                ['inventory', pageIndex, pageSize, debouncedFilter, sorting],
                (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map(item =>
                            item.id === updatedVariant.id ? {...item, ...updatedVariant} : item
                        ),
                    };
                }
            );
            setUpdateToConfirm(null);
        },
        onError: (err: Error) => {
            addNotification(`Error al actualizar: ${err.message}`, 'error');
            setUpdateToConfirm(null);
        },
    });

    const executeConfirmedUpdate = () => {
        if (!updateToConfirm) return;
        updateMutation.mutate(updateToConfirm);
    };

    const isLoading = isLoadingInventory && inventoryData === undefined;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Gestión de Inventario</h1>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-16">
                    <Spinner/>
                </div>
            ) : isError ? (
                <p className="text-red-500 text-center">Error: {error.message}</p>
            ) : (
                <InventoryTable
                    items={inventoryItems}
                    onUpdate={requestUpdateInventory}
                    pagination={{pageIndex, pageSize}}
                    setPagination={setPagination}
                    sorting={sorting}
                    setSorting={setSorting}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    pageCount={pageCount}
                />
            )}

            <ConfirmationModal
                isOpen={!!updateToConfirm}
                onClose={() => setUpdateToConfirm(null)}
                onConfirm={executeConfirmedUpdate}
                isConfirming={updateMutation.isPending}
                title="Confirmar Actualización"
                message="¿Estás seguro de que deseas guardar este cambio en el inventario?"
            />
        </div>
    );
};

export default InventoryPage;
