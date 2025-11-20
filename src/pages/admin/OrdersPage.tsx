import {useState, useEffect, useMemo} from 'react';
import type {PaymentStatus, Order, PaginatedResponse} from '../../types';
import {Spinner} from '../../components/general/Spinner';
import {OrdersTable} from "../../components/orders/OrdersTable.tsx";
import {useNotification} from "../../context/NotificationContext.tsx";
import {orderService} from "../../services/orderService.ts";
import {useQuery, useMutation, useQueryClient, keepPreviousData} from '@tanstack/react-query';
import type {PaginationState, SortingState} from "@tanstack/react-table";

const statusTabs: { label: string; status: PaymentStatus | null }[] = [
    {label: 'Todos', status: null},
    {label: 'Pendiente de Confirmación', status: 'pending_confirmation'},
    {label: 'Pagados', status: 'paid'},
    {label: 'Cancelados', status: 'cancelled'},
    {label: 'Reembolsados', status: 'refunded'},
];

export default function OrdersPage() {
    const queryClient = useQueryClient();
    const {addNotification} = useNotification();

    const [activeStatus, setActiveStatus] = useState<PaymentStatus | null>('pending_confirmation');

    // --- Estados para TanStack Table ---
    const [{pageIndex, pageSize}, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [debouncedFilter, setDebouncedFilter] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedFilter(globalFilter), 500);
        return () => clearTimeout(timer);
    }, [globalFilter]);

    const {
        data: ordersData,
        isLoading: isLoadingOrders,
        isError,
        error
    } = useQuery<PaginatedResponse<Order>, Error>({
        queryKey: ['orders', pageIndex, pageSize, debouncedFilter, sorting, activeStatus],
        queryFn: () => orderService.listAdmin({
            page: pageIndex + 1,
            pageSize: pageSize,
            search: debouncedFilter,
            sortBy: sorting[0]?.id,
            sortOrder: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
            paymentStatus: activeStatus ?? undefined,
        }),
        placeholderData: keepPreviousData,
    });


    const orders = useMemo(() => ordersData?.data ?? [], [ordersData]);
    const pageCount = useMemo(() => ordersData?.pageCount ?? -1, [ordersData]);

    const approveMutation = useMutation({
        mutationFn: (orderId: number) => orderService.approve(orderId),
        onSuccess: (_, orderId) => {
            addNotification(`Orden #${orderId} aprobada con éxito.`, 'success');
            queryClient.invalidateQueries({queryKey: ['orders']});
        },
        onError: (err: Error) => {
            addNotification(`Error al aprobar la orden: ${err.message}`, 'error');
        },
    });

    const rejectMutation = useMutation({
        mutationFn: (orderId: number) => orderService.reject(orderId),
        onSuccess: (_, orderId) => {
            addNotification(`Orden #${orderId} rechazada.`, 'success');
            queryClient.invalidateQueries({queryKey: ['orders']});
        },
        onError: (err: Error) => {
            addNotification(`Error al rechazar la orden: ${err.message}`, 'error');
        },
    });

    const isLoading = isLoadingOrders && ordersData === undefined;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-4">Gestión de Órdenes</h1>

            <div className="border-b border-[var(--color-border)] mb-4">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    {statusTabs.map((tab) => (
                        <button
                            key={tab.label}
                            onClick={() => setActiveStatus(tab.status)}
                            className={`${
                                activeStatus === tab.status
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)] hover:border-[var(--color-foreground)]/30'
                            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-16">
                    <Spinner/>
                </div>
            ) : isError ? (
                <p className="text-red-500 text-center">Error: {error.message}</p>
            ) : (
                <OrdersTable
                    orders={orders}
                    onApprove={(id) => approveMutation.mutate(id)}
                    onReject={(id) => rejectMutation.mutate(id)}
                    processingOrderId={approveMutation.isPending ? approveMutation.variables : rejectMutation.isPending ? rejectMutation.variables : null}
                    pagination={{pageIndex, pageSize}}
                    setPagination={setPagination}
                    sorting={sorting}
                    setSorting={setSorting}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    pageCount={pageCount}
                />
            )}
        </div>
    );
}