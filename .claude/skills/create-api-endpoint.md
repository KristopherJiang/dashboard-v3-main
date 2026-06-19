# 创建 API 端点

当需要新增一个后端 API 端点时，严格按以下步骤执行。

## 步骤

### 1. 创建路由文件 `src/server/routes/{module}.routes.ts`

```typescript
import { Router } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '../utils/response';
import { getXxxData } from '../services/{module}.service';

const router = Router();

// Zod 验证 schema
const QuerySchema = z.object({
  timeRange: z.enum(['today', 'yesterday', 'thisWeek', 'mtd', 'lastMonth', 'ytd', 'last90', 'custom']).default('mtd'),
  region: z.string().default('GLOBAL'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  granularity: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
});

router.get('/', async (req, res) => {
  try {
    const params = QuerySchema.parse(req.query);
    const data = await getXxxData(params);
    res.json(successResponse(data, params));
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('INVALID_PARAMS', error.message));
    } else {
      res.status(500).json(errorResponse('INTERNAL_ERROR', 'Something went wrong'));
    }
  }
});

export default router;
```

### 2. 创建服务文件 `src/server/services/{module}.service.ts`

```typescript
import { getMultiplier, TIME_SCALE, REGION_SCALE, COST_SCALE } from '../data/scales';
import type { QueryParams } from '../types';

export async function getXxxData(params: QueryParams) {
  const m = getMultiplier(params.timeRange, params.region);
  // 数据逻辑...
  return { ... };
}
```

### 3. 注册路由 `src/server/routes/index.ts`

```typescript
import xxxRouter from './xxx.routes';
app.use('/api/v1/xxx', xxxRouter);
```

### 4. 测试

```bash
curl "http://localhost:3000/api/v1/xxx?timeRange=mtd&region=GLOBAL"
```

## 规则

- 所有数值计算必须使用 `scales.ts` 中的系数
- 响应必须使用 `successResponse()` / `errorResponse()` 格式
- 查询参数必须通过 Zod 校验
- Service 层不直接操作 req/res
