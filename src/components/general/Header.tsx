import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import SmartLink from './SmartLink.tsx';
import {ImagesHome} from "../../utils/images.ts";
import CartDropdown from "../general/CartDropdown.tsx";
import SearchDropdown from "./SearchDropdown.tsx";
import LanguageSelector from "./LanguageSelector.tsx";
import SocialDropdown from './SocialDropdown.tsx';
import {List, X} from 'react-bootstrap-icons';

export const Header = () => {
    const {t} = useTranslation();
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    // Estado que controla si el header debe ser transparente.
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Clases dinámicas que cambian según el estado
    const headerClasses = `transition-all duration-300 ${isTransparent ? 'bg-transparent' : 'bg-white shadow-md'}`;
    const navLinkClasses = `font-medium transition-colors duration-300 ${isTransparent ? 'text-white hover:text-gray-300' : 'text-gray-700 hover:text-liderplast-primary'}`;
    const mobileMenuClasses = `md:hidden absolute top-full left-0 w-full shadow-lg transition-colors duration-300 ${isTransparent ? 'bg-gray-900/90 backdrop-blur-sm' : 'bg-white'}`;
    const mobileLinkClasses = `font-semibold py-2 ${isTransparent ? 'text-white hover:text-gray-300' : 'text-gray-800 hover:text-liderplast-primary'}`;

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
                    <CartDropdown isTransparent={isTransparent}/>
                    <LanguageSelector isTransparent={isTransparent}/>
                    <div className="h-6 border-l border-gray-400/50 mx-1"></div>
                    <SocialDropdown isTransparent={isTransparent}/>
                </div>
                {/* Botón de Menú para Móvil (Hamburger) */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2 rounded-md focus:outline-none ${isTransparent ? 'text-white' : 'text-gray-800'}`}>
                        {isMenuOpen ? <X size={30}/> : <List size={30}/>}
                    </button>
                </div>
            </div>
            {/* Menú Desplegable para Móvil */}
            {isMenuOpen && (
                <div className={mobileMenuClasses}>
                    <nav className="flex flex-col items-center space-y-4 p-6">
                        <SmartLink to="/" className={mobileLinkClasses}>Inicio</SmartLink>
                        <SmartLink to="/tienda" className={mobileLinkClasses}>Tienda</SmartLink>
                        <SmartLink to="/contacto" className={mobileLinkClasses}>Contáctanos</SmartLink>
                        <hr className="w-full border-gray-200 my-2"/>
                        <div className="flex items-center space-x-4">
                            <SearchDropdown isTransparent={isTransparent}/>
                            <CartDropdown isTransparent={isTransparent}/>
                            <LanguageSelector isTransparent={isTransparent}/>
                            <SocialDropdown isTransparent={isTransparent}/>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};