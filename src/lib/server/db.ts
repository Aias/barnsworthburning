import { relations } from '@aias/hozo';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { env } from '$env/dynamic/private';

const createDb = (): PostgresJsDatabase<typeof relations> => {
	if (!env.DATABASE_URL) {
		throw new Error('DATABASE_URL is not set');
	}
	return drizzle({ connection: env.DATABASE_URL, relations });
};

// Reuse one connection pool across dev-server module reloads.
const globalForDb = globalThis as { db?: PostgresJsDatabase<typeof relations> };

export const db = (globalForDb.db ??= createDb());
