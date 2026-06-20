---
paths:
  - "apps/backend/src/**/*.ts"
  - "apps/backend/prisma/**"
  - "apps/frontend/src/**/*.ts"
  - "docker-compose.yml"
  - ".env*"
  - "pnpm-workspace.yaml"
  - "turbo.json"
---

# 本地开发配置

## 项目结构（pnpm workspaces + Turborepo monorepo）
- `apps/frontend/` — React 19 + Vite 6 前端（端口 5173）
- `apps/backend/` — NestJS 后端 API（端口 3000）
- 前端通过 Vite proxy 转发 `/api/*` 到后端
- `tsconfig.base.json` — 共享 TypeScript 配置
- `turbo.json` — Turborepo 任务编排

## 开发命令
```bash
pnpm dev            # Turborepo 同时启动前端 + 后端
pnpm build          # 构建全部
pnpm test           # 运行全部测试
pnpm typecheck      # TypeScript 类型检查
pnpm lint           # ESLint 检查
```

## Docker 服务
```bash
pnpm db:up          # 启动 PostgreSQL 16 + Redis 7
pnpm db:down        # 停止
pnpm db:reset       # 重置（清空数据）
```

## pgAdmin（Web 数据库管理工具）
启动命令：`docker start dashboard-pgadmin`
- 访问: http://localhost:5050
- 登录邮箱: `admin@local.dev`
- 登录密码: `admin`
- 连接: Host=`host.docker.internal`, Port=5432, DB=`dashboard_v3`, User=`dashboard`, Pass=`dashboard_dev_2026`

## 数据库
- PostgreSQL: `postgresql://dashboard:dashboard_dev_2026@localhost:5432/dashboard_v3`
- Redis: `redis://localhost:6379`
- ORM: Prisma 6，schema 在 `apps/backend/prisma/schema.prisma`
- Migration: `pnpm db:migrate`
- 数据浏览: `pnpm db:studio` → http://localhost:5555

## .env 文件
- 后端: `apps/backend/.env`
```
DATABASE_URL="postgresql://dashboard:dashboard_dev_2026@localhost:5432/dashboard_v3"
REDIS_URL="redis://localhost:6379"
PORT=3000
NODE_ENV="development"
```
