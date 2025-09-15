import imageCompression from 'browser-image-compression';
import {api} from "./api.ts";

/**
 * Sube una imagen a R2 siguiendo el flujo seguro.
 * @param file El archivo de imagen original.
 * @param entityName El nombre base para el archivo.
 * @returns La URL pública y permanente de la imagen subida.
 */
export async function uploadImage(file: File, entityName: string): Promise<string> {
    // Comprimir y convertir la imagen en el navegador
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: 'image/webp',
    };
    const compressedFile = await imageCompression(file, options);

    // Crear un nombre de archivo consistente y único
    const filename = `${entityName}-${Date.now()}.webp`;

    // Pedir la URL de subida segura a nuestro backend
    const response = await api.post<{ url: string }>('/api/admin/upload-url', {filename, contentType: 'image/webp'});
    const signedUrl = response.data.url;

    // Subir el archivo directamente a R2 usando la URL firmada
    const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: compressedFile,
        headers: {'Content-Type': 'image/webp'},
    });

    if (!uploadResponse.ok) {
        throw new Error('La subida del archivo a R2 falló.');
    }

    // 5. Devolver la URL pública y permanente del recurso.
    return `${import.meta.env.VITE_R2_PUBLIC_URL}/${filename}`;
}