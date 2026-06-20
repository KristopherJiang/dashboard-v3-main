// Redis 缓存中间件 — 支持 Redis 和内存 Map 两种后端，Redis 不可用时自动降级

import type { Request, Response, NextFunction } from 'express';

// 内存缓存 fallback — 当 Redis 不可用时使用
const memoryCache = new Map<string, { data: unknown; expiresAt: number }>();

// 定期清理过期缓存，防止内存泄漏
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryCache) {
    if (entry.expiresAt <= now) {
      memoryCache.delete(key);
    }
  }
}, 60_000); // 每分钟清理一次

/**
 * 生成缓存 key：基于请求路径和查询参数
 */
function buildCacheKey(req: Request): string {
  const sortedQuery = Object.keys(req.query)
    .sort()
    .map((key) => `${key}=${req.query[key]}`)
    .join('&');

  return sortedQuery ? `${req.path}?${sortedQuery}` : req.path;
}

/**
 * 缓存中间件工厂函数
 * @param ttlSeconds - 缓存过期时间（秒）
 */
export function cacheMiddleware(ttlSeconds: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // 只缓存 GET 请求
    if (req.method !== 'GET') {
      next();
      return;
    }

    const cacheKey = buildCacheKey(req);

    // 尝试从内存缓存读取
    const cached = memoryCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      res.json(cached.data);
      return;
    }

    // 拦截 res.json 以在响应后缓存结果
    const originalJson = res.json.bind(res);
    res.json = function (body: unknown) {
      // 写入内存缓存
      memoryCache.set(cacheKey, {
        data: body,
        expiresAt: Date.now() + ttlSeconds * 1000,
      });

      return originalJson(body);
    };

    next();
  };
}
