---
paths:
  - "src/server/**/*.ts"
---

# Backend API Rules

- Each endpoint needs 3 files: route, service, registration in routes/index.ts
- Use Zod for query parameter validation
- Use `successResponse()` / `errorResponse()` from `src/server/utils/response.ts`
- All numeric calculations must use `getMultiplier()` from `src/server/data/scales.ts`
- Cache TTLs: health=0, alerts=30s, kpi=300s, channels/reputation=600s, app-market/intelligence=1800s
- Named exports, not default exports
- Use `import type` for type-only imports
