import React from "react";
import {useProductFilter} from "../hooks/useProductFilter";
import FilterSidebar from "../Components/FilterSidebar";
import ProductCard from "../Components/ProductCard";
import {useSearchParams} from "react-router-dom";

export default function AllProducts() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialCategory = searchParams.get("category");
    const {
        filteredProducts,
        searchText,
        setSearchText,
        selectedCats,
        allCategories,
        toggleCategory,
        clearFilters,
        setInitialCategory,
    } = useProductFilter();
// Establece la categoría inicial al cargar el componente
    React.useEffect(() => {
        if (initialCategory) {
            setInitialCategory(initialCategory);
        }
    }, [initialCategory, setInitialCategory]);

    const handleClearFilters = () => {
        clearFilters();
        searchParams.delete("category"); // Elimina el parámetro de la URL
        setSearchParams(searchParams); // Actualiza la URL
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
                        clearFilters={clearFilters}
                    />

                    {/* Grid de productos */}
                    <div className="col-12 col-lg-9">
                        <div className="row g-4">
                            {filteredProducts.map((p) => (
                                <div
                                    className="col-6 col-md-4 col-xl-3"
                                    key={p.id}
                                >
                                    <ProductCard/>
                                </div>
                            ))}

                            {filteredProducts.length === 0 && (
                                <div className="col-12 text-center">
                                    <p className="text-muted">No se encontraron productos.</p>
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={handleClearFilters}
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