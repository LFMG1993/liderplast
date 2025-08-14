import { Hono } from 'hono';
import {
	listUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser
} from '../handlers/users';
import { authMiddleware } from '../middlewares/auth.middleware';

const usersRoutes = new Hono<{ Bindings: Env }>();

// Aplicamos el middleware de autenticación a TODAS las rutas de usuarios.
usersRoutes.use('/*', authMiddleware);

usersRoutes.get('/', listUsers);
usersRoutes.post('/', createUser);
usersRoutes.get('/:id', getUserById);
usersRoutes.put('/:id', updateUser);
usersRoutes.delete('/:id', deleteUser);

export default usersRoutes;
