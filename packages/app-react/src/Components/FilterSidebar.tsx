type Props = {
    searchText: string;
    onSearch: (text: string) => void;
    selectedCats: string[];
    allCategories: string[];
    toggleCategory: (key: string) => void;
    clearFilters: () => void;
};

export default function FilterSidebar({
                                          searchText,
                                          onSearch,
                                          selectedCats,
                                          allCategories,
                                          toggleCategory,
                                          clearFilters,
                                      }: Props) {
    return (
        // ANTES: col-md-2 border-end position-static position-md-sticky top-0 bg-white
        <aside className="w-full md:w-1/4 lg:w-1/5 md:border-r border-gray-200 p-4 md:sticky top-24 h-screen">
            {/* ANTES: form-control mb-2 */}
            <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-liderplast-primary focus:border-liderplast-primary"
                placeholder="Buscar producto..."
                value={searchText}
                onChange={(e) => onSearch(e.target.value)}
            />
            {/* ANTES: btn btn-outline-secondary w-100 d-flex justify-content-center mb-4 */}
            <button
                className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md mb-6 transition-colors hover:bg-gray-100"
                onClick={clearFilters}
            >
                Limpiar Filtros
            </button>
            <h6 className="font-semibold text-lg mb-3">Categorías</h6>
            {/* ANTES: list-unstyled */}
            <ul className="space-y-2">
                {allCategories.map((cat) => (
                    <li key={cat}>
                        {/* ANTES: form-check */}
                        <div className="flex items-center">
                            {/* ANTES: form-check-input */}
                            <input
                                id={`cat-${cat}`}
                                className="h-4 w-4 rounded border-gray-300 text-liderplast-primary focus:ring-liderplast-primary"
                                type="checkbox"
                                checked={selectedCats.includes(cat)}
                                onChange={() => toggleCategory(cat)}
                            />
                            {/* ANTES: form-check-label */}
                            <label className="ml-3 min-w-0 flex-1 text-gray-600" htmlFor={`cat-${cat}`}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </label>
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    );
}