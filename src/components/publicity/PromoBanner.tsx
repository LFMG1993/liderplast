interface PromoBannerProps {
    text: string;
}

/**
 * Un banner promocional con texto que se desplaza continuamente.
 * Ideal para anuncios, ofertas o noticias importantes.
 */
export const PromoBanner = ({text}: PromoBannerProps) => {
    return (
        // Contenedor principal que oculta el texto que se desborda
        <div className="background-lider text-white h-6 flex items-center overflow-hidden select-none">
            {/* Contenedor animado que se mueve de derecha a izquierda */}
            <div className="flex w-full justify-center md:w-max animate-marquee-infinite">
                {/* El primer texto siempre es visible */}
                <span className="mx-8 text-base font-semibold flex-shrink-0">{text}</span>
                {/* El segundo texto solo aparece en pantallas grandes para crear el bucle */}
                <span className="mx-8 text-base font-semibold flex-shrink-0 hidden md:inline-block" aria-hidden="true">{text}</span>
            </div>
        </div>
    );
};