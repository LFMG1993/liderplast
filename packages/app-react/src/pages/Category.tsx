import { Link } from "react-router-dom";
import { ImagesCategory } from "../utils/images.ts";

const categories = [
    { key: "contenedores", label: "Contenedores", img: ImagesCategory.contenedores },
    { key: "bolsas", label: "Bolsas", img: ImagesCategory.Bolsas },
    { key: "cubiertos", label: "Cubiertos", img: ImagesCategory.Cubiertos },
    { key: "frascos", label: "Frascos", img: ImagesCategory.Frascos },
    { key: "peliculas", label: "Películas Extensibles", img: ImagesCategory.PeliculaExtensible },
    { key: "platos", label: "Platos", img: ImagesCategory.Platos },
    { key: "vasos", label: "Vasos", img: ImagesCategory.Vasos },
    { key: "alimentos", label: "Alimentos", img: ImagesCategory.Alimentos },
    { key: "catering", label: "Catering", img: ImagesCategory.Catering },
];

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
                <div className="row justify-content-center">
                    {categories.map(({ key, label, img }) => (
                        <div className="col-md-2" key={key}>
                            <div className="img-zoom">
                                <Link
                                    to={`/all-products?category=${encodeURIComponent(key)}`}
                                    className="btn-no-link"
                                >
                                    <img className="img-fluid" src={img} alt={label} />
                                    <div className="content">
                                        <h5 className="text-center">{label}</h5>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <br />
            </div>
        </section>
    );
}