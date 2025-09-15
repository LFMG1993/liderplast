import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import SmartLink from './SmartLink.tsx';
import {ImagesHome} from "../../utils/images.ts";
import CartDropdown from "../general/CartDropdown.tsx";
import SearchDropdown from "./SearchDropdown.tsx";
import LanguageSelector from "./LanguageSelector.tsx";
import SocialDropdown from './SocialDropdown.tsx';

export const Header = () => {
    const {t} = useTranslation();
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    // Estado que controla si el header debe ser transparente.
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

    // Clases dinámicas que cambian según el estado
    const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent ? 'bg-transparent' : 'bg-white shadow-md'}`;
    const navLinkClasses = `font-medium transition-colors duration-300 ${isTransparent ? 'text-white hover:text-gray-300' : 'text-gray-700 hover:text-liderplast-primary'}`;

    return (
        <header className={headerClasses}>
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* ✅ Logo siempre apunta a la raíz */}
                <SmartLink to="/" className="flex-shrink-0">
                    <img src={ImagesHome.logo} alt="Logo de Liderplast" className="h-20 w-auto"/>
                </SmartLink>

                {/* ✅ Navegación Principal (Centro) */}

                <nav className="hidden md:flex items-center space-x-8">
                    <SmartLink to="/" className={navLinkClasses}>{t("Inicio")}</SmartLink>
                    <SmartLink to="/tienda" className={navLinkClasses}>{t("Tienda")}</SmartLink>
                    {/* El enlace de contacto ahora es un ancla en la página de inicio */}
                    <SmartLink to="/contacto" className={navLinkClasses}>{t("Contáctanos")}</SmartLink>
                </nav>
                {/* ✅ Acciones y Redes Sociales (Derecha) */}
                <div className="flex items-center space-x-1 md:space-x-2">
                    <SearchDropdown isTransparent={isTransparent} />
                    <CartDropdown isTransparent={isTransparent} />
                    <LanguageSelector isTransparent={isTransparent} />
                    <div className="h-6 border-l border-gray-400/50 mx-1"></div>
                    <SocialDropdown isTransparent={isTransparent} />

                </div>
            </div>
        </header>
    );
};