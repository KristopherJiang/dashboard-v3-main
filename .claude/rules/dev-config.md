---
paths:
  - "backend/src/**/*.ts"
  - "backend/prisma/**"
  - "frontend/src/**/*.ts"
  - "docker-compose.yml"
  - ".env*"
---

# 本地开发配置

## 项目结构
- `frontend/` — React 19 + Vite 6 前端（端口 5173）
- `backend/` — NestJS 后端 API（端口 3000）
- 前端通过 Vite proxy 转发 `/api/*` 到后端

## Docker 服务
```bash
npm run db:up     # 启动 PostgreSQL 16 + Redis 7
npm run db:down   # 停止
npm run db:reset  # 重置（清空数据）
```

## pgAdmin（Web 数据库管理工具）
启动命令：
```bash
docker start dashboard-pgadmin
```
- 访问: http://localhost:5050
- 登录邮箱: `admin@local.dev`
- 登录密码: `admin`
- 添加 PostgreSQL 服务器连接：
  - Host: `host.docker.internal`
  - Port: `5432`
  - Database: `dashboard_v3`
  - Username: `dashboard`
  - Password: `dashboard_dev_2026`

## 开发命令
```bash
npm run dev           # 同时启动前端 + 后端
npm run dev:frontend  # 只启动前端（localhost:5173）
npm run dev:backend   # 只启动后端（localhost:3000）
npm run build         # 构建前端 + 后端
npm run test          # 运行全部测试
npm run typecheck     # TypeScript 类型检查
```

## 数据库
- PostgreSQL: `postgresql://dashboard:dashboard_dev_2026@localhost:5432/dashboard_v3`
- Redis: `redis://localhost:6379`
- ORM: Prisma 6，schema 在 `backend/prisma/schema.prisma`
- Migration: `npm run db:migrate`
- 数据浏览: `npm run db:studio` → http://localhost:5555

## .env 文件
- 后端: `backend/.env`
- 内容:
```
DATABASE_URL="postgresql://dashboard:dashboard_dev_2026@localhost:5432/dashboard_v3"
REDIS_URL="redis://localhost:6379"
PORT=3000
NODE_ENV="development"
```
