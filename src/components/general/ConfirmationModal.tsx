import {X} from 'lucide-react';
import {Button} from "./Button.tsx";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onConfirm: () => void;
    message: string;
    isConfirming?: boolean;
}

export function ConfirmationModal({isOpen, onClose, title, onConfirm, message, isConfirming = false}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div
                className="bg-[var(--color-card)] text-[var(--color-foreground)] rounded-lg shadow-xl w-full max-w-md p-6 relative"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-4 border-b border-[var(--color-border)]">
                    <h3 className="text-lg font-medium">{title}</h3>
                    <button onClick={onClose}
                            className="text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)]">
                        <X className="h-6 w-6"/>
                    </button>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-[var(--color-foreground)]/80">{message}</p>
                </div>
                <div className="flex justify-end gap-4 pt-6 border-t border-[var(--color-border)] mt-6">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button variant="danger" onClick={onConfirm} disabled={isConfirming}>
                        {isConfirming ? 'Eliminando...' : 'Confirmar'}
                    </Button>
                </div>
            </div>
        </div>
    );
}