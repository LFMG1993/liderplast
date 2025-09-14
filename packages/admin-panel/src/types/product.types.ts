export interface ProductVariant {
    id: number;
    sku: string;
    price: number;
    stock: number;
    salePrice?: number | null;
    // En el futuro, aquí podríamos tener los detalles de los valores de atributo.
}

export interface Product {
    id: number;
    name: string;
    description?: string | null;
    isFeatured: boolean;
    image_url: string | null;
    category: {
        id: number;
        name: string;
    };
    variants: ProductVariant[];
    // ... y cualquier otro campo que devuelva la API de getProductById
}

export interface ProductCreationData {
    name: string;
    description?: string;
    categoryId: number;
    isFeatured?: boolean;
    image_url?: string | null;
    variants: {
        id?: number;
        sku: string;
        price: number;
        stock: number;
        salePrice?: number;
        attributeValueIds: number[];
    }[];
}

export type ProductUpdateData = Partial<ProductCreationData>;