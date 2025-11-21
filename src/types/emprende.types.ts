import type { Product } from './index';

export interface EmprendePostProduct {
    productId: number;
    product: Product;
}

export interface EmprendePost {
    id: number;
    title: string;
    description: string | null;
    youtubeUrl: string;
    createdAt: string;
    updatedAt: string;
    products: EmprendePostProduct[];
}

export type EmprendePostCreationData = Omit<EmprendePost, 'id' | 'createdAt' | 'updatedAt' | 'products'> & {
    productIds: number[];
};

export type EmprendePostUpdateData = Partial<EmprendePostCreationData>;