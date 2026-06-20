// Health Nodes 路由 — GET /api/v1/health/nodes（实时数据，不缓存）

import { Router } from 'express';
import { getHealthNodesData } from '../services/health-nodes.service.js';
import { successResponse } from '../utils/response.js';

const router = Router();

// 实时健康监测 — 不缓存
router.get('/', (_req, res) => {
  const data = getHealthNodesData();
  res.json(successResponse(data));
});

export { router as healthNodesRouter };
