import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {ImagesHome, ImagesProducts} from "../utils/images.ts";
import CardDropdown from "./CartDropdown.tsx";
import {useProductFilter} from "../hooks/useProductFilter.ts";
import { useTranslation } from "react-i18next";

export default function Header() {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    // Usamos el hook solo para buscar sobre todos, no importa la categoría
    const {searchText, setSearchText, filteredProducts} =
        useProductFilter("", "");
    const [open, setOpen] = useState(false);

    const onSelect = (title: string) => {
        navigate(`/all-products?search=${encodeURIComponent(title)}`);
        setOpen(false);
    };

    return (
        <header>
            <section className="top-header py-2 border-bottom">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-4">
                            <div className="d-flex align-items-center d-none d-md-block">
                                <a href="https://wa.me/573242940464" target="_blank" className="btn-no-link">
                                    <i className="bi bi-whatsapp me-2 text-success"></i>
                                    <span>+57 324 294 0464</span>
                                </a>
                            </div>
                        </div>
                        <div className="col-md-4 text-center">
                            <Link to="/">
                                <img src={ImagesHome.logo} alt="Logo" className="img-fluid"
                                     style={{maxHeight: "100px"}}/>
                            </Link>
                        </div>
                        <div className="col-md-4">
                            <ul className="list-inline text-end mb-0">
                                <CardDropdown/>
                                {/* Search dropdown */}
                                <li className="list-inline-item dropdown ms-3 position-relative">
                                    <button
                                        type="button"
                                        className="btn btn-link btn-no-link dropdown-toggle"
                                        onClick={() => setOpen((o) => !o)}
                                    >
                                        <i className="bi bi-search me-2"></i>
                                    </button>
                                    {open && (
                                        <div
                                            className="dropdown-menu dropdown-menu-end p-2 show"
                                            style={{minWidth: 200}}
                                        >
                                            <input
                                                type="search"
                                                className="form-control mb-2"
                                                placeholder="Buscar Producto..."
                                                value={searchText}
                                                onChange={(e) => setSearchText(e.target.value)}
                                            />
                                            {searchText.trim() !== "" && (
                                                <ul className="list-group">
                                                    {filteredProducts.slice(0, 5).map((p) => (
                                                        <li
                                                            key={p.id}
                                                            className="list-group-item list-group-item-action d-flex align-items-center"
                                                            onClick={() => onSelect(p.title)}
                                                            style={{cursor: "pointer"}}
                                                        >
                                                            <img
                                                                src={ImagesProducts[p.image]}
                                                                alt={p.title}
                                                                className="img-thumbnail me-2"
                                                                style={{
                                                                    width: 40,
                                                                    height: 40,
                                                                    objectFit: "cover",
                                                                }}
                                                            />
                                                            <span>{p.title}</span>
                                                        </li>
                                                    ))}
                                                    {searchText && filteredProducts.length === 0 && (
                                                        <li className="list-group-item text-muted">
                                                            No se encontraron resultados
                                                        </li>
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </li>
                                <li className="list-inline-item ms-3">
                                    <select className="form-select form-select-sm"
                                            style={{width: "auto"}}
                                            value={i18n.language}
                                            onChange={(e) => i18n.changeLanguage(e.target.value)}
                                    >
                                        <option value="es">Español</option>
                                        <option value="en">English</option>
                                    </select>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <section className="menu">
                <nav className="navbar navigation">
                    <div className="container justify-content-center">
                        <ul className="navbar-nav d-flex flex-row">
                            <li className="nav-item me-3">
                                <Link className="nav-link" to="/">{t("Inicio")}</Link>
                            </li>

                            <li className="nav-item dropdown me-3 position-relative">
                                <Link className="nav-link dropdown-toggle" to="#" role="button"
                                      data-bs-toggle="dropdown" aria-expanded="false">
                                    {t("Tienda")}
                                </Link>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" to="/category">Categorías</Link></li>
                                    <li><Link className="dropdown-item" to="/all-products">Destacados</Link></li>
                                    <li><Link className="dropdown-item" to="/all-products">Promociones</Link></li>
                                    <li><Link className="dropdown-item" to="/all-products">Todos los
                                        Productos</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item me-3">
                                <Link className="nav-link" to="/Contact">{t("Contacto")}</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </section>
        </header>
    );
}