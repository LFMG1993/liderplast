import type { Context } from 'hono';
import type { CookieOptions } from 'hono/utils/cookie';

/**
 * Genera las opciones de cookie correctas dependiendo del entorno (local o producción).
 * @param c El contexto de Hono.
 * @returns Un objeto con las opciones de la cookie.
 */
export function getCookieOptions(c: Context): CookieOptions {
	const host = (c.req.header('host') || '');
	const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

	return {
		path: '/',
		httpOnly: true,
		secure: !isLocal,
		sameSite: isLocal ? 'Lax' : 'Strict',
	};
}
