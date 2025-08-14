import {createInsertSchema} from 'drizzle-zod';
import {z} from 'zod';
import {attributeValues} from './product.schemas';

// ✅ Schema para crear un nuevo valor de atributo.
export const insertAttributeValueSchema = createInsertSchema(attributeValues, {
	value: z.string().min(1, 'El valor no puede estar vacío'),
}).omit({id: true, attributeId: true}); // Omitimos IDs, se manejarán desde la ruta.

// ✅ Schema para actualizar un valor (solo el campo 'value' es opcional).
export const updateAttributeValueSchema = insertAttributeValueSchema.partial();
