// /packages/app-react/src/Components/WhatsAppButton.tsx (VERSIÓN FINAL)

import {useState, useEffect} from 'react';

export default function WhatsAppButton() {
    const [showBubble, setShowBubble] = useState(false);

    // Efecto para mostrar la burbuja solo una vez, 3 segundos después de que el componente se monte.
    // Esto es menos intrusivo para el usuario que un ciclo infinito.
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowBubble(true);
        }, 3000); // Muestra la burbuja después de 3 segundos

        return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
    }, []);

    const phoneNumber = '573242940464';
    const message = 'Hola! Quisiera más información 😊';
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <div className="fixed bottom-5 right-5 z-40 flex items-end space-x-3">
            {/* Burbuja de texto */}
            <div
                // Usamos transiciones de Tailwind para una aparición y desaparición suave
                className={`transition-all duration-300 ease-in-out ${showBubble ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
            >
                <div className="bg-white text-gray-800 py-2 px-4 rounded-lg rounded-br-none shadow-lg">
                    <p className="text-sm font-medium">¿Cómo podemos ayudarte?</p>
                </div>
            </div>

            {/* Botón principal de WhatsApp */}
            <a
                href={whatsappURL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactar a Liderplast por WhatsApp"
                className="relative bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-colors duration-300"
                onClick={() => setShowBubble(false)} // Oculta la burbuja al hacer clic
            >
                <i className="bi bi-whatsapp text-2xl leading-none"></i>
                {/* Punto de notificación */}
                <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white"></span>
            </a>
        </div>
    );
}