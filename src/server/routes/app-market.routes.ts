// App Market 路由 — GET /api/v1/app-market

import { Router } from 'express';
import { z } from 'zod';
import { getAppMarketData } from '../services/app-market.service.js';
import { successResponse } from '../utils/response.js';
import { getDateRange } from '../utils/dateRange.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = Router();

const QuerySchema = z.object({
  timeRange: z
    .enum([
      'today',
      'yesterday',
      'thisWeek',
      'mtd',
      'lastMonth',
      'ytd',
      'last90',
      'custom',
    ])
    .default('mtd'),
  region: z.string().default('GLOBAL'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  granularity: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  platform: z.enum(['ios', 'android']).default('ios'),
});

router.get('/', cacheMiddleware(1800), (req, res) => {
  const query = QuerySchema.parse(req.query);
  const { startDate, endDate } = getDateRange(
    query.timeRange,
    query.startDate,
    query.endDate,
  );

  const data = getAppMarketData(query.timeRange, query.region);

  res.json(
    successResponse(data, {
      region: query.region,
      timeRange: query.timeRange,
      platform: query.platform,
      startDate,
      endDate,
    }),
  );
});

export { router as appMarketRouter };
