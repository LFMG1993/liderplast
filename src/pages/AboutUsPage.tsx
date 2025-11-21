import {SEO} from '../components/general/SEO';
import aboutUsImage from '../assets/Inicios3.avif';
import {useTranslation} from 'react-i18next';

export default function AboutUsPage() {
    const {t} = useTranslation();
    return (
        <>
            <SEO
                title={t('about.seoTitle')}
                description={t('about.seoDescription')}
                canonicalUrl="/nosotros"
            />

            <section className="py-16 sm:py-24 bg-[var(--color-background)] text-[var(--color-foreground)]">
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
                                           className="inline-block bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-semibold px-3 py-1 rounded-full mb-3">
                                         {t('about.historyTag')}
                </span>
                            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                                {t('about.title')}
                            </h1>
                            <div className="space-y-4 text-[var(--color-foreground)]/80 lg:text-lg text-justify">
                                <p>
                                    {t('about.paragraph1')}
                                </p>
                                <p>
                                    {t('about.paragraph2')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 sm:py-24 bg-[var(--color-card)] text-[var(--color-foreground)]">
                <div className="container mx-auto px-6 space-y-20">

                    {/* Sección de Misión y Visión */}
                    <h2 className="text-3xl font-bold mb-4 text-center">{t('about.philosophyTitle')}</h2>
                    <p className="text-lg text-[var(--color-foreground)]/80"></p>
                </div>

                {/* Línea de tiempo de la historia */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center py-16">
                    <div
                        className="p-6 border border-[var(--color-border)] bg-[var(--color-background)] rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                        <div className="text-4xl font-bold text-primary mb-2">2015</div>
                        <h3 className="text-xl font-semibold mb-2">{t('about.timeline1Title')}</h3>
                        <p className="text-[var(--color-foreground)]/60">{t('about.timeline1Text')}</p>
                    </div>
                    <div
                        className="p-6 border border-[var(--color-border)] bg-[var(--color-background)] rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                        <div className="text-4xl font-bold text-primary mb-2">2020</div>
                        <h3 className="text-xl font-semibold mb-2">{t('about.timeline2Title')}</h3>
                        <p className="text-[var(--color-foreground)]/60">{t('about.timeline2Text')}</p>
                    </div>
                    <div
                        className="p-6 border border-[var(--color-border)] bg-[var(--color-background)] rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                        <div className="text-4xl font-bold text-primary mb-2">Hoy</div>
                        <h3 className="text-xl font-semibold mb-2">{t('about.timeline3Title')}</h3>
                        <p className="text-[var(--color-foreground)]/60">{t('about.timeline3Text')}</p>
                    </div>
                </div>
            </section>
        </>
    );
}