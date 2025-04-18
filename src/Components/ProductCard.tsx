import { CategoryImageKey, ImagesCategory } from "../utils/images.ts";

type Product = {
    id: number;
    name: string;
    title: string;
    price?: number;
    image: CategoryImageKey;
    category: string;
};

type Props = {
    product: Product;
    onAdd: (p: Product) => void;
};

export default function ProductCard({ product, onAdd }: Props) {
    return (
        <div className="card shadow-sm rounded-3 overflow-hidden h-100">
            <div className="bg-info d-flex align-items-center justify-content-center ratio ratio-1x1">
                <img
                    src={ImagesCategory[product.image]}
                    alt={product.name}
                    className="img-fluid"
                    style={{ objectFit: "cover" }}
                />
            </div>
            <div className="card-body text-center d-flex flex-column">
                <h6 className="card-title">{product.title}</h6>
                <p className={""}>{product.price}</p>
                <button
                    className="btn background-liderplast text-white mt-auto"
                    onClick={() => onAdd(product)}
                >
                    Añadir al carrito
                </button>
            </div>
        </div>
    );
}