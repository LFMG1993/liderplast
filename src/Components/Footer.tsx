import {Link} from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer section text-center">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <ul className="social-media list-unstyled d-flex justify-content-center mb-4">
                            <li className="mx-3">
                                <a href="https://www.facebook.com/lider.plast.52" target={"_blank"} aria-label={"Liderplast en Facebook"}>
                                    <i className="bi bi-facebook text-primary fs-3"></i>
                                    <span className={"visually-hidden"}>Liderplast en Facebook</span>
                                </a>
                            </li>
                            <li className="mx-3">
                                <a href="https://www.instagram.com/distribucionesliderplast/" target={"_blank"} aria-label={"Liderplast en Instagram"}>
                                    <i className="bi bi-instagram text-black fs-3"></i>
                                    <span className={"visually-hidden"}>Liderplast en Instagram</span>
                                </a>
                            </li>
                            <li className="mx-3">
                                <a href="https://wa.me/573242940464" target={"_blank"} aria-label={"Enviar un mensaje a Liderplast"}>
                                    <i className="bi bi-whatsapp text-success fs-3"></i>
                                    <span className={"visually-hidden"}>Enviar un mensaje a Liderplast</span>
                                </a>
                            </li>
                        </ul>
                        <ul className="footer-menu list-unstyled d-flex justify-content-center mb-4">
                            <li className="mx-2">
                                <Link to="/Contact" className="btn btn-no-link">Contacto</Link>
                            </li>
                            <li className="mx-2">
                                <Link to="/all-products" className="btn btn-no-link">Tienda</Link>
                            </li>
                            <li className="mx-2">
                                <Link to="/Contact" className="btn btn-no-link">Presupuesto</Link>
                            </li>
                            <li className="mx-2">
                                <Link to="/Contact" className="btn btn-no-link">Política de privacidad</Link>
                            </li>
                        </ul>
                        <p className="copyright-text text-secondary">
                            Copyright &copy;2025, Diseñado &amp;  Desarrollado <a
                            href="https://molink.com.co/" target="_blank">Molink Tecnologia</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}