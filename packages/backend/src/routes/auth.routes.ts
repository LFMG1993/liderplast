import { Hono } from 'hono';
import loginHandler from "../handlers/auth";
import getProfileHandler from "../handlers/profile";
import logoutHandler from "../handlers/logout";
import { authMiddleware } from "../middlewares/auth.middleware";

// --- Enrutador principal para la funcionalidad de autenticación ---
const authRoutes = new Hono<{ Bindings: Env }>();

// --- Ruta pública para iniciar sesión ---
authRoutes.post('/login', loginHandler);

// ---Grupo de rutas protegidas ---
const protectedRoutes = new Hono<{ Bindings: Env }>();
protectedRoutes.use('/*', authMiddleware);
protectedRoutes.get('/profile', getProfileHandler);
protectedRoutes.post('/logout', logoutHandler);

// --- Montamos el grupo protegido en el enrutador de autenticación ---
authRoutes.route('/', protectedRoutes);

export default authRoutes;
