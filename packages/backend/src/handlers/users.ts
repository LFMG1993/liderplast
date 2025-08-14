import type {Context} from 'hono';
import {insertUserSchema, updateUserSchema} from '../schemas/users.validation.schemas';
import {hashPassword} from '../utils/crypto';
import {drizzle} from "drizzle-orm/d1";
import {schema} from '../schemas';
import {eq} from "drizzle-orm";

// GET /api/admin/users -> Listar todos los usuarios
export async function listUsers(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	try {
		const allUsers = await db.query.users.findMany({
			columns: {hashed_password: false} // Excluimos el hash de la contraseña por seguridad
		});
		return c.json({success: true, users: allUsers});
	} catch (e) {
		console.error('Error al listar usuarios:', e);
		return c.json({success: false, error: 'Error al obtener los usuarios'}, 500);
	}
}

// GET /api/admin/users/:id -> Obtener un usuario
export async function getUserById(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	const id = parseInt(c.req.param('id'), 10);
	try {
		const user = await db.query.users.findFirst({
			where: eq(schema.users.id, id),
			columns: {hashed_password: false}
		});

		if (!user) {
			return c.json({success: false, error: 'Usuario no encontrado'}, 404);
		}
		return c.json({success: true, user});
	} catch (e) {
		console.error(`Error al obtener el usuario ${id}:`, e);
		return c.json({success: false, error: 'Error al obtener el usuario'}, 500);
	}
}

// POST /api/admin/users -> Crear un usuario
export async function createUser(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	const body = await c.req.json();
	const validation = insertUserSchema.safeParse(body);

	if (!validation.success) {
		return c.json({success: false, errors: validation.error.flatten().fieldErrors}, 400);
	}

	const {nombre, email, password, rol} = validation.data;

	try {
		const hashedPassword = await hashPassword(password);
		const [newUser] = await db.insert(schema.users).values({
			nombre,
			email,
			hashed_password: hashedPassword,
			rol
		}).returning({id: schema.users.id});

		return c.json({success: true, id: newUser.id}, 201);
	} catch (e: any) {
		// Manejar error de email duplicado
		if (e.message?.includes('UNIQUE constraint failed')) {
			return c.json({success: false, error: 'El correo electrónico ya está en uso'}, 409);
		}
		console.error('Error al crear usuario:', e);
		return c.json({success: false, error: 'Error al crear el usuario'}, 500);
	}
}

// PUT /api/admin/users/:id -> Actualizar un usuario
export async function updateUser(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	const id = parseInt(c.req.param('id'), 10);
	const body = await c.req.json();
	const validation = updateUserSchema.safeParse(body);

	if (!validation.success) {
		return c.json({success: false, errors: validation.error.flatten().fieldErrors}, 400);
	}

	try {
		// Aquí podrías construir la query dinámicamente, pero para simplicidad actualizamos los campos permitidos.
		// Nota: No permitimos actualizar la contraseña desde este endpoint por seguridad.
		const [updatedUser] = await db
			.update(schema.users)
			.set(validation.data)
			.where(eq(schema.users.id, id))
			.returning({id: schema.users.id});

		if (!updatedUser) {
			return c.json({success: false, error: 'Usuario no encontrado'}, 404);
		}

		return c.json({success: true});
	} catch (e: any) {
		if (e.message?.includes('UNIQUE constraint failed')) {
			return c.json({success: false, error: 'El correo electrónico ya está en uso'}, 409);
		}
		console.error(`Error al actualizar el usuario ${id}:`, e);
		return c.json({success: false, error: 'Error al actualizar el usuario'}, 500);
	}
}

// DELETE /api/admin/users/:id -> Eliminar un usuario
export async function deleteUser(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	const id = parseInt(c.req.param('id'), 10);
	try {
		const [deletedUser] = await db.delete(schema.users).where(eq(schema.users.id, id)).returning({id: schema.users.id});
		if (!deletedUser) {
			return c.json({success: false, error: 'Usuario no encontrado'}, 404);
		}
		return c.json({success: true});
	} catch (e) {
		console.error(`Error al eliminar el usuario ${id}:`, e);
		return c.json({success: false, error: 'Error al eliminar el usuario'}, 500);
	}
}
