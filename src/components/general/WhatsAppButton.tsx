import {useState, useEffect} from 'react';
import {Whatsapp} from "react-bootstrap-icons";

interface WhatsAppButtonProps {
    phoneNumber?: string;
    message?: string;
}

export default function WhatsAppButton({
                                           phoneNumber = '573242940464',
                                           message = 'Hola! Quisiera más información 😊'
                                       }: WhatsAppButtonProps) {
    const [showBubble, setShowBubble] = useState(false);
    const [showDot, setShowDot] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowBubble(true);
        }, 3000); // Muestra la burbuja después de 3 segundos

        return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
    }, []);

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    const handleClick = () => {
        setShowBubble(false);
        setShowDot(false);
    };

    return (
        <div className="fixed bottom-5 right-5 z-40 flex items-end space-x-3">
            {/* Burbuja de texto */}
            <div
                className={`transition-all duration-500 ease-in-out ${showBubble ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
            >
                <div className="bg-white text-gray-800 py-2 px-4 rounded-lg rounded-br-none shadow-lg">
                    <p className="text-sm font-medium">¿Cómo podemos ayudarte?</p>
                </div>
            </div>

            <a
                href={whatsappURL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactar a Liderplast por WhatsApp"
                className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-colors duration-300 hover:bg-[#128C7E]"
                onClick={handleClick}
            >
                <Whatsapp className="h-8 w-8"/>
                {showDot && <span
                    className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white"></span>}
            </a>
        </div>
    );
}