import {useState, useRef, useEffect} from 'react';
import type {Product} from '../../types';
import ProductCard from '../shop/ProductCard';
import {useCart} from '../../context/CardContext.tsx';
import {shopService} from "../../services/shopService.ts";
import {ProductDetailModal} from "../shop/ProductDetailModal.tsx";

interface FeaturedProductsProps {
    products: Product[];
}

export const FeaturedProducts = ({products}: FeaturedProductsProps) => {
    const {addItem} = useCart();
    const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Lógica "inteligente" que decide si añadir directamente o abrir el modal.
    const handleAddOrSelect = async (product: Product) => {
        try {
            // Obtenemos la versión completa del producto, que incluye las variantes.
            const fullProduct = await shopService.getPublicProductById(product.id);
            if (fullProduct.variants && fullProduct.variants.length === 1) {
                // Si solo hay una variante, la añadimos directamente.
                addItem(fullProduct, 1);
            } else {
                // Si hay múltiples variantes, abrimos el modal de detalles para que el usuario elija.
                setViewingProduct(fullProduct);
            }
        } catch (error) {
            console.error("Error al procesar el producto:", error);
        }
    };

    // Lógica del carrusel de auto-desplazamiento
    useEffect(() => {
        if (!scrollContainerRef.current || products.length === 0) return;

        const container = scrollContainerRef.current;
        const cardWidth = 18 * 16; // 18rem * 16px/rem (asumiendo 1rem = 16px por defecto)
        const scrollInterval = 3000; // Desplazarse cada 3 segundos

        let intervalId: NodeJS.Timeout;

        const startScrolling = () => {
            intervalId = setInterval(() => {
                const maxScrollLeft = container.scrollWidth - container.clientWidth;
                let newScrollLeft = container.scrollLeft + cardWidth;

                // Si estamos cerca del final, reiniciamos al principio
                if (newScrollLeft >= maxScrollLeft) {
                    newScrollLeft = 0;
                }
                container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
            }, scrollInterval);
        };

        // Iniciar el desplazamiento inicialmente
        startScrolling();

        // Opcional: Pausar el desplazamiento al pasar el ratón por encima
        const pauseScrolling = () => clearInterval(intervalId);
        const resumeScrolling = () => startScrolling();

        container.addEventListener('mouseenter', pauseScrolling);
        container.addEventListener('mouseleave', resumeScrolling);

        return () => {
            clearInterval(intervalId);
            container.removeEventListener('mouseenter', pauseScrolling);
            container.removeEventListener('mouseleave', resumeScrolling);
        };
    }, [products.length]); // Re-ejecutar si la lista de productos cambia

    if (products.length === 0) {
        return null; // No renderizar nada si no hay productos destacados.
    }

    return (
        <section className="py-16 bg-[var(--color-background)]">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center text-[var(--color-foreground)] mb-8">Nuestros Productos Destacados</h2>

                {/* Contenedor del Carrusel */}
                <div className="relative">
                    <div ref={scrollContainerRef} className="grid grid-flow-col auto-cols-[18rem] gap-6 overflow-x-auto pb-4 no-scrollbar scroll-snap-x-mandatory">
                        {products.map(product => ( // Usamos 'products' directamente
                            // Contenedor de cada tarjeta para controlar su tamaño en el carrusel
                            <div key={product.id} className=" scroll-snap-start">
                                <ProductCard
                                    product={product}
                                    onAdd={() => handleAddOrSelect(product)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <ProductDetailModal product={viewingProduct} onClose={() => setViewingProduct(null)}/>
        </section>
    );
};