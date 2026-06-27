FROM node:20-alpine AS base

RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

WORKDIR /app

# Copy monorepo root files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY tsconfig.base.json ./

# Copy backend package
COPY apps/backend/package.json apps/backend/

# Install dependencies (only backend)
RUN pnpm install --frozen-lockfile

# Copy backend source
COPY apps/backend/ apps/backend/

# Generate Prisma client and build
WORKDIR /app/apps/backend
RUN pnpm exec prisma generate
RUN pnpm exec nest build

# Production stage
FROM node:20-alpine AS production

RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

WORKDIR /app

COPY --from=base /app/pnpm-workspace.yaml /app/pnpm-lock.yaml /app/package.json ./
COPY --from=base /app/apps/backend/package.json apps/backend/
COPY --from=base /app/apps/backend/dist apps/backend/dist
COPY --from=base /app/apps/backend/node_modules apps/backend/node_modules
COPY --from=base /app/apps/backend/prisma apps/backend/prisma

WORKDIR /app/apps/backend

EXPOSE 3000

CMD ["node", "dist/main"]
