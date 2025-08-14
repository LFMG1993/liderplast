import type {Context} from "hono";
import type {UserPayload} from "../middlewares/auth.middleware";

export default async function getProfileHandler(c: Context<{
	Bindings: Env,
	Variables: { user: UserPayload }
}>) {
	// El middleware ya ha verificado al usuario y lo ha puesto en el contexto.
	const user = c.get('user');
	return c.json({success: true, profile: user});
}
