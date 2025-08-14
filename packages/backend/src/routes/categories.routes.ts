import { Hono } from 'hono';
import * as categoryHandlers from '../handlers/categories';

const categoryRoutes = new Hono();

// ✅ MEJORA: Agrupamos todas las rutas relacionadas con categorías en su propio archivo.
// Esto mantiene el archivo principal (index.ts) limpio y organizado.
categoryRoutes.get('/', categoryHandlers.listCategories);
categoryRoutes.post('/', categoryHandlers.createCategory);
categoryRoutes.put('/:id', categoryHandlers.updateCategory);
categoryRoutes.delete('/:id', categoryHandlers.deleteCategory);

export default categoryRoutes;
