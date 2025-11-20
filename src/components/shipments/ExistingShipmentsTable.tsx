import {type Dispatch, type SetStateAction} from "react";
import type {Shipment} from "../../types";
import {ShippingMethodLabels, ShippingStatusColors, ShippingStatusLabels} from "../../types";
import {StatusBadge} from "../general/StatusBadge.tsx";
import {Button} from '../general/Button.tsx';
import {
    Edit, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import {
    useReactTable, getCoreRowModel, flexRender, getSortedRowModel,
     type PaginationState, type SortingState, createColumnHelper
} from '@tanstack/react-table';

interface ExistingShipmentsTableProps {
    shipments: Shipment[];
    onUpdateShipment: (shipment: Shipment) => void;
    pagination: PaginationState;
    setPagination: Dispatch<SetStateAction<PaginationState>>;
    sorting: SortingState;
    setSorting: Dispatch<SetStateAction<SortingState>>;
    globalFilter: string;
    setGlobalFilter: Dispatch<SetStateAction<string>>;
    pageCount: number;
}

const columnHelper = createColumnHelper<Shipment>();

const columns = [
    columnHelper.accessor('orderId', {
        header: 'Pedido #',
        cell: info => `#${info.getValue()}`
    }),
    columnHelper.accessor('shippingMethod', {
        header: 'Método',
        cell: info => ShippingMethodLabels[info.getValue()]
    }),
    columnHelper.accessor('company', {
        header: 'Detalles de Envío',
        cell: ({row}) => {
            const shipment = row.original;
            return shipment.shippingMethod === 'national_shipping' ? (
                <>
                    {shipment.company && <p>{shipment.company}</p>}
                    {shipment.trackingNumber &&
                        <p className="text-xs text-[var(--color-foreground)]/60">{shipment.trackingNumber}</p>}
                </>
            ) : (
                <>
                    {shipment.driverName && <p>{shipment.driverName}</p>}
                    {shipment.licensePlate &&
                        <p className="text-xs text-[var(--color-foreground)]/60">{shipment.licensePlate}</p>}
                </>
            )
        }
    }),
    columnHelper.accessor('order.shippingStatus', {
        header: 'Estado',
        cell: ({row}) => (
            <StatusBadge
                label={ShippingStatusLabels[row.original.order.shippingStatus]}
                colorClasses={ShippingStatusColors[row.original.order.shippingStatus]}
            />
        )
    }),
];

export const ExistingShipmentsTable = (props: ExistingShipmentsTableProps) => {
    const {
        shipments, onUpdateShipment, pagination, setPagination, sorting, setSorting, globalFilter, setGlobalFilter, pageCount
    } = props;

    const table = useReactTable({
        data: shipments,
        columns: [
            ...columns,
            columnHelper.display({
                id: 'actions',
                header: () => <div className="text-end">Acciones</div>,
                cell: ({row}) => (
                    <div className="flex justify-end">
                        <Button size="sm" variant="secondary" onClick={() => onUpdateShipment(row.original)}>
                            <Edit className="h-4 w-4"/>
                        </Button>
                    </div>
                )
            })
        ],
        state: {pagination, sorting, globalFilter},
        pageCount: pageCount,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    });

    return (
        <div className="overflow-x-auto bg-[var(--color-card)] text-[var(--color-card-foreground)] rounded-lg shadow">
            <div className="p-4">
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-foreground)]/40"/>
                    <input
                        type="text"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Buscar por # de pedido, transportadora, etc..."
                        className="w-full pl-10 pr-4 py-2 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-md focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>
            <table className="min-w-full divide-y divide-[var(--color-border)]">
                <thead className="bg-[var(--color-card)] border-b border-[var(--color-border)]">
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id} scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-[var(--color-foreground)]/60 uppercase tracking-wider">
                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-[var(--color-background)]">
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            <div
                className="flex items-center justify-between p-4 border-t border-[var(--color-border)] flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                    <span>Mostrar</span>
                    <select value={table.getState().pagination.pageSize}
                            onChange={e => {
                                table.setPageIndex(0);
                                table.setPageSize(Number(e.target.value));
                            }}
                            className="p-1 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-md">
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>{pageSize}</option>
                        ))}
                    </select>
                    <span>resultados</span>
                </div>
                <div className="text-sm text-[var(--color-foreground)]/80 hidden sm:block">
                    Página{' '}<strong>{table.getState().pagination.pageIndex + 1} de {table.getPageCount()}</strong>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}><ChevronsLeft className="h-4 w-4"/></Button>
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}><ChevronLeft className="h-4 w-4"/></Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}><ChevronRight className="h-4 w-4"/></Button>
                    <Button variant="outline" size="sm" onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}><ChevronsRight className="h-4 w-4"/></Button>
                </div>
            </div>
        </div>
    );
};