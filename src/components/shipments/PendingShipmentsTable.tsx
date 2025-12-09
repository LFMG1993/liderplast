import {type Dispatch, type SetStateAction, useState} from "react";
import type {Order, ProductVariant} from '../../types';
import {Button} from '../general/Button.tsx';
import {
    ChevronDown, ChevronUp, Search,
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';
import {
    useReactTable, getCoreRowModel, flexRender, getSortedRowModel, getExpandedRowModel,
    type PaginationState, type SortingState, createColumnHelper
} from '@tanstack/react-table';
import React from "react";

interface PendingShipmentsTableProps {
    orders: Order[];
    onManageShipment: (order: Order) => void;
    pagination: PaginationState;
    setPagination: Dispatch<SetStateAction<PaginationState>>;
    sorting: SortingState;
    setSorting: Dispatch<SetStateAction<SortingState>>;
    globalFilter: string;
    setGlobalFilter: Dispatch<SetStateAction<string>>;
    pageCount: number;
}

const columnHelper = createColumnHelper<Order>();

const columns = [
    columnHelper.accessor('id', {
        header: '# Pedido',
        cell: info => `#${info.getValue()}`
    }),
    columnHelper.accessor('user.nombre', {
        header: 'Cliente',
    }),
    columnHelper.accessor('createdAt', {
        header: ({column}) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Fecha
                {column.getIsSorted() === 'asc' ?
                    <ArrowUp className="ml-2 h-4 w-4"/> : column.getIsSorted() === 'desc' ?
                        <ArrowDown className="ml-2 h-4 w-4"/> : <ArrowUpDown className="ml-2 h-4 w-4"/>}
            </Button>
        ),
        cell: info => new Date(info.getValue()).toLocaleDateString('es-ES'),
    }),
    columnHelper.accessor('total', {
        header: 'Total',
        cell: info => new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP'}).format(info.getValue()),
    }),
];

const getVariantAttributes = (variant: ProductVariant | null) => {
    if (!variant || !variant.variantValues) return null;
    return variant.variantValues.map(vv => vv.attributeValue.value).join(' / ');
};

export function PendingShipmentsTable(props: PendingShipmentsTableProps) {
    const {
        orders,
        onManageShipment,
        pagination,
        setPagination,
        sorting,
        setSorting,
        globalFilter,
        setGlobalFilter,
        pageCount
    } = props;

    const [expanded, setExpanded] = useState({});

    const table = useReactTable({
        data: orders,
        columns: [
            ...columns,
            columnHelper.display({
                id: 'actions',
                header: 'Acciones',
                cell: ({row}) => (
                    <Button onClick={() => onManageShipment(row.original)} size="sm">
                        Gestionar Envío
                    </Button>
                )
            }),
            columnHelper.display({
                id: 'expander',
                header: () => null,
                cell: ({row}) => (
                    <button {...{onClick: row.getToggleExpandedHandler()}}
                            className="p-1 rounded-full hover:bg-[var(--color-muted)] transition-colors">
                        {row.getIsExpanded() ? <ChevronUp className="h-5 w-5"/> : <ChevronDown className="h-5 w-5"/>}
                    </button>
                ),
            }),
        ],
        state: {pagination, sorting, globalFilter, expanded},
        pageCount: pageCount,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onExpandedChange: setExpanded,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: () => true,
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        manualExpanding: false
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
                        placeholder="Buscar por cliente o # de pedido..."
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
                                className="px-6 py-3 text-left text-xs font-medium text-[var(--color-foreground)]/60 uppercase tracking-wider"
                                style={{width: header.getSize() !== 150 ? header.getSize() : 'auto'}}>
                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                {table.getRowModel().rows.map(row => (
                    <React.Fragment key={row.id}>
                        <tr className="hover:bg-[var(--color-background)]">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                        {row.getIsExpanded() && (
                            <tr>
                                <td colSpan={table.getAllColumns().length} className="p-0">
                                    <div className="p-4 border-l-4 border-primary bg-[var(--color-muted)]">
                                        <h4 className="font-semibold mb-3">Productos del Pedido:</h4>
                                        {row.original.items && row.original.items.length > 0 ? (
                                            <ul className="space-y-3">
                                                {row.original.items.map(item => (
                                                    <li key={item.id} className="flex items-center gap-4 text-sm">
                                                        <img
                                                            src={item.variant?.imageUrl ?? item.product.imageUrl ?? '/placeholder.png'}
                                                            alt={item.product.name}
                                                            className="h-12 w-12 rounded object-cover bg-gray-200"
                                                        />
                                                        <div className="flex-grow">
                                                            <p className="font-medium">{item.product.name}
                                                                <span
                                                                    className="ml-2 text-[var(--color-foreground)]/60 font-normal">({getVariantAttributes(item.variant)})</span>
                                                            </p>
                                                            <p className="text-[var(--color-foreground)]/60">SKU: {item.variant?.sku || 'N/A'}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p>{item.quantity} x ${item.price.toLocaleString('es-CO')}</p>
                                                            <p className="font-semibold">${(item.quantity * item.price).toLocaleString('es-CO')}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-[var(--color-foreground)]/60">No se pudieron cargar los detalles de los productos.</p>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
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
}