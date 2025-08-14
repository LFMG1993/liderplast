import {useState} from "react";
import {useProductFilter} from "../hooks/useProductFilter.ts";
import FilterSidebar from "../Components/FilterSidebar.tsx";
import ProductCard from "../Components/ProductCard.tsx";
import {useSearchParams} from "react-router-dom";
import {useCart, CartItem} from "../hooks/CardContext.tsx";
import EditCartItemModal from "../Modals/EditCartModal.tsx";


export default function AllProducts() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialCategory = searchParams.get("category") ?? "";
    const initialSearch = searchParams.get("search") ?? "";
    const {
        filteredProducts,
        searchText,
        setSearchText,
        selectedCats,
        allCategories,
        toggleCategory,
        clearFilters: clearLocalFilters,
    } = useProductFilter(initialCategory, initialSearch);

    // función que limpia tanto el estado como la URL
    const clearAllFilters = () => {
        clearLocalFilters();       // vacía selectedCats y searchText
        setSearchParams({});       // quita todos los params de la URL
    };

    // 2. extraes addItem del context
    const {updateItemQuantity} = useCart();

    const [editingProduct, setEditingProduct] = useState<CartItem | null>(null);

    return (
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
                        clearFilters={clearAllFilters}
                    />

                    <main className="w-full md:w-3/4 lg:w-4/5">
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    onAdd={() => setEditingProduct({...p, quantity: 1})}
                                />
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="col-span-full text-center py-16">
                                <p className="text-gray-500 text-xl mb-4">No se encontraron productos.</p>
                                {/* ANTES: btn btn-outline-primary */}
                                <button
                                    className="border border-liderplast-primary text-liderplast-primary px-6 py-2 rounded-md hover:bg-liderplast-primary hover:text-white transition-colors"
                                    onClick={clearAllFilters}
                                >
                                    Ver todos los productos
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
            <EditCartItemModal
                show={!!editingProduct}
                item={editingProduct}
                onClose={() => setEditingProduct(null)}
                onSave={(product, newQty) => {
                    updateItemQuantity(product, newQty);
                    setEditingProduct(null);
                }}
            />
        </section>
    );
}