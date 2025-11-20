import type {Attribute, AttributeValue} from "../../types";
import {Button} from '../general/Button.tsx';
import {Plus, Edit, Trash2, X} from 'lucide-react';

interface AttributeCardProps {
    attribute: Attribute;
    onEdit: (attr: Attribute) => void;
    onDelete: (attr: Attribute) => void;
    onAddValue: (attr: Attribute) => void;
    onDeleteValue: (value: AttributeValue) => void;
}

export const AttributeCard = ({attribute, onEdit, onDelete, onAddValue, onDeleteValue}: AttributeCardProps) => (
    <div className="bg-[var(--color-card)] rounded-lg shadow p-6 flex flex-col">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-[var(--color-foreground)]">{attribute.name}</h3>
            <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => onEdit(attribute)}><Edit
                    className="h-4 w-4"/></Button>
                <Button size="sm" variant="danger" onClick={() => onDelete(attribute)}><Trash2
                    className="h-4 w-4"/></Button>
            </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 flex-grow content-start">
            {attribute.values.map(value => (
                <span key={value.id}
                      className="group relative px-3 py-1 bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border border-[var(--color-border)] rounded-full text-sm flex items-center gap-1">
                     {value.value}
                    <button onClick={() => onDeleteValue(value)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <X size={10}/>
                     </button>
                 </span>
            ))}
            <button onClick={() => onAddValue(attribute)}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 flex items-center gap-1">
                <Plus className="h-4 w-4"/> Añadir
            </button>
        </div>
    </div>
);