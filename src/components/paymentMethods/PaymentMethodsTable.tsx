import type {PaymentMethod} from '../../types';
import {Pencil, Trash, QrCode} from 'lucide-react';

interface PaymentMethodsTableProps {
    methods: PaymentMethod[];
    onEdit: (method: PaymentMethod) => void;
    onDelete: (method: PaymentMethod) => void;
}

export const PaymentMethodsTable = ({methods, onEdit, onDelete}: PaymentMethodsTableProps) => {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado
                    </th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {methods.map((method) => (
                    <tr key={method.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                    {method.qrCodeUrl ? (
                                        <img className="h-10 w-10 rounded-md object-cover"
                                             src={method.qrCodeUrl}
                                             alt={method.name}/>
                                    ) : (
                                        <div
                                            className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                            <QrCode className="h-6 w-6 text-gray-400"/>
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{method.name}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">{method.instructions}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${method.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {method.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-x-4">
                                <button onClick={() => onEdit(method)} className="text-indigo-600 hover:text-indigo-900"
                                        title="Editar"><Pencil size={18}/></button>
                                <button onClick={() => onDelete(method)} className="text-red-600 hover:text-red-900"
                                        title="Eliminar"><Trash size={18}/></button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};