export interface VolumeDiscount {
    id?: number;
    minQuantity: number;
    price: number;
}

export interface ProductVariant {
    id: number;
    sku: string;
    price: number;
    stock: number;
    salePrice?: number | null;
    imageUrl: string | null;
    unitOfMeasure: string | null; // Ej: "Caja", "Unidad", "Millar"
    unitsPerItem: number | null; // Ej: 1000 (unidades por caja)
    volumeDiscounts: VolumeDiscount[];
    variantValues: {
        attributeValue: {
            id: number;
            value: string;
            attributeId: number;
            attribute: {
                name: string;
            };
        };
    }[];
}

export interface Product {
    id: number;
    name: string;
    description?: string | null;
    isFeatured: boolean;
    imageUrl: string | null;
    category: {
        id: number;
        name: string;
    };
    variants: ProductVariant[];
}

export interface ProductCreationData {
    name: string;
    description?: string;
    categoryId: number;
    isFeatured?: boolean;
    imageUrl?: string | null;
    variants: {
        id?: number;
        sku: string;
        price: number;
        stock: number;
        salePrice?: number | null;
        imageUrl?: string | null;
        unitOfMeasure?: string | null;
        unitsPerItem?: number | null;
        volumeDiscounts?: VolumeDiscount[];
        attributeValueIds: number[];
    }[];
}

export type ProductUpdateData = Partial<ProductCreationData>;