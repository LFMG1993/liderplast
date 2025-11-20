import {useState, useEffect, useRef} from 'react';
import {useAuthStore} from "../../store/authStore.ts";
import {User, LogOut, Moon, Sun} from 'lucide-react';
import {useTheme} from '../../context/ThemeContext.tsx';

const ProfilePopover = () => {
    const {user, isAuthenticated, logout} = useAuthStore();
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

    const {theme, toggleTheme} = useTheme();

    return (
        <div ref={popoverRef} className="relative">
            {/* El panel que se muestra cuando está abierto */}
            {isOpen && (
                <div
                    className="absolute bottom-full right-0 mb-3 w-64 bg-[var(--color-card)] text-[var(--color-card-foreground)] rounded-lg shadow-xl border border-[var(--color-border)] p-4">
                    <div className="flex flex-col items-start">
                        <p className="font-bold">{user?.nombre}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                    <hr className="my-3 border-[var(--color-border)]"/>
                    <div className="space-y-1">
                        <button
                            onClick={toggleTheme}
                            className="flex items-center w-full px-3 py-2 text-sm text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {theme === 'light' ? <Moon className="w-4 h-4 mr-2"/> : <Sun className="w-4 h-4 mr-2"/>}
                            Modo {theme === 'light' ? 'Oscuro' : 'Claro'}
                        </button>
                        <button
                            onClick={logout}
                            className="flex items-center w-full px-3 py-2 text-sm text-left text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/50"
                        >
                            <LogOut className="w-4 h-4 mr-2"/>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            )}

            {/* El botón que activa el popover */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center w-16 h-16 rounded-lg transition-colors duration-200 focus:outline-none ${isOpen ? 'bg-primary/20 text-primary dark:bg-primary/30' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
                <div className="flex flex-col items-center">
                    <User className="w-6 h-6"/>
                    <span className="mt-1 text-xs font-medium">Perfil</span>
                </div>
            </button>
        </div>
    );
};

export default ProfilePopover;