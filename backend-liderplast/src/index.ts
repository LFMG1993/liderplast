import contactHandler from "./handlers/contact";

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const pathname = url.pathname;
		const method   = request.method;    // ← aquí, request.method en lugar de url.method

		// Ahora puedes usar pathname y method por separado:
		if (pathname === "/api/contact" && method === "POST") {
			return contactHandler(request, env);
		}

		return new Response("Not found", { status: 404 });
	},
};
