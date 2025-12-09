import {useState, useEffect, useMemo} from 'react';
import type {Order, Shipment, ShipmentFormData, PaginatedResponse} from '../../types';
import {Spinner} from '../../components/general/Spinner';
import {useNotification} from "../../context/NotificationContext.tsx";
import {orderService} from "../../services/orderService.ts";
import {ShipmentModal} from "../../components/shipments/ShipmentModal.tsx";
import {Tabs} from "../../components/general/Tabs.tsx";
import {shipmentService} from "../../services/shipmentService.ts";
import {useQuery, useMutation, useQueryClient, keepPreviousData} from '@tanstack/react-query';
import type {PaginationState, SortingState} from "@tanstack/react-table";
import {PendingShipmentsTable} from "../../components/shipments/PendingShipmentsTable.tsx";
import {ExistingShipmentsTable} from "../../components/shipments/ExistingShipmentsTable.tsx";

const PendingShipments = () => {
    const queryClient = useQueryClient();
    const {addNotification} = useNotification();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [{pageIndex, pageSize}, setPagination] = useState<PaginationState>({pageIndex: 0, pageSize: 10});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [debouncedFilter, setDebouncedFilter] = useState('');


    useEffect(() => {
        const timer = setTimeout(() => setDebouncedFilter(globalFilter), 500);
        return () => clearTimeout(timer);
    }, [globalFilter]);

    const {data, isLoading, isError, error} = useQuery<PaginatedResponse<Order>, Error>({
        queryKey: ['pendingShipments', pageIndex, pageSize, debouncedFilter, sorting, { includeItems: true }],
        queryFn: () => orderService.listAdmin({
            page: pageIndex + 1,
            pageSize: pageSize,
            search: debouncedFilter,
            sortBy: sorting[0]?.id,
            sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
            paymentStatus: 'paid',
            shippingStatus: 'unfulfilled',
            includeItems: true
        }),
        placeholderData: keepPreviousData,
    });

    const orders = useMemo(() => data?.data ?? [], [data]);
    const pageCount = useMemo(() => data?.pageCount ?? -1, [data]);

    const createShipmentMutation = useMutation({
        mutationFn: ({orderId, formData}: { orderId: number, formData: ShipmentFormData }) =>
            orderService.createShipment(orderId, formData),
        onSuccess: (_, {orderId}) => {
            addNotification(`Envío para el pedido #${orderId} creado con éxito.`, 'success');
            queryClient.invalidateQueries({queryKey: ['pendingShipments']});
            queryClient.invalidateQueries({queryKey: ['existingShipments']});
            setIsModalOpen(false);
        },
        onError: (err: Error) => {
            addNotification(`Error al crear el envío: ${err.message}`, 'error');
        }
    });

    const handleOpenModal = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCreateShipment = async (data: ShipmentFormData) => {
        if (!selectedOrder) return;
        createShipmentMutation.mutate({orderId: selectedOrder.id, formData: data});
    };

    return (
        <>
            <p className="text-[var(--color-foreground)]/80 mb-6">
                Pedidos que han sido pagados y están listos para ser preparados y enviados.
            </p>
            {isLoading ? (
                <div className="flex justify-center items-center py-16"><Spinner/></div>
            ) : isError ? (
                <p className="text-red-500 text-center">Error: {error.message}</p>
            ) : (
                <PendingShipmentsTable
                    orders={orders}
                    onManageShipment={handleOpenModal}
                    pagination={{pageIndex, pageSize}}
                    setPagination={setPagination}
                    sorting={sorting}
                    setSorting={setSorting}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    pageCount={pageCount}
                />
            )}

            {selectedOrder && (
                <ShipmentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateShipment}
                    orderId={selectedOrder.id}
                    isSubmitting={createShipmentMutation.isPending}
                />
            )}
        </>
    );
}

// --- Vista para Envíos Existentes ---
const ExistingShipments = () => {
    const queryClient = useQueryClient();
    const {addNotification} = useNotification();
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [{pageIndex, pageSize}, setPagination] = useState<PaginationState>({pageIndex: 0, pageSize: 10});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [debouncedFilter, setDebouncedFilter] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedFilter(globalFilter), 500);
        return () => clearTimeout(timer);
    }, [globalFilter]);

    const {data, isLoading, isError, error} = useQuery<PaginatedResponse<Shipment>, Error>({
        queryKey: ['existingShipments', pageIndex, pageSize, debouncedFilter, sorting],
        queryFn: () => shipmentService.listShipments({
            page: pageIndex + 1,
            pageSize: pageSize,
            search: debouncedFilter,
            sortBy: sorting[0]?.id,
            sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
        }),
        placeholderData: keepPreviousData,
    });

    const shipments = useMemo(() => data?.data ?? [], [data]);
    const pageCount = useMemo(() => data?.pageCount ?? -1, [data]);

    const updateShipmentMutation = useMutation({
        mutationFn: ({shipmentId, formData}: { shipmentId: number, formData: Partial<ShipmentFormData> }) =>
            shipmentService.updateShipment(shipmentId, formData),
        onSuccess: (_, {shipmentId}) => {
            addNotification(`Envío #${shipmentId} actualizado.`, 'success');
            queryClient.invalidateQueries({queryKey: ['existingShipments']});
            setIsModalOpen(false);
        },
        onError: (err: Error) => {
            addNotification(`Error al actualizar el envío: ${err.message}`, 'error');
        }
    });


    const handleOpenModal = (shipment: Shipment) => {
        setSelectedShipment(shipment);
        setIsModalOpen(true);
    };

    const handleUpdateShipment = async (data: ShipmentFormData) => {
        if (!selectedShipment) return;
        const cleanedData: Partial<ShipmentFormData> = {
            shippingMethod: data.shippingMethod,
        };

        if (data.shippingMethod === 'national_shipping') {
            cleanedData.company = data.company;
            cleanedData.trackingNumber = data.trackingNumber;
            cleanedData.trackingUrl = data.trackingUrl;
        } else if (data.shippingMethod === 'local_delivery') {
            cleanedData.driverName = data.driverName;
            cleanedData.licensePlate = data.licensePlate;
        }
        updateShipmentMutation.mutate({shipmentId: selectedShipment.id, formData: cleanedData});
    };

    return (
        <>
            <p className="text-[var(--color-foreground)]/80 mb-6">
                Todos los envíos que han sido creados. Desde aquí puedes editar la información de seguimiento.
            </p>
            {isLoading ? (
                <div className="flex justify-center items-center py-16"><Spinner/></div>
            ) : isError ? (
                <p className="text-red-500 text-center">Error: {error.message}</p>
            ) : (
                <ExistingShipmentsTable
                    shipments={shipments}
                    onUpdateShipment={handleOpenModal}
                    pagination={{pageIndex, pageSize}}
                    setPagination={setPagination}
                    sorting={sorting}
                    setSorting={setSorting}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    pageCount={pageCount}
                />
            )}
            {selectedShipment && (
                <ShipmentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleUpdateShipment} // Llama a la función de actualizar
                    orderId={selectedShipment.orderId}
                    shipmentToEdit={selectedShipment} // Pasa el envío para entrar en modo edición
                    isSubmitting={updateShipmentMutation.isPending}
                />
            )}
        </>
    );
};


export default function ShipmentsPage() {
    const tabs = [
        {label: 'Pendientes de Envío', content: <PendingShipments/>},
        {label: 'Envíos Realizados', content: <ExistingShipments/>},
    ];

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-4">Gestión de Envíos</h1>
            <Tabs tabs={tabs}/>
        </div>
    );
}