import * as React from 'react';
import { useState, useEffect } from 'react';

interface FormattedNumberInputProps {
    value: number | string | null | undefined;
    id?: string;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    onChange: (value: number) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    autoFocus?: boolean;
}

const formatNumber = (num: number | string): string => {
    if (num === '' || num === null || num === undefined) return '';
    // Convierte a número, luego a string con separadores de miles para Colombia.
    return Number(num).toLocaleString('es-CO');
};

const parseNumber = (str: string): number => {
    // Elimina los puntos de los miles y convierte a número.
    return Number(str.replace(/\./g, ''));
};

export const FormattedNumberInput = (props: FormattedNumberInputProps) => {
    const { value, onChange, ...rest } = props;
    const [displayValue, setDisplayValue] = useState(formatNumber(value || ''));

    useEffect(() => {
        // Sincroniza el valor formateado si el valor externo cambia.
        setDisplayValue(formatNumber(value || ''));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        // Permite solo números y un campo vacío.
        if (/^[0-9.]*$/.test(rawValue)) {
            const numericValue = parseNumber(rawValue);
            setDisplayValue(formatNumber(numericValue));
            onChange(numericValue);
        }
    };

    return (
        <input type="text" inputMode="numeric" value={displayValue} onChange={handleChange} {...rest} />
    );
};