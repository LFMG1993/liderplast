import imageCompression from 'browser-image-compression';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL;

/**
 * Sube una imagen a R2 siguiendo el flujo seguro.
 * @param file El archivo de imagen original.
 * @param entityName El nombre base para el archivo (ej: "category-123").
 * @returns La URL pública y permanente de la imagen subida.
 */
export async function uploadImage(file: File, entityName: string): Promise<string> {
    // 1. Comprimir y convertir la imagen en el navegador
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: 'image/webp',
    };
    const compressedFile = await imageCompression(file, options);

    // 2. Crear un nombre de archivo consistente y único
    const filename = `${entityName}-${Date.now()}.webp`;

    // 3. Pedir la URL de subida segura a nuestro backend
    const presignResponse = await fetch(`${API_BASE_URL}/api/admin/upload-url`, {
        credentials: 'include',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({filename, contentType: 'image/webp'}),
    });

    if (!presignResponse.ok) {
        throw new Error('No se pudo obtener la URL de subida desde el backend.');
    }

    const {url: signedUrl} = await presignResponse.json();

    // 4. Subir el archivo directamente a R2 usando la URL firmada
    const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: compressedFile,
        headers: {'Content-Type': 'image/webp'},
    });

    if (!uploadResponse.ok) {
        throw new Error('La subida del archivo a R2 falló.');
    }

    // 5. Devolver la URL pública y permanente del recurso.
    return `${R2_PUBLIC_URL}/${filename}`;
}