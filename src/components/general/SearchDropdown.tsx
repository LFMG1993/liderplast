import {Fragment, useState, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {Menu, Transition} from "@headlessui/react";
import {useProductFilter} from "../../hooks/useProductFilter.ts";
import {Search, FileImage} from "react-bootstrap-icons";

interface SearchDropdownProps {
    isTransparent: boolean;
    isPanel?: boolean;
}

export default function SearchDropdown({isTransparent, isPanel = false}: SearchDropdownProps) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const {filteredProducts: allProducts} = useProductFilter();

    const suggestedProducts = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const normalizedQuery = searchQuery.toLowerCase().trim();
        return allProducts
            .filter(p => p.name.toLowerCase().includes(normalizedQuery))
            .slice(0, 5); // Mostramos solo los primeros 5 resultados.
    }, [searchQuery, allProducts]);

    const handleSelectProduct = (productName: string) => {
        navigate(`/tienda?search=${encodeURIComponent(productName)}`);
        setSearchQuery("");
    };
    const buttonClasses = `p-2 rounded-full transition-colors ${isTransparent ? 'text-white hover:bg-white/20' : 'text-gray-700 hover:bg-gray-100'}`;

    const SearchContent = (
        <>
            <div className="p-4">
                <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-liderplast-primary focus:border-liderplast-primary"
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
                                    className="w-full text-left flex items-center p-3 hover:bg-gray-100"
                                >
                                    <div className="h-12 w-12 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover rounded-md"/>
                                        ) : (
                                            <FileImage className="h-6 w-6 text-gray-400"/>
                                        )}
                                    </div>
                                    <span className="ml-3 text-sm text-gray-800">{product.name}</span>
                                </button>
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-sm text-gray-500 py-4">No se encontraron resultados.</p>
                    )}
                </ul>
            )}
        </>
    );

    if (isPanel) return SearchContent;

    return (
        <Menu as="div" className="relative">
            <Menu.Button className={buttonClasses}>
                <span className="sr-only">Buscar productos</span>
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
                    className="absolute right-0 mt-2 w-80 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                    {SearchContent}
                </Menu.Items>
            </Transition>
        </Menu>
    );
}