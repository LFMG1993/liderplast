import type { Provider } from '../../types';
import { Pencil, Trash2 } from 'lucide-react';

interface ProviderTableProps {
    providers: Provider[];
    onEdit: (id: number) => void;
    onDelete: (provider: Provider) => void;
}

export const ProviderTable = ({ providers, onEdit, onDelete }: ProviderTableProps) => {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Acciones</span>
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {providers.map((provider) => (
                    <tr key={provider.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                            {provider.website && <div className="text-sm text-gray-500">{provider.website}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{provider.contactName || '-'}</div>
                            <div className="text-sm text-gray-500">{provider.contactEmail || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{provider.contactPhone || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-4">
                                <button onClick={() => onEdit(provider.id)} className="text-indigo-600 hover:text-indigo-900" title="Editar">
                                    <Pencil className="h-5 w-5" />
                                </button>
                                <button onClick={() => onDelete(provider)} className="text-red-600 hover:text-red-900" title="Eliminar">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};