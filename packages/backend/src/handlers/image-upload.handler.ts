import type { Context } from 'hono';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function getUploadUrl(c: Context<{ Bindings: Env }>) {
	// Inicializamos el cliente S3 para que apunte a nuestro bucket de R2
	const s3 = new S3Client({
		region: 'auto',
		endpoint: `https://${c.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: c.env.R2_ACCESS_KEY_ID,
			secretAccessKey: c.env.R2_SECRET_ACCESS_KEY,
		},
	});

	try {
		const { filename, contentType } = await c.req.json();

		if (!filename || !contentType) {
			return c.json({ success: false, error: 'Faltan filename o contentType' }, 400);
		}

		// Creamos el comando para subir un objeto
		const command = new PutObjectCommand({
			Bucket: c.env.R2_BUCKET_NAME,
			Key: filename, // El nombre del archivo que el frontend nos dijo
			ContentType: contentType,
		});

		// Generamos la URL firmada que es válida por 5 minutos
		const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

		return c.json({ success: true, url: signedUrl });
	} catch (e: any) {
		console.error('Error al generar la URL de subida:', e);
		return c.json({ success: false, error: 'No se pudo generar la URL de subida' }, 500);
	}
}
