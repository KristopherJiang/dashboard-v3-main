// Express 错误处理中间件 — 捕获所有未处理错误并返回统一格式

import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { errorResponse } from '../utils/response.js';

/**
 * 全局错误处理中间件
 * ZodError → 400 参数校验失败
 * 其他错误 → 500 服务器内部错误
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Zod 校验错误 → 400
  if (err instanceof ZodError) {
    const messages = err.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');

    console.error(`[Validation Error] ${messages}`);

    res.status(400).json(errorResponse('VALIDATION_ERROR', messages));
    return;
  }

  // 其他错误 → 500
  console.error(`[Internal Error] ${err.message}`, err.stack);

  res
    .status(500)
    .json(errorResponse('INTERNAL_ERROR', 'An unexpected error occurred'));
}
