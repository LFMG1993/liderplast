import {useState, useEffect} from 'react';
import {HeroSection} from '../components/home/HeroSection';
import Footer from '../components/general/Footer';
import WhatsAppButton from "../components/general/WhatsAppButton";
import {SEO} from "../components/general/SEO.tsx";
import {TopBar} from '../components/general/TopBar.tsx'
import {FeaturedProducts} from '../components/home/FeaturedProducts.tsx';
import {shopService} from '../services/shopService.ts';
import type {Product} from '../types';

const HomePage = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const publicProducts = await shopService.getPublicProducts();
                setProducts(publicProducts);
            } catch (error) {
                console.error("Error al cargar los productos públicos:", error);
            }
        };
        fetchProducts();
    }, []);
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
                <FeaturedProducts products={products}/>
            </main>
            <Footer/>
            <WhatsAppButton/>
        </>
    );
};

export default HomePage;