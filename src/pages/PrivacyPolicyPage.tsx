import {SEO} from "../components/general/SEO.tsx";
import {Link} from "react-router-dom";

export default function PrivacyPolicyPage() {
    return (
        <>
            <SEO
                title="Política de Privacidad - Distribuciones Lider Plast"
                description="Conoce cómo manejamos y protegemos tus datos personales en Distribuciones Lider Plast."
                noIndex={true}
            />
            <main className="bg-[var(--color-background)] text-[var(--color-foreground)]">
                <section className="relative py-24 bg-primary/10">
                    <div className="container mx-auto text-center px-4">
                        <h1 className="text-4xl md:text-5xl font-bold uppercase">Política de Privacidad</h1>
                        <p className="mt-8 text-[var(--color-foreground)]/70">Última actualización: 20 de Noviembre de 2025</p>
                    </div>
                </section>

                <section className="py-6">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="space-y-12 text-[var(--color-foreground)]/80 text-lg leading-relaxed">

                            {/* Sección 1 */}
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">1. INFORMACIÓN GENERAL</h2>
                                <p className="text-justify"><strong>Distribuciones Lider Plast</strong> (en adelante, "la Empresa") es responsable del tratamiento de los datos personales que usted (en adelante, "el Usuario") proporciona a través de nuestro sitio web y otros canales de comunicación. Esta Política de Privacidad se aplica a todos nuestros Usuarios y Clientes. Al acceder o utilizar nuestros servicios, el Usuario acepta y se compromete a cumplir con esta política.</p>
                            </div>

                            {/* Sección 2 */}
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">2. MARCO LEGAL</h2>
                                <p className="text-justify">Esta Política de Privacidad se rige por las leyes de la República de Colombia, en particular por la Ley 1581 de 2012 ("Por la cual se dictan disposiciones generales para la protección de datos personales") y sus decretos reglamentarios.</p>
                            </div>

                            {/* Sección 3 */}
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">3. DATOS PERSONALES QUE RECOPILAMOS</h2>
                                <p className="mb-4">Recopilamos los siguientes datos personales del Usuario:</p>
                                <ul className="list-disc list-inside space-y-3 pl-4">
                                    <li><strong>Datos de identificación:</strong> Nombre completo, número de identificación (Cédula, NIT, etc.), dirección de correo electrónico y número de teléfono.</li>
                                    <li><strong>Datos de envío:</strong> Dirección de entrega, ciudad, departamento y nombre del destinatario.</li>
                                    <li><strong>Datos de uso de la plataforma:</strong> Información sobre cómo el Usuario navega en nuestro sitio, como los productos que visita, las búsquedas que realiza y los artículos que añade al carrito.</li>
                                    <li><strong>Datos técnicos:</strong> Información sobre el dispositivo y el navegador del Usuario, como la dirección IP, el tipo de dispositivo y el sistema operativo.</li>
                                    <li className="text-justify"><strong>Datos de pago:</strong> Recopilamos comprobantes de pago subidos por el usuario. La información sensible de tarjetas de crédito o débito es procesada directamente por nuestras pasarelas de pago aliadas y no es almacenada en nuestros servidores.</li>
                                </ul>
                            </div>

                            {/* Sección 4 */}
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">4. FINALIDAD DEL TRATAMIENTO DE DATOS</h2>
                                <p className="mb-4">Tratamos los datos personales del Usuario con las siguientes finalidades:</p>
                                <ul className="list-disc list-inside space-y-3 pl-4">
                                    <li><strong>Prestación de los Servicios:</strong> Para procesar y completar las compras, lo que incluye la gestión de pedidos, procesamiento de pagos y coordinación de envíos.</li>
                                    <li><strong>Mejora de la Plataforma:</strong> Para analizar el uso de nuestro sitio web y mejorar su funcionamiento, personalizando la experiencia de compra y desarrollando nuevas funcionalidades.</li>
                                    <li className="text-justify"><strong>Comunicaciones Transaccionales:</strong> Para enviar notificaciones sobre el estado de sus pedidos, confirmaciones de pago, información de envío y cualquier otra comunicación esencial para la prestación del servicio.</li>
                                    <li><strong>Marketing y Promociones:</strong> Para enviar comunicaciones de marketing sobre nuestros productos, ofertas y novedades, siempre que contemos con el consentimiento previo del Usuario.</li>
                                    <li><strong>Soporte al Cliente:</strong> Para atender sus consultas, quejas o reclamos.</li>
                                    <li><strong>Cumplimiento Legal:</strong> Para cumplir con nuestras obligaciones legales, como la facturación, la prevención del fraude y la protección de la seguridad.</li>
                                </ul>
                            </div>

                            {/* Sección 5 */}
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">5. CONSENTIMIENTO DEL USUARIO</h2>
                                <p className="text-justify">Al registrarse, realizar una compra o proporcionarnos sus datos a través de nuestros formularios, el Usuario acepta y consiente el tratamiento de sus datos personales para las finalidades indicadas en esta Política. El Usuario tiene derecho a revocar su consentimiento en cualquier momento contactándonos a través de los medios indicados.</p>
                            </div>

                            {/* Sección 6 */}
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">6. DERECHOS DEL USUARIO</h2>
                                <p className="mb-4">Como titular de los datos personales, el Usuario tiene los siguientes derechos:</p>
                                <ul className="list-disc list-inside space-y-3 pl-4">
                                    <li><strong>Derecho de acceso:</strong> A conocer qué datos tenemos sobre usted y cómo se están utilizando.</li>
                                    <li><strong>Derecho de rectificación:</strong> A corregir o actualizar sus datos si son inexactos o están incompletos.</li>
                                    <li><strong>Derecho de supresión:</strong> A solicitar la eliminación de sus datos cuando ya no sean necesarios para la finalidad con la que fueron recogidos.</li>
                                    <li><strong>Derecho de oposición:</strong> A oponerse al tratamiento de sus datos en determinadas circunstancias, como el marketing directo.</li>
                                </ul>
                                <p className="mt-4">Para ejercer estos derechos, puede contactarnos a través del correo electrónico: <strong><Link to="mailto:distribucionesliderjn@gmail.com" className="text-primary hover:underline">distribucionesliderjn@gmail.com</Link>.</strong>.</p>
                            </div>

                            {/* Sección 7 */}
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">7. SEGURIDAD DE LOS DATOS</h2>
                                <p className="text-justify">En <strong>Distribuciones Lider Plast</strong>, hemos adoptado medidas de seguridad técnicas, humanas y administrativas para proteger los datos personales del Usuario contra el acceso no autorizado, la pérdida, la alteración o la divulgación.</p>
                            </div>

                            {/* Sección 8 */}
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">8. TRANSFERENCIA DE DATOS A TERCEROS</h2>
                                <p className="text-justify">Podemos compartir los datos personales del Usuario con terceros para cumplir con la prestación de nuestros servicios. Esto incluye, pero no se limita a, proveedores de servicios de tecnología (hosting, software), pasarelas de procesamiento de pagos y empresas de logística y transporte para la entrega de los pedidos. En estos casos, nos aseguramos de que los terceros cumplan con las leyes de protección de datos y adopten medidas de seguridad adecuadas.</p>
                            </div>

                            {/* Sección 9 */}
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">9. USO DE COOKIES</h2>
                                <p className="text-justify">Nuestro sitio web utiliza cookies para mejorar la experiencia de navegación y personalizar el contenido. Las cookies son pequeños archivos de texto que se almacenan en el dispositivo del Usuario. El Usuario puede configurar su navegador para que rechace las cookies o para que le notifique cuando se envíe una cookie, aunque esto podría afectar la funcionalidad de algunas partes de nuestro sitio.</p>
                            </div>

                            {/* Sección 10 */}
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">10. MODIFICACIONES A LA POLÍTICA DE PRIVACIDAD</h2>
                                <p className="text-justify">Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Cualquier cambio se publicará en esta página y entrará en vigor a partir de su publicación. Se recomienda al Usuario revisar periódicamente esta Política de Privacidad para estar informado sobre cualquier cambio.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}