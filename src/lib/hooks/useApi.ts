// 通用 API Hook — 读取 DashboardContext 的 timeRange/region，管理 loading/error/data

import { useState, useEffect } from 'react';
import { useDashboardContext } from '../DashboardContext';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * 通用 API 请求 Hook
 * @param fetcher - 接受 (timeRange, region) 返回 Promise 的函数
 * @returns { data, loading, error }
 */
export function useApi<T>(
  fetcher: (timeRange: string, region: string) => Promise<T>,
): UseApiState<T> {
  const { timeRange, selectedRegion } = useDashboardContext();
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetcher(timeRange, selectedRegion)
      .then((d) => {
        if (!cancelled) setState({ data: d, loading: false, error: null });
      })
      .catch((e: Error) => {
        if (!cancelled) setState({ data: null, loading: false, error: e.message });
      });

    return () => {
      cancelled = true;
    };
  }, [timeRange, selectedRegion, fetcher]);

  return state;
}

/**
 * 无需 DashboardContext 的 API 请求 Hook
 * 用于不依赖 timeRange/region 的组件（如 AIAlertDrawer、AIDiagnosticModal）
 * 组件通过 deps 参数控制 refetch 时机
 */
export function useStaticApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): UseApiState<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetcher()
      .then((d) => {
        if (!cancelled) setState({ data: d, loading: false, error: null });
      })
      .catch((e: Error) => {
        if (!cancelled) setState({ data: null, loading: false, error: e.message });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
