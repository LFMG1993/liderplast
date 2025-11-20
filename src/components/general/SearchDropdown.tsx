import {Fragment, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Menu, Transition} from "@headlessui/react";
import {Search} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import {shopService} from "../../services/shopService.ts";
import type {PaginatedResponse, Product} from "../../types";
import {ImageIcon} from "lucide-react";

interface SearchDropdownProps {
    isTransparent: boolean;
    isPanel?: boolean;
}

export default function SearchDropdown({isTransparent, isPanel = false}: SearchDropdownProps) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    // Debounce para no sobrecargar la API con cada tecleo
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Hook useQuery para buscar sugerencias de forma eficiente
    const {data: suggestedProducts = []} = useQuery({
        queryKey: ['searchSuggestions', debouncedQuery],
        queryFn: () => shopService.getPublicProducts({
            search: debouncedQuery,
            page: 1,
            limit: 5 // Solo queremos 5 sugerencias
        }),
        select: (data: PaginatedResponse<Product>) => data.data,
        enabled: debouncedQuery.trim().length > 2, // Solo busca si hay al menos 3 caracteres
        staleTime: 1000 * 60, // Cachea las sugerencias por 1 minuto
    });

    const handleSelectProduct = (productName: string) => {
        navigate(`/tienda?search=${encodeURIComponent(productName)}`);
        setSearchQuery("");
    };
    const buttonClasses = `p-2 rounded-full transition-colors ${isTransparent ? 'text-white hover:bg-white/20' : 'text-[var(--color-foreground)] hover:bg-[var(--color-muted)]'}`;

    const SearchContent = (
        <>
            <div className="p-4">
                <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--color-border)] bg-[var(--color-muted)] rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Buscar producto..."
                    autoFocus
                />
            </div>
            {searchQuery.trim() !== "" && (
                <ul className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    {suggestedProducts.length > 0 ? (
                        suggestedProducts.map(product => (
                            <li key={product.id}>
                                <button
                                    onClick={() => handleSelectProduct(product.name)}
                                    className="w-full text-left flex items-center p-3 hover:bg-[var(--color-muted)]"
                                >
                                    <div
                                        className="h-12 w-12 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-md flex-shrink-0 flex items-center justify-center">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name}
                                                 className="h-full w-full object-cover rounded-md"/>
                                        ) : (
                                            <ImageIcon className="h-6 w-6 text-[var(--color-foreground)]/40"/>
                                        )}
                                    </div>
                                    <span className="ml-3 text-sm">{product.name}</span>
                                </button>
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-sm text-[var(--color-foreground)]/60 py-4">No se encontraron
                            resultados.</p>
                    )}
                </ul>
            )}
        </>
    );

    if (isPanel) return SearchContent;

    return (
        <Menu as="div" className="relative">
            <Menu.Button className={buttonClasses}>
                <span className="sr-only">Buscar</span>
                <Search className="w-6 h-6"/>
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className="absolute right-0 mt-2 w-80 origin-top-right bg-[var(--color-card)] text-[var(--color-foreground)] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                    {SearchContent}
                </Menu.Items>
            </Transition>
        </Menu>
    );
}