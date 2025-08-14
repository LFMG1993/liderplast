import type {Context} from "hono";
import {deleteCookie} from "hono/cookie";
import {getCookieOptions} from "../utils/cookies";

export default async function logoutHandler(c: Context<{ Bindings: Env }>) {
	// Obtenemos las opciones de la cookie desde nuestra utilidad centralizada.
	const cookieOptions = getCookieOptions(c);
	deleteCookie(c, 'auth_token', cookieOptions);

	return c.json({success: true, message: 'Logged out successfully'});
}
