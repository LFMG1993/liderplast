import {useMemo, useState} from 'react';
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

    const handleOpenDetailsModal = async (productId: number) => {
        try {
            const fullProduct = await shopService.getPublicProductById(productId);
            setViewingProduct(fullProduct);
        } catch (error) {
            console.error("Error al cargar detalles del producto:", error);
        }
    };

    // Usamos useMemo para evitar recalcular la lista en cada renderizado.
    const featuredProducts = useMemo(() => {
        return products.filter(p => p.isFeatured);
    }, [products]);

    if (featuredProducts.length === 0) {
        return null; // No renderizar nada si no hay productos destacados.
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Nuestros Productos Destacados</h2>

                {/* Contenedor del Carrusel */}
                <div className="relative">
                    {/* ✅ MEJORA: Usamos flexbox con overflow para crear el carrusel. */}
                    {/* `scroll-snap` mejora la experiencia de desplazamiento en dispositivos táctiles. */}
                    <div className="flex space-x-6 overflow-x-auto pb-4 no-scrollbar scroll-snap-x-mandatory">
                        {featuredProducts.map(product => (
                            // Contenedor de cada tarjeta para controlar su tamaño en el carrusel
                            <div key={product.id} className="flex-shrink-0 w-72 scroll-snap-start">
                                <ProductCard
                                    product={product}
                                    onAdd={() => handleAddOrSelect(product)}
                                    onViewDetails={() => handleOpenDetailsModal(product.id)}
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