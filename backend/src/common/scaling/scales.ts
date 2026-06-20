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

export const REGION_SCALE: Record<string, number> = {
  GLOBAL: 1.0,
  ASIA_VN: 0.15,
  EU_UK: 0.12,
  ASIA_IN: 0.2,
  MENA_AE: 0.08,
  GS_AU: 0.06,
};

export const COST_SCALE: Record<string, number> = {
  GLOBAL: 1.0,
  ASIA_VN: 0.35,
  EU_UK: 2.1,
  ASIA_IN: 0.22,
  MENA_AE: 1.4,
  GS_AU: 1.8,
};

export function getMultiplier(timeRange: string, region: string): number {
  return (TIME_SCALE[timeRange] || 1.0) * (REGION_SCALE[region] || 0.04);
}
