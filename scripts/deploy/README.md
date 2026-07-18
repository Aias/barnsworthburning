# Deploying barnsworthburning on the Mac mini

The site runs as a Node process under PM2, reads the Red Cliff Record Postgres database on the same machine, and is exposed publicly through a Cloudflare Tunnel. An auto-deploy monitor polls `main` and rebuilds on new commits.

## Prerequisites

- Node 24 and pnpm (`corepack enable pnpm` or a version manager)
- PM2: `npm install -g pm2`
- `cloudflared` (`brew install cloudflared`)
- The Red Cliff Record Postgres database running locally
- `@aias/hozo` published to npm (the site depends on it)

## Database role

The site only reads. Create a dedicated role and grant it SELECT on the three tables the site queries (run by hand against the mini's Postgres; pick a real password):

```sql
CREATE ROLE bwb_read LOGIN PASSWORD 'change-me';
GRANT CONNECT ON DATABASE redcliffrecord TO bwb_read;
GRANT USAGE ON SCHEMA public TO bwb_read;
GRANT SELECT ON records, links, media TO bwb_read;
```

If a future rcr migration drops and recreates one of these tables, re-run the `GRANT SELECT`.

## Setup

1. Clone the repo and install:

   ```bash
   git clone git@github.com:Aias/barnsworthburning.git
   cd barnsworthburning
   pnpm install
   ```

2. Create `.env` (see `.env.example`):

   ```bash
   DATABASE_URL="postgresql://bwb_read:...@localhost:5432/redcliffrecord"
   PUBLIC_RCR_URL="https://<rcr-tailscale-hostname>"
   ```

3. Build and start under PM2:

   ```bash
   pnpm build
   ./scripts/deploy/setup-pm2.sh
   ```

4. Follow the instructions from `pm2 startup` to enable auto-start on boot.

The app listens on port 3002 (set in `ecosystem.config.cjs`).

## Cloudflare Tunnel

Public traffic reaches the mini through a named tunnel; Postgres and the rest of the tailnet stay private.

```bash
cloudflared tunnel login
cloudflared tunnel create barnsworthburning
```

Configure `~/.cloudflared/config.yml`:

```yaml
tunnel: <tunnel-id>
credentials-file: /Users/<user>/.cloudflared/<tunnel-id>.json
ingress:
  - hostname: barnsworthburning.net
    service: http://localhost:3002
  - service: http_status:404
```

Route DNS and install the tunnel as a service:

```bash
cloudflared tunnel route dns barnsworthburning barnsworthburning.net
sudo cloudflared service install
```

## Auto-deployment

`barnsworthburning-deploy` (started by `setup-pm2.sh`) polls `origin/main` every 60 seconds. On new commits it pulls, runs `pnpm install --frozen-lockfile`, builds, and restarts the app process. Deploying is just merging to `main`.

## Operations

- **Status**: `pm2 status`
- **App logs**: `pm2 logs barnsworthburning`
- **Deploy logs**: `pm2 logs barnsworthburning-deploy`
- **Manual deploy**: `git pull && pnpm install && pnpm build && pm2 restart barnsworthburning`
- **Log rotation**: handled by `pm2-logrotate` (installed by `setup-pm2.sh`); tune with `pm2 set pm2-logrotate:<key> <value>`
