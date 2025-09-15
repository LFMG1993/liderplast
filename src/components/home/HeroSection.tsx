import {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
// Importa las imágenes del carrusel
import car1 from '../../assets/carrousel/lider11.avif';
import car2 from '../../assets/carrousel/lider12.avif';
import car3 from '../../assets/carrousel/lider13.avif';

const carouselImages = [car1, car2, car3];

export const HeroSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % carouselImages.length);
        }, 5000);

        // Limpieza del intervalo al desmontar el componente
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="inicio" className="relative h-screen w-full overflow-hidden">
            <div className="absolute inset-0 z-0">
                {carouselImages.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${currentIndex === index ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${image})`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 animate-fade-in-down">
                    Soluciones en Plásticos Sostenibles
                </h1>
                <p className="text-lg md:text-xl max-w-3xl mb-8 animate-fade-in-up">
                    En Liderplast, impulsamos soluciones biodegradables y tradicionales con un enfoque responsable,
                    alineado con las exigencias del presente y el compromiso con el futuro.
                </p>
                <Link to="/tienda"
                   className="background-lider text-white font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 animate-bounce-slow">
                    Ver Productos
                </Link>
            </div>
        </section>
    );
};