import {SEO} from '../components/general/SEO';
import aboutUsImage from '../assets/inicios3.avif';

export default function AboutUsPage() {
    return (
        <>
            <SEO
                title="Nosotros - Liderplast"
                description="Conoce la historia de Liderplast, desde nuestros inicios en 2015 hasta convertirnos en un referente en soluciones plásticas sostenibles y tradicionales en Cúcuta."
                canonicalUrl="/nosotros"
            />

            <section className="py-16 sm:py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        {/* Columna de la Imagen */}
                        <div className="md:w-1/2 w-full">
                            <img
                                src={aboutUsImage}
                                alt="Instalaciones o equipo de Liderplast en sus inicios"
                                className="w-full h-auto aspect-[3/2] object-cover rounded-lg shadow-xl"
                                width="1200"
                                height="800"
                                loading="lazy"
                            />
                        </div>
                        {/* Columna del Texto */}
                        <div className="md:w-1/2 w-full">
                                       <span
                                           className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-3">
                    Nuestra Historia
                </span>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                De un sueño familiar a un referente en soluciones sostenibles
                            </h1>
                            <div className="space-y-4 text-gray-600 lg:text-lg text-justify">
                                <p>
                                    Liderplast nació en 2015 como una microempresa familiar enfocada en la distribución
                                    de productos
                                    desechables. Con esfuerzo, cercanía al cliente y visión a futuro, fuimos creciendo
                                    paso a paso hasta
                                    convertirnos en una marca reconocida en el sector.
                                </p>
                                <p>
                                    Hoy, combinamos nuestra experiencia comercial con un compromiso real por el medio
                                    ambiente,
                                    ofreciendo tanto productos biodegradables como opciones tradicionales, siempre con
                                    el respaldo de
                                    calidad y responsabilidad que nos caracteriza.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 sm:py-24 bg-white">
                <div className="container mx-auto px-6 space-y-20">

                    {/* Sección de Misión y Visión */}
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Filosofía</h2>
                        <p className="text-lg text-gray-600">
                            Más que un distribuidor, somos un aliado para tu negocio y un agente de cambio para el
                            planeta. Nuestra misión es ofrecer soluciones prácticas y de calidad que respondan a las
                            necesidades del mercado actual, sin comprometer el futuro.
                        </p>
                    </div>

                    {/* Línea de tiempo de la historia */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div
                            className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                            <div className="text-4xl font-bold text-liderplast-primary mb-2">2015</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">El Comienzo</h3>
                            <p className="text-gray-500">Nacimos como una microempresa familiar, con el sueño de
                                abastecer al mercado local con productos desechables de calidad.</p>
                        </div>
                        <div
                            className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                            <div className="text-4xl font-bold text-liderplast-primary mb-2">2020</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Crecimiento y Expansión</h3>
                            <p className="text-gray-500">Nos consolidamos en Cúcuta, ampliando nuestro catálogo y
                                nuestra base de clientes gracias a la confianza y el servicio.</p>
                        </div>
                        <div
                            className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                            <div className="text-4xl font-bold text-liderplast-primary mb-2">Hoy</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Mirando al Futuro</h3>
                            <p className="text-gray-500">Lideramos la transición hacia lo sostenible, introduciendo
                                productos biodegradables y manteniendo nuestro compromiso con la innovación.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}