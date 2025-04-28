import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
    .use(initReactI18next)
    .init({
        fallbackLng: "es",
        lng: "es",
        resources: {
            es: {
                translation: {
                    inicio: "Inicio",
                    tienda: "Tienda",
                    contacto: "Contacto",
                    buscar: "Buscar",
                    // … todas tus claves …
                },
            },
            en: {
                translation: {
                    inicio: "Home",
                    tienda: "Shop",
                    contacto: "Contact",
                    buscar: "Search",
                    // … todas tus claves traducidas …
                },
            },
        },
        interpolation: { escapeValue: false },
    });

export default i18n;
