# 数据覆盖分析 — Dashboard V3

## 甲方提供的 6 张表

| # | 文件 | 行数 | 列数 | 内容 |
|---|------|------|------|------|
| 1 | 用户维表1 | 100K | 16 | 注册→FTD/FTT 转化率（7d/30d），渠道三层拆分 |
| 2 | 用户维表2 | 52K | 5 | FTD→FTT 转化率（7d） |
| 3 | 聚合数据2 | 100K | 12 | 日维度聚合：注册/FTD/FTT/净入金/交易量 |
| 4 | 需求转化2 | 100K | 8 | LTV_30d 按渠道/地区，ROI 计算 |
| 5 | 需求转化1 | 47K | 6 | FTT 后 D7/D30 留存率 |
| 6 | Vantage MKT UID颗粒度 | 80K | 51 | 用户级全生命周期（最完整） |

## 组件覆盖情况

### ✅ 可实现（数据齐全）

| 组件 | 数据来源 |
|------|---------|
| KPICards（8 张卡片） | 表1+2+3+5 |
| UserDistributionSunburst（旭日图） | 表3 |
| AcquisitionEfficiency（漏斗） | 表1 |
| UserDemographics（用户画像） | 表1+3 |

### ⚠️ 部分可实现

| 组件 | 缺失 | 说明 |
|------|------|------|
| ChannelEfficiencyMatrix | 渠道成本 | 有 LTV_30d（表4），但缺渠道花费数据 |
| MarketingROI | 营销花费 | 有净入金（表3），但缺花费 Excel |
| AIAlertDrawer | — | 可从 KPI 数据推导告警 |
| AIDiagnosticModal | — | 可从 KPI 数据生成诊断 |

### ❌ 无法实现（需要外部数据）

| 组件 | 所需数据源 | API 文档 |
|------|-----------|---------|
| Reputation | Meltwater API | developer.meltwater.com |
| AppMarketOverview | Sensor Tower + Trustpilot | 已有 ST API Key |
| WebsiteHealthMonitor | Checkly / Catchpoint | checklyhq.com/docs |
| GlobalIntelligence | Semrush | developer.semrush.com |
| MarketCommand | Semrush + Sensor Tower | — |
| MarketExposureASO | Sensor Tower | — |

## 需要向甲方要的数据

1. **Paid Ads 花费 Excel** — 文档提到 `202501-202604--Paid Ads 花费集合.xlsx`，未提供
2. **KOL 归因数据** — 文档说"归因有问题"
3. **RAF 成本数据** — 文档说"待补充"
4. **IB+Affiliate 成本** — 文档说"敏感，需支持"

## 外部 API 需要的账号

| 服务 | 用途 | 状态 |
|------|------|------|
| Sensor Tower | App 市场 + ASO | 已有 API Key |
| Meltwater | 品牌舆情 | 需要账号 |
| Semrush | SEO/GEO | 需要账号 |
| Checkly | 网站健康 | 需要账号 |
| Trustpilot | 评论数据 | 爬虫可获取 |
