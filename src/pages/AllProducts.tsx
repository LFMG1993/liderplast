import {useProductFilter} from "../hooks/useProductFilter";
import FilterSidebar from "../Components/FilterSidebar";
import ProductCard from "../Components/ProductCard";
import {useSearchParams} from "react-router-dom";

export default function AllProducts() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialCategory = searchParams.get("category") ?? "";

    const {
        filteredProducts,
        searchText,
        setSearchText,
        selectedCats,
        allCategories,
        toggleCategory,
        clearFilters: clearLocalFilters,
    } = useProductFilter(initialCategory);

    // función que limpia tanto el estado como la URL
    const clearAllFilters = () => {
        clearLocalFilters();       // vacía selectedCats y searchText
        setSearchParams({});       // quita todos los params de la URL
    };

    // Simula la función de añadir al carrito
    const addToCart = (product: any) =>
        console.log("añadiendo al carrito:", product);

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
                                    <ProductCard product={p} onAdd={addToCart} />
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
        </section>
    );
}