-- Migration number: 0002 	 2025-08-12_21:00:00

-- Tabla para Categorías y Subcategorías (auto-referenciada)
CREATE TABLE `categories` (
							  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
							  `name` text NOT NULL,
							  `description` text,
							  `parent_id` integer,
							  `created_at` integer NOT NULL,
							  `updated_at` integer NOT NULL,
							  FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);

-- Tabla para Productos
CREATE TABLE `products` (
							`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
							`name` text NOT NULL,
							`description` text,
							`category_id` integer,
							`is_featured` integer DEFAULT false NOT NULL,
							`created_at` integer NOT NULL,
							`updated_at` integer NOT NULL,
							FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);

-- Tabla para Atributos (Ej: Color, Capacidad)
CREATE TABLE `attributes` (
							  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
							  `name` text NOT NULL
);
CREATE UNIQUE INDEX `attributes_name_unique` ON `attributes` (`name`);

-- Tabla para Valores de Atributos (Ej: Rojo, 5kg)
CREATE TABLE `attribute_values` (
									`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
									`attribute_id` integer NOT NULL,
									`value` text NOT NULL,
									FOREIGN KEY (`attribute_id`) REFERENCES `attributes`(`id`) ON UPDATE no action ON DELETE cascade
);

-- Tabla para Variantes de Producto (SKUs)
CREATE TABLE `product_variants` (
									`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
									`product_id` integer NOT NULL,
									`sku` text,
									`price` integer NOT NULL,
									`stock` integer DEFAULT 0 NOT NULL,
									`sale_price` integer,
									FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX `product_variants_sku_unique` ON `product_variants` (`sku`);

-- Tabla de Unión para conectar Variantes con sus Valores de Atributo
CREATE TABLE `variant_values` (
								  `variant_id` integer NOT NULL,
								  `value_id` integer NOT NULL,
								  PRIMARY KEY(`variant_id`, `value_id`),
								  FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE cascade,
								  FOREIGN KEY (`value_id`) REFERENCES `attribute_values`(`id`) ON UPDATE no action ON DELETE cascade
);
