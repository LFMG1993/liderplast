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

const HomePage = () => {
    const {addNotification} = useNotification();

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
            <TopBar/>
            <SEO
                title="Plásticos Biodegradables y Desechables en Cúcuta"
                description="Descubre la gama líder en plásticos de un solo uso en Cúcuta. Ofrecemos soluciones 100% biodegradables y tradicionales. Calidad y sostenibilidad para tu negocio."
                canonicalUrl="/"
            />
            <main className="-mt-28 relative z-0">
                <HeroSection/>
                {isLoading ? (
                    <section className="py-16 bg-[var(--color-background)] flex flex-col justify-center items-center">
                        <Spinner/>
                        <p className="text-[var(--color-foreground)]/80 mt-4">Cargando productos destacados...</p>
                    </section>
                ) : isError ? (
                    <section className="py-16 bg-[var(--color-background)] text-center">
                        <p className="text-red-500">No se pudieron cargar los productos destacados.</p>
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