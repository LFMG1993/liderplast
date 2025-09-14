import type { Attribute} from "../../types";
import { Button } from '../general/Button';
import { Plus, Edit, Trash2 } from 'lucide-react';

// ✅ MEJORA: Componente extraído a su propio archivo para reutilización y claridad.
interface AttributeCardProps {
    attribute: Attribute;
    onEdit: (attr: Attribute) => void;
    onDelete: (attr: Attribute) => void;
    onAddValue: (attr: Attribute) => void;
}

export const AttributeCard = ({ attribute, onEdit, onDelete, onAddValue }: AttributeCardProps) => (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-gray-800">{attribute.name}</h3>
            <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => onEdit(attribute)}><Edit className="h-4 w-4" /></Button>
                <Button size="sm" variant="danger" onClick={() => onDelete(attribute)}><Trash2 className="h-4 w-4" /></Button>
            </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 flex-grow content-start">
            {attribute.values.map(value => (
                <span key={value.id} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">{value.value}</span>
            ))}
            <button onClick={() => onAddValue(attribute)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 flex items-center gap-1">
                <Plus className="h-4 w-4" /> Añadir
            </button>
        </div>
    </div>
);