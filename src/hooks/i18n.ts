import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
    // Detecta el idioma del usuario
    .use(LanguageDetector)
    .use(HttpApi)
    .use(initReactI18next)
    .init({

        // --- CONFIGURACIÓN PRINCIPAL ---
        lng: "es",
        fallbackLng: "es",
        supportedLngs: ['es', 'en'],
        debug: process.env.NODE_ENV === 'development', // Muestra logs solo en desarrollo

        interpolation: {
            escapeValue: false,
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
