export interface Address {
    id: number;
    userId: number;
    recipientName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string | null;
    country: string;
    details: string | null;
    isDefault: boolean;
}

export type AddressCreationData = Omit<Address, 'id' | 'userId' | 'country'> & { country?: string };
export type AddressUpdateData = Partial<AddressCreationData>;