import type {MiddlewareHandler} from 'hono';
import {getCookie} from 'hono/cookie';
import * as jose from 'jose';

// Definimos un tipo para la información que guardaremos en el contexto.
export type UserPayload = {
	userId: number;
	email: string;
	name: string;
};

// El middleware ahora usa la firma de Hono
export const authMiddleware: MiddlewareHandler<{
	Bindings: Env,
	Variables: {
		user: UserPayload
	}
}> = async (c, next) => {
	const token = getCookie(c, 'auth_token');
	if (!token) {
		return c.json({success: false, error: 'Unauthorized: Missing token'}, 401);
	}

	try {
		const secret = new TextEncoder().encode(c.env.JWT_SECRET);
		const {payload} = await jose.jwtVerify<UserPayload>(token, secret);
		// Guardamos la información del usuario en el contexto para los siguientes handlers.
		c.set('user', payload);
	} catch (err) {
		return c.json({success: false, error: 'Unauthorized: Invalid token'}, 401);
	}

	await next(); // Si todo es correcto, pasamos al siguiente handler.
};
