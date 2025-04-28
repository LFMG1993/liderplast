import {useState} from "react";
import {useProductFilter} from "../hooks/useProductFilter";
import FilterSidebar from "../Components/FilterSidebar";
import ProductCard from "../Components/ProductCard";
import {useSearchParams} from "react-router-dom";
import {useCart, CartItem} from "../hooks/CardContext";
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
        <section className="products section py-5">
            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar */}
                    <FilterSidebar
                        searchText={searchText}
                        onSearch={setSearchText}
                        selectedCats={selectedCats}
                        allCategories={allCategories}
                        toggleCategory={toggleCategory}
                        clearFilters={clearAllFilters}
                    />

                    {/* Grid de productos */}
                    <div className="col-12 col-lg-9">
                        <div className="row g-4">
                            {filteredProducts.map((p) => (
                                <div
                                    className="col-6 col-md-4 col-xl-3"
                                    key={p.id}
                                >
                                    <ProductCard product={p} onAdd={() => setEditingProduct({...p, quantity: 1})}/>
                                </div>
                            ))}

                            {filteredProducts.length === 0 && (
                                <div className="col-12 text-center">
                                    <p className="text-muted">No se encontraron productos.</p>
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={clearAllFilters}
                                    >
                                        Ver todos
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal para editar cantidad / ver detalles */}
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