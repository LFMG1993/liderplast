CREATE TABLE IF NOT EXISTS usuarios
(
	id              INTEGER PRIMARY KEY AUTOINCREMENT,
	nombre          TEXT NOT NULL,
	email           TEXT NOT NULL UNIQUE,
	hashed_password TEXT NOT NULL,
	rol             TEXT NOT NULL DEFAULT 'admin',
	created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO usuarios (nombre, email, hashed_password)
VALUES ('Admin Liderplast', 'admin@liderplast.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f');
