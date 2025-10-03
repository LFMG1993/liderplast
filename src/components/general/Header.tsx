import {useState, useEffect} from 'react';
import {useLocation, Link} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import SmartLink from './SmartLink.tsx';
import {ImagesHome} from "../../utils/images.ts";
import CartDropdown from "../general/CartDropdown.tsx";
import SearchDropdown from "./SearchDropdown.tsx";
import LanguageSelector from "./LanguageSelector.tsx";
import SocialDropdown from './SocialDropdown.tsx';
import {List, X, Search, Person, Cart, BoxArrowLeft, ChevronRight} from 'react-bootstrap-icons';
import UserMenu from "./UserMenu.tsx";
import {AuthModal} from "../auth/AuthModal.tsx";
import {useUserAuth} from "../../context/UserAuthContext.tsx";
import {useCart} from "../../context/CardContext.tsx";

export const Header = () => {
    const {t} = useTranslation();
    const {items: cartItems, isShaking: isCartShaking} = useCart();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const location = useLocation();
    const {isAuthenticated, logout} = useUserAuth();

    // Estado que controla si el header debe ser transparente.
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // NUEVOS ESTADOS: Controlan los paneles de búsqueda y carrito en móvil.
    const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
    const [isCartPanelOpen, setIsCartPanelOpen] = useState(false);

    const isHomePage = location.pathname === '/';
    const [isTransparent, setIsTransparent] = useState(isHomePage);

    useEffect(() => {
        const handleScroll = () => {
            // El header es transparente solo si estamos en la página de inicio Y en la parte superior.
            if (isHomePage) {
                setIsTransparent(window.scrollY < 50);
            } else {
                // En cualquier otra página, el header nunca es transparente.
                setIsTransparent(false);
            }
        };

        // Ejecutamos la función una vez al montar y cada vez que cambia la ruta.
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHomePage]);

    // Cierra el menú móvil cuando se cambia de ruta
    useEffect(() => {
        setIsMenuOpen(false); // Cierra el menú de navegación
        setIsSearchPanelOpen(false); // Cierra el panel de búsqueda
        setIsCartPanelOpen(false); // Cierra el panel del carrito
    }, [location.pathname]);

    // Clases dinámicas que cambian según el estado
    const headerClasses = `transition-all duration-300 ${isTransparent ? 'bg-transparent' : 'bg-white shadow-md'}`;
    const navLinkClasses = `font-medium transition-colors duration-300 ${isTransparent ? 'text-white hover:text-gray-300' : 'text-gray-700 hover:text-liderplast-primary'}`;

    return (
        <header className={`${headerClasses} relative`}>
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <SmartLink to="/" className="flex-shrink-0">
                    <img src={ImagesHome.logo} alt="Logo de Liderplast" className="h-20 w-auto"/>
                </SmartLink>
                {/* Navegación para Desktop */}
                <nav className="hidden md:flex items-center space-x-8">
                    <SmartLink to="/" className={navLinkClasses}>{t("Inicio")}</SmartLink>
                    <SmartLink to="/tienda" className={navLinkClasses}>{t("Tienda")}</SmartLink>
                    <SmartLink to="/contacto" className={navLinkClasses}>{t("Contáctanos")}</SmartLink>
                </nav>
                {/* Acciones para Desktop */}
                <div className="hidden md:flex items-center space-x-1 md:space-x-2">
                    <SearchDropdown isTransparent={isTransparent}/>
                    <UserMenu isTransparent={isTransparent} onLoginClick={() => setIsAuthModalOpen(true)}/>
                    <CartDropdown isTransparent={isTransparent}/>
                    <LanguageSelector isTransparent={isTransparent}/>
                    <div className="h-6 border-l border-gray-400/50 mx-1"></div>
                    <SocialDropdown isTransparent={isTransparent}/>
                </div>
                {/* Acciones para Móvil */}
                <div className="md:hidden flex items-center gap-2">
                    {/* Botón para abrir panel de búsqueda */}
                    <button onClick={() => setIsSearchPanelOpen(true)}
                            className={`p-2 rounded-full ${isTransparent ? 'text-white' : 'text-gray-800'}`}>
                        <Search size={24}/>
                    </button>
                    {/* Botón para abrir panel de carrito */}
                    <button
                        onClick={() => setIsCartPanelOpen(true)}
                        className={`p-2 rounded-full relative ${isTransparent ? 'text-white' : 'text-gray-800'} ${isCartShaking ? 'shake' : ''}`}
                    >
                        {cartItems.length > 0 && (
                            <span
                                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                 {cartItems.length}
                             </span>
                        )}
                        <Cart size={24}/>
                    </button>
                    {/* Botón de Menú (Hamburger) */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2 rounded-md focus:outline-none ${isTransparent ? 'text-white' : 'text-gray-800'}`}>
                        {isMenuOpen ? <X size={30}/> : <List size={30}/>}
                    </button>
                </div>
            </div>
            {/* Menú Desplegable para Móvil */}
            <MobilePanel isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} title="Menú">
                <nav className="flex-grow p-4 space-y-2">
                    <Link to="/"
                          className="block py-3 px-3 rounded-md hover:bg-gray-100 font-medium text-lg">Inicio</Link>
                    <Link to="/tienda"
                          className="block py-3 px-3 rounded-md hover:bg-gray-100 font-medium text-lg">Tienda</Link>
                    <Link to="/contacto"
                          className="block py-3 px-3 rounded-md hover:bg-gray-100 font-medium text-lg">Contáctanos</Link>
                    <hr className="my-4"/>
                    {isAuthenticated ? (
                        <>
                            <Link to="/perfil"
                                  className="flex justify-between items-center w-full text-left py-3 px-3 rounded-md hover:bg-gray-100 font-medium text-lg">
                                <div className="flex items-center gap-3">
                                    <Person size={24}/>
                                    <span>Mi Perfil</span>
                                </div>
                                <ChevronRight size={20} className="text-gray-400"/>
                            </Link>
                            <button onClick={logout}
                                    className="flex items-center gap-3 w-full text-left py-3 px-3 rounded-md hover:bg-red-50 text-red-700 font-medium text-lg">
                                <BoxArrowLeft size={24}/> Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsAuthModalOpen(true)}
                                className="flex items-center gap-3 w-full text-left py-3 px-3 rounded-md hover:bg-gray-100 font-medium text-lg">
                            <Person size={24}/> Ingresar / Registrarse
                        </button>
                    )}
                </nav>
            </MobilePanel>

            {/* Panel de Búsqueda para Móvil */}
            <MobilePanel isOpen={isSearchPanelOpen} onClose={() => setIsSearchPanelOpen(false)}
                         title="Buscar Productos">
                {/* Reutilizamos el componente SearchDropdown, pero solo su contenido interno */}
                <SearchDropdown isTransparent={false} isPanel/>
            </MobilePanel>

            {/* Panel de Carrito para Móvil */}
            <MobilePanel isOpen={isCartPanelOpen} onClose={() => setIsCartPanelOpen(false)} title="Mi Carrito">
                {/* Reutilizamos el componente CartDropdown, pero solo su contenido interno */}
                <CartDropdown isTransparent={false} isPanel/>
            </MobilePanel>
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </header>
    );
};

// Componente genérico para los paneles laterales móviles
const MobilePanel = ({isOpen, onClose, title, children}: {
    isOpen: boolean,
    onClose: () => void,
    title: string,
    children: React.ReactNode
}) => {
    return (
        <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
            {/* Panel */}
            <div
                className={`absolute top-0 right-0 flex flex-col w-full max-w-md h-full bg-white shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="font-bold text-lg">{title}</h2>
                    <button onClick={onClose} className="p-2">
                        <X size={24}/>
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};