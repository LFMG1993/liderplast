import type {Category, Attribute} from "../../types";
import {Disclosure} from '@headlessui/react';
import {ChevronUp} from "lucide-react";

type Props = {
    searchText: string;
    onSearch: (text: string) => void;
    selectedCategoryIds: number[];
    toggleCategory: (id: number) => void;
    clearFilters: () => void;
    hierarchicalCategories: (Category & { children: Category[] })[];
    filterableAttributes: Attribute[];
    selectedAttributes: Record<number, number[]>;
    toggleAttribute: (attributeId: number, valueId: number) => void;
};

export default function FilterSidebar({
                                          searchText,
                                          onSearch,
                                          selectedCategoryIds,
                                          toggleCategory,
                                          clearFilters,
                                          hierarchicalCategories,
                                          filterableAttributes,
                                          selectedAttributes,
                                          toggleAttribute
                                      }: Props) {
    return (
        //  permite scroll independiente en el contenido de los filtros.
        <div className="flex flex-col h-full text-[var(--color-foreground)]">
            <div className="p-4 border-b border-[var(--color-border)] md:border-none md:p-0">
                <input
                    type="text"
                    className="w-full border border-[var(--color-border)] bg-[var(--color-muted)] rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Buscar producto..."
                    value={searchText}
                    onChange={(e) => onSearch(e.target.value)}
                />
                <button
                    className="w-full border border-[var(--color-border)] px-4 py-2 rounded-md mb-6 transition-colors hover:bg-[var(--color-muted)]"
                    onClick={clearFilters}
                >
                    Limpiar Filtros
                </button>
            </div>

            {/* El contenido de los filtros es scrollable. */}
            <div className="flex-grow overflow-y-auto p-4 md:p-0 md:pr-4 no-scrollbar">
                {/*  Secciones colapsables (Accordion) para una UI más limpia. */}
                <Disclosure as="div" className="mb-6" defaultOpen>
                    {({open}: { open: boolean }) => (
                        <>
                            <Disclosure.Button className="flex w-full justify-between items-center text-left">
                                <h6 className="font-semibold text-lg">Categorías</h6>
                                <ChevronUp
                                    className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-[var(--color-foreground)]/60`}/>
                            </Disclosure.Button>
                            <Disclosure.Panel as="ul" className="mt-3 space-y-2">
                                {hierarchicalCategories.map((cat) => (
                                    <li key={cat.id}>
                                        <div className="flex items-center">
                                            <input id={`cat-${cat.id}`} type="checkbox"
                                                   checked={selectedCategoryIds.includes(cat.id)}
                                                   onChange={() => toggleCategory(cat.id)}
                                                   className="h-4 w-4 rounded border-[var(--color-border)] bg-[var(--color-muted)] text-primary focus:ring-primary"/>
                                            <label className="ml-3 min-w-0 flex-1"
                                                   htmlFor={`cat-${cat.id}`}>{cat.name}</label>
                                        </div>
                                        {cat.children && cat.children.length > 0 && (
                                            <ul className="pl-6 mt-2 space-y-2">
                                                {cat.children.map(subCat => (
                                                    <li key={subCat.id}>
                                                        <div className="flex items-center">
                                                            <input id={`cat-${subCat.id}`} type="checkbox"
                                                                   checked={selectedCategoryIds.includes(subCat.id)}
                                                                   onChange={() => toggleCategory(subCat.id)}
                                                                   className="h-4 w-4 rounded border-[var(--color-border)] bg-[var(--color-muted)] text-primary focus:ring-primary"/>
                                                            <label
                                                                className="ml-3 min-w-0 flex-1 text-sm text-[var(--color-foreground)]/80"
                                                                htmlFor={`cat-${subCat.id}`}>{subCat.name}</label>
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
                                            className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-[var(--color-foreground)]/60`}/>
                                    </Disclosure.Button>
                                    <Disclosure.Panel as="ul" className="mt-3 space-y-2">
                                        {attribute.values.map((value) => (
                                            <li key={value.id}>
                                                <div className="flex items-center">
                                                    <input id={`attr-${attribute.id}-${value.id}`} type="checkbox"
                                                           checked={selectedAttributes[attribute.id]?.includes(value.id) || false}
                                                           onChange={() => toggleAttribute(attribute.id, value.id)}
                                                           className="h-4 w-4 rounded border-[var(--color-border)] bg-[var(--color-muted)] text-primary focus:ring-primary"/>
                                                    <label className="ml-3 min-w-0 flex-1"
                                                           htmlFor={`attr-${attribute.id}-${value.id}`}>{value.value}</label>
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