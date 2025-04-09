import {Link} from "react-router-dom";
import images from "../utils/images.ts";

export default function Category() {
    return (
        <section className="product-category section">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="title text-center">
                            <h2>Categorías</h2>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="img-zoom">
                            <Link to="/shop" className={"btn-no-link"}>
                                <img className="img-fluid" src={images.contenedorP} alt="foto"/>
                                <div className="content">
                                    <h3>Contenedores de Plástico</h3>
                                    <p>Disponible en diferentes tamaños.</p>
                                </div>
                            </Link>
                        </div>
                        <div className="img-zoom">
                            <Link to="/shop" className={"btn-no-link"}>
                                <img className="img-fluid " src={images.contenedorI} alt="foto"/>
                                <div className="content">
                                    <h3>Contenedores de Icopor.</h3>
                                    <p>encuentralos de 3oz 6oz 9oz 12oz</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="img-zoom">
                            <Link to="/shop" className={"btn-no-link"}>
                                <img className="img-fluid" src={images.copasV} alt="foto"/>
                                <div className="content">
                                    <h3>Copas Venecianas</h3>
                                    <p>Todas las presentaciones disponibles.</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
}