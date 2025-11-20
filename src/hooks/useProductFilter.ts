import {useState, useMemo, useEffect, useCallback} from 'react';
import {useSearchParams} from 'react-router-dom';
import type {Category, Attribute} from '../types';
import {shopService} from '../services/shopService';
import {useQuery} from "@tanstack/react-query";

export function useProductFilter() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Estados de los filtros
    const [searchText, setSearchText] = useState<string>(searchParams.get('search') || '');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(() => {
        const cats = searchParams.get('categories');
        return cats ? cats.split(',').map(Number) : [];
    });

    // Estado para los filtros de atributos
    const [selectedAttributes, setSelectedAttributes] = useState<Record<number, number[]>>(() => {
        const attrs: Record<number, number[]> = {};
        for (const [key, value] of searchParams.entries()) {
            // Buscamos claves que sigan el patrón 'attr_ID'
            if (key.startsWith('attr_')) {
                const attrId = parseInt(key.split('_')[1], 10);
                if (!isNaN(attrId)) {
                    attrs[attrId] = value.split(',').map(Number);
                }
            }
        }
        return attrs;
    });

    // --- CARGA DE DATOS PARA CONSTRUIR LOS FILTROS (CATEGORÍAS Y ATRIBUTOS) ---
    const {data: allCategories = [], isLoading: isLoadingCategories} = useQuery<Category[], Error>({
        queryKey: ['allCategoriesForFilter'],
        queryFn: shopService.getPublicCategories,
        staleTime: Infinity, // Estos datos rara vez cambian, los cacheamos indefinidamente.
    });

    const {data: filterableAttributes = [], isLoading: isLoadingAttributes} = useQuery<Attribute[], Error>({
        queryKey: ['allAttributesForFilter'],
        queryFn: shopService.getPublicAttributes,
        staleTime: Infinity,
    });

    // --- FUNCIONES PARA MANIPULAR LOS FILTROS ---
    const toggleCategory = useCallback((categoryId: number) => {
        setSelectedCategoryIds((prev) =>
            prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
        );
    }, []);

    const clearFilters = useCallback(() => {
        setSearchText("");
        setSelectedCategoryIds([]);
        setSelectedAttributes({});
    }, []);

    const toggleAttribute = useCallback((attributeId: number, valueId: number) => {
        setSelectedAttributes(prev => {
            const currentValues = prev[attributeId] || []; // No hay error, la clave es un número
            const newValues = currentValues.includes(valueId) // No hay error, buscamos un número en un array de números
                ? currentValues.filter((v) => v !== valueId)
                : [...currentValues, valueId];

            if (newValues.length === 0) {
                const {[attributeId]: _, ...rest} = prev;
                return rest;
            }
            return {...prev, [attributeId]: newValues};
        });
    }, []);

    // Si la URL cambia (ej. desde el SearchDropdown del Header), actualiza el estado interno del hook.
    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        if (urlSearch !== searchText) {
            setSearchText(urlSearch);
        }
        // La dependencia es solo searchParams para reaccionar a cambios externos.
    }, [searchParams]);

    // --- SINCRONIZACIÓN CON LA URL ---
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchText) params.set('search', searchText);
        if (selectedCategoryIds.length > 0) params.set('categories', selectedCategoryIds.join(','));
        Object.entries(selectedAttributes).forEach(([key, values]) => {
            if (values.length > 0) {
                params.set(`attr_${key}`, values.join(','));
            }
        });
        setSearchParams(params, {replace: true});
    }, [searchText, selectedCategoryIds, selectedAttributes, setSearchParams]);

    // Construimos una estructura jerárquica para las categorías para renderizar el filtro correctamente.
    const hierarchicalCategories = useMemo(() => {
        const categoryMap = new Map(allCategories.map(c => [c.id, {...c, children: [] as Category[]}]));
        const tree: (Category & { children: Category[] })[] = [];
        allCategories.forEach(c => {
            if (c.parentId && categoryMap.has(c.parentId)) {
                categoryMap.get(c.parentId)?.children.push(c as Category & { children: Category[] });
            } else {
                tree.push(c as Category & { children: Category[] });
            }
        });
        return tree;
    }, [allCategories]);

    return {
        searchText,
        setSearchText,
        selectedCategoryIds,
        toggleCategory,
        clearFilters,
        isLoading: isLoadingCategories || isLoadingAttributes,
        toggleAttribute,
        filterableAttributes,
        hierarchicalCategories,
        selectedAttributes
    };
}
