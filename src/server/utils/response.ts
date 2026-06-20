// 统一响应格式工具 — 所有 API 端点必须使用此模块返回标准结构

interface SuccessMeta {
  timestamp?: string;
  region?: string;
  timeRange?: string;
  [key: string]: unknown;
}

interface SuccessResponse {
  success: true;
  data: unknown;
  meta: {
    timestamp: string;
    [key: string]: unknown;
  };
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

/** 构建成功响应 */
export function successResponse(
  data: unknown,
  meta?: SuccessMeta,
): SuccessResponse {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}

/** 构建错误响应 */
export function errorResponse(code: string, message: string): ErrorResponse {
  return {
    success: false,
    error: { code, message },
  };
}
