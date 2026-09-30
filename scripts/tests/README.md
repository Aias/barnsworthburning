# Public-record regression tests

Run from the repository root after installing dependencies:

```sh
npm test
```

Requires Node.js 24 or newer for the built-in TypeScript stripper and SQLite driver. No database credentials or running app are required. Node may print an experimental TypeScript-stripping warning.

## Coverage

- The exact public record, media, and child-preview media field allowlists, including unexpected future fields on oversized input rows
- Explicit scalar query projections at every nested relation, including relation-only selections with `columns: {}`
- Private, uncurated, and missing relations in all predicate buckets
- Visible titleless attachments and children, deliberately public notes, preview precedence, and visual-media fallback
- Best-first ranking, tie-breakers, chronological children, deduplication, and connection insertion order
- Cards, search, detail pages, similarity results, artifact lists, and recursive feed payloads
- Corpus-count SQL behavior for private/uncurated intermediate works, direct paths, duplicate child paths, invisible contributors, and visible titleless intermediate works

## Test boundaries

The harness reads and executes the current TypeScript implementations in `src/lib/server/records.ts` and `src/lib/records.ts`. It imports predicate metadata from the real `@aias/hozo` package. It strips TypeScript and replaces module imports to avoid starting SvelteKit or opening a production database connection. The functions under test are not copied into fixtures.

Database calls are captured by in-memory stand-ins. The SQL tag preserves template text and parameters; count tests capture the actual expression produced by `indexEntriesFor` and execute it against synthetic records and links in SQLite. The only SQL rewrite removes PostgreSQL's `::int` aggregate cast.

These are focused unit/relational regression tests, not a Postgres/Drizzle integration test, SvelteKit build, or live-data test. They do not establish production query plans, transferred byte counts, or end-to-end rendering. Run the project's type check, linter, and build separately.
