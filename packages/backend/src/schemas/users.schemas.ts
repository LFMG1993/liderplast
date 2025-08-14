import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
// ✅ MEJORA: Este archivo ahora solo tiene la responsabilidad de definir la tabla para Drizzle.
// Se renombra `usersSchemas` a `users` por claridad y consistencia.
// Las validaciones de Zod se han movido a `users.validation.schemas.ts`.
export const users = sqliteTable('usuarios', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	nombre: text('nombre').notNull(),
	email: text('email').notNull().unique(),
	hashed_password: text('hashed_password').notNull(),
	rol: text('rol', { enum: ['admin', 'user'] }).notNull().default('user'),
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
});

// Drizzle ORM requiere que CADA tabla en el schema principal tenga su `relations` correspondiente
export const usersRelations = relations(users, () => ({}));
