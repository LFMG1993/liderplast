/**
 * Convierte un texto en un "slug" amigable para URL.
 * Ejemplo: "Contenedores de Basura" -> "contenedores-de-basura"
 * @param text El texto a convertir.
 * @returns El texto convertido en slug.
 */
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Reemplaza espacios con -
        .replace(/[^\w\-]+/g, '')       // Elimina todos los caracteres no alfanuméricos
        .replace(/\-\-+/g, '-');        // Reemplaza múltiples - con uno solo
}