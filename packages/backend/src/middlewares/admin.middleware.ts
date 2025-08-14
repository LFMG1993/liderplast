import type {MiddlewareHandler} from 'hono';
import type {UserPayload} from './auth.middleware';
import {drizzle} from 'drizzle-orm/d1';
import {schema} from '../schemas';
import {eq} from 'drizzle-orm';

/** Middleware de autorización específíco para administradores. */
export const adminAuth: MiddlewareHandler<{
	Bindings: Env,
	Variables: {
		user: UserPayload
	}
}> = async (c, next) => {

	const user = c.get('user');
	if (!user) {
		return c.json({success: false, error: 'Authentication context not found'}, 500);
	}
	// Realizamos la comprobación de autorización.
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	const dbUser = await db.query.users.findFirst({where: eq(schema.users.id, user.userId)});

	if (dbUser?.rol !== 'admin') {
		return c.json({success: false, error: 'Prohibido: Require privilegios de administrador'}, 403);
	}
	// Si la autorización es exitosa, continuamos con el handler final.
	await next();
};
