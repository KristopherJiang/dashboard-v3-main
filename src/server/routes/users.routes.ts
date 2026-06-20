// Users 路由 — 分布 + 画像

import { Router } from 'express';
import { z } from 'zod';
import { getUsersDistributionData } from '../services/users.service.js';
import { getUsersDemographicsData } from '../services/users-demographics.service.js';
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

// GET /api/v1/users/distribution
router.get('/distribution', cacheMiddleware(300), (req, res) => {
  const query = QuerySchema.parse(req.query);
  const { startDate, endDate } = getDateRange(
    query.timeRange,
    query.startDate,
    query.endDate,
  );

  const data = getUsersDistributionData(query.timeRange, query.region);

  res.json(
    successResponse(data, {
      region: query.region,
      timeRange: query.timeRange,
      startDate,
      endDate,
    }),
  );
});

// GET /api/v1/users/demographics
router.get('/demographics', cacheMiddleware(300), (req, res) => {
  const query = QuerySchema.parse(req.query);
  const { startDate, endDate } = getDateRange(
    query.timeRange,
    query.startDate,
    query.endDate,
  );

  const data = getUsersDemographicsData(query.timeRange, query.region);

  res.json(
    successResponse(data, {
      region: query.region,
      timeRange: query.timeRange,
      startDate,
      endDate,
    }),
  );
});

export { router as usersRouter };
