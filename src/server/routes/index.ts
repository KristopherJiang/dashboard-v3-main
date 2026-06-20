// 路由注册总入口 — 所有业务路由统一挂载到 /api/v1/ 前缀

import { Router } from 'express';
import { successResponse } from '../utils/response.js';
import { funnelRouter } from './funnel.routes.js';
import { marketingRoiRouter } from './marketing-roi.routes.js';
import { kpiRouter } from './kpi.routes.js';
import { usersRouter } from './users.routes.js';
import { channelsRouter } from './channels.routes.js';
import { appMarketRouter } from './app-market.routes.js';
import { reputationRouter } from './reputation.routes.js';
import { marketIntelligenceRouter } from './market-intelligence.routes.js';
import { asoRouter } from './aso.routes.js';
import { marketCommandRouter } from './market-command.routes.js';
import { healthNodesRouter } from './health-nodes.routes.js';
import { aiAlertsRouter } from './ai-alerts.routes.js';

const router = Router();

// Health check — 验证 API 框架可用
router.get('/health', (_req, res) => {
  res.json(
    successResponse({
      status: 'ok',
      uptime: process.uptime(),
      version: '3.0.0',
    }),
  );
});

// 注册全部业务路由模块
router.use('/funnel', funnelRouter);
router.use('/marketing/roi', marketingRoiRouter);
router.use('/kpi', kpiRouter);
router.use('/users', usersRouter);
router.use('/channels', channelsRouter);
router.use('/app-market', appMarketRouter);
router.use('/reputation', reputationRouter);
router.use('/market-intelligence', marketIntelligenceRouter);
router.use('/aso', asoRouter);
router.use('/market/command', marketCommandRouter);
router.use('/health/nodes', healthNodesRouter);
router.use('/ai/alerts', aiAlertsRouter);

export { router };
