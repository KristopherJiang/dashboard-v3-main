// API 客户端封装 — 统一 fetch 请求、错误处理和响应解析

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/** 统一 API 响应结构 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
  error?: { code: string; message: string };
}

/** 通用查询参数 */
interface CommonParams {
  timeRange?: string;
  region?: string;
  startDate?: string;
  endDate?: string;
  granularity?: string;
}

/**
 * 通用 fetch wrapper
 * 拼接 query params、处理 HTTP 错误、解析 JSON 并校验 success 字段
 */
async function apiFetch<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const searchParams = new URLSearchParams(params);
  const qs = searchParams.toString();
  const url = `${API_BASE}/${path}${qs ? `?${qs}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  const json: ApiResponse<T> = await res.json();
  if (!json.success) {
    throw new Error(json.error?.message || 'Unknown API error');
  }

  return json.data;
}

/** 把 CommonParams 转为 Record<string, string> */
function toQuery(timeRange: string, region: string): Record<string, string> {
  return { timeRange, region };
}

// ============================================================
// KPI — 8 张卡片
// ============================================================

export interface KPIChartPoint {
  month: string;
  current: number;
  previous: number;
}

export interface KPICard {
  key: string;
  value: number;
  trendPoP: number;
  trendYoY: number;
  chartData: KPIChartPoint[];
}

export async function fetchKPI(
  timeRange: string,
  region: string,
): Promise<{ cards: KPICard[] }> {
  return apiFetch('kpi', toQuery(timeRange, region));
}

// ============================================================
// Channels — 渠道效率矩阵
// ============================================================

export interface ChannelMetrics {
  newUsers: number;
  spend: number;
  signupCAC: number;
  kycCAC: number;
  ftdCAC: number;
  fttCAC: number;
  roi: number;
  ltv: number;
}

export interface ChannelNode {
  id: string;
  name: string;
  metrics: ChannelMetrics;
  children?: ChannelNode[];
}

export async function fetchChannels(
  timeRange: string,
  region: string,
): Promise<{ channels: ChannelNode[] }> {
  return apiFetch('channels', toQuery(timeRange, region));
}

// ============================================================
// Users — 分布 + 画像
// ============================================================

export interface DistributionNode {
  name: string;
  value: number;
  pct: number;
  children?: DistributionNode[];
}

export async function fetchUserDistribution(
  timeRange: string,
  region: string,
): Promise<{ totalNewUsers: number; distribution: DistributionNode[] }> {
  return apiFetch('users/distribution', toQuery(timeRange, region));
}

export interface DemographicItem {
  label: string;
  count: number;
  pct: number;
}

export async function fetchUserDemographics(
  timeRange: string,
  region: string,
): Promise<{
  total: number;
  regionDistribution: DemographicItem[];
  ageDistribution: DemographicItem[];
}> {
  return apiFetch('users/demographics', toQuery(timeRange, region));
}

// ============================================================
// Funnel — 获客漏斗
// ============================================================

export interface FunnelStep {
  step: number;
  title: string;
  users: number;
  pctOfTotal: number;
  stepCVR: number | null;
  cumCVR: number;
  dropoff: number | null;
  dropoffPct: number | null;
}

export async function fetchFunnel(
  timeRange: string,
  region: string,
): Promise<{ steps: FunnelStep[] }> {
  return apiFetch('funnel', toQuery(timeRange, region));
}

// ============================================================
// Reputation — 舆情散点
// ============================================================

export interface ReputationPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  platform: string;
  insight: string;
  action: string;
}

export async function fetchReputation(
  timeRange: string,
  region: string,
): Promise<{ points: ReputationPoint[] }> {
  return apiFetch('reputation', toQuery(timeRange, region));
}

// ============================================================
// App Market — 应用市场口碑
// ============================================================

export interface AppMarketOverviewData {
  rating: number;
  totalReviews: number;
  fiveStarRatio: number;
  positiveRatio: number;
}

export interface TrendPoint {
  month: string;
  reviews: number;
  downloads: number;
  score: number;
  compReviews: number;
  compDownloads: number;
  compScore: number;
}

export interface NegativeReview {
  id: number;
  text: string;
  date: string;
  rating: number;
  tag: string;
}

export interface Competitor {
  name: string;
  rating: number;
  reviews: number;
  downloads: number;
}

export async function fetchAppMarket(
  timeRange: string,
  region: string,
): Promise<{
  overview: AppMarketOverviewData;
  trends: TrendPoint[];
  negativeReviews: NegativeReview[];
  competitors: Competitor[];
}> {
  return apiFetch('app-market', toQuery(timeRange, region));
}

// ============================================================
// Health Nodes — 官网/APP 健康度监测
// ============================================================

export interface NodeHealth {
  id: string;
  flag: string;
  name: string;
  city: string;
  latency: number;
  jitter: string;
  packetLoss: string;
  iosStatus: 'normal' | 'removed';
  androidStatus: 'normal' | 'removed';
  iosDesc: string;
  androidDesc: string;
}

export interface SLASummary {
  healthyRatio: number;
  warningRatio: number;
  criticalRatio: number;
}

export async function fetchHealthNodes(): Promise<{
  nodes: NodeHealth[];
  sla: SLASummary;
}> {
  return apiFetch('health/nodes');
}

// ============================================================
// Market Intelligence — 市场情报
// ============================================================

export interface SEOMetric {
  value: number;
  change: number;
}

export interface SEOData {
  authorityScore: SEOMetric & { status: string; percentile: string };
  organicTraffic: SEOMetric;
  organicKeywords: SEOMetric;
  paidTraffic: SEOMetric;
  paidKeywords: SEOMetric;
}

export interface AISource {
  name: string;
  mentions: number;
  cited: number;
}

export interface GEOData {
  visibility: number;
  mentions: number;
  citedPages: number;
  aiSources: AISource[];
}

export interface ASOSummary {
  cvr: number;
  organicRatio: number;
  totalKeywords: number;
  top3Keywords: number;
}

export interface BrandRank {
  rank: number;
  name: string;
  change: string;
  score: string;
}

export interface MarketIntelligenceData {
  seo: SEOData;
  geo: GEOData;
  aso: ASOSummary;
  brandRanking: BrandRank[];
}

export async function fetchMarketIntelligence(
  timeRange: string,
  region: string,
): Promise<MarketIntelligenceData> {
  return apiFetch('market-intelligence', toQuery(timeRange, region));
}

// ============================================================
// ASO — ASO 数据
// ============================================================

export interface ASOKPI {
  cvr: number;
  organicRatio: number;
  totalKeywords: number;
  top3Keywords: number;
}

export interface RankDistribution {
  month: string;
  top1_3: number;
  top4_10: number;
  top10_50: number;
  tail: number;
}

export interface SemanticKeyword {
  name: string;
  rank: number;
  downloads: number;
}

export async function fetchASO(
  timeRange: string,
  region: string,
): Promise<{
  kpi: ASOKPI;
  rankDistribution: RankDistribution[];
  semanticKeywords: SemanticKeyword[];
}> {
  return apiFetch('aso', toQuery(timeRange, region));
}

// ============================================================
// Market Command — 市场命令
// ============================================================

export interface MarketMetric {
  val: number;
  delta: number;
  growth: number;
}

export interface CountryData {
  id: string;
  name: string;
  coords: { top: string; left: string };
  tier: 1 | 2;
  aso: MarketMetric;
  geo: MarketMetric;
  seo: MarketMetric;
  comps: string[];
}

export async function fetchMarketCommand(
  timeRange: string,
  region: string,
): Promise<{ countries: CountryData[] }> {
  return apiFetch('market/command', toQuery(timeRange, region));
}

// ============================================================
// AI Alerts — AI 告警
// ============================================================

export interface AIAlert {
  id: string;
  type: 'critical' | 'warning' | 'optimize';
  title: string;
  value: string;
  region: string;
  timestamp: string;
  description: string;
  action: string;
}

export async function fetchAIAlerts(
  timeRange: string,
  region: string,
): Promise<{ alerts: AIAlert[] }> {
  return apiFetch('ai/alerts', toQuery(timeRange, region));
}

// ============================================================
// Marketing ROI — 营销 ROI
// ============================================================

export interface WeeklyROI {
  week: string;
  spend: number;
  revenue: number;
  roi: number;
}

export async function fetchMarketingROI(
  timeRange: string,
  region: string,
): Promise<{ weeks: WeeklyROI[]; totalSpend: number; totalRevenue: number; avgRoi: number }> {
  return apiFetch('marketing/roi', toQuery(timeRange, region));
}

// ============================================================
// Regions — 地区/国家结构
// ============================================================

export interface RegionCountry {
  id: string;
  name: string;
  en: string;
  isHot?: boolean;
}

export interface RegionItem {
  id: string;
  label: string;
  nameCn: string;
  countries: RegionCountry[];
}

export interface FavoriteItem {
  id: string;
  label: string;
  sub: string;
  isHot?: boolean;
}

export async function fetchRegions(): Promise<{ regions: RegionItem[]; favorites: FavoriteItem[] }> {
  return apiFetch('regions');
}
