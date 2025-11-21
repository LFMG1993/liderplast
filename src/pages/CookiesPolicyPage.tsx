import {SEO} from "../components/general/SEO.tsx";
import {Link} from "react-router-dom";

export default function CookiePolicyPage() {
    return (
        <>
            <SEO
                title="Política de Cookies - Distribuciones Lider Plast"
                description="Entiende cómo y por qué utilizamos cookies para mejorar tu experiencia en nuestro sitio web."
                noIndex={true}
            />
            <main className="bg-[var(--color-background)] text-[var(--color-foreground)]">
                <section className="relative py-24 bg-primary/10">
                    <div className="container mx-auto text-center px-4">
                        <h1 className="text-4xl md:text-5xl font-bold uppercase">Política de Cookies</h1>
                        <p className="mt-8 text-[var(--color-foreground)]/70">Última actualización: 20 de Noviembre de
                            2025</p>
                    </div>
                </section>

                <section className="py-8">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="space-y-12 text-[var(--color-foreground)]/80 text-lg leading-relaxed">

                            <div>
                                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">1. ¿QUÉ SON LAS
                                    COOKIES?</h2>
                                <p className="text-justify">Una cookie es un pequeño archivo de texto que un sitio web
                                    almacena en su ordenador o dispositivo móvil cuando usted visita el sitio. Esto
                                    permite que el sitio web recuerde sus acciones y preferencias (como el inicio de
                                    sesión, el idioma, el tamaño de la letra y otras preferencias de visualización)
                                    durante un período de tiempo, para que no tenga que volver a introducirlas cada vez
                                    que vuelva al sitio o navegue de una página a otra.</p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">2. ¿CÓMO
                                    UTILIZAMOS LAS COOKIES?</h2>
                                <p className="mb-4 text-justify">En <strong>Distribuciones Lider Plast</strong>,
                                    utilizamos cookies y tecnologías similares (como `localStorage`) para mejorar su
                                    experiencia y asegurar el correcto funcionamiento de nuestro e-commerce. Las
                                    clasificamos de la siguiente manera:</p>
                                <ul className="list-disc list-inside space-y-4 pl-4">
                                    <li className="text-justify">
                                        <strong>Cookies Esenciales o Estrictamente Necesarias:</strong> Son
                                        indispensables para la navegación y el uso de las funcionalidades básicas del
                                        sitio. Sin ellas, servicios como el inicio de sesión o el carrito de compras no
                                        podrían funcionar.
                                        <ul className="list-circle list-inside space-y-2 pl-8 mt-2 text-base">
                                            <li>Mantener su sesión de usuario iniciada.</li>
                                            <li>Recordar los productos que ha añadido a su carrito de compras.</li>
                                        </ul>
                                    </li>
                                    <li className="text-justify">
                                        <strong>Cookies de Funcionalidad:</strong> Nos permiten recordar las elecciones
                                        que usted ha hecho para proporcionarle una experiencia más personal.
                                        <ul className="list-circle list-inside space-y-2 pl-8 mt-2 text-base">
                                            <li>Recordar su preferencia de tema (modo claro u oscuro).</li>
                                        </ul>
                                    </li>
                                    <li className="text-justify">
                                        <strong>Cookies de Rendimiento o Analíticas:</strong> Recopilan información
                                        anónima sobre cómo los visitantes utilizan nuestro sitio web. Nos ayudan a
                                        entender qué páginas son más populares, cómo navegan los usuarios y si
                                        encuentran algún error. Esta información nos permite mejorar continuamente
                                        nuestro sitio.
                                    </li>
                                    <li className="text-justify">
                                        <strong>Cookies de Publicidad o Marketing:</strong> Pueden ser utilizadas por
                                        nosotros o por terceros (como redes sociales o socios publicitarios) para
                                        mostrarle anuncios que sean relevantes para usted. Estas cookies pueden rastrear
                                        su navegación a través de diferentes sitios web.
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">3. GESTIÓN DE
                                    COOKIES</h2>
                                <p>Usted tiene el control total sobre las cookies. Puede gestionar y/o eliminar las
                                    cookies como lo desee. La mayoría de los navegadores le permiten:</p>
                                <ul className="list-disc list-inside space-y-3 pl-4 mt-4">
                                    <li>Ver qué cookies tiene y eliminarlas individualmente.</li>
                                    <li>Bloquear las cookies de terceros.</li>
                                    <li>Bloquear las cookies de sitios específicos.</li>
                                    <li>Bloquear todas las cookies para que no se instalen.</li>
                                    <li>Eliminar todas las cookies cuando cierre el navegador.</li>
                                </ul>
                                <p className="mt-4">Tenga en cuenta que si decide bloquear o eliminar las cookies,
                                    especialmente las esenciales, es posible que algunas partes de nuestro sitio web no
                                    funcionen correctamente y su experiencia de compra se vea afectada.</p>
                                <p className="mt-4">Puede encontrar información sobre cómo gestionar las cookies en los
                                    sitios web de los navegadores más populares:</p>
                                <ul className="list-disc list-inside space-y-3 pl-4 mt-4">
                                    <li><a href="https://support.google.com/chrome/answer/95647" target="_blank"
                                           rel="noopener noreferrer" className="text-primary hover:underline">Google
                                        Chrome</a></li>
                                    <li><a
                                        href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
                                        target="_blank" rel="noopener noreferrer"
                                        className="text-primary hover:underline">Mozilla Firefox</a></li>
                                    <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                                           target="_blank" rel="noopener noreferrer"
                                           className="text-primary hover:underline">Apple Safari</a></li>
                                    <li><a
                                        href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
                                        target="_blank" rel="noopener noreferrer"
                                        className="text-primary hover:underline">Microsoft Edge</a></li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">4. MÁS
                                    INFORMACIÓN</h2>
                                <p>Para obtener más detalles sobre cómo tratamos sus datos personales, por favor
                                    consulte nuestra <strong><Link to="/privacy-policy"
                                                                   className="text-primary hover:underline">Política de
                                        Privacidad</Link>.</strong></p>
                                <p className="mt-4">Si tiene alguna pregunta sobre nuestro uso de cookies, puede
                                    contactarnos a través del correo electrónico: <strong><Link
                                        to="mailto:distribucionesliderjn@gmail.com" className="text-primary hover:underline">distribucionesliderjn@gmail.com</Link>.</strong>
                                </p>
                            </div>

                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}