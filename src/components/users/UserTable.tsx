import {useState, type Dispatch, type SetStateAction} from "react";
import type {User} from '../../types';
import {Button} from '../general/Button.tsx';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    flexRender,
    type ColumnDef, type PaginationState,
} from '@tanstack/react-table';
import {Edit, Trash2, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from 'lucide-react';

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    pagination: PaginationState;
    setPagination: Dispatch<SetStateAction<PaginationState>>;
    pageCount: number;
}

const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'nombre',
        header: 'Nombre',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'rol',
        header: 'Rol',
        cell: ({row}) => (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                row.original.rol === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
                 {row.original.rol}
             </span>
        ),
    },
];

export function UserTable({users, onEdit, onDelete, pagination, setPagination, pageCount}: UserTableProps) {
    const [globalFilter, setGlobalFilter] = useState('');

    const table = useReactTable({
        data: users,
        columns: [
            ...columns,
            {
                id: 'actions',
                header: 'Acciones',
                cell: ({row}) => (
                    <div className="flex justify-end space-x-2">
                        <Button variant="secondary" size="sm" onClick={() => onEdit(row.original)}><Edit
                            className="h-4 w-4"/></Button>
                        <Button variant="danger" size="sm" onClick={() => onDelete(row.original)}><Trash2
                            className="h-4 w-4"/></Button>
                    </div>
                ),
            },
        ],
        state: {
            globalFilter,
            pagination,
        },
        pageCount: pageCount,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true,
    });

    return (
        <div className="bg-[var(--color-card)] text-[var(--color-card-foreground)] rounded-lg shadow">
            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                    <input
                        type="text"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Buscar usuario..."
                        className="w-full pl-10 pr-4 py-2 bg-transparent border border-[var(--color-border)] rounded-md focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--color-border)]">
                    <thead className="bg-gray-50 dark:bg-white/5">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
                {table.getRowModel().rows.length === 0 && (
                    <div className="text-center p-8 text-gray-500 dark:text-gray-400">No se encontraron usuarios.</div>
                )}
            </div>
            {/* Controles de Paginación */}
            <div className="flex items-center justify-between p-4 border-t border-[var(--color-border)]">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    Página{' '}
                    <strong>
                        {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                    </strong>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}>
                        <ChevronsLeft className="h-4 w-4"/>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}>
                        <ChevronLeft className="h-4 w-4"/>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}>
                        <ChevronRight className="h-4 w-4"/>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}>
                        <ChevronsRight className="h-4 w-4"/>
                    </Button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span>Ir a la página:</span>
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                        className="w-16 p-1 bg-transparent border border-[var(--color-border)] rounded-md"
                    />
                </div>
            </div>
        </div>
    );
}