// 缩放系数核心模块 — 所有 Service 的数值计算都必须引用此文件的系数

/** 时间范围缩放系数：将时间维度映射到比例因子 */
export const TIME_SCALE: Record<string, number> = {
  today: 0.03,
  yesterday: 0.035,
  thisWeek: 0.21,
  mtd: 1.0,
  lastMonth: 0.95,
  ytd: 4.8,
  last90: 2.9,
  custom: 1.2,
};

/** 地区缩放系数：不同地区占总量的权重 */
export const REGION_SCALE: Record<string, number> = {
  GLOBAL: 1.0,
  ASIA_VN: 0.15,
  EU_UK: 0.12,
  ASIA_IN: 0.2,
  MENA_AE: 0.08,
  GS_AU: 0.06,
};

/** 地区成本系数：不同地区的单位成本倍数 */
export const COST_SCALE: Record<string, number> = {
  GLOBAL: 1.0,
  ASIA_VN: 0.35,
  EU_UK: 2.1,
  ASIA_IN: 0.22,
  MENA_AE: 1.4,
  GS_AU: 1.8,
};

/**
 * 计算最终倍数 = 时间范围缩放 × 地区缩放
 * 当 timeRange 或 region 不在已知映射中时使用默认值
 */
export function getMultiplier(timeRange: string, region: string): number {
  return (TIME_SCALE[timeRange] || 1.0) * (REGION_SCALE[region] || 0.04);
}
