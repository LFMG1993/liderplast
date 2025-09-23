import SmartLink from "./SmartLink.tsx";
import {Link} from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Columna 1: Logo/Descripción */}
                    <div className="lg:col-span-1">
                        {/* Puedes poner tu logo aquí si quieres */}
                        <p className="text-gray-400 mt-4">
                            Soluciones sostenibles para un mundo moderno.
                        </p>
                    </div>

                    {/* Columna 2: Navegación */}
                    <div>
                        <h2 className="text-lg font-bold mb-4">Navegación</h2>
                        <ul className="space-y-2">
                            <li>
                                <SmartLink to="/tienda" className="text-gray-400 hover:text-white transition-colors">
                                    Tienda
                                </SmartLink>
                            </li>
                            <li>
                                <SmartLink to="/contacto" className="text-gray-400 hover:text-white transition-colors">
                                    Contacto
                                </SmartLink>
                            </li>
                            {/* Enlace a la sección "nosotros" de la landing page */}
                            <li>
                                <SmartLink to="/nosotros" className="text-gray-400 hover:text-white transition-colors">
                                    Nosotros
                                </SmartLink>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 3: Contacto */}
                    <div>
                        <h2 className="text-lg font-bold mb-4">Contacto</h2>
                        <ul className="space-y-2">
                            <li>
                                <SmartLink to="https://www.google.com/maps/search/?api=1&query=plasticos+el+lider" className="text-gray-400 hover:text-white transition-colors" target="_blank">
                                    Calle 6 # 4 - 18
                                </SmartLink>
                            </li>
                            <li>
                                <SmartLink to="mailto:distribucionesliderjn@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                                    distribucionesliderjn@gmail.com
                                </SmartLink>
                            </li>
                            <li>
                                <SmartLink to="https://wa.me/573242940464" className="text-gray-400 hover:text-white transition-colors" target="_blank">
                                    +57 324 294 0464
                                </SmartLink>
                            </li>
                            <li>
                                <SmartLink to="https://maps.app.goo.gl/vBNcLBfDCAioF8kS9" className="text-gray-400 hover:text-white transition-colors" target="_blank">
                                    Cúcuta - Colombia
                                </SmartLink>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 4: Políticas */}
                    <div>
                        <h2 className="text-lg font-bold mb-4">Legal</h2>
                        <ul className="space-y-2">
                            <li>
                                <SmartLink to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                                    Política de Privacidad
                                </SmartLink>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Sección de Copyright */}
                <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-500">
                    <Link to="/admin" className="text-xs text-gray-500 hover:text-white transition-colors pt-4">
                        Acceso Administrador
                    </Link>
                    <p className="mb-2">&copy; {new Date().getFullYear()} Liderplast. Todos los derechos reservados.</p>
                    <p>
                        Diseñado y Desarrollado por{' '}
                        <SmartLink to="https://molink.com.co/" className="text-gray-400 hover:text-white underline transition-colors">
                            Molink Tecnologia
                        </SmartLink>
                    </p>
                </div>
            </div>
        </footer>
    );
}