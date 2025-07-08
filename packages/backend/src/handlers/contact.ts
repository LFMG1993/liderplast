export default async function contactHandler(
	req: Request,
	env: Env
): Promise<Response> {
	// 1. Parsear y validar
	let payload: { nombre: string; email: string; asunto: string; mensaje: string };
	try {
		payload = await req.json();
	} catch (e) {
		console.error("JSON inválido:", e);
		return new Response("JSON inválido", { status: 400 });
	}
	const { nombre, email, asunto, mensaje } = payload;
	if (!nombre || !email || !asunto || !mensaje) {
		return new Response("Faltan campos", { status: 400 });
	}

	// 2. Hacer el INSERT en la tabla contactos
	const stmt = env.LIDERPLAST_DB.prepare(
		`INSERT INTO contactos (nombre, email, asunto, mensaje)
     VALUES (?, ?, ?, ?)`
	);
	const result = await stmt.bind(nombre, email, asunto, mensaje).run();

	const { lastInsertRowid } = result;
	// 3. Responder con éxito
	return new Response(
		JSON.stringify({ success: true, id: lastInsertRowid }),
		{
			status: 201,
			headers: { "Content-Type": "application/json" },
		}
	);
}
