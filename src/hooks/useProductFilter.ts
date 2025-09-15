import { useState, useMemo, useEffect } from "react";
import type { ProductStatic as Product} from "../types";
import { products } from "../data/product.ts";

 // Normaliza un texto: baja a minúsculas y elimina caracteres no alfanuméricos
const normalize = (str: string) =>
    str
        .toLowerCase()
        .normalize("NFD")             // descompone caracteres acentuados
        .replace(/\p{Diacritic}/gu, "") // elimina marcas diacríticas
        .replace(/[^a-z0-9]/g, "");     // solo letras y números

export function useProductFilter(initialCategory = "",
                                 initialSearch = "") {
    const [searchText, setSearchText] = useState<string>(initialSearch);
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
        const terms = searchText
            .trim()
            .split(/\s+/)
            .map((t) => normalize(t))
            .filter((t) => t.length > 0);

        return products.filter((p) => {
            const matchCat =
                selectedCats.length === 0 || selectedCats.includes(p.category);
            if (terms.length === 0 && matchCat) {
                return true;
            }
            // Normaliza los campos de producto
            const titleNorm = normalize(p.title);
            const nameNorm = p.name ? normalize(p.name) : "";
            const matchSearch = terms.every(
                (term) => titleNorm.includes(term) || nameNorm.includes(term)
            );
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
