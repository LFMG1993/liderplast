import {useState, useMemo, useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';
import type {Category, Product, Attribute} from '../types';
import {shopService} from '../services/shopService';

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
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [filterableAttributes, setFilterableAttributes] = useState<Attribute[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // El estado de los filtros se inicializa desde la URL.
    const [searchText, setSearchText] = useState<string>(searchParams.get('search') || '');
    const [selectedCats, setSelectedCats] = useState<string[]>(() => {
        const cats = searchParams.get('category');
        return cats ? cats.split(',') : [];
    });

    // Estado para los filtros de atributos
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>(() => {
        const attrs: Record<string, string[]> = {};
        for (const [key, value] of searchParams.entries()) {
            if (key !== 'search' && key !== 'category') {
                attrs[key] = value.split(',');
            }
        }
        return attrs;
    });

    // Obtiene los productos de la API una sola vez.
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const productsFromApi = await shopService.getPublicProducts();
                setAllProducts(productsFromApi);
                const [categoriesFromApi, attributesFromApi] = await Promise.all([
                    shopService.getPublicCategories(),
                    shopService.getPublicAttributes()
                ]);
                setAllCategories(categoriesFromApi);
                setFilterableAttributes(attributesFromApi);
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
        setSelectedAttributes({});
    };

    const toggleAttribute = (attributeName: string, value: string) => {
        setSelectedAttributes(prev => {
            const currentValues = prev[attributeName] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];

            if (newValues.length === 0) {
                const {[attributeName]: _, ...rest} = prev;
                return rest;
            }
            return {...prev, [attributeName]: newValues};
        });
    };

    // Función para establecer una categoría inicial
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchText) params.set('search', searchText);
        if (selectedCats.length > 0) params.set('category', selectedCats.join(','));
        Object.entries(selectedAttributes).forEach(([key, values]) => {
            params.set(key, values.join(','));
        });
        setSearchParams(params, {replace: true});
    }, [searchText, selectedCats, setSearchParams, selectedAttributes]);

    const filteredProducts = useMemo<Product[]>(() => {
        if (isLoading) return []; // Devuelve vacío mientras carga

        const terms = searchText.trim().split(/\s+/).map(normalize).filter(Boolean);

        return allProducts.filter((p) => {
            // 1. Filtro por texto de búsqueda
            if (terms.length > 0) {
                const nameNorm = normalize(p.name);
                if (!terms.every((term) => nameNorm.includes(term))) {
                    return false;
                }
            }

            // 2. Filtro por categoría (incluyendo subcategorías)
            if (selectedCats.length > 0) {
                const categoryAndDescendants = new Set<number>();
                const selectedCategoryIds = allCategories.filter(c => selectedCats.includes(c.name)).map(c => c.id);

                const addDescendants = (catId: number) => {
                    categoryAndDescendants.add(catId);
                    allCategories.filter(c => c.parentId === catId).forEach(child => addDescendants(child.id));
                };
                selectedCategoryIds.forEach(addDescendants);

                if (!categoryAndDescendants.has(p.category.id)) {
                    return false;
                }
            }

            // 3. Filtro por atributos
            const selectedAttrEntries = Object.entries(selectedAttributes);
            if (selectedAttrEntries.length > 0) {
                const matchesAllAttributes = selectedAttrEntries.every(([attrName, selectedValues]) => {
                    //  La lógica ahora busca una coincidencia en CUALQUIER variante del producto.
                    return p.variants.some(variant => {
                        // Si el filtro es por "Unidad de Medida", lo comprobamos en la propiedad directa.
                        if (attrName.toLowerCase() === 'unidad de medida') {
                            return variant.unitOfMeasure && selectedValues.includes(variant.unitOfMeasure);
                        }
                        // Para los demás atributos, usamos la lógica existente.
                        return variant.variantValues?.some(vv =>
                            vv.attributeValue.attribute.name === attrName && selectedValues.includes(vv.attributeValue.value)
                        );
                    });
                });
                if (!matchesAllAttributes) return false;
            }
            return true; // Si pasa todos los filtros, se incluye.
        });
    }, [allProducts, searchText, selectedCats, selectedAttributes, isLoading, allCategories]);

    // ✅ MEJORA: Construimos una estructura jerárquica para las categorías.
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
        selectedCats,
        toggleCategory,
        clearFilters,
        filteredProducts,
        isLoading,
        toggleAttribute,
        filterableAttributes,
        hierarchicalCategories,
        selectedAttributes
    };
}
