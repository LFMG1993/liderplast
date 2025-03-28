import {Link, useNavigate} from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    navigate('/');

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-black fixed-top">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                            <ul className="navbar-nav me-auto mb-2 mb-md-0">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="#">Inicio</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Tienda</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Contacto</a>
                                </li>
                            </ul>
                        <Link className="navbar-brand d-flex mx-auto justify-content-center" to="/">
                            <img className="img-fluid w-25" src="/src/assets/logo.png" alt="Logo Liderplast"/>
                        </Link>
                        <form className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Buscar..."
                                   aria-label="Search"/>
                            <button className="btn btn-outline-success" type="submit">Buscar</button>
                        </form>
                    </div>
                </div>
            </nav>
        </header>
    )
}