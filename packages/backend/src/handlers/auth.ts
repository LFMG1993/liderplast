import * as jose from 'jose';
import {LoginSchema} from "../schemas/auth.schemas";
import {verifyPassword} from '../utils/crypto';
import {Context} from 'hono';
import {setCookie} from 'hono/cookie';
import {getCookieOptions} from "../utils/cookies";

type UserFromDB = {
	id: number;
	nombre: string;
	email: string;
	hashed_password: string;
};

export default async function loginHandler(c: Context<{ Bindings: Env }>): Promise<Response> {
	console.log('[login] start');
	try {
		if (!c.env?.LIDERPLAST_DB || !c.env?.JWT_SECRET) {
			console.error('[login] Server misconfiguration (DB or JWT_SECRET missing)');
			return c.json({success: false, error: 'Server misconfiguration'}, 500);
		}

		let payload: unknown;
		try {
			payload = await c.req.json();
		} catch (e) {
			console.warn('[login] invalid json body');
			return c.json({success: false, error: 'JSON inválido'}, 400);
		}

		const validation = LoginSchema.safeParse(payload);
		if (!validation.success) {
			return c.json({
				success: false,
				errors: validation.error.flatten().fieldErrors
			}, 400);
		}

		const {email, password} = validation.data;

		const stmt = c.env.LIDERPLAST_DB.prepare('SELECT id, nombre, email, hashed_password FROM usuarios WHERE email = ?');
		const user = await stmt.bind(email).first<UserFromDB>();
		if (!user) {
			return c.json({success: false, error: 'Credenciales inválidas'}, 401);
		}

		const isPasswordValid = await verifyPassword(password, user.hashed_password);
		if (!isPasswordValid) {
			return c.json({success: false, error: 'Credenciales inválidas'}, 401);
		}

		// Sign JWT
		const secret = new TextEncoder().encode(c.env.JWT_SECRET);
		const token = await new jose.SignJWT({userId: user.id, email: user.email, name: user.nombre})
			.setProtectedHeader({alg: 'HS256'})
			.setIssuedAt()
			.setExpirationTime('24h')
			.sign(secret);

		// Usamos la utilidad para obtener las opciones y añadimos Max-Age
		const cookieOptions = getCookieOptions(c);
		setCookie(c, 'auth_token', token, {...cookieOptions, maxAge: 86400});

		console.log('[login] success for', email);
		return c.json({success: true, user: {id: user.id, name: user.nombre, email: user.email}});

	} catch (err: any) {
		console.error('[login] uncaught error', err.stack || err);
		return c.json({success: false, error: 'Error interno del servidor'}, 500);
	}
}
