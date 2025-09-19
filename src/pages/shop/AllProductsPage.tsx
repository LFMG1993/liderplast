import {useState} from "react";
import {useProductFilter} from "../../hooks/useProductFilter.ts";
import FilterSidebar from "../../components/shop/FilterSidebar.tsx";
import ProductCard from "../../components/shop/ProductCard.tsx";
import {useCart} from "../../context/CardContext.tsx";
import type {Product} from "../../types";
import {SEO} from "../../components/general/SEO.tsx";
import {ProductDetailModal} from "../../components/shop/ProductDetailModal.tsx";
import {shopService} from '../../services/shopService.ts';


export default function AllProductsPage() {
    const {
        filteredProducts,
        searchText,
        setSearchText,
        selectedCats,
        allCategories,
        toggleCategory,
        clearFilters,
        isLoading,
    } = useProductFilter();

    const {addItem} = useCart();
    const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

    //  Nueva función "inteligente" que decide la acción a tomar.
    const handleAddOrSelect = async (product: Product) => {
        try {
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

    return (
        <>
            <SEO
                title={`Tienda - ${searchText || selectedCats.join(', ') || 'Todos los Productos'}`}
                description="Explora nuestro catálogo completo de productos desechables y biodegradables."
                canonicalUrl="/tienda"
            />
            <section className="py-8">
                {/* ANTES: container-fluid */}
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* ANTES: row */}
                    <div className="flex flex-col md:flex-row gap-8">
                        <FilterSidebar
                            searchText={searchText}
                            onSearch={setSearchText}
                            selectedCats={selectedCats}
                            allCategories={allCategories}
                            toggleCategory={toggleCategory}
                            clearFilters={clearFilters}
                        />

                        <main className="w-full md:w-3/4 lg:w-4/5">
                            {isLoading ? (
                                <div className="text-center py-16">Cargando productos...</div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredProducts.map((p) => (
                                        <ProductCard
                                            key={p.id}
                                            product={p}
                                            onAdd={() => handleAddOrSelect(p)}
                                            onViewDetails={() => handleOpenDetailsModal(p.id)}
                                        />
                                    ))}
                                </div>
                            )}

                            {!isLoading && filteredProducts.length === 0 && (
                                <div className="col-span-full text-center py-16">
                                    <p className="text-gray-500 text-xl mb-4">No se encontraron productos.</p>
                                    <button
                                        className="border border-liderplast-primary text-liderplast-primary px-6 py-2 rounded-md hover:bg-liderplast-primary hover:text-white transition-colors"
                                        onClick={clearFilters}
                                    >
                                        Ver todos los productos
                                    </button>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
                <ProductDetailModal
                    product={viewingProduct}
                    onClose={() => setViewingProduct(null)}
                />
            </section>
        </>
    );
}