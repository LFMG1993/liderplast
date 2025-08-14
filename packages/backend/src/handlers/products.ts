import type {Context} from 'hono';
import {drizzle} from 'drizzle-orm/d1';
import {schema} from '../schemas';
import {insertProductSchema, updateProductSchema} from '../schemas/products.validation.schemas';
import {eq} from 'drizzle-orm';

// POST /api/admin/products -> Crear un producto con sus variantes
export async function createProduct(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	const body = await c.req.json();
	const validation = insertProductSchema.safeParse(body);

	if (!validation.success) {
		return c.json({success: false, errors: validation.error.flatten().fieldErrors}, 400);
	}

	const {name, description, categoryId, isFeatured, variants, imageUrl} = validation.data;
	const now = new Date();

	let createdProductId: number | null = null;

	try {
		// 1. Insertar el producto base
		const [product] = await db
			.insert(schema.products)
			.values({name, description, categoryId, isFeatured, imageUrl, createdAt: now, updatedAt: now})
			.returning({id: schema.products.id});

		createdProductId = product.id;

		// 2. Iterar e insertar cada variante
		for (const variantData of variants) {
			const {attributeValueIds, ...variantDetails} = variantData;

			const [variant] = await db
				.insert(schema.productVariants)
				.values({...variantDetails, productId: createdProductId})
				.returning({id: schema.productVariants.id});

			// 3. Preparar y insertar las relaciones en la tabla de unión
			const variantValuesToInsert = attributeValueIds.map((valueId) => ({
				variantId: variant.id,
				valueId: valueId,
			}));

			// Si una variante no tiene valores de atributo, no intentamos insertar un array vacío.
			if (variantValuesToInsert.length > 0) {
				await db.insert(schema.variantValues).values(variantValuesToInsert);
			}
		}

		return c.json({success: true, product: {id: createdProductId, ...validation.data}}, 201);
	} catch (e: any) {
		// --- LÓGICA DE ROLLBACK MANUAL ---
		// Si algo falló, pero el producto principal ya se había creado, lo eliminamos.
		if (createdProductId) {
			await db.delete(schema.products).where(eq(schema.products.id, createdProductId));
		}
		console.error('Error al crear el producto:', e);
		return c.json({
			success: false,
			error: 'Error al crear el producto. Verifique los datos e intente de nuevo.'
		}, 500);
	}
}

// ✅ MEJORA: Se añade la función para listar todos los productos.
// Incluimos información básica de la categoría y las variantes para que la lista sea útil.
export async function listProducts(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	try {
		const allProducts = await db.query.products.findMany({
			with: {
				category: {
					columns: {name: true},
				},
				variants: {
					columns: {id: true, sku: true, price: true, stock: true},
				},
			},
		});
		return c.json({success: true, products: allProducts});
	} catch (e) {
		console.error('Error al listar productos:', e);
		return c.json({success: false, error: 'Error al obtener los productos'}, 500);
	}
}

// ✅ MEJORA: Se añade la función para obtener un único producto con todos sus detalles.
// Esta es la consulta más rica, ideal para una página de "detalle de producto" o "editar producto".
export async function getProductById(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	const id = parseInt(c.req.param('id'), 10);

	try {
		const product = await db.query.products.findFirst({
			where: eq(schema.products.id, id),
			with: {
				category: true,
				variants: {
					with: {
						variantValues: {
							with: {
								attributeValue: {
									with: {
										attribute: true,
									},
								},
							},
						},
					},
				},
			},
		});

		if (!product) {
			return c.json({success: false, error: 'Producto no encontrado'}, 404);
		}
		return c.json({success: true, product});
	} catch (e) {
		console.error(`Error al obtener el producto ${id}:`, e);
		return c.json({success: false, error: 'Error al obtener el producto'}, 500);
	}
}

// ✅ MEJORA: Se añade la función para actualizar un producto.
// Utiliza una transacción para garantizar la consistencia: actualiza el producto base
// y reemplaza por completo sus variantes para simplificar la lógica.
export async function updateProduct(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	const id = parseInt(c.req.param('id'), 10);
	const body = await c.req.json();
	const validation = updateProductSchema.safeParse(body);

	if (!validation.success) {
		return c.json({success: false, errors: validation.error.flatten().fieldErrors}, 400);
	}

	const {variants, ...productData} = validation.data;

	try {
		// 1. Actualizar los datos del producto base si se proporcionaron
		if (Object.keys(productData).length > 0) {
			await db
				.update(schema.products)
				.set({...productData, updatedAt: new Date()})
				.where(eq(schema.products.id, id));
		}

		// 2. Si se proporcionó un nuevo array de variantes, reemplazarlas.
		if (variants) {
			// 2a. Eliminar todas las variantes antiguas (cascade delete limpiará variant_values)
			// Esta operación es clave y debe completarse antes de añadir las nuevas.
			await db.delete(schema.productVariants).where(eq(schema.productVariants.productId, id));

			// 2b. Insertar las nuevas variantes (lógica idéntica a la de createProduct)
			for (const variantData of variants) {
				const {attributeValueIds, ...variantDetails} = variantData;
				const [variant] = await db
					.insert(schema.productVariants)
					.values({...variantDetails, productId: id})
					.returning({id: schema.productVariants.id});

				if (attributeValueIds && attributeValueIds.length > 0) {
					const variantValuesToInsert = attributeValueIds.map((valueId) => ({
						variantId: variant.id,
						valueId: valueId,
					}));
					await db.insert(schema.variantValues).values(variantValuesToInsert);
				}
			}
		}

		return c.json({success: true, message: 'Producto actualizado correctamente'});
	} catch (e: any) {
		console.error(`Error al actualizar el producto ${id}:`, e);
		return c.json({success: false, error: 'Error al actualizar el producto'}, 500);
	}
}

// ✅ MEJORA: Se añade la función para eliminar un producto.
// Gracias a `onDelete: 'cascade'`, Drizzle se encargará de eliminar todas las
// variantes y relaciones asociadas automáticamente.
export async function deleteProduct(c: Context<{ Bindings: Env }>) {
	const db = drizzle(c.env.LIDERPLAST_DB, {schema});
	const id = parseInt(c.req.param('id'), 10);
	try {
		const [deleted] = await db.delete(schema.products).where(eq(schema.products.id, id)).returning({id: schema.products.id});
		if (!deleted) {
			return c.json({success: false, error: 'Producto no encontrado'}, 404);
		}
		return c.json({success: true});
	} catch (e) {
		console.error(`Error al eliminar el producto ${id}:`, e);
		return c.json({success: false, error: 'Error al eliminar el producto'}, 500);
	}
}
