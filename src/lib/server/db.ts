import { DATABASE_URL } from '$app/env/private';
import { relations } from '@aias/hozo';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

// Reuse one connection pool across dev-server module reloads.
const globalForDb = globalThis as { db?: PostgresJsDatabase<typeof relations> };

export const db = (globalForDb.db ??= drizzle({ connection: DATABASE_URL, relations }));
