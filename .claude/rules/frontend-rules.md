---
paths:
  - "src/components/**/*.tsx"
---

# Frontend Component Rules

- Do NOT change UI layout, styles, or className attributes
- Only replace data sources (hardcoded data → API hooks)
- Use `useApi()` hook from `src/lib/hooks/useApi.ts`
- API functions go in `src/lib/api.ts`
- Always handle loading and error states
- Use `cancelled` flag in useEffect to prevent memory leaks
- DashboardContext provides `timeRange` and `selectedRegion`
