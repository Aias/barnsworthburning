# Airtable → Red Cliff Record migration

Working plan for rebasing barnsworthburning on the Red Cliff Record (rcr) Postgres database via the `@aias/hozo` package. This document is deleted once the migration lands.

## Summary of decisions

- **bwb becomes the public window into rcr.** It shows every curated, non-private record, not just the Airtable-sourced subset. The site adopts rcr's unified record model, keeping bwb's dual-pane paradigm: artifacts open as trail panels, while entities and concepts render as gallery pages in the main pane — the trail explores within a context, the main pane switches between contexts.
- **Hosting moves off Cloudflare Workers** to the mac mini (SvelteKit `adapter-node`, Node/pnpm toolchain kept), managed by pm2 with an auto-deploy script mirroring rcr's, exposed publicly through a Cloudflare Tunnel. Postgres stays tailnet-only.
- **Data access is direct Drizzle queries** using `@aias/hozo` schema + relations with the `postgres-js` driver. The internal `/api/*` REST layer is deleted; pages load data in idiomatic SvelteKit `load` functions. There is no view-model translation layer; components consume record/link shapes natively.
- **URLs get a clean break.** Record detail lives at `/records/{id}/{slug}` (id is the lookup key; the slug is derived from the title at render time, Notion-style, and exists for redundancy/SEO). Type lists live at `/artifacts`, `/entities`, `/concepts`, with `/extracts`, `/creators`, `/spaces` redirecting to them. Old Airtable rec-ID URLs get no per-record redirects.
- **"Best" sorting = elo.** All ranked queries order by `eloScore` desc, tiebroken by `rating` desc, then `contentCreatedAt` desc. Elo seeding is a followup after cutover: review `seed-elo.ts` together, then run it (today every record sits at the default 1200 with zero matchups, so tiebreaks carry the ordering until then).
- **hozo stays lean** (schema + relations + small utils). Consumed as a git dependency during the migration; published fresh to npm once the shape settles (npm has a stale 0.3.0 from February 2026). Only add shared helpers that genuinely serve both apps.
- **Airtable retires at cutover**: freeze the base, run a final sync, author in rcr from then on; the sync job is dropped from rotation afterward.

## Verified ground truth (prod DB, July 2026)

- Public records: 21,524 artifacts (12,477 curated), 4,774 entities (all curated), 1,379 concepts (all curated). Only 11 Airtable-sourced artifacts are non-curated, so the curated+public filter preserves effectively all current site content.
- The Airtable sync mapped: extract→artifact, creator→entity, space→concept, format→concept; links use `created_by`, `tagged_with`, `contained_by`, `has_format`, `related_to`; `michelinStars`→`rating` (0–3); unpublished extracts→`isPrivate`.
- Slugs are absent (2 of ~28k records), hence deriving the URL slug from the title instead of backfilling.
- All 4,917 media rows point at `assets.barnsworthburning.net` (R2). bwb can render them directly; the `airtable-media-proxy` worker retires. `media.altText` improves on today's filename-as-alt.
- bwb never renders creator professions/organizations/nationality or space icons, so the sync's lossy mapping of those fields costs nothing.
- Version pins that bwb must match: `drizzle-orm@1.0.0-rc.4` and `zod@~4.4.3` (hozo peer deps).
- `VITE_AIRTABLE_ACCESS_TOKEN` is client-exposed today (VITE\_ prefix). It dies with Airtable; revoke the token at cutover.

## Site structure

| Route                                  | Content                                                                                                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`                                    | Index/table-of-contents: top entities + concepts by elo (first 100, links to full lists)                                                                     |
| `/artifacts`, `/entities`, `/concepts` | Type-filtered record lists, elo-ordered, paginated at 100/page (`?page=N`)                                                                                   |
| `/records/{id}/{slug}`                 | Record detail for every type (artifacts as panels, entities/concepts as galleries); `/records/{id}` and stale slugs 301 to the canonical path                |
| `/extracts`, `/creators`, `/spaces`    | 301 → `/artifacts`, `/entities`, `/concepts` (child paths redirect to the section root)                                                                      |
| `/search?q=&type=`                     | Trigram ILIKE over title/content/summary/abbreviation (all pg_trgm-indexed), all types, filterable by type, elo-ordered                                      |
| `/feed.xml`                            | 30 most recent curated artifacts by `contentCreatedAt`, with children via `contained_by`; atom IDs change with the URL break (one-time re-delivery accepted) |
| `/index.txt`                           | Entities + concepts, mirroring the homepage                                                                                                                  |

Every query filters `isPrivate = false AND isCurated = true`.

Record detail panels render title, rating stars, content/notes/summary as markdown, media with alt text, and source URL, followed by link sections grouped by predicate with human labels: `created_by` ("by"), `contained_by`/`contains` ("from"/"contains"), `tagged_with` ("tagged"), `related_to` ("related"), `has_format`, `quotes`, `about`, `references` as they occur. Incoming and outgoing directions both render, using the predicate's canonical/inverse names from hozo.

## Work plan: barnsworthburning

1. **Data layer.** Remove the `airtable` dependency, `src/types/Airtable.ts`, `src/lib/server/requests.ts`, `src/helpers/mapping.ts`, and the `src/lib/api.ts` client. Add `@aias/hozo` (git dep, see rcr work below), `drizzle-orm` (exact rc pin), `postgres`, `zod`. Create `src/lib/server/db.ts`: `drizzle(postgres(DATABASE_URL), { relations })` with `DATABASE_URL` from `$env/dynamic/private`. Build query modules for: type lists (paginated, best-sorted), record detail (links grouped by predicate + media), search, homepage lists, and feed entries.
2. **Routes.** Implement the table above; delete all `/api/*` endpoints and move data loading into `+page.server.ts` loads. Keep the existing cache-header helper strategy per route class. Reuse the existing slugify helper for canonical slugs.
3. **Components.** Refactor to native record shapes: the extract panel and list components generalize to records of any type; stars read `rating`; images come from the `media` relation; nav becomes Artifacts / Entities / Concepts / Search. Add pagination controls.
4. **Deployment.** Swap `adapter-cloudflare` for `adapter-node`; remove `wrangler.toml`. Add a pm2 app + auto-deploy script on the mini modeled on rcr's `scripts/deploy/`. Configure a Cloudflare Tunnel for `barnsworthburning.net` → the mini. Retire the Workers deployment and the `airtable-media-proxy` worker.
5. **Environments.** Prod `DATABASE_URL` points at the mini's Postgres via a read-only role; dev points at the local dev database kept fresh with `rcr db clone-prod-to-dev`. Remove all `VITE_`-prefixed secrets.

## Work plan: red-cliff-record

1. **Publish `@aias/hozo` 0.4.0 to npm** (a git dependency is unworkable: pnpm 10's bundled `preferred-pm` hits the yarn-workspace heuristic on rcr's `workspaces` field and always tries `yarn install`, with no config override). hozo builds `dist/` via `prepack`, which runs on `npm`/`bun publish`. Until the publish lands, bwb depends on `link:../../red-cliff-record/mumbai/packages/hozo` (the sibling Conductor worktree); swap to `~0.4.0` once published.
2. **Shared helpers, only as earned**: candidates that serve both apps are a public-visibility filter fragment and a best-sort (elo/rating/recency) order helper. Anything bwb-specific stays in bwb.
3. **Read-only Postgres role** for bwb with SELECT on `records`, `links`, `media` only (SQL to run by hand against the mini's Postgres).
4. **No schema or data-model changes.** The records/links/media model already carries everything bwb renders.
5. **Republish hozo** as needed while the consumption shape settles; bwb tracks published versions once the initial 0.4.0 lands.

## Cutover checklist

1. Publish `@aias/hozo` 0.4.0 to npm; swap bwb's `file:` dep for `~0.4.0` (the mini can't resolve the worktree path).
2. Freeze Airtable edits; run the final sync; verify record counts match expectations.
3. Delete `has_format` links targeting the Fragments record in prod (`delete from links where predicate = 'has_format' and target_id = 3233;`) — an absent format means fragment, which the site leaves unlabeled.
4. Optionally sweep the 11 non-curated Airtable artifacts (curate or consciously leave hidden).
5. Stand up bwb on the mini per `scripts/deploy/README.md` (read-only role, pm2, tunnel); verify routes, feed, and search against prod data.
6. Point `barnsworthburning.net` at the tunnel; retire the Workers deployment and image-proxy worker.
7. Revoke the exposed Airtable token.

## Followups (after cutover)

- Review `seed-elo.ts` together, then seed elo scores (until then, rating/recency tiebreaks drive ordering).
- Disable the Airtable sync job; `airtable_*` tables stay for provenance (removal is a separate, later decision).
- Revisit making the rcr database/app publicly reachable; bwb's architecture doesn't change when that happens.
