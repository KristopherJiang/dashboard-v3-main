# Dashboard V3 - 技术架构规划文档

> 本文档是项目的完整技术架构蓝图。任何开发人员（包括低级AI模型）都应能根据本文档独立完成开发任务。

---

## 一、项目概述

### 1.1 项目定位
一个 PC 端营销数据 Dashboard，服务于 Exness/Vantage 两家券商的 C-Level 管理层。前端 UI 已完成，当前目标是**开发完整的后端 API 并完成前后端联调**。

### 1.2 核心模块（14 个页面组件）
| # | 组件 | 功能 | 数据来源 |
|---|------|------|----------|
| 1 | KPICards | 8 张核心指标卡片（注册/FTD/FTT/净入金/交易量/转化率/留存） | 业务数据库 |
| 2 | ChannelEfficiencyMatrix | 渠道获客成本与 ROI 矩阵（树形表格） | 业务数据库 + 营销平台 |
| 3 | UserDistributionSunburst | 用户来源构成旭日图（Retail/IB/Paid/Organic/RAF） | 业务数据库 |
| 4 | AcquisitionEfficiency | 获客转化全链路漏斗 | 业务数据库 |
| 5 | Reputation | 品牌舆情散点气泡图 | NLP 服务 / 第三方舆情 API |
| 6 | AppMarketOverview | App Store/Google Play 口碑摘要 | **Sensor Tower API（已有）** |
| 7 | WebsiteHealthMonitor | 全球 10 节点网络延迟 + App 上架状态 | Ping 服务 / App Store API |
| 8 | GlobalIntelligence | SEO/GEO/ASO 三合一市场情报 | Semrush / 第三方 API |
| 9 | MarketCommand | 13 国气泡地图市场曝光度 | SEO/ASO 数据聚合 |
| 10 | AIAlertDrawer | AI 实时告警抽屉 | 告警引擎 |
| 11 | AIDiagnosticModal | AI 深度诊断报告（打字机效果） | LLM API |
| 12 | MarketExposureASO | ASO 关键词排名与语义核心 | Sensor Tower / AppTweak |
| 13 | MarketingROI | 营销 ROI 趋势折线图 | 营销平台数据 |
| 14 | UserDemographics | 用户地域分布与年龄画像 | 业务数据库 |

---

## 二、技术栈选型

### 2.1 后端技术栈

| 层级 | 技术 | 版本 | 选择理由 |
|------|------|------|----------|
| **运行时** | Node.js | 20 LTS | 与前端同构，团队统一技术栈 |
| **框架** | Express | 5.x | 已在项目中引入，成熟稳定 |
| **语言** | TypeScript | 5.8 | 已配置，类型安全保障 |
| **ORM** | Prisma | 6.x | 类型安全、迁移管理、查询性能优秀 |
| **数据库** | PostgreSQL | 16 | 复杂分析查询、JSON 支持、窗口函数 |
| **缓存** | Redis | 7.x | 多层 TTL 缓存、实时数据热存储 |
| **验证** | Zod | 3.x | 运行时类型校验，与 TypeScript 无缝集成 |
| **任务调度** | node-cron | 3.x | 定时数据同步、缓存预热 |
| **日志** | Pino | 9.x | 高性能结构化 JSON 日志 |
| **错误处理** | Express 中间件 | - | 统一错误格式、异常捕获 |

### 2.2 前端技术栈（已有，不变更）

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19 | UI 框架 |
| Vite | 6.x | 构建工具 + 开发服务器 |
| Tailwind CSS | 4.x | 样式方案 |
| Recharts | 3.x | 图表库 |
| Lucide React | 0.546 | 图标库 |
| Motion | 12.x | 动画库 |

### 2.3 部署与基础设施

| 组件 | 方案 | 说明 |
|------|------|------|
| **前端部署** | Vercel | SPA 部署，CDN 全球加速，零配置 |
| **后端部署** | Railway | Express API Server 托管，自动扩缩容 |
| **数据库** | Neon PostgreSQL | 托管 PostgreSQL，Serverless，免费额度足够 |
| **Redis** | 按需（开发期用 Docker 本地 Redis） | 生产环境可选 Upstash 或不使用 |
| **CI/CD** | GitHub Actions | 自动测试、构建、部署 |
| **域名/SSL** | Cloudflare | 免费 SSL、DNS 管理 |
| **监控** | Sentry（错误）+ Vercel Analytics（性能） | 免费层足够 |

### 2.4 开发环境要求

```bash
# 必需环境
Node.js >= 20.x
npm >= 10.x
Git

# 可选（本地数据库开发时需要）
Docker Desktop  # 运行 PostgreSQL + Redis 容器
```

---

## 三、系统架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│                        用户浏览器 (PC Web)                           │
│   React 19 + Vite + Tailwind CSS + Recharts                        │
└──────────────┬──────────────────────────────────┬───────────────────┘
               │ REST API (JSON)                  │
               ▼                                  ▼
┌──────────────────────────┐     ┌─────────────────────────────────────┐
│   Express API Server     │     │     Vite Dev Server (dev only)      │
│   /api/v1/*              │     │     Serves SPA + HMR                │
├──────────────────────────┤     └─────────────────────────────────────┘
│ Middleware:               │
│   ├─ CORS                │
│   ├─ Request Validation  │
│   ├─ Rate Limiting       │
│   ├─ Error Handler       │
│   └─ Request Logger      │
├──────────────────────────┤
│ Service Layer:            │
│   ├─ KPI Service         │
│   ├─ Channel Service     │
│   ├─ User Service        │
│   ├─ Funnel Service      │
│   ├─ Reputation Service  │
│   ├─ Market Service      │
│   ├─ Health Service      │
│   ├─ Intelligence Service│
│   ├─ AI Service          │
│   └─ Marketing Service   │
└──────┬──────────┬────────┘
       │          │
       ▼          ▼
┌──────────┐ ┌──────────┐    ┌───────────────────────┐
│PostgreSQL│ │  Redis   │    │  External APIs        │
│ (主存储)  │ │ (缓存层) │    │  ├─ Sensor Tower      │
│           │ │          │    │  ├─ Semrush (SEO)     │
│           │ │          │    │  ├─ Google Gemini (AI)│
│           │ │          │    │  └─ App Store API     │
└──────────┘ └──────────┘    └───────────────────────┘
```

---

## 四、数据库设计

### 4.1 Prisma Schema 核心模型

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============ KPI 指标存储 ============

model KPIRecord {
  id          String   @id @default(cuid())
  metricType  String   // 'registration' | 'ftd' | 'ftt' | 'net_deposit' | 'trading_volume' | 'signup_ftd_cvr' | 'ftd_ftt_cvr' | 'd30_retention'
  date        DateTime @db.Date
  region      String   @default("GLOBAL")
  value       Float
  dimension   Json?    // 存储额外维度数据，如 channel, device 等
  createdAt   DateTime @default(now())

  @@index([metricType, date, region])
  @@map("kpi_records")
}

// ============ 渠道数据 ============

model ChannelMetric {
  id          String   @id @default(cuid())
  channelId   String   // 'ib_affiliate' | 'retail' | 'kol' | 'paid_ads' | 'dsp' | 'asa' | 'google_ads' | 'organic' | 'raf'
  parentChannelId String? // 父渠道 ID，用于树形结构
  channelName String
  level       Int      // 1=顶层, 2=二级, 3=三级
  date        DateTime @db.Date
  region      String   @default("GLOBAL")
  newUsers    Int
  spend       Float
  signupCAC   Float
  kycCAC      Float
  ftdCAC      Float
  fttCAC      Float
  roi         Float
  ltv         Float
  createdAt   DateTime @default(now())

  @@index([channelId, date, region])
  @@map("channel_metrics")
}

// ============ 漏斗数据 ============

model FunnelRecord {
  id          String   @id @default(cuid())
  stepNumber  Int      // 1-7
  stepTitle   String
  date        DateTime @db.Date
  region      String   @default("GLOBAL")
  users       Int
  createdAt   DateTime @default(now())

  @@index([date, region])
  @@map("funnel_records")
}

// ============ App 市场口碑 ============

model AppReviewRecord {
  id          String   @id @default(cuid())
  platform    String   // 'ios' | 'android'
  appName     String
  date        DateTime @db.Date
  region      String   @default("GLOBAL")
  downloads   Int
  reviews     Int
  score       Float
  // 竞品数据
  compAppName String?
  compDownloads Int?
  compReviews   Int?
  compScore     Float?
  createdAt   DateTime @default(now())

  @@index([platform, date, region])
  @@map("app_review_records")
}

// ============ 舆情数据 ============

model ReputationPoint {
  id          String   @id @default(cuid())
  name        String
  platform    String   // 'Twitter' | 'App Store' | 'Reddit' | 'Trustpilot'
  sentimentX  Float    // -100 到 100
  influenceY  Float    // 0 到 100
  volumeZ     Float    // 讨论声量
  sentiment   String   // 'positive' | 'negative'
  insight     String
  suggestedAction String
  date        DateTime @db.Date
  region      String   @default("GLOBAL")
  createdAt   DateTime @default(now())

  @@index([date, region, sentiment])
  @@map("reputation_points")
}

// ============ 健康度监测 ============

model HealthNodeStatus {
  id              String   @id @default(cuid())
  nodeId          String
  countryFlag     String
  countryName     String
  city            String
  latency         Int      // ms
  jitter          String
  packetLoss      String
  iosStatus       String   // 'normal' | 'removed'
  androidStatus   String   // 'normal' | 'removed'
  iosDesc         String?
  androidDesc     String?
  recordedAt      DateTime @default(now())

  @@index([nodeId, recordedAt])
  @@map("health_node_statuses")
}

// ============ 市场情报 (SEO/GEO/ASO) ============

model MarketIntelligenceRecord {
  id              String   @id @default(cuid())
  type            String   // 'seo' | 'geo' | 'aso'
  date            DateTime @db.Date
  region          String   @default("GLOBAL")
  data            Json     // 灵活存储不同类型的指标数据
  createdAt       DateTime @default(now())

  @@index([type, date, region])
  @@map("market_intelligence_records")
}

// ============ AI 告警 ============

model AlertRecord {
  id              String   @id @default(cuid())
  alertType       String   // 'critical' | 'warning' | 'optimize'
  title           String
  value           String
  region          String
  description     String
  suggestedAction String
  isRead          Boolean  @default(false)
  createdAt       DateTime @default(now())

  @@index([alertType, createdAt])
  @@map("alert_records")
}

// ============ 营销 ROI ============

model MarketingROIRecord {
  id          String   @id @default(cuid())
  weekLabel   String   // 'W1' | 'W2' 等
  date        DateTime @db.Date
  region      String   @default("GLOBAL")
  spend       Float
  revenue     Float
  roi         Float
  createdAt   DateTime @default(now())

  @@index([date, region])
  @@map("marketing_roi_records")
}
```

### 4.2 数据库索引策略
- 所有查询涉及 `date + region` 组合的表，建立复合索引
- `metricType + date` 索引用于 KPI 快速查询
- `channelId + date` 索引用于渠道维度分析

---

## 五、API 接口规范

### 5.1 统一响应格式

```typescript
// 成功响应
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-06-19T10:30:00Z",
    "region": "GLOBAL",
    "timeRange": "mtd"
  }
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMS",
    "message": "Invalid timeRange value"
  }
}
```

### 5.2 通用查询参数

所有 API 都接受以下通用参数：

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| timeRange | string | 否 | 'mtd' | 时间范围枚举 |
| region | string | 否 | 'GLOBAL' | 地区代码 |
| startDate | string | 否 | - | 自定义开始日期 (YYYY-MM-DD) |
| endDate | string | 否 | - | 自定义结束日期 (YYYY-MM-DD) |
| granularity | string | 否 | 'daily' | 数据粒度 daily/weekly/monthly |

### 5.3 完整 API 端点列表

#### 5.3.1 KPI 模块 `GET /api/v1/kpi`

**请求：** `GET /api/v1/kpi?timeRange=mtd&region=GLOBAL`

**响应：**
```json
{
  "success": true,
  "data": {
    "registrationUsers": {
      "value": 18420,
      "trendPoP": 12.5,
      "trendYoY": 28.3,
      "chartData": [
        { "name": "6/1", "value": 620, "previous": 580 },
        { "name": "6/2", "value": 645, "previous": 590 }
      ]
    },
    "ftdUsers": { ... },
    "fttUsers": { ... },
    "netDeposit": { ... },
    "tradingVolume": { ... },
    "signupToFtdCVR": { ... },
    "ftdToFttCVR": { ... },
    "d30Retention": { ... }
  }
}
```

#### 5.3.2 渠道效率 `GET /api/v1/channels`

**请求：** `GET /api/v1/channels?timeRange=mtd&region=GLOBAL`

**响应：**
```json
{
  "success": true,
  "data": {
    "channels": [
      {
        "id": "ib_affiliate",
        "channel": "IB & Affiliate",
        "level": 1,
        "newUsers": 3825,
        "spend": 19890,
        "signupCAC": 5.2,
        "kycCAC": 12.0,
        "ftdCAC": 42.0,
        "fttCAC": 55.0,
        "roi": 920,
        "ltv": 8.5
      },
      {
        "id": "retail",
        "channel": "Retail",
        "level": 1,
        "newUsers": 7425,
        "spend": 107662,
        "signupCAC": 14.5,
        "kycCAC": 28.0,
        "ftdCAC": 98.0,
        "fttCAC": 132.0,
        "roi": 508,
        "ltv": 3.9,
        "children": [
          { "id": "kol", "channel": "KOL", "level": 2, ... },
          {
            "id": "paid_ads",
            "channel": "投放 Paid ads",
            "level": 2,
            "children": [
              { "id": "dsp", "channel": "DSP", "level": 3, ... },
              { "id": "asa", "channel": "ASA", "level": 3, ... },
              { "id": "google_ads", "channel": "Google Ads", "level": 3, ... }
            ]
          },
          { "id": "organic", "channel": "Organic", "level": 2, ... },
          { "id": "raf", "channel": "RAF", "level": 2, ... }
        ]
      }
    ]
  }
}
```

#### 5.3.3 用户分布 `GET /api/v1/users/distribution`

#### 5.3.4 获客漏斗 `GET /api/v1/funnel`

#### 5.3.5 舆情分析 `GET /api/v1/reputation`

#### 5.3.6 App 市场 `GET /api/v1/app-market`

#### 5.3.7 健康监测 `GET /api/v1/health`

#### 5.3.8 市场情报 `GET /api/v1/market-intelligence`

#### 5.3.9 AI 告警 `GET /api/v1/ai/alerts`

#### 5.3.10 AI 诊断 `GET /api/v1/ai/diagnostic`

#### 5.3.11 ASO 数据 `GET /api/v1/aso`

#### 5.3.12 营销 ROI `GET /api/v1/marketing/roi`

#### 5.3.13 用户画像 `GET /api/v1/users/demographics`

---

## 六、项目目录结构

```
dashboard-v3-main/
├── docs/
│   ├── ARCHITECTURE.md          # 本文档
│   └── API.md                   # 完整 API 文档
├── prisma/
│   ├── schema.prisma            # 数据库模型定义
│   ├── seed.ts                  # 种子数据脚本
│   └── migrations/              # 自动生成的迁移文件
├── src/
│   ├── server/                  # 后端代码
│   │   ├── index.ts             # 服务入口（重构 server.ts）
│   │   ├── config/
│   │   │   └── index.ts         # 环境变量、常量配置
│   │   ├── db/
│   │   │   ├── prisma.ts        # Prisma 客户端单例
│   │   │   └── redis.ts         # Redis 客户端单例
│   │   ├── middleware/
│   │   │   ├── validation.ts    # Zod 参数校验中间件
│   │   │   ├── errorHandler.ts  # 统一错误处理
│   │   │   ├── cache.ts         # Redis 缓存中间件
│   │   │   └── logger.ts        # 请求日志中间件
│   │   ├── routes/
│   │   │   ├── index.ts         # 路由注册总入口
│   │   │   ├── kpi.routes.ts
│   │   │   ├── channels.routes.ts
│   │   │   ├── users.routes.ts
│   │   │   ├── funnel.routes.ts
│   │   │   ├── reputation.routes.ts
│   │   │   ├── appMarket.routes.ts
│   │   │   ├── health.routes.ts
│   │   │   ├── marketIntelligence.routes.ts
│   │   │   ├── ai.routes.ts
│   │   │   ├── aso.routes.ts
│   │   │   └── marketing.routes.ts
│   │   ├── services/
│   │   │   ├── kpi.service.ts
│   │   │   ├── channels.service.ts
│   │   │   ├── users.service.ts
│   │   │   ├── funnel.service.ts
│   │   │   ├── reputation.service.ts
│   │   │   ├── appMarket.service.ts
│   │   │   ├── health.service.ts
│   │   │   ├── marketIntelligence.service.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── aso.service.ts
│   │   │   └── marketing.service.ts
│   │   ├── data/
│   │   │   ├── scales.ts        # 时间/地区缩放系数
│   │   │   └── seedGenerators.ts # 智能种子数据生成器
│   │   └── utils/
│   │       ├── dateRange.ts     # 时间范围计算工具
│   │       ├── cache.ts         # 缓存 key 生成、TTL 管理
│   │       └── response.ts      # 统一响应格式工具
│   ├── components/              # 前端组件（已有，不改动结构）
│   │   ├── KPICards.tsx
│   │   ├── ChannelEfficiencyMatrix.tsx
│   │   └── ... (14 个组件)
│   ├── lib/
│   │   ├── DashboardContext.tsx  # 全局上下文
│   │   ├── api.ts               # 【新增】前端 API 调用封装层
│   │   └── sensorTowerApi.ts    # 已有的 Sensor Tower 客户端
│   ├── App.tsx
│   └── main.tsx
├── server.ts                    # 现有入口，重构为调用 src/server/index.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

---

## 七、实施计划（分 5 个阶段）

### 阶段 1：基础设施搭建（预计 1-2 小时）

**目标：** 后端骨架 + 数据库 + 缓存 + 种子数据能跑通

| 步骤 | 任务 | 产出文件 |
|------|------|----------|
| 1.1 | 初始化 Prisma，写 schema.prisma | `prisma/schema.prisma` |
| 1.2 | 创建环境变量配置 | `.env.example` 更新 |
| 1.3 | 搭建 Prisma + Redis 客户端单例 | `src/server/db/prisma.ts`, `redis.ts` |
| 1.4 | 编写智能种子数据生成器（基于现有组件中的硬编码数据） | `src/server/data/seedGenerators.ts` |
| 1.5 | 运行 migration + seed | 命令行操作 |
| 1.6 | 创建中间件（验证、缓存、错误处理、日志） | `src/server/middleware/*.ts` |
| 1.7 | 重构 server.ts 为模块化入口 | `src/server/index.ts` |

### 阶段 2：API 开发 — 按模块逐个实现（预计 3-4 小时）

**每个模块的标准实现流程：**
1. 写 Zod 校验 schema（`routes/xxx.routes.ts`）
2. 写 Service 层业务逻辑（`services/xxx.service.ts`）
3. 注册路由到主路由（`routes/index.ts`）
4. curl 测试

**模块优先级（按数据复杂度排序）：**

| 优先级 | 模块 | 复杂度 | 说明 |
|--------|------|--------|------|
| P0 | Health 健康监测 | 低 | 实时数据，无复杂聚合 |
| P0 | Funnel 漏斗 | 低 | 线性数据，7 步 |
| P1 | KPI 核心指标 | 中 | 8 张卡片，时间/地区维度 |
| P1 | Users 分布 | 中 | 旭日图数据结构 |
| P1 | Marketing ROI | 低 | 简单趋势数据 |
| P2 | Channels 渠道矩阵 | 高 | 树形结构，3 层嵌套 |
| P2 | App Market | 中 | 对接 Sensor Tower |
| P2 | Reputation 舆情 | 中 | 散点气泡数据 |
| P3 | Market Intelligence | 高 | SEO/GEO/ASO 三维 |
| P3 | ASO 曝光度 | 中 | 关键词排名 |
| P3 | Market Command | 中 | 13 国气泡地图 |
| P4 | AI Alerts | 低 | 告警列表 |
| P4 | AI Diagnostic | 中 | 调用 LLM 生成报告 |
| P4 | Demographics | 低 | 用户画像 |

### 阶段 3：前端 API 对接层（预计 2-3 小时）

**目标：** 创建 `src/lib/api.ts`，替换组件中的硬编码数据为 API 调用

| 步骤 | 任务 |
|------|------|
| 3.1 | 创建 API 客户端封装（fetch wrapper + 错误处理 + 类型定义） |
| 3.2 | 创建各模块的 React hooks（useKPI, useChannels 等） |
| 3.3 | 逐个组件替换：硬编码数据 → useXxx hook + loading/error 状态 |
| 3.4 | 确保 DashboardContext 的 timeRange/selectedRegion 变化时自动 refetch |

### 阶段 4：缓存策略实施（预计 1 小时）

| 数据类型 | 缓存 TTL | 缓存 Key 格式 |
|----------|----------|---------------|
| 实时健康监测 | 不缓存 | - |
| AI 告警 | 30s | `alert:latest` |
| KPI 指标 | 5min | `kpi:{region}:{timeRange}` |
| 渠道数据 | 10min | `channels:{region}:{timeRange}` |
| 舆情数据 | 10min | `reputation:{region}:{timeRange}` |
| App 市场 | 30min | `app-market:{platform}:{region}` |
| 市场情报 | 30min | `intelligence:{type}:{region}` |
| Sensor Tower | 1h | `sensortower:{platform}:{dates}` |

### 阶段 5：测试 + 部署 + 文档（预计 1-2 小时）

| 步骤 | 任务 |
|------|------|
| 5.1 | 编写关键 API 的集成测试 |
| 5.2 | 配置 GitHub Actions CI/CD |
| 5.3 | 部署到 Railway + Vercel |
| 5.4 | 完善 API 文档 |

---

## 八、数据缩放系数（核心业务逻辑）

这些系数是整个 Dashboard 数据一致性的基础，所有 Service 层必须引用。

```typescript
// src/server/data/scales.ts

/** 时间范围缩放系数 — 控制数据在不同时间窗口下的量级 */
export const TIME_SCALE: Record<string, number> = {
  today: 0.03,
  yesterday: 0.035,
  thisWeek: 0.21,
  mtd: 1.0,        // 基准
  lastMonth: 0.95,
  ytd: 4.8,
  last90: 2.9,
  custom: 1.2,
};

/** 地区缩放系数 — 控制不同地区数据量级 */
export const REGION_SCALE: Record<string, number> = {
  GLOBAL: 1.0,
  ASIA_VN: 0.15,
  EU_UK: 0.12,
  ASIA_IN: 0.2,
  MENA_AE: 0.08,
  GS_AU: 0.06,
};

/** 地区成本系数 — 控制不同地区获客成本 */
export const COST_SCALE: Record<string, number> = {
  GLOBAL: 1.0,
  ASIA_VN: 0.35,
  EU_UK: 2.1,
  ASIA_IN: 0.22,
  MENA_AE: 1.4,
  GS_AU: 1.8,
};

/** 最终缩放倍数 = TIME_SCALE × REGION_SCALE */
export function getMultiplier(timeRange: string, region: string): number {
  return (TIME_SCALE[timeRange] || 1.0) * (REGION_SCALE[region] || 0.04);
}
```

---

## 九、环境变量配置

```bash
# .env.example

# 数据库
DATABASE_URL="postgresql://postgres:password@localhost:5432/dashboard_v3"

# Redis（可选，没有 Redis 时自动降级为内存缓存）
REDIS_URL="redis://localhost:6379"

# 外部 API Keys
SENSORTOWER_API_KEY="your_sensortower_api_key"
GEMINI_API_KEY="your_google_gemini_api_key"

# 服务端口
PORT=3000

# 环境
NODE_ENV="development"
```

---

## 十、关键设计决策与约束

### 10.1 数据策略
- **当前阶段：智能模拟数据 + 真实 Sensor Tower 数据混合**
  - 种子数据基于现有组件中的硬编码数据生成，保证视觉一致性
  - Sensor Tower API（已实现）提供真实的下载量数据
  - 所有 Service 层设计为可插拔：未来接入真实数据库只需替换数据源
- **数据生成公式：** `实际值 = 基准值 × TIME_SCALE × REGION_SCALE × 季节因子`

### 10.2 前后端联调策略
- 组件中的缩放系数（TIME_SCALE / REGION_SCALE / COST_SCALE）必须与后端 `scales.ts` 完全一致
- API 返回的数据结构必须完全匹配组件期望的接口
- 前端 hook 自动根据 DashboardContext 变化 refetch

### 10.3 性能要求
- 单个 API 响应 < 200ms（有缓存时 < 50ms）
- 首屏加载所有 KPI 数据 < 2s
- Redis 缓存命中率目标 > 80%

### 10.4 安全要求
- API 限流：每 IP 每分钟 100 次请求
- 输入校验：所有查询参数通过 Zod 校验
- 无认证要求（内部工具，但保留中间件扩展点）
- API Key 仅存在于服务端，不暴露给前端

---

## 十一、执行指令（给执行此任务的 AI/开发者）

> **阅读完本文档后，请严格按以下顺序执行：**

1. **不要改动任何前端组件的 UI 代码** — 只替换数据源
2. **先跑通阶段 1** — 确保 Prisma + 种子数据可用
3. **按优先级逐个实现 API** — 每完成一个模块立即 curl 测试
4. **前端对接时创建统一的 api.ts** — 不要在组件中直接写 fetch
5. **每完成一个模块 git commit** — 保持可追溯
6. **所有数值必须基于 scales.ts 中的系数计算** — 保证数据一致性
7. **缓存在最后阶段添加** — 先保证功能正确，再优化性能

---

## 十二、风险与备选方案

| 风险 | 影响 | 缓解方案 |
|------|------|----------|
| Sensor Tower API 配额耗尽 | App 市场数据不可用 | 已有 fallback 模拟数据逻辑 |
| Redis 不可用 | 缓存失效 | 降级为内存缓存（node-cache） |
| PostgreSQL 连接问题 | 全部 API 失效 | 种子数据模式下可切换为纯内存数据 |
| 前端组件数据结构变化 | API 需同步更新 | TypeScript 类型约束自动检测 |
