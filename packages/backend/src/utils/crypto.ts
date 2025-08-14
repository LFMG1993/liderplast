/**
 * Crea un hash de una contraseña en texto plano.
 * Usa SHA-256, que es rápido y adecuado para el entorno de Workers.
 * @param password La contraseña en texto plano a hashear.
 * @returns Una promesa que se resuelve con el hash en formato hexadecimal.
 */
export async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifica si una contraseña en texto plano coincide con un hash almacenado.
 * Usa SHA-256, que es rápido y adecuado para el entorno de Workers.
 * @param password La contraseña en texto plano.
 * @param hashedPassword El hash almacenado en la base de datos.
 * @returns Una promesa que se resuelve a `true` si las contraseñas coinciden, de lo contrario `false`.
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashOfInput = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
	return hashOfInput === hashedPassword;
}
