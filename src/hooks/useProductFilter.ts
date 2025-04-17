import { useState, useMemo } from "react";
import products from "../data/product.json";

export function useProductFilter() {
    const [searchText, setSearchText] = useState("");
    const [selectedCats, setSelectedCats] = useState<string[]>([]);

    const allCategories = useMemo(
        () => Array.from(new Set(products.map((p) => p.category))),
        []
    );

    const toggleCategory = (key: string) => {
        setSelectedCats((prev) =>
            prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
        );
    };

    const clearFilters = () => {
        setSearchText("");
        setSelectedCats([]);
    };

    // Función para establecer una categoría inicial
    const setInitialCategory = (category: string) => {
        if (!selectedCats.includes(category)) {
            setSelectedCats([category]);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchCat =
                selectedCats.length === 0 || selectedCats.includes(p.category);
            const matchSearch =
                !searchText ||
                p.name.toLowerCase().includes(searchText.toLowerCase());
            return matchCat && matchSearch;
        });
    }, [searchText, selectedCats]);

    return {
        searchText,
        setSearchText,
        selectedCats,
        allCategories,
        toggleCategory,
        clearFilters,
        setInitialCategory,
        filteredProducts
    };
}
