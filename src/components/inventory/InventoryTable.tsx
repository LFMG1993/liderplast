import type {InventoryItem, InventoryUpdateData} from '../../types';
import {EditableCell} from './EditableCell';

interface InventoryTableProps {
    items: InventoryItem[];
    onUpdate: (variantId: number, data: InventoryUpdateData) => void;
}

export const InventoryTable = ({items, onUpdate}: InventoryTableProps) => {
    const currencyFormatter = (value: number) => `$${value.toLocaleString('es-CO')}`;

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio
                        Venta
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio
                        Descuento
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo
                        ($)
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.product?.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{item.sku}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-black">
                            <EditableCell
                                initialValue={item.price}
                                onSave={(newValue) => onUpdate(item.id, {price: newValue})}
                                formatter={currencyFormatter}
                            />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-black">
                            <EditableCell
                                initialValue={item.salePrice}
                                onSave={(newValue) => onUpdate(item.id, {salePrice: newValue})}
                                formatter={currencyFormatter}
                            />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-black">
                            <EditableCell
                                initialValue={item.stock}
                                onSave={(newValue) => onUpdate(item.id, {stock: newValue})}
                                formatter={currencyFormatter}
                            />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-black">
                            <EditableCell
                                initialValue={item.costPrice}
                                onSave={(newValue) => onUpdate(item.id, {costPrice: newValue})}
                                formatter={currencyFormatter}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};