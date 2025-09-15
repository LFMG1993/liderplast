export interface Category {
    id: number;
    name: string;
    description?: string | null;
    parentId?: number | null;
    imageUrl: string | null;
    children?: Category[];
}

export type CategoryCreationData = Omit<Category, 'id' | 'children'>;
export type CategoryUpdateData = Partial<CategoryCreationData>;