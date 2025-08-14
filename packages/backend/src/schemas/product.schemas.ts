import {
	sqliteTable,
	integer,
	text,
	primaryKey,
} from 'drizzle-orm/sqlite-core';
import {relations} from 'drizzle-orm';

// ✨ NUEVA TABLA: categories
// Maneja categorías y subcategorías con una relación auto-referenciada.
export const categories = sqliteTable('categories', {
	id: integer('id').primaryKey({autoIncrement: true}),
	name: text('name').notNull(),
	description: text('description'),
	// Si parentId es NULL, es una categoría principal. Si tiene un valor, es una subcategoría.
	parentId: integer('parent_id').references((): any => categories.id, {onDelete: 'set null'}),
	imageUrl: text('image_url'), // URL de la imagen del producto
	createdAt: integer('created_at', {mode: 'timestamp'}).notNull(),
	updatedAt: integer('updated_at', {mode: 'timestamp'}).notNull(),
});

// ✨ NUEVA TABLA: products
// Almacena la información genérica de un producto.
export const products = sqliteTable('products', {
	id: integer('id').primaryKey({autoIncrement: true}),
	name: text('name').notNull(), // Ej: "Bolsa Camiseta Asa Fina"
	description: text('description'),
	categoryId: integer('category_id').references(() => categories.id, {onDelete: 'set null'}),
	isFeatured: integer('is_featured', {mode: 'boolean'}).default(false).notNull(), // Para destacar en la tienda
	imageUrl: text('image_url'), // URL de la imagen del producto
	createdAt: integer('created_at', {mode: 'timestamp'}).notNull(),
	updatedAt: integer('updated_at', {mode: 'timestamp'}).notNull(),
});

// ✨ NUEVA TABLA: attributes
// Define los tipos de atributos que un producto puede tener.
export const attributes = sqliteTable('attributes', {
	id: integer('id').primaryKey({autoIncrement: true}),
	name: text('name').notNull().unique(), // Ej: "Color", "Capacidad", "Marca"
});

// ✨ NUEVA TABLA: attribute_values
// Define los valores posibles para cada atributo.
export const attributeValues = sqliteTable('attribute_values', {
	id: integer('id').primaryKey({autoIncrement: true}),
	attributeId: integer('attribute_id').notNull().references(() => attributes.id, {onDelete: 'cascade'}),
	value: text('value').notNull(), // Ej: "Rojo", "5 kg", "Liderplast"
});

// ✨ NUEVA TABLA: product_variants (SKUs)
// El artículo real que se vende, con su propio precio y stock.
export const productVariants = sqliteTable('product_variants', {
	id: integer('id').primaryKey({autoIncrement: true}),
	productId: integer('product_id').notNull().references(() => products.id, {onDelete: 'cascade'}),
	sku: text('sku').unique(), // Stock Keeping Unit, código único para el inventario
	price: integer('price').notNull(), // Almacenar como centavos para evitar problemas de punto flotante
	stock: integer('stock').notNull().default(0),
	salePrice: integer('sale_price'), // Para descuentos, también en centavos
});

// ✨ NUEVA TABLA DE UNIÓN: variant_values
// Conecta una variante con sus valores de atributo específicos.
export const variantValues = sqliteTable('variant_values', {
	variantId: integer('variant_id').notNull().references(() => productVariants.id, {onDelete: 'cascade'}),
	valueId: integer('value_id').notNull().references(() => attributeValues.id, {onDelete: 'cascade'}),
}, (table) => {
	return {
		pk: primaryKey({columns: [table.variantId, table.valueId]}),
	};
});

// --- RELACIONES ---

// Una categoría puede tener un padre, muchos hijos y muchos productos.
export const categoriesRelations = relations(categories, ({one, many}) => ({
	parent: one(categories, {
		fields: [categories.parentId],
		references: [categories.id],
		relationName: 'parent_category',
	}),
	children: many(categories, {
		relationName: 'parent_category',
	}),
	products: many(products),
}));

// ✅ MEJORA: Se añaden las relaciones para `attributes` y `attributeValues`.
// Drizzle necesita una definición de `relations` para CADA tabla que participa
// en una relación para poder construir correctamente el objeto `db.query`.
// Esta omisión era la causa del error `Property categories does not exist on type {}`.
export const attributesRelations = relations(attributes, ({many}) => ({
	values: many(attributeValues),
}));

export const attributeValuesRelations = relations(attributeValues, ({one, many}) => ({
	attribute: one(attributes, {
		fields: [attributeValues.attributeId],
		references: [attributes.id],
	}),
	variantValues: many(variantValues),
}));

// Un producto puede tener muchas variantes
export const productsRelations = relations(products, ({many, one}) => ({
	variants: many(productVariants),
	// Un producto pertenece a una categoría
	category: one(categories, {fields: [products.categoryId], references: [categories.id]}),
}));

// Una variante pertenece a un solo producto y tiene muchos valores de atributo a través de la tabla de unión
export const productVariantsRelations = relations(productVariants, ({one, many}) => ({
	product: one(products, {
		fields: [productVariants.productId],
		references: [products.id],
	}),
	variantValues: many(variantValues),
}));

// La tabla de unión conecta a una variante y a un valor de atributo
export const variantValuesRelations = relations(variantValues, ({one}) => ({
	variant: one(productVariants, {
		fields: [variantValues.variantId],
		references: [productVariants.id]
	}),
	attributeValue: one(attributeValues, {
		fields: [variantValues.valueId],
		references: [attributeValues.id]
	}),
}));
