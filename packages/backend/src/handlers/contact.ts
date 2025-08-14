import {Context} from "hono";
import {ContactSchema} from "../schemas/contact.schemas";

export default async function contactHandler(c: Context<{ Bindings: Env }>) {
	// Parsear el cuerpo de la solicitud
	let payload: unknown;
	try {
		payload = await c.req.json();
	} catch (e) {
		console.error("JSON inválido:", e);
		return c.json({success: false, error: "JSON inválido"}, 400);
	}
	// Validar el payload usando el esquema de Zod
	const validation = ContactSchema.safeParse(payload);
	if (!validation.success) {
		// Si la validación falla, devolver los errores especificos
		return c.json({
			success: false,
			errors: validation.error.flatten().fieldErrors
		}, 400);
	}

	// Hacer el INSERT en la tabla contactos
	const {nombre, email, asunto, mensaje} = validation.data;
	const stmt = c.env.LIDERPLAST_DB.prepare(
		`INSERT INTO contactos (nombre, email, asunto, mensaje)
		 VALUES (?, ?, ?, ?)`
	);
	const result = await stmt.bind(nombre, email, asunto, mensaje).run();

	const lastInsertRowid = result.meta.last_row_id;
	// 3. Responder con éxito
	return c.json({success: true, id: lastInsertRowid ?? 0}, 201);
}
