import { z } from 'zod';

export const ContactSchema = z.object({
	nombre: z.string().min(1, { message: "El nombre es requerido." }),
	email: z.string().email({ message: "El email no es válido." }),
	asunto: z.string().min(1, { message: "El asunto es requerido." }),
	mensaje: z.string().min(1, { message: "El mensaje es requerido." }),
});
