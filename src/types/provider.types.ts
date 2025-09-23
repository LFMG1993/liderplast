export interface Provider {
    id: number;
    name: string;
    contactName: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    address: string | null;
    website: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * Representa los datos necesarios para crear o actualizar un proveedor.
 */
export type ProviderCreationData = Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>;