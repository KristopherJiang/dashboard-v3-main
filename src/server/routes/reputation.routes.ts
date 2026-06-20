// Reputation 舆情路由 — GET /api/v1/reputation

import { Router } from 'express';
import { z } from 'zod';
import { getReputationData } from '../services/reputation.service.js';
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
});

router.get('/', cacheMiddleware(600), (req, res) => {
  const query = QuerySchema.parse(req.query);
  const { startDate, endDate } = getDateRange(
    query.timeRange,
    query.startDate,
    query.endDate,
  );

  const data = getReputationData(query.timeRange, query.region);

  res.json(
    successResponse(data, {
      region: query.region,
      timeRange: query.timeRange,
      startDate,
      endDate,
    }),
  );
});

export { router as reputationRouter };
