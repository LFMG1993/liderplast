export interface CustomerProfile {
    id: number;
    userId: number;
    fullName: string;
    phone: string | null;
    documentType: 'CC' | 'NIT' | 'CE' | 'PPT' | null;
    documentNumber: string | null;
    isBusiness: boolean;
    businessName: string | null;
    businessTaxId: string | null;
}

export type CustomerProfileUpdateData = Omit<CustomerProfile, 'id' | 'userId'>;
