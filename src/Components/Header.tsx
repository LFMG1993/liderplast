import {Link} from "react-router-dom";
import { ImagesHome } from "../utils/images.ts";
import CardDropdown from "./CartDropdown.tsx";

export default function Header() {

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
                                {/*<li className="list-inline-item dropdown">*/}
                                {/*    <Link to="/"*/}
                                {/*          className="dropdown-toggle btn-no-link"*/}
                                {/*          data-bs-toggle="dropdown"*/}
                                {/*          aria-expanded="false"*/}
                                {/*    >*/}
                                {/*        <i className="bi bi-cart-check me-2"></i> Carrito*/}
                                {/*    </Link>*/}
                                {/*    <ul className="dropdown-menu dropdown-menu-end">*/}
                                {/*        <li>*/}
                                {/*            <Link to="/" className="dropdown-item">*/}
                                {/*                Ver Carrito*/}
                                {/*            </Link>*/}
                                {/*        </li>*/}
                                {/*        <li>*/}
                                {/*            <Link to="/" className="dropdown-item">*/}
                                {/*                Pagar*/}
                                {/*            </Link>*/}
                                {/*        </li>*/}
                                {/*    </ul>*/}
                                {/*</li>*/}
                                <CardDropdown/>
                                <li className="list-inline-item dropdown ms-3">
                                    <a
                                        href="#!"
                                        className="dropdown-toggle btn-no-link"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <i className="bi bi-search me-2"></i> Buscar
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-end p-2" style={{minWidth: "200px"}}>
                                        <form>
                                            <input
                                                type="search"
                                                className="form-control"
                                                placeholder="Buscar Producto..."
                                            />
                                        </form>
                                    </div>
                                </li>
                                <li className="list-inline-item ms-3">
                                    <select className="form-select form-select-sm" style={{width: "auto"}}>
                                        <option>
                                            Español
                                        </option>
                                        <option>
                                            English
                                        </option>
                                    </select>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <section className="menu">
                <nav className="navbar navbar-expand-lg navigation">
                    <div className="container">
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div id="navbarNav" className="collapse navbar-collapse">
                            <ul className="navbar-nav mx-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Inicio</Link>
                                </li>

                                <li className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle" to="#" role="button"
                                          data-bs-toggle="dropdown" aria-expanded="false">
                                        Tienda
                                    </Link>
                                    <ul className="dropdown-menu">
                                        <li><Link className="dropdown-item" to="/category">Categorías</Link></li>
                                        <li><Link className="dropdown-item" to="/cart">Destacados</Link></li>
                                        <li><Link className="dropdown-item" to="/pricing">Promociones</Link></li>
                                        <li><Link className="dropdown-item" to="/all-products">Todos los
                                            Productos</Link></li>
                                    </ul>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/Contact">Contacto</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </section>
        </header>
    );
}