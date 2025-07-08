declare namespace Cloudflare {
	export interface Env {
		LIDERPLAST_DB: D1Database;
	}
}
interface Env extends Cloudflare.Env {}
