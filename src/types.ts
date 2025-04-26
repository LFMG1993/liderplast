import type { ProductImageKey } from "./utils/images";

export interface Product {
    id: number;
    name: string;
    title: string;
    description?: string;     // opcional si no siempre tienes descripción
    price?: number;           // opcional si no lo manejas
    category: string;
    image: ProductImageKey;   // key que ya tienes en ImagesProducts/ImagesCategory
}