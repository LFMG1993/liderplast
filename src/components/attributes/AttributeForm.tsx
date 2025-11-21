import * as React from "react";
import {Button} from '../general/Button.tsx';
import {X} from 'lucide-react';

// El modal de formulario ahora es un componente genérico y reutilizable.
interface FormModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    children: React.ReactNode;
    isSubmitting: boolean;
}

export const AttributeForm = ({title, isOpen, onClose, onSubmit, children, isSubmitting}: FormModalProps) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-[var(--color-card)] rounded-lg shadow-xl w-full max-w-md text-[var(--color-foreground)]">
                <form onSubmit={onSubmit}>
                    <div className="flex justify-between items-center p-4 border-b border-[var(--color-border)]">
                        <h3 className="text-lg font-medium">{title}</h3>
                        <button type="button" onClick={onClose}>
                            <X className="h-6 w-6 text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)]"/>
                        </button>
                    </div>
                    <div className="p-6">{children}</div>
                    <div className="flex justify-end gap-4 p-4 border-t border-[var(--color-border)]">
                        <Button type="button" variant="secondary" onClick={onClose}
                                disabled={isSubmitting}>Cancelar</Button>
                        <Button type="submit"
                                disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};