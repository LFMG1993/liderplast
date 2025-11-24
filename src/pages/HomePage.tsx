import {useEffect} from 'react';
import {useQuery} from '@tanstack/react-query';
import {HeroSection} from '../components/home/HeroSection';
import Footer from '../components/general/Footer';
import WhatsAppButton from "../components/general/WhatsAppButton";
import {SEO} from "../components/general/SEO.tsx";
import {TopBar} from '../components/general/TopBar.tsx'
import {FeaturedProducts} from '../components/home/FeaturedProducts.tsx';
import {shopService} from '../services/shopService.ts';
import type {Product, PaginatedResponse} from '../types';
import {Spinner} from '../components/general/Spinner.tsx';
import {useNotification} from '../context/NotificationContext.tsx';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
    const {addNotification} = useNotification();
    const { t } = useTranslation();

    const {data: featuredProducts = [], isLoading, isError, error} = useQuery({
        queryKey: ['featuredProducts'],
        queryFn: () => shopService.getPublicProducts({featured: true, page: 1, limit: 100}),
        staleTime: 1000 * 60 * 5, // Cachea los datos por 5 minutos
        select: (data: PaginatedResponse<Product>) => data.data,
    });

    useEffect(() => {
        if (isError && error) {
            addNotification(`Error al cargar productos destacados: ${error.message}`, 'error');
        }
    }, [isError, error, addNotification]);

    return (
        <>
            {/* --- Bloque de Depuración de Variables de Entorno (Eliminar después) --- */}
            <div className="mt-12 p-4 border-2 border-dashed border-yellow-500 rounded-lg bg-yellow-500/10">
                <h3 className="font-bold text-yellow-300">Información de Depuración</h3>
                <p className="mt-2 text-sm text-yellow-200">
                    Valor de VITE_GA_MEASUREMENT_ID:
                    <code className="ml-2 px-2 py-1 bg-black/30 rounded font-mono text-white">
                        {import.meta.env.VITE_GA_MEASUREMENT_ID || 'NO DEFINIDA'}
                    </code>
                </p>
            </div>
            <TopBar/>
            <SEO
                title={t('home.seoTitle')}
                description={t('home.seoDescription')}
                canonicalUrl="/"
            />
            <main className="-mt-28 relative z-0">
                <HeroSection/>
                {isLoading ? (
                    <section className="py-16 bg-[var(--color-background)] flex flex-col justify-center items-center">
                        <Spinner/>
                        <p className="text-[var(--color-foreground)]/80 mt-4">{t('home.loadingFeatured')}</p>
                    </section>
                ) : isError ? (
                    <section className="py-16 bg-[var(--color-background)] text-center">
                        <p className="text-red-500">{t('home.errorFeatured')}</p>
                    </section>
                ) : (
                    <FeaturedProducts products={featuredProducts}/>
                )}
            </main>
            <Footer/>
            <WhatsAppButton/>
        </>
    );
};

export default HomePage;