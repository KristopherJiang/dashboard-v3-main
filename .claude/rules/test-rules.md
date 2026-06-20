---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
---

# Testing Rules

- Use Vitest as test runner
- Use MSW to mock API calls (handlers in src/__tests__/mocks/handlers.ts)
- Use @testing-library/react for component tests
- Test naming: "should [expected] when [condition]"
- Clean up side effects in afterEach
- Mock external dependencies, not internal modules
