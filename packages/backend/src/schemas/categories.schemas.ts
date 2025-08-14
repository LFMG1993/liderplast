import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { categories } from './product.schemas';

// ✅ MEJORA: Creamos schemas de Zod para validar la entrada de la API de forma segura y tipada.

// Schema para crear una nueva categoría.
export const insertCategorySchema = createInsertSchema(categories, {
	// Hacemos que el nombre sea requerido y tenga una longitud mínima.
	name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
}).omit({ id: true, createdAt: true, updatedAt: true }); // Omitimos campos generados por el servidor.

// Schema para actualizar una categoría (todos los campos son opcionales).
export const updateCategorySchema = insertCategorySchema.partial();

export const selectCategorySchema = createSelectSchema(categories);
