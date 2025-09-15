import {Header} from '../components/general/Header';
import {HeroSection} from '../components/home/HeroSection';
import Footer from '../components/general/Footer';
import WhatsAppButton from "../components/general/WhatsAppButton";
import {SEO} from "../components/general/SEO.tsx";

const HomePage = () => {
    return (
        <>
            <SEO
                title="Plásticos Biodegradables y Desechables en Cúcuta"
                description="Descubre la gama líder en plásticos de un solo uso en Cúcuta. Ofrecemos soluciones 100% biodegradables y tradicionales. Calidad y sostenibilidad para tu negocio."
                canonicalUrl="/"
            />
            <Header/>
            <main>
                <HeroSection/>
            </main>
            <Footer/>
            <WhatsAppButton/>
        </>
    );
};

export default HomePage;