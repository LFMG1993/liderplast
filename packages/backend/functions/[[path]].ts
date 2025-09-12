// ✅ SOLUCIÓN 1: Esta directiva de triple-slash le indica a TypeScript que
// incluya las definiciones de tipos de nuestro archivo de entorno,
// resolviendo el error "Cannot find name Env".
/// <reference path="../src/env.d.ts" />

// Este archivo es el punto de entrada para Cloudflare Pages Functions.
// El nombre especial `[[path]]` actúa como una "ruta catch-all",
// lo que significa que interceptará TODAS las peticiones que lleguen al sitio.

import app from '../src/index'; // Importamos nuestra aplicación de Hono existente.

// La función `onRequest` es el handler que Pages espera.
// Simplemente le pasamos la petición a nuestra aplicación de Hono.
export const onRequest: PagesFunction<Env> = (context) => {
	// ✅ SOLUCIÓN 2: Usamos una aserción de tipo `as any` en el tercer argumento.
	// Esto le dice a TypeScript que ignore el conflicto de tipos para `ExecutionContext`,
	// ya que sabemos que en tiempo de ejecución el objeto `context` es compatible.
	return app.fetch(context.request, context.env, context as any);
};
