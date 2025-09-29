/**
 * Representa un ítem en la tabla de inventario.
 * Es una variante de producto enriquecida con el nombre del producto padre.
 */
export interface InventoryItem {
    id: number; // Variant ID
    sku: string;
    price: number | null;
    salePrice: number | null;
    product: {name: string};
    productName: string;
    variantDescription: string;
    stock: number | null;
    costPrice: number | null;
}

export type InventoryUpdateData = Partial<Pick<InventoryItem, 'stock' | 'costPrice' | 'price' | 'salePrice' >>;