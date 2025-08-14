import {z} from "zod";

export const LoginSchema = z.object({
	email: z.string().email({ message: "El email no es válido." }),
	password: z.string().min(1, { message: "La contraseña es requerida." }),
});
