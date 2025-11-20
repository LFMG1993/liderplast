import type {Category} from "../../types";
import {type Table, flexRender} from "@tanstack/react-table";

interface CategoryTableProps<TData> {
    table: Table<TData>;
}

/**
 * Componente de tabla para categorías, ahora impulsado por TanStack Table.
 * Recibe una instancia de tabla y la renderiza.
 */
export function CategoryTable({table}: CategoryTableProps<Category>) {
    return (
        <div className="overflow-x-auto bg-[var(--color-card)] rounded-lg shadow">
            <table className="min-w-full divide-y divide-[var(--color-border)]">
                <thead className="bg-[var(--color-card)] border-b border-[var(--color-border)]">
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th
                                key={header.id}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-[var(--color-foreground)]/60 uppercase tracking-wider"
                                style={{width: header.getSize() !== 150 ? header.getSize() : undefined}}
                            >
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-[var(--color-background)]">
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}
                                className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-foreground)]">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}