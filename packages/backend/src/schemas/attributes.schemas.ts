import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { attributes } from './product.schemas';

// ✅ Schema para crear un nuevo atributo.
export const insertAttributeSchema = createInsertSchema(attributes, {
	name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
}).omit({ id: true });

// ✅ Schema para actualizar un atributo (todos los campos son opcionales).
export const updateAttributeSchema = insertAttributeSchema.partial();
