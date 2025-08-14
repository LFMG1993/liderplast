import { Hono } from 'hono';
import * as attributeHandlers from '../handlers/attributes';

const attributeRoutes = new Hono();

attributeRoutes.get('/', attributeHandlers.listAttributes);
attributeRoutes.post('/', attributeHandlers.createAttribute);
attributeRoutes.put('/:id', attributeHandlers.updateAttribute);
attributeRoutes.delete('/:id', attributeHandlers.deleteAttribute);

export default attributeRoutes;
