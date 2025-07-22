import {Fragment, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Menu, Transition} from "@headlessui/react";
import {useProductFilter} from "../hooks/useProductFilter";
import {ImagesProducts} from "../utils/images";

export default function SearchDropdown() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    // 2. Usamos el hook para obtener la lista filtrada y la función para actualizar el texto de búsqueda
    const {filteredProducts, setSearchText} = useProductFilter("", "");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Sincronizamos el filtro del hook con nuestro estado local.
    useEffect(() => {
        setSearchText(searchQuery);
    }, [searchQuery, setSearchText]);
    const handleSelectProduct = (productTitle: string) => {
        // Navegamos a la página de productos con el término de búsqueda exacto
        navigate(`/all-products?search=${encodeURIComponent(productTitle)}`);
        setIsMenuOpen(false);
        setSearchQuery("");
    };

    return (
        <Menu as="div" className="relative">
            <Menu.Button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-liderplast-primary focus:outline-none"
            >
                <span className="sr-only">Buscar productos</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </Menu.Button>

            <Transition
                show={isMenuOpen}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    static
                    className="absolute right-0 mt-2 w-80 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                    <div className="p-2">
                        <input
                            type="search"
                            // 2. El input ahora actualiza nuestro estado local.
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-liderplast-primary focus:border-liderplast-primary"
                            placeholder="Buscar producto..."
                            autoFocus
                        />
                    </div>

                    {/* 3. La clave: renderizado condicional de la lista de resultados */}
                    {/*    La lista solo se muestra si el usuario ha escrito algo. */}
                    {searchQuery.trim() !== "" && (
                        <ul className="max-h-80 overflow-y-auto">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.slice(0, 5).map((product) => (
                                    <Menu.Item key={product.id}>
                                        {({active}) => (
                                            <li
                                                onClick={() => handleSelectProduct(product.title)}
                                                className={`${active ? 'bg-gray-100' : ''} flex items-center p-3 cursor-pointer`}
                                            >
                                                <img src={ImagesProducts[product.image]} alt={product.title}
                                                     className="h-12 w-12 object-cover rounded-md"/>
                                                <span className="ml-3 text-sm text-gray-800">{product.title}</span>
                                            </li>
                                        )}
                                    </Menu.Item>
                                ))
                            ) : (
                                <p className="text-center text-sm text-gray-500 py-4">No se encontraron resultados.</p>
                            )}
                        </ul>
                    )}
                </Menu.Items>
            </Transition>
        </Menu>
    );
}