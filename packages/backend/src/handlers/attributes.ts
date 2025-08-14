import type {Context} from 'hono';
import {drizzle} from 'drizzle-orm/d1';
import {schema} from '../schemas';
import {insertAttributeSchema, updateAttributeSchema} from '../schemas/attributes.schemas';
import {eq} from 'drizzle-orm';

// GET /api/admin/attributes -> Listar todos los atributos
export async function listAttributes(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	try {
		// Esto es mucho más eficiente y simplifica enormemente la lógica del frontend.
		const allAttributes = await db.query.attributes.findMany({
			with: {
				values: true,
			},
		});
		return c.json({success: true, attributes: allAttributes});
	} catch (e) {
		console.error('Error al listar atributos:', e);
		return c.json({success: false, error: 'Error al obtener los atributos'}, 500);
	}
}

// POST /api/admin/attributes -> Crear un atributo
export async function createAttribute(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	const body = await c.req.json();
	const validation = insertAttributeSchema.safeParse(body);

	if (!validation.success) {
		return c.json({success: false, errors: validation.error.flatten().fieldErrors}, 400);
	}

	try {
		const [newAttribute] = await db
			.insert(schema.attributes)
			.values(validation.data)
			.returning();

		return c.json({success: true, attribute: newAttribute}, 201);
	} catch (e: any) {
		if (e.message?.includes('UNIQUE constraint failed')) {
			return c.json({success: false, error: 'El nombre del atributo ya existe'}, 409);
		}
		console.error('Error al crear atributo:', e);
		return c.json({success: false, error: 'Error al crear el atributo'}, 500);
	}
}

// PUT /api/admin/attributes/:id -> Actualizar un atributo
export async function updateAttribute(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	const id = parseInt(c.req.param('id'), 10);
	const body = await c.req.json();
	const validation = updateAttributeSchema.safeParse(body);

	if (!validation.success) {
		return c.json({success: false, errors: validation.error.flatten().fieldErrors}, 400);
	}

	try {
		const [updatedAttribute] = await db
			.update(schema.attributes)
			.set(validation.data)
			.where(eq(schema.attributes.id, id))
			.returning();

		if (!updatedAttribute) {
			return c.json({success: false, error: 'Atributo no encontrado'}, 404);
		}

		return c.json({success: true, attribute: updatedAttribute});
	} catch (e: any) {
		console.error(`Error al actualizar el atributo ${id}:`, e);
		return c.json({success: false, error: 'Error al actualizar el atributo'}, 500);
	}
}

// DELETE /api/admin/attributes/:id -> Eliminar un atributo
export async function deleteAttribute(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	const id = parseInt(c.req.param('id'), 10);

	try {
		await db.delete(schema.attributes).where(eq(schema.attributes.id, id));
		return c.json({success: true});
	} catch (e) {
		console.error(`Error al eliminar el atributo ${id}:`, e);
		return c.json({success: false, error: 'Error al eliminar el atributo. Asegúrate de que no esté en uso.'}, 500);
	}
}
