import {Hono} from 'hono';
import * as productHandlers from '../handlers/products';

const productRoutes = new Hono();

productRoutes.get('/', productHandlers.listProducts);
productRoutes.post('/', productHandlers.createProduct);
productRoutes.get('/:id', productHandlers.getProductById);
productRoutes.put('/:id', productHandlers.updateProduct);
productRoutes.delete('/:id', productHandlers.deleteProduct);

export default productRoutes;
