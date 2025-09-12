// Este archivo de declaración de tipos (.d.ts) le informa a TypeScript
// sobre las variables de entorno y los bindings que Cloudflare inyectará
// en el entorno de ejecución de tu Worker.

// Es importante que este archivo no se importe en ningún otro lugar;
// TypeScript lo encontrará y aplicará los tipos globalmente en el proyecto.

interface Env {
	// --- Bindings configurados en el dashboard de Cloudflare ---
	LIDERPLAST_DB: D1Database;
	ASSETS: Fetcher; // ✅ AÑADIDO: El binding para servir activos estáticos en Pages.

	// --- Variables de entorno (secrets) ---
	CORS_ALLOWED_ORIGINS: string;
	JWT_SECRET: string;
	// Añade aquí cualquier otra variable que necesites.
}
