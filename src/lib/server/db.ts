import { env } from '$env/dynamic/private';
import { schema, relations } from '@aias/hozo';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const createDb = () => {
	const client = postgres(env.DATABASE_URL);
	return drizzle({ client, schema, relations });
};

type Database = ReturnType<typeof createDb>;

const globalForDb = globalThis as unknown as { db: Database | undefined };

export const db = globalForDb.db ?? createDb();

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
