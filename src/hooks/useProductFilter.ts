import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../types';
import { shopService } from '../services/shopService';

 // Normaliza un texto: baja a minúsculas y elimina caracteres no alfanuméricos
const normalize = (str: string) =>
    str
        .toLowerCase()
        .normalize("NFD")             // descompone caracteres acentuados
        .replace(/\p{Diacritic}/gu, "") // elimina marcas diacríticas
        .replace(/[^a-z0-9]/g, "");     // solo letras y números

export function useProductFilter() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // El estado de los filtros se inicializa desde la URL.
    const [searchText, setSearchText] = useState<string>(searchParams.get('search') || '');
    const [selectedCats, setSelectedCats] = useState<string[]>(() => {
        const cats = searchParams.get('category');
        return cats ? cats.split(',') : [];
    });

    // Obtiene los productos de la API una sola vez.
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const productsFromApi = await shopService.getPublicProducts();
                setAllProducts(productsFromApi);
            } catch (error) {
                console.error("Error al cargar productos en el hook:", error);
                setAllProducts([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

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
        const params = new URLSearchParams();
        if (searchText) params.set('search', searchText);
        if (selectedCats.length > 0) params.set('category', selectedCats.join(','));
        setSearchParams(params, { replace: true });
    }, [searchText, selectedCats, setSearchParams]);

    const filteredProducts = useMemo<Product[]>(() => {
        if (isLoading) return []; // Devuelve vacío mientras carga

        const terms = searchText.trim().split(/\s+/).map(normalize).filter(Boolean);

        return allProducts.filter((p) => {
            const matchCat = selectedCats.length === 0 || selectedCats.includes(p.category.name);
            if (!matchCat) return false;

            if (terms.length === 0) return true;

            const nameNorm = normalize(p.name);
            return terms.every((term) => nameNorm.includes(term));
        });
    }, [allProducts, searchText, selectedCats, isLoading]);

    const allCategories = useMemo(() => {
        const cats = new Set<string>();
        allProducts.forEach((p) => cats.add(p.category.name));
        return Array.from(cats);
    }, [allProducts]);

    return {
        searchText,
        setSearchText,
        selectedCats,
        allCategories,
        toggleCategory,
        clearFilters,
        filteredProducts,
        isLoading
    };
}
