# Dashboard V3 — 开发进度日志
 
 > 最后更新：2026-06-27
 
 ## 项目结构
 
 | 应用 | 说明 |
 |------|------|
 | `apps/backend` | NestJS + Prisma 后端 API |
 | `apps/frontend` | 已联调的前端（从 dashboard-v3-main fork） |
 | `apps/dashboard-v3-main` | 纯前端参考版（全 mock 数据，无任何 API 调用） |
 
 ## 数据库表（Prisma Schema）
 
 | 表名 | 对应 Excel | 行数 | 被谁使用 |
 |------|-----------|------|---------|
 | `user_funnel` | 用户维表1 | 100K | Funnel + KPI |
 | `ftd_ftt_conversion` | 用户维表2 | 52K | KPI（FTD→FTT 转化率） |
 | `daily_aggregates` | 聚合数据2 | 100K | KPI + Users 分布 + Marketing ROI |
 | `ftt_retention` | 需求转化1 | 47K | KPI（D30 留存率） |
 | `channel_ltv` | 需求转化2 | 100K | 无 service 查询（未使用） |
 
 ---
 
 ## 组件联调进度
 
 ### 已完成（6/15）
 
 - [x] **KPICards** — 8 张 KPI 卡片
   - 前端：`useApi(fetchKPI)` ✅
   - 后端：Prisma 查 `daily_aggregates` + `ftt_retention` ✅
   - 备注：chart 有 fallback mock 数据
 
 - [x] **AcquisitionEfficiency** — 获客转化全链路漏斗
   - 前端：`useApi(fetchFunnel)` ✅
   - 后端：Prisma 查 `user_funnel` ✅
 
 - [x] **ChannelEfficiencyMatrix** — 渠道效率矩阵
   - 前端：`useApi(fetchChannels)` ✅
   - 后端：返回静态数据 + 缩放系数（⚠️ 无真实渠道成本数据）
 
 - [x] **UserDemographics** — 用户画像（地区 + 年龄分布）
   - 前端：`useApi(fetchUserDemographics)` ✅
   - 后端：返回静态数据 + 缩放系数（⚠️ 无真实年龄分布数据）
 
 - [x] **MarketingROI** — 营销 ROI 趋势
   - 前端：`useApi(fetchMarketingROI)` ✅
   - 后端：Prisma 查 `daily_aggregates`（⚠️ 用 netDeposit 代理 spend，非真实广告花费）
 
 - [x] **AppMarketOverview** — 应用市场口碑
   - 前端：`fetchSensorTowerData` 部分连接
   - 后端：Sensor Tower API proxy + fallback
   - 备注：趋势图接了 ST API（iOS 4-5月），差评/评分/竞品仍为 mock
 
 ### 未完成（9/15）
 
 - [ ] **UserDistributionSunburst** — 用户来源旭日图
   - 前端：导入了 `useApi`/`fetchUserDistribution` 但**未使用**，仍用本地 `getRegionalData()`
   - 后端：Prisma 查 `daily_aggregates` 按 retail_layer1/2/3 聚合 ✅
   - 缺口：**前端未对接**（数据已在 DB，只需改造前端代码）
   - 优先级：**P0 — 最容易修复，无外部依赖**
 
 - [ ] **Reputation** — 品牌舆情散点图
   - 前端：硬编码散点数组，无 API 调用
   - 后端：有 controller/service，返回静态 mock
   - 缺口：需要 **Meltwater API**（8 个社交平台的评论+声量数据）
   - 优先级：**P1** — 需要 Meltwater 账号
 
 - [ ] **WebsiteHealthMonitor** — 官网/APP 健康度监测
   - 前端：硬编码国家节点数组，无 API 调用
   - 后端：有 controller/service，返回静态 mock
   - 缺口：需要 **Checkly / Catchpoint API**（网站可用性+LCP）+ **App Store Connect** + **Google Play Developer API**（上下架监控）
   - 优先级：**P1** — 需要多个 API 账号
 
 - [ ] **GlobalIntelligence** — 市场曝光度（SEO + GEO）
   - 前端：硬编码 SEO/GEO 指标，无 API 调用
   - 后端：有 controller/service，返回静态 mock
   - 缺口：需要 **Semrush API**（SEO 指标 + AI Visibility）
   - 优先级：**P1** — 需要 Semrush 账号
 
 - [ ] **MarketCommand** — 全球市场指挥（13 国对比）
   - 前端：硬编码 13 国数据 + 缩放系数，无 API 调用
   - 后端：有 controller/service，返回静态 mock
   - 缺口：需要 **Semrush + Sensor Tower** 综合数据
   - 优先级：**P1**
 
 - [ ] **MarketExposureASO** — ASO 洞察（关键词覆盖+排名）
   - 前端：硬编码关键词/排名数据，无 API 调用
   - 后端：有 controller/service，返回静态 mock
   - 缺口：需要 **Sensor Tower ASO 数据**（关键词覆盖、自然下载占比）
   - 优先级：**P1** — 已有 ST API Key，需扩展 ASO 端点
 
 - [ ] **AIAlertDrawer** — AI 告警抽屉
   - 前端：硬编码告警文案，纯静态 HTML，无 API 调用
   - 后端：有 controller/service，返回静态 mock
   - 缺口：可从 KPI 数据推导告警（数据已在 DB，代码可开发）
   - 优先级：**P2 — 内部数据可支撑，无需外部依赖**
 
 - [ ] **AIDiagnosticModal** — AI 深度战略诊断报告
   - 前端：硬编码打字机效果文本，无 API 调用
   - 后端：无对应 service
   - 缺口：需要接入 **Google Gemini AI**，基于 KPI 数据生成诊断
   - 优先级：**P2**
 
 - [ ] **UserDemographics** 年龄分布数据补全
   - 当前返回的是静态模拟的年龄段比例
   - 缺口：6 张 Excel 表均无 age 字段，需要向资方要用户年龄分布数据
   - 优先级：**P2**
 
 ---
 
 ## 需要向资方要的数据（内部数据）
 
 | # | 缺失数据 | 影响组件 | 需求文档原文 | 优先级 | 状态 |
 |---|---------|---------|-------------|-------|------|
 | 1 | **Paid Ads 各渠道月度花费** | ChannelEfficiencyMatrix, MarketingROI | 提到 `202501-202604--Paid Ads 花费集合.xlsx`，未提供 | **P0** | 🔴 未提供 |
 | 2 | **KOL 归因数据** | ChannelEfficiencyMatrix | "DW 还没有有效的归因到 customer" | **P1** | 🔴 未提供 |
 | 3 | **RAF 成本数据** | ChannelEfficiencyMatrix | "待补充，processing, pending in BI" | **P1** | 🔴 未提供 |
 | 4 | **IB + Affiliate 成本** | ChannelEfficiencyMatrix | "敏感，需支持" | **P1** | 🔴 未提供 |
 | 5 | **年龄分布数据** | UserDemographics | 无此数据维度 | **P2** | 🔴 未提供 |
 | 6 | **D7 留存率** | KPICards 第 8 张卡片 | `ftt_retention` 表已有 `ftt_trade_7d` 字段，代码未用 | **P2** | 🟡 数据已有，代码未对接 |
 | 7 | **渠道归因注册数** | ChannelEfficiencyMatrix | `channel_ltv` 表已有数据，后端 service 未查询 | **P2** | 🟡 数据已有，代码未对接 |
 
 ---
 
 ## 需要的外部 API 账号
 
 | 服务 | 用途 | 影响组件 | 状态 |
 |------|------|---------|------|
 | **Sensor Tower** | App 下载量/评分/ASO | AppMarketOverview, MarketExposureASO, MarketCommand | 🟡 已有 API Key，proxy 部分连通（仅 iOS 4-5月） |
 | **Meltwater** | 品牌舆情（8 个社交平台） | Reputation | 🔴 需要账号 |
 | **Semrush** | SEO + GEO/AI Visibility | GlobalIntelligence, MarketCommand | 🔴 需要账号 |
 | **Checkly / Catchpoint** | 网站可用性 + LCP 监控 | WebsiteHealthMonitor | 🔴 需要账号 |
 | **Trustpilot** | 用户评论/评分 | AppMarketOverview | 🟢 可爬取，不需账号 |
 | **App Store Connect** | iOS 上下架监控 | WebsiteHealthMonitor | 🔴 需要 API Key |
 | **Google Play Developer** | Android 上下架监控 | WebsiteHealthMonitor | 🔴 需要 API Key |
 
 ---
 
 ## 完成度评估
 
 | 维度 | 完成度 | 说明 |
 |------|--------|------|
 | 后端模块创建 | **14/14** | 所有 controller + service + module 已创建 |
 | 后端真实数据 | **4/14** | KPI, Funnel, Users(分布), Marketing(ROI) 用 Prisma 查 DB |
 | 前端 API 对接 | **6/15** | 6 个组件已接 API（含部分连接的 AppMarketOverview） |
 | 前端 mock 改造 | **0/9** | 9 个组件仍为硬编码 mock 数据 |
 | 外部 API 接入 | **1/7** | 仅 Sensor Tower 部分连通 |
 | 整体联调 | **~40%** | 核心内部数据模块联调较好，外部数据模块几乎未启动 |
 
 ---
 
 ## 开发日志
 
 ### 2026-06-27
 - 完成全项目梳理：对比 dashboard-v3-main 与 frontend 的组件差异
 - 识别出 15 个组件的联调状态（6 已完成 / 9 未完成）
 - 梳理出后端 5 张 DB 表的使用情况
 - 整理出 7 项内部数据缺口和 7 项外部 API 缺口
 - 产出本文档作为后续开发跟踪基准
