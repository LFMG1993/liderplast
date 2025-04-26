import { useState, useMemo, useEffect } from "react";
import type { Product } from "../types.ts";
import { products } from "../data/product.ts";

export function useProductFilter(initialCategory = "") {
    const [searchText, setSearchText] = useState("");
    const [selectedCats, setSelectedCats] = useState<string[]>(
        initialCategory ? [initialCategory] : []
    );

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
    useEffect(() => {
        if (initialCategory) {
            setSelectedCats([initialCategory]);
        }
    }, [initialCategory]);

    const filteredProducts = useMemo<Product[]>(() => {
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
        filteredProducts
    };
}
