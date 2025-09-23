import {X} from 'lucide-react';
import {Button} from "./Button.tsx";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onConfirm: () => void;
    message: string;
}

export function ConfirmationModal({isOpen, onClose, title, onConfirm, message}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
                 onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6"/>
                    </button>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-gray-500">{message}</p>
                </div>
                <div className="flex justify-end gap-4 pt-6 border-t mt-6">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="button" variant="danger" onClick={onConfirm}>
                        Confirmar
                    </Button>
                </div>
            </div>
        </div>
    );
}