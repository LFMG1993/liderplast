import type {Category} from "../../types";
import {Button} from '../general/Button';
import {Edit, Trash2, ImageIcon} from 'lucide-react';

interface CategoryTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}

interface CategoryRowProps {
    category: Category;
    level: number;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}

// ✅ MEJORA: Componente recursivo para renderizar una fila y a todos sus descendientes.
const CategoryRow = ({category, level, onEdit, onDelete}: CategoryRowProps) => (
    <>
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900" style={{paddingLeft: `${level * 1.5}rem`}}>
                    {level > 0 && <span className="mr-2 text-gray-400">—</span>}
                    {category.name}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.description}</td>
            {/* Proporciona una referencia visual inmediata y mejora enormemente la UX. */}
            <td className="px-6 py-4">
                <div className="flex items-center">
                    {category.imageUrl ? (
                        <img src={category.imageUrl} alt={`Imagen de ${category.name}`}
                             className="w-12 h-12 object-cover rounded-md bg-gray-100"/>
                    ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-md">
                            <ImageIcon className="h-6 w-6 text-gray-400"/>
                        </div>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => onEdit(category)}><Edit
                        className="h-4 w-4"/></Button>
                    <Button size="sm" variant="danger" onClick={() => onDelete(category)}><Trash2 className="h-4 w-4"/></Button>
                </div>
            </td>
        </tr>
        {category.children?.map(child => (
            <CategoryRow key={child.id} category={child} level={level + 1} onEdit={onEdit} onDelete={onDelete}/>
        ))}
    </>
);

export function CategoryTable({categories, onEdit, onDelete}: CategoryTableProps) {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                        Imagen
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {categories.map(category => (
                    <CategoryRow key={category.id} category={category} level={0} onEdit={onEdit} onDelete={onDelete}/>
                ))}
                </tbody>
            </table>
        </div>
    );
}