# Dashboard V3 — Agent Instructions

## Project

PC端营销数据 Dashboard for Exness/Vantage C-Level executives.
pnpm monorepo (Turborepo) with two active apps:

| App | Path | Stack | Port |
|-----|------|-------|------|
| Frontend | `apps/frontend/` | React 19 + Vite 6 + Tailwind 4 + Recharts 3 | 5173 |
| Backend | `apps/backend/` | NestJS 11 + Prisma 6 + PostgreSQL 16 + Redis 7 | 3000 |

`apps/dashboard-v3-main/` is a legacy single-app — ignore it.

Full architecture doc: `docs/ARCHITECTURE.md` (aspirational; actual code may differ).

## Commands

Package manager is **pnpm** (10.13.1). Do not use npm.

```bash
pnpm dev            # Turborepo: starts frontend + backend concurrently
pnpm build          # Turborepo build all
pnpm test           # Turborepo test all
pnpm typecheck      # TypeScript check all
pnpm lint           # ESLint all
pnpm format:check   # Prettier check all
pnpm check          # typecheck + lint + format:check combined

# Single app
cd apps/frontend && pnpm dev
cd apps/backend && pnpm dev          # runs: prisma generate && nest start --watch

# Database
pnpm db:up          # docker compose up -d (PostgreSQL 16 + Redis 7)
pnpm db:down        # docker compose down
pnpm db:reset       # docker compose down -v && up -d (destroys data)
pnpm db:migrate     # cd apps/backend && pnpm prisma migrate dev
pnpm db:studio      # Prisma Studio at http://localhost:5555

# E2E
pnpm e2e            # Playwright (Edge, headed, slowMo=500ms, workers=1)
```

### Verification order

`typecheck → lint → format:check → build` (CI runs this sequence).

### Single test

```bash
# Backend (Jest)
cd apps/backend && pnpm test                    # all
cd apps/backend && pnpm test -- kpi.service     # pattern match

# Frontend (Vitest)
cd apps/frontend && pnpm test
```

## Architecture

### Backend (NestJS)

Standard NestJS module pattern. Each feature in `apps/backend/src/modules/<name>/`:

```
<name>.module.ts      # NestJS module registration
<name>.controller.ts  # Route handlers (@Controller decorator)
<name>.service.ts     # Business logic (@Injectable)
```

14 feature modules registered in `apps/backend/src/app.module.ts`:
kpi, channels, users, funnel, reputation, app-market, health, market-intelligence, aso, market-command, ai, marketing, sensor-tower.

Shared code in `apps/backend/src/common/`:
- `dto/query.dto.ts` — BaseQueryDto (timeRange, region, etc.)
- `scaling/scales.ts` — TIME_SCALE, REGION_SCALE, COST_SCALE, `getMultiplier()`
- `utils/date-range.ts`, `utils/region-filter-orm.ts`
- `interceptors/response.interceptor.ts` — wraps all responses in `{ success, data, meta }`
- `filters/http-exception.filter.ts` — unified error handling

Global prefix: `/api/v1` (set in `main.ts`).

### Frontend

Components in `apps/frontend/src/components/` (14 page components + 2 pickers).
Shared code in `apps/frontend/src/lib/`:
- `api.ts` — API call functions
- `DashboardContext.tsx` — global state (timeRange, selectedRegion)
- `sensorTowerApi.ts` — Sensor Tower client

Vite proxies `/api` → `http://localhost:3000` in dev.

### Database

Prisma schema at `apps/backend/prisma/schema.prisma`. 5 models:
`DailyAggregate`, `UserFunnel`, `FtdFttConversion`, `FttRetention`, `ChannelLtv`.
All use `@map()` to snake_case table names. DB connection via `DATABASE_URL` env var.

Default dev DB: `postgresql://dashboard:dashboard_dev_2026@localhost:5432/dashboard_v3`

### Response format

All API responses wrapped by `ResponseInterceptor`:
```json
{ "success": true, "data": { ... }, "meta": { "timestamp": "..." } }
```

## Coding conventions

- TypeScript strict mode
- Files: `kebab-case.ts` / `PascalCase.tsx`
- Use `import type` for type-only imports
- Backend: named exports only, no default exports
- Prettier: 2 spaces, single quotes, trailing commas, 100 char width, LF line endings
- Do not change existing component UI/layout/styles — only replace data sources

## Frontend integration pattern

When replacing hardcoded data with API calls:
1. Add API function in `apps/frontend/src/lib/api.ts`
2. Create `useXxx` hook with loading/error states
3. Replace data source in component, keep UI identical
4. Ensure DashboardContext timeRange/region changes trigger refetch

## Git

- Branch: `master` (CI triggers on push/PR to master)
- Commit format: `type(scope): description` (feat/fix/refactor/chore/docs/test/style)
- Pre-commit hook exists but is empty (no lint-staged enforcement)
- CI: typecheck → lint → format:check → build (uses `npm ci` — may need fixing)

## Environment

```bash
# apps/backend/.env
DATABASE_URL="postgresql://dashboard:dashboard_dev_2026@localhost:5432/dashboard_v3"
REDIS_URL="redis://localhost:6379"
PORT=3000
NODE_ENV="development"

# Root .env (for Sensor Tower)
SENSORTOWER_API_KEY=...
```

## Cache TTLs (when Redis caching is implemented)

| Data | TTL | Key pattern |
|------|-----|-------------|
| Health | no cache | — |
| AI alerts | 30s | `alert:latest` |
| KPI | 5min | `kpi:{region}:{timeRange}` |
| Channels/Reputation | 10min | `channels:{region}:{timeRange}` |
| App market/Intelligence | 30min | `app-market:{platform}:{region}` |
| Sensor Tower | 1h | `sensortower:{platform}:{dates}` |
