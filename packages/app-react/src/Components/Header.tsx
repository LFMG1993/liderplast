import SmartLink from "./SmartLink.tsx";
import {useTranslation} from "react-i18next";

import {ImagesHome} from "../utils/images.ts";
import CardDropdown from "./CartDropdown.tsx";
// Asumimos que tienes componentes para estos, si no, los creamos abajo
import SearchDropdown from "./SearchDropdown.tsx";
import LanguageSelector from "./LanguageSelector.tsx";

export default function Header() {
    const {t} = useTranslation();
    const navLinkClasses = "text-gray-700 font-medium hover:text-liderplast-primary transition-colors duration-300";
    return (
        // Usamos 'sticky' para que se quede fijo al hacer scroll, con fondo y sombra para visibilidad.
        <header className="sticky top-0 z-50 bg-white shadow-md transition-all duration-300">
            <div className="container mx-auto px-6 py-2 flex justify-between items-center">
                {/* Logo */}
                <SmartLink to="/" className="flex-shrink-0">
                    <img src={ImagesHome.logo} alt="Logo de Liderplast" className="h-20 w-auto"/>
                </SmartLink>

                {/* Navegación Principal (Centro) */}
                <nav className="hidden md:flex items-center space-x-8">
                    <SmartLink to="/" className={navLinkClasses}>
                        {t("Inicio")}
                    </SmartLink>
                    <SmartLink to="/all-products" className={navLinkClasses}>
                        {t("Tienda")}
                    </SmartLink>
                    <SmartLink to="/contact" className={navLinkClasses}>
                        {t("Contáctanos")}
                    </SmartLink>
                </nav>

                {/* Acciones y Redes Sociales (Derecha) */}
                <div className="flex items-center space-x-3">
                    <div className="h-8 border-l border-gray-300 mx-2 hidden lg:block"></div>
                    <SearchDropdown/>
                    <CardDropdown/>
                    <LanguageSelector/>
                </div>
            </div>
        </header>
    );
}
