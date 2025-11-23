import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { relations, schema } from '@aias/hozo';

const createDb = () => {
	const pool = new Pool({
		connectionString: process.env.VITE_DATABASE_URL,
		max: 10,
		idleTimeoutMillis: 30000
	});
	return drizzle(pool, { schema, relations });
};

type Database = ReturnType<typeof createDb>;

const globalForDb = globalThis as unknown as {
	db: Database | undefined;
};

export const db = globalForDb.db ?? createDb();

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
