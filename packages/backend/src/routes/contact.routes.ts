import { Hono } from 'hono';
import contactHandler from '../handlers/contact';

const contactRoutes = new Hono<{ Bindings: Env }>();

contactRoutes.post('/contact', contactHandler);

export default contactRoutes;
