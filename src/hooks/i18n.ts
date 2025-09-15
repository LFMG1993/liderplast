import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
    // Detecta el idioma del usuario (ej. en el navegador)
    .use(LanguageDetector)
    // Carga las traducciones desde una ruta (ej. /locales/es/translation.json)
    .use(HttpApi)
    // Pasa la instancia de i18n a react-i18next
    .use(initReactI18next)
    .init({
        fallbackLng: "es",
        supportedLngs: ['es', 'en'],
        // Configuración para el detector de idioma
        detection: {
            order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage'],
        },
        // Configuración para el backend que carga los JSON
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        },
    });

export default i18n;
