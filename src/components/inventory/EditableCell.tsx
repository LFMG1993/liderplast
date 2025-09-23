import {useState, useEffect} from 'react';

interface EditableCellProps {
    initialValue: number | null;
    onSave: (newValue: number | null) => void;
    formatter?: (value: number) => string;
}

export const EditableCell = ({initialValue, onSave, formatter}: EditableCellProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleSave = () => {
        if (value !== initialValue) {
            onSave(value);
        }
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <input
                type="number"
                value={value ?? ''}
                onChange={(e) => setValue(e.target.value === '' ? null : parseFloat(e.target.value))}
                onBlur={handleSave}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="w-24 rounded-md border-gray-300 shadow-sm text-sm p-1"
                autoFocus
            />
        );
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className="cursor-pointer hover:bg-gray-100 p-1 rounded-md min-h-[34px] flex items-center"
        >
            {/* Si hay un formateador y un valor, lo usamos. Si no, mostramos el valor o N/A. */}
            {value !== null
                ? (formatter ? formatter(value) : value)
                : <span className="text-gray-400">N/A</span>}
        </div>
    );
};