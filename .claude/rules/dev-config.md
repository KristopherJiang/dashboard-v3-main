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

## Prisma 工作流
Prisma 是 ORM 工具（翻译官），不是数据库本身。它从 `schema.prisma` 生成 TypeScript 代码。

**关键命令：**

| 命令 | 作用 | 适用场景 |
|------|------|---------|
| `prisma migrate dev` | 生成迁移 + 执行 | 开发时修改 schema |
| `prisma migrate dev --create-only` | 只生成 SQL，不执行 | 表已存在，避免重复创建 |
| `prisma migrate deploy` | 执行所有未执行的迁移 | 新环境/生产环境 |
| `prisma migrate resolve --applied` | 标记迁移为已执行 | 表已存在，只更新记录 |
| `prisma generate` | 生成 TypeScript 类型 | 修改 schema 后（start:dev 自动执行） |
| `prisma db pull` | 从数据库反向生成 schema | 数据库已有表，需要同步 schema |

**迁移文件结构：**
```
prisma/migrations/
├── 20260620030841_init/
│   └── migration.sql    ← SQL 脚本（CREATE TABLE/INDEX）
└── migration_lock.toml
```

**切换数据库（PostgreSQL → MySQL/SQLite）：**
1. 改 `schema.prisma` 的 `provider`
2. 改 `.env` 的 `DATABASE_URL`
3. `prisma migrate dev` 重新生成

**新电脑设置：**
```bash
docker compose up -d                    # 启动数据库
cd apps/backend
npx prisma migrate deploy               # 执行所有迁移
```

## .env 文件
- 后端: `apps/backend/.env`
```
DATABASE_URL="postgresql://dashboard:dashboard_dev_2026@localhost:5432/dashboard_v3"
REDIS_URL="redis://localhost:6379"
PORT=3000
NODE_ENV="development"
```

## 第三方 API 凭证配置

### Sensor Tower
```env
SENSORTOWER_API_KEY=ST0_ku78zgJi_xLibVBEFrw1yMB
```
已有，直接使用。

### App Store Connect API
**认证方式：JWT 签名**（不是简单 API Key）

**获取步骤：**
1. 登录 https://appstoreconnect.apple.com
2. 用户和访问 → 集成 → App Store Connect API
3. 点击「密钥」→ 生成新密钥
4. 记录页面顶部的 **Issuer ID**
5. 记录生成密钥时显示的 **Key ID**
6. 下载 **.p8 私钥文件**（只下载一次，务必保存）

```env
APPLE_ISSUER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
APPLE_KEY_ID=XXXXXXXXXX
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIGTAg...\n-----END PRIVATE KEY-----"
```

**可提供的数据：** App 下载量、评分、评论数、上架状态、曝光量、产品页浏览量

### Google Play Console API
**认证方式：Service Account JSON**（不是 API Key，API Key 无法访问 App 数据）

**获取步骤：**
1. 登录 https://console.cloud.google.com
2. APIs & Services → Library → 搜索 **Google Play Android Developer API** → 启用
3. APIs & Services → Credentials → Create Credentials → **Service Account**
4. 填写名称 → Create and Continue → 跳过权限设置 → Done
5. 点击刚创建的 Service Account → **Keys** 标签 → Add Key → Create new key → 选择 **JSON** → 下载
6. 登录 https://play.google.com/console
7. 用户和权限 → 邀请该 Service Account 的邮箱（格式：xxx@project-id.iam.gserviceaccount.com）
8. 给予 **查看应用数据** 权限

```env
GOOGLE_PLAY_SERVICE_ACCOUNT_PATH=./config/google-play-sa.json
```

**可提供的数据：** App 下载量/安装量、评分、评论数、崩溃率、上架状态、收入数据

### Google Gemini AI
```env
GEMINI_API_KEY=your_key_here
```
用于 AI 深度诊断报告（AIDiagnosticModal 组件）。

### 凭证文件存放
Service Account JSON 和 .p8 私钥文件放在 `apps/backend/config/` 目录下，该目录已在 `.gitignore` 中排除。
