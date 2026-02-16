# barnsworthburning

The name is always stylized as "barnsworthburning" — one word, lowercase.

## Database

- PostgreSQL via Drizzle ORM (`postgres-js` driver), connection in `$lib/server/db.ts`
- Schema shared from `@aias/hozo` package
- Use the relational query API (`db.query.table.findMany()`, `db.query.table.findFirst()`) over the SQL-like builder (`db.select().from()`)
