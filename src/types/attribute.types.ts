export interface AttributeValue {
    id: number;
    attributeId: number;
    value: string;
}

export interface Attribute {
    id: number;
    name: string;
    values: AttributeValue[];
}
// --- Tipos para Creación y Actualización ---
export type AttributeCreationData = Pick<Attribute, 'name'>;
export type AttributeUpdateData = Partial<AttributeCreationData>;
export type AttributeValueCreationData = Pick<AttributeValue, 'value' | 'attributeId'>;
export type AttributeValueUpdateData = Partial<Pick<AttributeValue, 'value'>>;