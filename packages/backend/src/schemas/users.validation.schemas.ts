import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users.schemas';

// ✅ MEJORA: Schemas de Zod para validación, separados de la definición de la tabla.
export const insertUserSchema = createInsertSchema(users)
	.extend({
		password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
	})
	.omit({ id: true, created_at: true, hashed_password: true });

export const selectUserSchema = createSelectSchema(users);
export const updateUserSchema = insertUserSchema.partial().omit({ password: true });
