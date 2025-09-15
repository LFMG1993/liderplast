import { useState, useEffect, useRef } from 'react';
import { useAuthStore} from "../../store/authStore.ts";
import { User, LogOut } from 'lucide-react';

const ProfilePopover = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Cierra el popover si se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!isAuthenticated) {
        return null; // No mostrar nada si el usuario no está autenticado
    }

    return (
        <div ref={popoverRef} className="fixed bottom-4 right-4">
            {/* El panel que se muestra cuando está abierto */}
            {isOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex flex-col items-start">
                        <p className="font-bold text-gray-800 dark:text-white">{user?.nombre}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                    <hr className="my-3 border-gray-200 dark:border-gray-600" />
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 rounded-md dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                    </button>
                </div>
            )}

            {/* El botón que activa el popover */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-12 h-12 bg-primary rounded-full shadow-lg text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
                <User className="w-6 h-6" />
            </button>
        </div>
    );
};

export default ProfilePopover;