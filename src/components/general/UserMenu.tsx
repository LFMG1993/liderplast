import {Fragment} from 'react';
import {Menu, Transition} from '@headlessui/react';
import {User, LogIn, LogOut, ChevronDown} from 'lucide-react';
import {useUserAuth} from '../../context/UserAuthContext.tsx';
import {Link} from 'react-router-dom';

interface UserMenuProps {
    isTransparent: boolean;
    onLoginClick: () => void;
}

export default function UserMenu({isTransparent, onLoginClick}: UserMenuProps) {
    const {isAuthenticated, customer, logout} = useUserAuth();

    const buttonBaseClasses = "flex items-center gap-2 p-2 rounded-full transition-colors";
    const buttonClasses = isTransparent
        ? `${buttonBaseClasses} text-white hover:bg-white/20`
        : `${buttonBaseClasses} text-[var(--color-foreground)] hover:bg-[var(--color-muted)]`;

    if (!isAuthenticated) {
        return (
            <button onClick={onLoginClick} className={buttonClasses} title="Iniciar Sesión o Registrarse">
                <LogIn className="h-5 w-5"/>
                <span className="hidden lg:inline text-sm font-medium">Ingresar</span>
            </button>
        );
    }

    // Si está autenticado, muestra un menú desplegable.
    return (
        <Menu as="div" className="relative">
            <Menu.Button className={buttonClasses}>
                <div
                    className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {/* Muestra la inicial del nombre del cliente */}
                    {customer?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:inline text-sm font-medium">{customer?.name}</span>
                <ChevronDown className="h-4 w-4 opacity-70 hidden lg:inline"/>
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className="absolute right-0 mt-2 w-56 origin-top-right bg-[var(--color-card)] text-[var(--color-foreground)] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-1">
                        <Menu.Item>
                            {({active}) => (
                                <Link to="/perfil"
                                      className={`${active ? 'bg-[var(--color-muted)]' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                    <User className="mr-2 h-5 w-5" aria-hidden="true"/>
                                    Mi Perfil
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({active}) => (
                                <button onClick={logout}
                                        className={`${active ? 'bg-red-500/10 text-red-500' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                    <LogOut className="mr-2 h-5 w-5" aria-hidden="true"/>
                                    Cerrar Sesión
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}