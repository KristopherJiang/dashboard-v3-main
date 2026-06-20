// Prisma ORM Region 过滤工具 — 返回 Prisma where 子句对象

/**
 * 将前端 region 枚举映射为 where 条件对象。
 * GLOBAL 不加任何 region 过滤。
 * 返回值可与任何包含 region/country 字段的 Prisma where 对象展开合并且类型兼容。
 */
export function getRegionFilter(region: string): Record<string, string> {
  switch (region) {
    case 'GLOBAL':
      return {};
    case 'ASIA_VN':
      return { region: 'Asia', country: 'Vietnam' };
    case 'EU_UK':
      return { region: 'EU' };
    case 'ASIA_IN':
      return { region: 'Asia', country: 'India' };
    case 'MENA_AE':
      return { region: 'MENA' };
    case 'GS_AU':
      return { region: 'GS-Others' };
    default:
      return {};
  }
}
