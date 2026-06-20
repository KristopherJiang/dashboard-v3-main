---
paths:
  - "src/server/**/*.ts"
  - "prisma/**"
  - "docker-compose.yml"
  - ".env*"
---

# 本地开发配置

## Docker 服务
```bash
npm run db:up     # 启动 PostgreSQL 16 + Redis 7
npm run db:down   # 停止
npm run db:reset  # 重置（清空数据）
```

## pgAdmin（Web 数据库管理工具）
启动命令：
```bash
docker run -d --name dashboard-pgadmin -p 5050:80 \
  -e PGADMIN_DEFAULT_EMAIL=admin@local.dev \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  --add-host=host.docker.internal:host-gateway \
  dpage/pgadmin4
```
- 访问: http://localhost:5050
- 登录邮箱: `admin@local.dev`
- 登录密码: `admin`

添加 PostgreSQL 服务器连接步骤：
1. 右键 "Servers" → "Register" → "Server"
2. General 标签：Name 填 `Dashboard V3`
3. Connection 标签：
   - Host: `host.docker.internal`
   - Port: `5432`
   - Database: `dashboard_v3`
   - Username: `dashboard`
   - Password: `dashboard_dev_2026`

## 数据库连接
- PostgreSQL: `postgresql://dashboard:dashboard_dev_2026@localhost:5432/dashboard_v3`
- Redis: `redis://localhost:6379`
- ORM: Prisma 6，schema 在 `prisma/schema.prisma`
- Migration: `npx prisma migrate dev`
- 数据浏览: `npx prisma studio`

## 启动开发服务器
```bash
npm run dev       # tsx server.ts，端口 3000
```

## 质量检查
```bash
npm run check     # typecheck + lint + format:check
npm run test      # vitest run
npm run build     # vite build + esbuild
```

## .env 文件配置
```
DATABASE_URL="postgresql://dashboard:dashboard_dev_2026@localhost:5432/dashboard_v3"
REDIS_URL="redis://localhost:6379"
PORT=3000
NODE_ENV="development"
```
