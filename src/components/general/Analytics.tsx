import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

declare global {
    interface Window {
        gtag?: (command: string, ...args: any[]) => void;
        dataLayer?: unknown[];
    }
}

const GA_MEASUREMENT_ID = 'G-4NLXPVS4W2';
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;

export const Analytics = () => {
    const location = useLocation();

    // Cargar Google Analytics dinámicamente
    useEffect(() => {
        if (!GA_MEASUREMENT_ID) return;

        // Verificar si ya está cargado
        if (document.querySelector(`script[src*="googletagmanager"]`)) return;

        // Crear y cargar el script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);

        // Inicializar gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer!.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', GA_MEASUREMENT_ID);
    }, []);

    // Rastrear cambios de página
    useEffect(() => {
        if (typeof window.gtag === 'function') {
            window.gtag('config', GA_MEASUREMENT_ID, {
                page_path: location.pathname + location.search,
            });
        }
    }, [location]);

    // Cargar Microsoft Clarity
    useEffect(() => {
        if (!CLARITY_PROJECT_ID) return;
        if ((window as any).clarity) return;

        (function (c: any, l: any, a: string, r: string, i: string) {
            let t: any, y: any;
            c[a] = c[a] || function () {
                (c[a].q = c[a].q || []).push(arguments);
            };
            t = l.createElement(r);
            t.async = 1;
            t.src = "https://www.clarity.ms/tag/" + i;
            y = l.getElementsByTagName(r)[0];
            y.parentNode.insertBefore(t, y);
        })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
    }, []);

    return null;
};