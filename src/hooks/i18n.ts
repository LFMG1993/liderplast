import i18n from "i18next";
import {initReactI18next} from "react-i18next";
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
        // --- CONFIGURACIÓN PRINCIPAL ---
        lng: "es",
        fallbackLng: "es",
        supportedLngs: ['es', 'en'],
        debug: process.env.NODE_ENV === 'development', // Muestra logs solo en desarrollo

        interpolation: {
            escapeValue: false, // React ya se encarga de la seguridad (XSS)
        },

        // Configuración para el detector de idioma
        detection: {
            // 1. Revisa localStorage, 2. Revisa el idioma del navegador
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },

        // Configuración para el backend que carga los JSON
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        },
    });

export default i18n;
