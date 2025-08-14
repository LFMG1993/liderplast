import { z } from 'zod';

// ✅ MEJORA: Schema para una única variante de producto.
// Define la estructura que debe tener cada SKU en la solicitud.
const variantSchema = z.object({
	sku: z.string().min(1, 'El SKU es requerido'),
	price: z.number().int().positive('El precio debe ser un número positivo'),
	stock: z.number().int().min(0, 'El stock no puede ser negativo'),
	salePrice: z.number().int().positive('El precio de oferta debe ser positivo').optional(),
	// Un array de IDs numéricos que corresponden a los `attribute_values` (ej: [1, 5] para "Rojo" y "5kg")
	attributeValueIds: z.array(z.number().int()).min(1, 'Cada variante debe tener al menos un valor de atributo'),
});

// ✅ MEJORA: El schema principal para crear un producto completo.
// Este es el "contrato" que el frontend debe cumplir.
export const insertProductSchema = z.object({
	name: z.string().min(3, 'El nombre del producto es requerido'),
	description: z.string().optional(),
	categoryId: z.number().int().positive('Se requiere una categoría válida'),
	isFeatured: z.boolean().default(false),
	imageUrl: z.string().url('Debe ser una URL válida').nullable().optional(),
	// Un producto debe tener al menos una variante.
	variants: z.array(variantSchema).min(1, 'El producto debe tener al menos una variante'),
});
// ✅ MEJORA: Schema para actualizar un producto. Hacemos todos los campos opcionales.
export const updateProductSchema = insertProductSchema.partial();
