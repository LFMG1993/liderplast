import type {Context} from 'hono';
import {drizzle} from 'drizzle-orm/d1';
import {schema} from '../schemas';
import {insertCategorySchema, updateCategorySchema} from '../schemas/categories.schemas';
import {eq, isNull} from 'drizzle-orm';

// GET /api/admin/categories -> Listar todas las categorías con su jerarquía
export async function listCategories(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	try {
		// ✅ MEJORA: Usamos Drizzle ORM para una consulta más segura y legible.
		// Obtenemos todas las categorías y sus hijos para construir el árbol en el frontend.
		const allCategories = await db.query.categories.findMany({
			with: {
				children: true,
			},
			where: isNull(schema.categories.parentId), // Empezamos por las categorías raíz (sin padre)
		});
		return c.json({success: true, categories: allCategories});
	} catch (e) {
		console.error('Error al listar categorías:', e);
		return c.json({success: false, error: 'Error al obtener las categorías'}, 500);
	}
}

// POST /api/admin/categories -> Crear una categoría
export async function createCategory(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	const body = await c.req.json();
	const validation = insertCategorySchema.safeParse(body);

	if (!validation.success) {
		return c.json({success: false, errors: validation.error.flatten().fieldErrors}, 400);
	}

	const {name, description, parentId} = validation.data;
	const now = new Date();

	try {
		const [newCategory] = await db
			.insert(schema.categories)
			.values({name, description, parentId, createdAt: now, updatedAt: now})
			.returning();

		return c.json({success: true, category: newCategory}, 201);
	} catch (e: any) {
		console.error('Error al crear categoría:', e);
		return c.json({success: false, error: 'Error al crear la categoría'}, 500);
	}
}

// PUT /api/admin/categories/:id -> Actualizar una categoría
export async function updateCategory(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	const id = parseInt(c.req.param('id'), 10);
	const body = await c.req.json();
	const validation = updateCategorySchema.safeParse(body);

	if (!validation.success) {
		return c.json({success: false, errors: validation.error.flatten().fieldErrors}, 400);
	}

	const dataToUpdate = {...validation.data, updatedAt: new Date()};

	try {
		const [updatedCategory] = await db
			.update(schema.categories)
			.set(dataToUpdate)
			.where(eq(schema.categories.id, id))
			.returning();

		if (!updatedCategory) {
			return c.json({success: false, error: 'Categoría no encontrada'}, 404);
		}

		return c.json({success: true, category: updatedCategory});
	} catch (e: any) {
		console.error(`Error al actualizar la categoría ${id}:`, e);
		return c.json({success: false, error: 'Error al actualizar la categoría'}, 500);
	}
}

// DELETE /api/admin/categories/:id -> Eliminar una categoría
export async function deleteCategory(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	const id = parseInt(c.req.param('id'), 10);

	try {
		const result = await db.delete(schema.categories).where(eq(schema.categories.id, id));

		// Drizzle para D1 no devuelve el número de filas afectadas directamente en `result`.
		// La lógica de "no encontrado" se puede manejar verificando si el recurso existía antes.
		// Por simplicidad, asumimos que la operación fue exitosa si no hay error.

		return c.json({success: true});
	} catch (e) {
		console.error(`Error al eliminar la categoría ${id}:`, e);
		// Podríamos verificar si es un error de clave foránea (si la categoría tiene productos)
		return c.json({
			success: false,
			error: 'Error al eliminar la categoría. Asegúrate de que no tenga productos asociados.'
		}, 500);
	}
}
