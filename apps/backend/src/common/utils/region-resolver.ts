import { PrismaClient } from '@prisma/client';

let _prisma: PrismaClient | null = null;
function getPrisma(): PrismaClient {
  if (!_prisma) _prisma = new PrismaClient();
  return _prisma;
}

const regionCache = new Map<string, { region: string; country: string | null }>();
let cacheLoaded = false;

async function loadCache() {
  if (cacheLoaded) return;
  const rows = await getPrisma().region.findMany({
    where: { parentId: { not: null } },
    include: { parent: true },
  });
  for (const r of rows) {
    regionCache.set(r.code, {
      region: r.parent?.nameEn || '',
      country: r.nameEn,
    });
  }
  // 也加载大区本身的映射（如 EU_UK → region=EU）
  const regions = await getPrisma().region.findMany({ where: { parentId: null } });
  for (const r of regions) {
    if (!regionCache.has(r.code)) {
      regionCache.set(r.code, { region: r.nameEn, country: null });
    }
  }
  cacheLoaded = true;
}

/** 根据前端 region code 解析为数据库的 region + country */
export async function resolveRegion(code: string): Promise<{ region: string; country: string | null } | null> {
  if (!code || code === 'GLOBAL') return null;
  await loadCache();
  return regionCache.get(code) || null;
}
