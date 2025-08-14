/**
 * Maneja las peticiones de "pre-vuelo" (preflight) de CORS.
 * El navegador envía estas peticiones OPTIONS automáticamente antes de la petición real.
 */
export function handleCors(request: Request, env: Env, response?: Response): Response {
	const allowedOriginsString = env.CORS_ALLOWED_ORIGINS || '*';
	const allowedOrigins = allowedOriginsString.split(',').map(s => s.trim());
	const origin = request.headers.get('Origin');

	const corsHeaders = new Headers();
	corsHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	corsHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	corsHeaders.set('Access-Control-Allow-Credentials', 'true');

	// Solo añade la cabecera si el origen está en nuestra lista de permitidos o si se permite '*'.
	if (origin && (allowedOrigins.includes(origin) || allowedOrigins.includes('*'))) {
		corsHeaders.set('Access-Control-Allow-Origin', origin);
	}
	if (request.method === 'OPTIONS') {
		return new Response(null, {
			status: 204,
			headers: corsHeaders
		});
	}

	if (!response) {
		console.error('[handleCors] Se llamó sin una respuesta para una petición no-OPTIONS.');
		const errorResponse = new Response('Internal Server Error: Response object missing.', {status: 500});
		corsHeaders.forEach((value, key) => errorResponse.headers.set(key, value));
		return errorResponse;
	}

	const newResponse = new Response(response.body, response);
	corsHeaders.forEach((value, key) => newResponse.headers.set(key, value));

	return newResponse;
}
