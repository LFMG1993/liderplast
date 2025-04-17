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
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <div className="img-zoom">
                            <Link to="/shop" className={"btn-no-link"}>
                                <img className="img-fluid" src={images.contenedores} alt="Contenedores"/>
                                <div className="content">
                                    <h4 className={"text-center"}>Contenedores</h4>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="img-zoom text-center">
                            <Link to="/shop" className={"btn-no-link"}>
                                <img className="img-fluid " src={images.Bandejas} alt="Bandejas Desechables"/>
                                <div className="content">
                                    <h4 className={"text-center"}>Bandejas</h4>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="img-zoom">
                            <Link to="/shop" className={"btn-no-link"}>
                                <img className="img-fluid" src={images.Bioseguridad} alt="bioseguridad"/>
                                <div className="content">
                                    <h4 className={"text-center"}>Bioseguridad</h4>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="img-zoom">
                            <Link to="/shop" className={"btn-no-link"}>
                                <img className="img-fluid" src={images.Bolsas} alt="Bolsas desechables"/>
                                <div className="content">
                                    <h4 className={"text-center"}>Bolsas</h4>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col-md-3">
                            <div className="img-zoom">
                                <Link to="/shop" className={"btn-no-link"}>
                                    <img className="img-fluid" src={images.Cubiertos}
                                         alt="Cubiertos Plasticos"/>
                                    <div className="content">
                                        <h4 className={"text-center"}>Cubiertos</h4>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
}