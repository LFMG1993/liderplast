import {ImagesProducts, ProductImageKey} from "../utils/images.ts";

type Product = {
    id: number;
    name: string;
    title: string;
    price?: number;
    image: ProductImageKey;
    category: string;
};

type Props = {
    product: Product;
    onAdd: (p: Product) => void;
};

export default function ProductCard({product, onAdd}: Props) {
    return (
        // ANTES: card shadow-sm rounded-3 overflow-hidden h-100
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
            {/* ANTES: bg-info d-flex align-items-center justify-content-center ratio ratio-1x1 */}
            <div className="bg-gray-100 flex items-center justify-center aspect-square">
                {/* ANTES: img-fluid */}
                <img
                    src={ImagesProducts[product.image]}
                    alt={product.name}
                    className="w-full h-full object-cover" // object-cover es clave para que no se deforme
                />
            </div>
            {/* ANTES: card-body text-center d-flex flex-column */}
            <div className="p-4 text-center flex flex-col flex-grow">
                {/* ANTES: card-title */}
                <h6 className="font-semibold text-gray-800">{product.title}</h6>
                <p className="text-gray-600 text-lg font-medium my-2">${product.price}</p>
                {/* ANTES: btn background-liderplast text-white mt-auto */}
                <button
                    className="bg-liderplast-primary text-white px-4 py-2 rounded-md mt-auto transition-colors hover:bg-liderplast-hover"
                    onClick={() => onAdd(product)}
                >
                    Añadir al carrito
                </button>
            </div>
        </div>
    );
}