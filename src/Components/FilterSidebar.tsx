
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
        <aside className="col-md-2 border-end position-sticky top-0">
            <input
                type="text"
                className="form-control mb-2"
                placeholder="Buscar producto..."
                value={searchText}
                onChange={(e) => onSearch(e.target.value)}
            />
            <button
                className="btn btn-outline-secondary w-100 d-flex justify-content-center mb-4"
                onClick={clearFilters}
            >
                Ver todos
            </button>
            <h6>Categorías</h6>
            <ul className="list-unstyled">
                {allCategories.map((cat) => (
                    <li key={cat}>
                        <div className="form-check">
                            <input
                                id={`cat-${cat}`}
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedCats.includes(cat)}
                                onChange={() => toggleCategory(cat)}
                            />
                            <label className="form-check-label" htmlFor={`cat-${cat}`}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </label>
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    );
}