import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { Cookie } from 'lucide-react';

export const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Comprueba si el consentimiento ya ha sido dado.
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            // Si no hay registro, muestra el banner.
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        // Guarda la preferencia del usuario y oculta el banner.
        localStorage.setItem('cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const handleReject = () => {
        // Guarda la preferencia del usuario y oculta el banner.
        localStorage.setItem('cookie_consent', 'rejected');
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-card)] text-[var(--color-foreground)] shadow-2xl border-t border-[var(--color-border)]"
            role="dialog"
            aria-live="polite"
            aria-label="Banner de consentimiento de cookies"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <Cookie className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                        <p className="text-sm text-[var(--color-foreground)]/80">
                            Utilizamos cookies para mejorar tu experiencia de navegación y analizar el tráfico del sitio. Al hacer clic en "Aceptar", aceptas nuestro uso de cookies. Puedes leer más en nuestra{' '}
                            <Link to="/cookie-policy" className="font-semibold text-primary hover:underline">Política de Cookies</Link>.
                        </p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-3 w-full sm:w-auto">
                        <Button variant="outline" onClick={handleReject} className="w-full sm:w-auto hover:bg-[var(--color-muted)]">Rechazar</Button>
                        <Button variant="primary" onClick={handleAccept} className="w-full sm:w-auto">Aceptar</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};