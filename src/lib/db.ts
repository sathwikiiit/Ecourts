import { D1Database } from '@cloudflare/workers-types';
/**
 * Represents the Cloudflare environment bindings.
 * This is a generic type and should be extended in your actual
 * worker types to include specific bindings for D1, R2, KV, etc.
 *
 * @example
 * interface Env {
 *   DB: D1Database;
 * }
 */

export interface Env {
	DB: D1Database;
}
/**
 * Returns the D1 database instance from the environment.
 * @param env The Cloudflare environment object.
 * @returns The D1Database instance.
 */
export const getDb = (env: Env): D1Database => {
    if (!env.DB) {
        throw new Error("D1 Database binding 'DB' is not found in the environment.");
    }
    return env.DB;
}