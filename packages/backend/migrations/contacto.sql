CREATE TABLE contactos (
						   id_contactos INTEGER PRIMARY KEY AUTOINCREMENT,
						   nombre TEXT NOT NULL,
						   email TEXT NOT NULL,
						   asunto TEXT,
						   mensaje TEXT NOT NULL,
						   creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);
