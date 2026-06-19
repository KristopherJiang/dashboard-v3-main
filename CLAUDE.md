# Dashboard V3 — 项目指令

## 项目概述

PC 端营销数据 Dashboard，服务 Exness/Vantage 两家券商的 C-Level 管理层。
前端 UI 已完成（React 19），当前目标：**开发后端 API 并完成前后端联调**。

完整架构文档：`docs/ARCHITECTURE.md`

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | React 19 + Vite 6 + Tailwind 4 + Recharts 3 |
| 后端 | Express 5 + TypeScript 5.8 |
| 数据库 | PostgreSQL 16 + Prisma 6 |
| 缓存 | Redis 7 (ioredis) |
| 验证 | Zod |
| AI | Google Gemini (`@google/genai`) |

## 开发命令

```bash
npm run dev          # 启动开发服务器 (tsx server.ts)
npm run build        # 生产构建
npm run typecheck    # TypeScript 类型检查
npm run lint         # ESLint 检查
npm run lint:fix     # ESLint 自动修复
npm run format       # Prettier 格式化
npm run format:check # Prettier 格式检查
npm run check        # 全部检查 (typecheck + lint + format)
```

## 目录结构约定

```
src/
├── server/           # 后端代码
│   ├── routes/       # 路由定义 + Zod 验证
│   ├── services/     # 业务逻辑
│   ├── db/           # Prisma + Redis 客户端
│   ├── middleware/    # Express 中间件
│   ├── data/         # 缩放系数、种子数据
│   └── utils/        # 工具函数
├── components/       # 前端组件（14 个模块）
├── lib/              # 前端工具（api.ts, DashboardContext）
└── main.tsx          # 入口
```

## API 开发规范

每个 API 端点必须遵循三层分离：

1. **路由层** (`routes/xxx.routes.ts`) — 路由定义 + Zod 参数校验
2. **服务层** (`services/xxx.service.ts`) — 业务逻辑 + 数据查询
3. **注册** (`routes/index.ts`) — 在主路由中注册

### 统一响应格式

```typescript
// 成功
{ success: true, data: { ... }, meta: { timestamp, region, timeRange } }
// 失败
{ success: false, error: { code: string, message: string } }
```

### 通用查询参数

所有 GET 接口支持：`timeRange`, `region`, `startDate`, `endDate`, `granularity`

### 数据缩放

所有数值计算必须引用 `src/server/data/scales.ts` 中的系数：
- `TIME_SCALE` — 时间范围缩放
- `REGION_SCALE` — 地区缩放
- `COST_SCALE` — 地区成本系数
- `getMultiplier(timeRange, region)` — 计算最终倍数

## 编码规范

- **语言**：TypeScript strict 模式，禁止 `any`（warning 级别）
- **命名**：
  - 文件名：`kebab-case.ts` / `PascalCase.tsx`
  - 变量/函数：`camelCase`
  - 类型/接口：`PascalCase`
  - 常量：`UPPER_SNAKE_CASE`
- **导入**：使用 `type import` 导入类型（`import type { X } from '...'`）
- **注释**：关键业务逻辑用中文注释，代码层面用英文
- **格式**：Prettier 自动格式化（2 空格、单引号、尾逗号）

## 禁止事项

- ❌ 不改动现有组件的 UI 布局和样式
- ❌ 不在代码中硬编码 API Key（使用环境变量）
- ❌ 不跳过 TypeScript 类型检查
- ❌ 不在前端暴露服务端密钥
- ❌ 不引入未在 package.json 中声明的依赖

## 前端对接规范

替换组件硬编码数据时：
1. 在 `src/lib/api.ts` 添加 API 调用函数
2. 创建 React hook（`useXxx`）带 loading/error 状态
3. 在组件中替换数据源，保持 UI 不变
4. 确保 DashboardContext 的 timeRange/region 变化时自动 refetch

## 缓存策略

| 数据类型 | TTL | 缓存 Key |
|----------|-----|----------|
| 实时健康监测 | 不缓存 | - |
| AI 告警 | 30s | `alert:latest` |
| KPI | 5min | `kpi:{region}:{timeRange}` |
| 渠道/舆情 | 10min | `channels:{region}:{timeRange}` |
| App 市场/情报 | 30min | `app-market:{platform}:{region}` |
| Sensor Tower | 1h | `sensortower:{platform}:{dates}` |

## Git 规范

- Commit 格式：`type(scope): description`
  - 类型：`feat` / `fix` / `refactor` / `chore` / `docs` / `test` / `style`
  - 示例：`feat(api): add KPI endpoint with time range filtering`
- Pre-commit hook 自动运行 lint-staged（ESLint + Prettier）
- CI 检查：typecheck + lint + format + build

## 自定义 Skills

使用 `/create-api-endpoint` 快速创建 API 端点
使用 `/connect-frontend-component` 对接前端组件
使用 `/run-quality-check` 运行完整质量检查
