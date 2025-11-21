import SmartLink from "./SmartLink.tsx";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

export default function Footer() {
    const {t} = useTranslation();

    return (
        <footer className="bg-[var(--color-card)] text-[var(--color-foreground)]">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Columna 1: Logo/Descripción */}
                    <div className="lg:col-span-1">
                        <p className="text-[var(--color-foreground)]/70 mt-4">
                            {t('footer.description')}
                        </p>
                    </div>

                    {/* Columna 2: Navegación */}
                    <div>
                        <h2 className="text-lg font-bold mb-4">{t('footer.navigationTitle')}</h2>
                        <ul className="space-y-2">
                            <li>
                                <SmartLink to="/tienda"
                                           className="text-[var(--color-foreground)]/70 hover:text-primary hover:underline transition-colors">
                                    {t('header.shop')}
                                </SmartLink>
                            </li>
                            <li>
                                <SmartLink to="/contacto"
                                           className="text-[var(--color-foreground)]/70 hover:text-primary hover:underline transition-colors">
                                    {t('header.contact')}
                                </SmartLink>
                            </li>
                            {/* Enlace a la sección "nosotros" de la landing page */}
                            <li>
                                <SmartLink to="/nosotros"
                                           className="text-[var(--color-foreground)]/70 hover:text-primary hover:underline transition-colors">
                                    Nosotros
                                </SmartLink>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 3: Contacto */}
                    <div>
                        <h2 className="text-lg font-bold mb-4">{t('footer.contactTitle')}</h2>
                        <ul className="space-y-2">
                            <li>
                                <SmartLink to="https://www.google.com/maps/search/?api=1&query=plasticos+el+lider"
                                           className="text-[var(--color-foreground)]/70 hover:text-primary hover:underline transition-colors"
                                           target="_blank">
                                    Calle 6 # 4 - 18
                                </SmartLink>
                            </li>
                            <li>
                                <SmartLink to="mailto:distribucionesliderjn@gmail.com"
                                           className="text-[var(--color-foreground)]/70 hover:text-primary hover:underline transition-colors">
                                    distribucionesliderjn@gmail.com
                                </SmartLink>
                            </li>
                            <li>
                                <SmartLink to="https://wa.me/573242940464"
                                           className="text-[var(--color-foreground)]/70 hover:text-primary hover:underline transition-colors"
                                           target="_blank">
                                    +57 324 294 0464
                                </SmartLink>
                            </li>
                            <li>
                                <SmartLink to="https://maps.app.goo.gl/vBNcLBfDCAioF8kS9"
                                           className="text-[var(--color-foreground)]/70 hover:text-primary hover:underline transition-colors"
                                           target="_blank">
                                    Cúcuta - Colombia
                                </SmartLink>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 4: Políticas */}
                    <div>
                        <h2 className="text-lg font-bold mb-4">{t('footer.legalTitle')}</h2>
                        <ul className="space-y-2">
                            <li>
                                <SmartLink to="/privacy-policy"
                                           className="text-[var(--color-foreground)]/70 hover:text-primary hover:underline transition-colors">
                                    {t('footer.privacyPolicy')}
                                </SmartLink>
                            </li>
                            <li>
                                <SmartLink to="/cookie-policy"
                                           className="text-[var(--color-foreground)]/70 hover:text-primary hover:underline transition-colors">
                                    {t('footer.cookiePolicy')}
                                </SmartLink>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Sección de Copyright */}
                <div
                    className="mt-12 border-t border-[var(--color-border)] pt-8 text-center text-[var(--color-foreground)]/60">
                    <Link to="/admin"
                          className="text-xs text-[var(--color-foreground)]/60 hover:text-primary hover:underline transition-colors pt-4"
                          target="_blank">
                        Acceso Administrador
                    </Link>
                    <p className="mb-2">&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
                    <p>
                        {t('footer.designedBy')}{' '}
                        <SmartLink to="https://molink.com.co/"
                                   className="text-[var(--color-foreground)]/70 hover:text-primary hover:underline transition-colors">
                            Molink Tecnologia
                        </SmartLink>
                    </p>
                </div>
            </div>
        </footer>
    );
}