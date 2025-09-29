import {useState, Fragment} from "react";
import {useProductFilter} from "../../hooks/useProductFilter.ts";
import FilterSidebar from "../../components/shop/FilterSidebar.tsx";
import ProductCard from "../../components/shop/ProductCard.tsx";
import {useCart} from "../../context/CardContext.tsx";
import type {Product} from "../../types";
import {SEO} from "../../components/general/SEO.tsx";
import {ProductDetailModal} from "../../components/shop/ProductDetailModal.tsx";
import {shopService} from '../../services/shopService.ts';
import {Spinner} from "../../components/general/Spinner.tsx";
import {Dialog, Transition} from '@headlessui/react';
import {Filter, X} from 'lucide-react';

export default function AllProductsPage() {
    const {
        filteredProducts,
        searchText,
        setSearchText,
        selectedCats,
        toggleCategory,
        clearFilters,
        isLoading,
        hierarchicalCategories,
        filterableAttributes,
        selectedAttributes,
        toggleAttribute,
    } = useProductFilter();

    const {addItem} = useCart();
    const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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
                    {/* Botón de Filtros para Móvil */}
                    <div className="md:hidden mb-4">
                        <button
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <Filter className="h-5 w-5"/>
                            Filtros
                        </button>
                    </div>

                    {/* Off-canvas para Filtros en Móvil */}
                    <Transition.Root show={isMobileFilterOpen} as={Fragment}>
                        <Dialog as="div" className="relative z-40 md:hidden" onClose={setIsMobileFilterOpen}>
                            <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300"
                                              enterFrom="opacity-0" enterTo="opacity-100"
                                              leave="transition-opacity ease-linear duration-300"
                                              leaveFrom="opacity-100" leaveTo="opacity-0">
                                <div className="fixed inset-0 bg-black bg-opacity-25"/>
                            </Transition.Child>
                            <div className="fixed inset-0 z-40 flex">
                                <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform"
                                                  enterFrom="-translate-x-full" enterTo="translate-x-0"
                                                  leave="transition ease-in-out duration-300 transform"
                                                  leaveFrom="translate-x-0" leaveTo="-translate-x-full">
                                    <Dialog.Panel
                                        className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                                        <div className="flex px-4 pt-5 pb-2 justify-end">
                                            <button type="button"
                                                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                                                    onClick={() => setIsMobileFilterOpen(false)}>
                                                <X className="h-6 w-6" aria-hidden="true"/>
                                            </button>
                                        </div>
                                        <FilterSidebar searchText={searchText} onSearch={setSearchText}
                                                       selectedCats={selectedCats} toggleCategory={toggleCategory}
                                                       clearFilters={clearFilters}
                                                       hierarchicalCategories={hierarchicalCategories}
                                                       filterableAttributes={filterableAttributes}
                                                       selectedAttributes={selectedAttributes}
                                                       toggleAttribute={toggleAttribute}/>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </Dialog>
                    </Transition.Root>
                    {/* ANTES: row */}
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar para Desktop */}
                        <aside
                            className="hidden md:block w-full md:w-1/4 lg:w-1/5 md:sticky top-24 self-start max-h-[calc(100vh-6rem)]">
                            <FilterSidebar
                                searchText={searchText}
                                onSearch={setSearchText}
                                selectedCats={selectedCats}
                                toggleCategory={toggleCategory}
                                clearFilters={clearFilters}
                                hierarchicalCategories={hierarchicalCategories}
                                filterableAttributes={filterableAttributes}
                                selectedAttributes={selectedAttributes}
                                toggleAttribute={toggleAttribute}
                            />
                        </aside>

                        <main className="w-full md:w-3/4 lg:w-4/5">
                            {isLoading ? (
                                <div className="flex justify-center items-center py-16">
                                    <Spinner/>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
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