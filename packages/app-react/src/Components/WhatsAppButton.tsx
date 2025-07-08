import React, { useEffect, useState } from 'react';

const WhatsAppButton: React.FC = () => {
    const [showBubble, setShowBubble] = useState(true);

    useEffect(() => {
        let hideTimer: NodeJS.Timeout;
        let interval: NodeJS.Timeout;

        const startCycle = () => {
            hideTimer = setTimeout(() => setShowBubble(false), 7000); // Oculta a los 7s

            interval = setInterval(() => {
                setShowBubble(true);
                hideTimer = setTimeout(() => setShowBubble(false), 7000);
            }, 15000);
        };

        startCycle();

        return () => {
            clearTimeout(hideTimer);
            clearInterval(interval);
        };
    }, []);

    const phoneNumber = '573242940464';
    const message = 'Hola! Quisiera más información 😊';
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <>
            {showBubble && (
                <div className="whatsapp-bubble" onClick={() => setShowBubble(false)}>
                    ¿Cómo podemos ayudarte?
                </div>
            )}
            <a
                href={whatsappURL}
                className="whatsapp-float"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat en WhatsApp"
            >
                <i className="bi bi-whatsapp whatsapp-icon"></i>
            </a>
        </>
    );
};

export default WhatsAppButton;
