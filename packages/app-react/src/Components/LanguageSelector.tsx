import {useTranslation} from "react-i18next";

export default function LanguageSelector() {
    const {i18n} = useTranslation();

    return (
        <div className="relative">
            <select
                className="appearance-none bg-transparent border-none text-gray-700 font-medium py-2 pl-3 pr-8 rounded-md leading-tight focus:outline-none hover:text-liderplast-primary"
                value={i18n.language}
                aria-label="Seleccionar idioma"
                onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
                <option value="es">ES</option>
                <option value="en">EN</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
            </div>
        </div>
    );
}