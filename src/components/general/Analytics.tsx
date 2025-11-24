import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Declara la función gtag en el ámbito global para que TypeScript la reconozca.
declare global {
    interface Window {
        gtag?: (command: string, action: string, config: Record<string, unknown>) => void;
    }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;

export const Analytics = () => {
    const location = useLocation();

    // Efecto para rastrear las vistas de página en una SPA
    useEffect(() => {
        // Solo se ejecuta si estamos en producción y tenemos un ID de GA
        if (import.meta.env.PROD && GA_MEASUREMENT_ID && typeof window.gtag === 'function') {
            window.gtag('config', GA_MEASUREMENT_ID, {
                page_path: location.pathname + location.search,
            });
        }
    }, [location]);

    // No renderizar nada en desarrollo o si no hay IDs
    if (!GA_MEASUREMENT_ID && !CLARITY_PROJECT_ID) {
        return null;
    }

    return (
        <Helmet>
            {/* --- Google Analytics 4 --- */}
            {GA_MEASUREMENT_ID && (
                <>
                    <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}></script>
                    <script>
                        {`
                             window.dataLayer = window.dataLayer || [];
                             function gtag(){dataLayer.push(arguments);}
                             gtag('js', new Date());
                             if (import.meta.env.PROD) {
                                 gtag('config', '${GA_MEASUREMENT_ID}');
                              }
                         `}
                    </script>
                </>
            )}

            {/* --- Microsoft Clarity --- */}
            {CLARITY_PROJECT_ID && (
                <script>
                    {`
                        (function(c,l,a,r,i,t,y){
                            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
                    `}
                </script>
            )}
        </Helmet>
    );
};