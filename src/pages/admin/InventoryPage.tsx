import {useEffect, useState, useMemo, useCallback} from 'react';
import type {InventoryItem, InventoryUpdateData} from '../../types';
import {inventoryService} from '../../services/inventoryService';
import {useNotification} from '../../providers/NotificationProvider.tsx';
import {Spinner} from '../../components/general/Spinner.tsx';
import {InventoryTable} from '../../components/inventory/InventoryTable.tsx';
import {ConfirmationModal} from "../../components/general/ConfirmationModal.tsx";

const InventoryPage = () => {
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updateToConfirm, setUpdateToConfirm] = useState<{
        variantId: number;
        data: InventoryUpdateData
    } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const {showNotification} = useNotification();

    const fetchData = useCallback(async () => {
            try {
                setIsLoading(true);
                const data = await inventoryService.getInventory();
                setInventoryItems(data);
            } catch (err: any) {
                showNotification({message: `Error al cargar el inventario: ${err.message}`, type: 'error'});
            } finally {
                setIsLoading(false);
            }
        }, [showNotification]
    );

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const requestUpdateInventory = (variantId: number, data: InventoryUpdateData) => {
        setUpdateToConfirm({variantId, data});
    };

    // Esta función ejecuta la actualización después de la confirmación.
    const executeConfirmedUpdate = async () => {
        if (!updateToConfirm) return;
        const {variantId, data} = updateToConfirm;

        try {
            const updatedVariant = await inventoryService.updateVariantInventory(variantId, data);
            setInventoryItems(prevItems =>
                prevItems.map(item =>
                    item.id === variantId ? {...item, ...updatedVariant} : item
                )
            );
            showNotification({message: 'Inventario actualizado con éxito.', type: 'success'});
        } catch (err: any) {
            showNotification({message: `Error al actualizar: ${err.message}`, type: 'error'});
        } finally {
            setUpdateToConfirm(null); // Cierra el modal
        }
    };

    // Filtra los ítems basados en el término de búsqueda.
    const filteredItems = useMemo(() => {
        if (!searchTerm.trim()) return inventoryItems;
        const lowercasedFilter = searchTerm.toLowerCase();
        return inventoryItems.filter(item =>
            item.product.name?.toLowerCase().includes(lowercasedFilter) ||
            item.sku.toLowerCase().includes(lowercasedFilter)
        );
    }, [inventoryItems, searchTerm]);


    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Inventario</h1>
                <input
                    type="text"
                    placeholder="Buscar por producto o SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-xs border border-gray-300 rounded-md px-3 py-2 focus:ring-2
                focus:ring-liderplast-primary focus:border-liderplast-primary"
                />

            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-16">
                    <Spinner/>
                </div>
            ) : (
                <InventoryTable items={filteredItems} onUpdate={requestUpdateInventory}/>
            )}

            <ConfirmationModal
                isOpen={!!updateToConfirm}
                onClose={() => setUpdateToConfirm(null)}
                onConfirm={executeConfirmedUpdate}
                title="Confirmar Actualización"
                message="¿Estás seguro de que deseas guardar este cambio en el inventario?"
            />
        </div>
    );
};

export default InventoryPage;
