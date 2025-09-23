import type {Category, Attribute} from "../../types";
import {Disclosure} from '@headlessui/react';
import {ChevronUp} from "lucide-react";

type Props = {
    searchText: string;
    onSearch: (text: string) => void;
    selectedCats: string[];
    toggleCategory: (key: string) => void;
    clearFilters: () => void;
    hierarchicalCategories: (Category & { children: Category[] })[];
    filterableAttributes: Attribute[];
    selectedAttributes: Record<string, string[]>;
    toggleAttribute: (attributeName: string, value: string) => void;
};

export default function FilterSidebar({
                                          searchText,
                                          onSearch,
                                          selectedCats,
                                          toggleCategory,
                                          clearFilters,
                                          hierarchicalCategories,
                                          filterableAttributes,
                                          selectedAttributes,
                                          toggleAttribute
                                      }: Props) {
    return (
        //  permite scroll independiente en el contenido de los filtros.
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 md:border-none md:p-0">
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-liderplast-primary focus:border-liderplast-primary"
                    placeholder="Buscar producto..."
                    value={searchText}
                    onChange={(e) => onSearch(e.target.value)}
                />
                <button
                    className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md mb-6 transition-colors hover:bg-gray-100"
                    onClick={clearFilters}
                >
                    Limpiar Filtros
                </button>
            </div>

            {/* ✅ MEJORA: El contenido de los filtros ahora es scrollable. */}
            <div className="flex-grow overflow-y-auto p-4 md:p-0 md:pr-4 no-scrollbar">
                {/* ✅ MEJORA: Secciones colapsables (Accordion) para una UI más limpia. */}
                <Disclosure as="div" className="mb-6" defaultOpen>
                    {({open}: { open: boolean }) => (
                        <>
                            <Disclosure.Button className="flex w-full justify-between items-center text-left">
                                <h6 className="font-semibold text-lg">Categorías</h6>
                                <ChevronUp className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500`}/>
                            </Disclosure.Button>
                            <Disclosure.Panel as="ul" className="mt-3 space-y-2">
                                {hierarchicalCategories.map((cat) => (
                                    <li key={cat.id}>
                                        <div className="flex items-center">
                                            <input id={`cat-${cat.name}`} type="checkbox"
                                                   checked={selectedCats.includes(cat.name)}
                                                   onChange={() => toggleCategory(cat.name)}
                                                   className="h-4 w-4 rounded border-gray-300 text-liderplast-primary focus:ring-liderplast-primary"/>
                                            <label className="ml-3 min-w-0 flex-1 text-gray-600"
                                                   htmlFor={`cat-${cat.name}`}>{cat.name}</label>
                                        </div>
                                        {cat.children && cat.children.length > 0 && (
                                            <ul className="pl-6 mt-2 space-y-2">
                                                {cat.children.map(subCat => (
                                                    <li key={subCat.id}>
                                                        <div className="flex items-center">
                                                            <input id={`cat-${subCat.name}`} type="checkbox"
                                                                   checked={selectedCats.includes(subCat.name)}
                                                                   onChange={() => toggleCategory(subCat.name)}
                                                                   className="h-4 w-4 rounded border-gray-300 text-liderplast-primary focus:ring-liderplast-primary"/>
                                                            <label className="ml-3 min-w-0 flex-1 text-sm text-gray-500"
                                                                   htmlFor={`cat-${subCat.name}`}>{subCat.name}</label>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>

                {filterableAttributes
                    .map((attribute) => (
                        <Disclosure as="div" key={attribute.id} className="mb-6">
                            {({open}) => (
                                <>
                                    <Disclosure.Button className="flex w-full justify-between items-center text-left">
                                        <h6 className="font-semibold text-lg">{attribute.name}</h6>
                                        <ChevronUp
                                            className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500`}/>
                                    </Disclosure.Button>
                                    <Disclosure.Panel as="ul" className="mt-3 space-y-2">
                                        {attribute.values.map((value) => (
                                            <li key={value.id}>
                                                <div className="flex items-center">
                                                    <input id={`attr-${attribute.name}-${value.value}`} type="checkbox"
                                                           checked={selectedAttributes[attribute.name]?.includes(value.value) || false}
                                                           onChange={() => toggleAttribute(attribute.name, value.value)}
                                                           className="h-4 w-4 rounded border-gray-300 text-liderplast-primary focus:ring-liderplast-primary"/>
                                                    <label className="ml-3 min-w-0 flex-1 text-gray-600"
                                                           htmlFor={`attr-${attribute.name}-${value.value}`}>{value.value}</label>
                                                </div>
                                            </li>
                                        ))}
                                    </Disclosure.Panel>
                                </>
                            )}
                        </Disclosure>
                    ))}
            </div>
        </div>
    );
}