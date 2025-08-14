import type {Context} from 'hono';
import {drizzle} from 'drizzle-orm/d1';
import {schema} from '../schemas';
import {insertAttributeValueSchema, updateAttributeValueSchema} from '../schemas/attribute-values.validation.schemas';
import {and, eq} from 'drizzle-orm';

// GET /api/admin/attributes/:attributeId/values -> Listar valores de un atributo
export async function listValuesForAttribute(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	const attributeId = parseInt(c.req.param('attributeId'), 10);

	try {
		const values = await db.query.attributeValues.findMany({
			where: eq(schema.attributeValues.attributeId, attributeId),
		});
		return c.json({success: true, values});
	} catch (e) {
		console.error(`Error al listar valores para el atributo ${attributeId}:`, e);
		return c.json({success: false, error: 'Error al obtener los valores'}, 500);
	}
}

// POST /api/admin/attributes/:attributeId/values -> Crear un valor para un atributo
export async function createValueForAttribute(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	const attributeId = parseInt(c.req.param('attributeId'), 10);
	const body = await c.req.json();
	const validation = insertAttributeValueSchema.safeParse(body);

	if (!validation.success) {
		return c.json({success: false, errors: validation.error.flatten().fieldErrors}, 400);
	}

	try {
		const dataToInsert = {...validation.data, attributeId};
		const [newValue] = await db.insert(schema.attributeValues).values(dataToInsert).returning();
		return c.json({success: true, value: newValue}, 201);
	} catch (e) {
		console.error(`Error al crear valor para el atributo ${attributeId}:`, e);
		return c.json({success: false, error: 'Error al crear el valor'}, 500);
	}
}

// PUT /api/admin/attributes/:attributeId/values/:valueId -> Actualizar un valor
export async function updateAttributeValue(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	const valueId = parseInt(c.req.param('valueId'), 10);
	const body = await c.req.json();
	const validation = updateAttributeValueSchema.safeParse(body);

	if (!validation.success) {
		return c.json({success: false, errors: validation.error.flatten().fieldErrors}, 400);
	}

	try {
		const [updatedValue] = await db
			.update(schema.attributeValues)
			.set(validation.data)
			.where(eq(schema.attributeValues.id, valueId))
			.returning();

		if (!updatedValue) {
			return c.json({success: false, error: 'Valor no encontrado'}, 404);
		}
		return c.json({success: true, value: updatedValue});
	} catch (e) {
		console.error(`Error al actualizar el valor ${valueId}:`, e);
		return c.json({success: false, error: 'Error al actualizar el valor'}, 500);
	}
}

// DELETE /api/admin/attributes/:attributeId/values/:valueId -> Eliminar un valor
export async function deleteAttributeValue(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	const valueId = parseInt(c.req.param('valueId'), 10);

	try {
		await db.delete(schema.attributeValues).where(eq(schema.attributeValues.id, valueId));
		return c.json({success: true});
	} catch (e) {
		console.error(`Error al eliminar el valor ${valueId}:`, e);
		return c.json({success: false, error: 'Error al eliminar el valor'}, 500);
	}
}
