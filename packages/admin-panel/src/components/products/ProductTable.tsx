import type {Product, ProductVariant} from '../../types';
import {Button} from '../general/Button';
import {Edit, Trash2, ImageIcon} from 'lucide-react';

interface ProductTableProps {
    products: Product[];
    onEdit: (id: number) => void;
    onDelete: (product: Product) => void;
}

export function ProductTable({products, onEdit, onDelete}: ProductTableProps) {
    // Helper para formatear la moneda local.
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(amount);
    };
    // Resuelve el problema de cómo mostrar el precio cuando hay múltiples variantes.
    const getPriceDisplay = (variants: ProductVariant[]) => {
        if (!variants || variants.length === 0) {
            return <span className="text-gray-400">N/A</span>;
        }

        if (variants.length === 1) {
            return formatCurrency(variants[0].price);
        }

        const prices = variants.map(v => v.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        return minPrice === maxPrice ? formatCurrency(minPrice) : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
    };

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variantes
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                    <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            {product.isFeatured && <span
                                className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Destacado</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getPriceDisplay(product.variants)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.variants.length}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="h-12 w-12 rounded-md object-cover"
                                />
                            ) : (
                                <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center">
                                    <ImageIcon className="h-6 w-6 text-gray-400"/>
                                </div>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="secondary" onClick={() => onEdit(product.id)}><Edit
                                    className="h-4 w-4"/></Button>
                                <Button size="sm" variant="danger" onClick={() => onDelete(product)}><Trash2
                                    className="h-4 w-4"/></Button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}