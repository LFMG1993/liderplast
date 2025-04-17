import {Link} from "react-router-dom";
import { ImagesHome , ImagesCategory} from "../utils/images.ts";

export default function Home() {
    return (
        <div>
            <div className="content-offset">
                <div className="container marketing">
                    <hr className="featurette-divider"/>
                    <div className="row featurette">
                        <div className="col-md-7">
                            <h2 className="featurette-heading">Mas de 10 Años de Historia
                            </h2>
                            <p className="lead">Somos una micro empresa fundada en 2015, destacando por nuestro
                                excelente
                                servicio al cliente y precios competitivos.</p>
                        </div>
                        <div className="col-md-5">
                            <img className="img-fluid" src={ImagesHome.fachada} alt="foto"/>
                        </div>
                    </div>

                    <hr className="featurette-divider"/>
                    <div className="row featurette">
                        <div className="col-md-7 order-md-2">
                            <h2 className="featurette-heading">Productos de Excelente Calidad
                            </h2>
                            <p className="lead">Trabajamos con los mejores fabricantes de la region, ofreciendo
                                productos de excelente calidad para multiples comercios.</p>
                        </div>
                        <div className="col-md-5 order-md-1">
                            <img className="img-fluid" src={ImagesCategory.contenedorP} alt="foto"/>
                        </div>
                    </div>

                    <hr className="featurette-divider"/>
                    <div className="row featurette">
                        <div className="col-md-7">
                            <h2 className="featurette-heading">Encuentranos en Google Maps </h2>
                            <p className="lead">Navega a traves de tu telefono para llegar a nuestra sede fisica o pide
                                a domicilio en nuestro whatsapp</p>
                        </div>
                        <div className="col-md-5">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.0374524933236!2d-72.50638242499737!3d7.891150705761184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e66455e93349cdb%3A0x8aa9d6d8b0782d46!2sPlasticos%20El%20lider!5e0!3m2!1ses!2sco!4v1743737142891!5m2!1ses!2sco"
                                width="500" height="500" style={{ border: 0 }} allowFullScreen loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>
                    <Link to="/Home"> </Link>
                </div>
            </div>
        </div>
    );
}