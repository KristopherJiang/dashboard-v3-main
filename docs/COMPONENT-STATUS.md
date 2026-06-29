# Dashboard V3 — 组件联调状态表

> 最后更新：2026-06-27

## 已对接真实数据（7/14）

| # | 组件 | 接口 | 数据表 | 数据源 xlsx | 备注 |
|---|------|------|--------|-----------|------|
| 1 | KPICards（注册人数/FTD人数/FTT人数/Net Deposit 净入金/总交易量/转化率/留存率） | `GET /api/v1/kpi` | `daily_aggregates` + `ftt_retention` + `ftd_ftt_conversion` | 聚合数据2 + UID颗粒度 + 需求特化1 + 用户维表2 | ✅ |
| 2 | ChannelEfficiencyMatrix（各渠道获客成本与 ROI 矩阵） | `GET /api/v1/channels` | `channel_ltv` | 需求特化2 + UID颗粒度 | ✅ |
| 3 | AcquisitionEfficiency（获客转化全链路漏斗） | `GET /api/v1/funnel` | `user_funnel` | 用户维表1 | ⚠️ 表中只有 2025 数据，2026 未导入 |
| 4 | UserDistributionSunburst（新增用户来源构成矩阵） | `GET /api/v1/users/distribution` | `daily_aggregates` | 聚合数据2 + UID颗粒度 | ✅ |
| 5 | MarketingROI（营销 ROI 趋势） | `GET /api/v1/marketing/roi` | `daily_aggregates` | 聚合数据2 + UID颗粒度 | ✅ |
| 6 | UserDemographics（用户画像与地域分布） | `GET /api/v1/users/demographics` | `daily_aggregates` | 聚合数据2 + UID颗粒度 | ✅ |
| 7 | GlobalRegionPicker（地区维度选择器） | `GET /api/v1/regions` | `regions` | 手动配置 | ✅ 从数据库读取地区/国家结构 |

## 未对接 / 使用 Mock 数据（7/14）

| # | 组件 | 接口 | 缺什么 |
|---|------|------|--------|
| 8 | Reputation（品牌舆情监控） | `GET /api/v1/reputation` | 无真实数据源，需 NLP 服务或第三方舆情 API |
| 9 | AppMarketOverview（应用市场口碑摘要） | `GET /api/v1/app-market` | 需对接 Sensor Tower API |
| 10 | WebsiteHealthMonitor（官网/APP健康度监测） | `GET /api/v1/health` | 需对接 Ping 监控服务 |
| 11 | GlobalIntelligence（市场曝光度） | `GET /api/v1/market-intelligence` | 无真实数据源，需 SEO/GEO/ASO 第三方 API |
| 12 | MarketCommand（全球市场曝光度） | `GET /api/v1/market/command` | 无真实数据源 |
| 13 | AIAlertDrawer（AI 智能监控中心） | `GET /api/v1/ai/alerts` | 无真实数据源 |
| 14 | AIDiagnosticModal（AI 深度战略诊断报告） | `GET /api/v1/ai/diagnostic` | 需对接 LLM（Gemini） |

## 数据库表使用情况

| 表 | 当前数据范围 | 使用它的组件 | 数据源 xlsx |
|---|------------|------------|-----------|
| `daily_aggregates` | 2025-01 ~ 2026-06 | KPICards, UserDistribution, MarketingROI | 聚合数据2 + UID颗粒度 |
| `ftt_retention` | 2025-01 ~ 2025-04 | KPICards (D30留存) | 需求特化1 |
| `channel_ltv` | 2025-01 ~ 2026-06 | ChannelEfficiencyMatrix | 需求特化2 + UID颗粒度 |
| `user_funnel` | 2025-01 ~ 2025-04 | AcquisitionEfficiency | 用户维表1 |
| `ftd_ftt_conversion` | 2025-01 ~ 2026-06 | KPICards（FTD→FTT转化率） | 用户维表2 + UID颗粒度 |
| `regions` | 配置数据 | GlobalRegionPicker | 手动配置（70个国家） |

## 数据导入记录

| 日期 | 脚本 | 目标表 | 数据源 | 行数 |
|------|------|--------|--------|------|
| 2026-06-27 | `scripts/import-data.py` | 全部5张表 | 5个聚合xlsx | 399,025 |
| 2026-06-27 | `scripts/import-uid-to-daily.py` | `daily_aggregates` | UID颗粒度 | 10,454 |
| 2026-06-27 | `scripts/import-uid-to-all.py` | `channel_ltv` + `ftd_ftt_conversion` | UID颗粒度 | 10,639 |
| 2026-06-27 | `scripts/seed-regions.py` | `regions` | 前端 REGION_STRUCTURE 配置 | 77 |

## 已知问题

1. **UID 颗粒度数据只覆盖 2026-05-20 ~ 2026-06-17**，5月1-19日无数据，"上个月"等时间范围前几周为空
2. **`ftt_retention` 缺少 2026 数据**，D30 留存率卡片只有 2025 数据
3. **`user_funnel` 缺少 2026 数据**，获客漏斗页面只有 2025 数据
