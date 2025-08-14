import * as productSchema from './product.schemas';
import * as userSchema from './users.schemas';
// NOTA: No importamos los schemas de Zod (categories.schemas, attributes.schemas) aquí.
// Este archivo es solo para los schemas de tablas de Drizzle.

// ✅ MEJORA: Centralizamos todos los schemas de Drizzle en un solo objeto.
// Esto proporciona una única fuente de verdad para la estructura de la base de datos
// y resuelve problemas de importación inconsistente en los handlers.
export const schema = {
	...productSchema,
	...userSchema,
};
