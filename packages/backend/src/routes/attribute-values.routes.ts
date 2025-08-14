import {Hono} from 'hono';
import {
	listValuesForAttribute,
	createValueForAttribute,
	updateAttributeValue,
	deleteAttributeValue
} from '../handlers/attribute-values';
import {authMiddleware} from '../middlewares/auth.middleware';
import {adminAuth} from "../middlewares/admin.middleware";

// Este archivo es el que conecta las direcciones anidadas con sus handlers específicos.
const attributeValuesRoutes = new Hono<{ Bindings: Env }>();

// Aplicamos el middleware de autenticación y privilegios a todas estas rutas
attributeValuesRoutes.use('/*', authMiddleware, adminAuth);
attributeValuesRoutes.get('/', listValuesForAttribute);
attributeValuesRoutes.post('/', createValueForAttribute);
attributeValuesRoutes.put('/:valueId', updateAttributeValue);
attributeValuesRoutes.delete('/:valueId', deleteAttributeValue);

export default attributeValuesRoutes;
