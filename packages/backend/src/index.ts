import {Hono} from 'hono';
import {cors} from 'hono/cors';
import contactRoutes from "./routes/contact.routes";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import categoriesRoutes from "./routes/categories.routes";
import attributeRoutes from "./routes/attributes.routes";
import attributeValuesRoutes from "./routes/attribute-values.routes";
import productRoutes from "./routes/product.routes";
import {getUploadUrl} from "./handlers/image-upload.handler";

const app = new Hono<{ Bindings: Env }>();
// --- Middlewares Globales ---
app.use('/api/*', (c, next) => {
	const corsMiddleware = cors({
		origin: (origin) => {
			const allowedOrigins = c.env.CORS_ALLOWED_ORIGINS ? c.env.CORS_ALLOWED_ORIGINS.split(',') : [];
			return (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) ? origin : undefined;
		},
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	});
	return corsMiddleware(c, next);
});

// --- Rutas ---
app.get('/api/ping', (c) => c.json({ok: true, message: 'pong'}));
app.route('/api', contactRoutes);
app.route('/api/admin', authRoutes);
app.route('/api/admin/users', usersRoutes);
app.route('/api/admin/categories', categoriesRoutes);
app.route('/api/admin/attributes', attributeRoutes);
app.route('/api/admin/attributes/:attributeId/values', attributeValuesRoutes);
app.route('/api/admin/products', productRoutes);
app.post('/api/admin/upload-url', getUploadUrl);

// --- ✅ NUEVO: Manejador de Activos Estáticos (Modo Avanzado de Pages) ---
// Esta es la última ruta, por lo que solo se ejecutará si ninguna ruta de API coincide.
// Delega la petición al servicio de activos estáticos de Cloudflare Pages.
app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw));

// --- 3. Manejo de Errores y 404 ---
app.notFound((c) => c.json({success: false, error: 'Not Found'}, 404));
app.onError((err, c) => {
	console.error(`[Hono Error] Unhandled error on path ${c.req.path}:`, err);
	return c.json({success: false, error: 'Internal Server Error'}, 500);
});

export default app;
