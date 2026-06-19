# 前端组件对接 API

将前端组件的硬编码数据替换为后端 API 调用。

## 步骤

### 1. 在 `src/lib/api.ts` 添加 API 调用函数

```typescript
export interface XxxData {
  // 定义响应数据类型
}

export async function fetchXxxData(timeRange: string, region: string): Promise<XxxData> {
  const params = new URLSearchParams({ timeRange, region });
  const res = await fetch(`/api/v1/xxx?${params}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message);
  return json.data;
}
```

### 2. 创建 React Hook `src/lib/hooks/useXxx.ts`

```typescript
import { useState, useEffect } from 'react';
import { useDashboardContext } from '../DashboardContext';
import { fetchXxxData } from '../api';

export function useXxx() {
  const { timeRange, selectedRegion } = useDashboardContext();
  const [data, setData] = useState<XxxData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchXxxData(timeRange, selectedRegion)
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [timeRange, selectedRegion]);

  return { data, loading, error };
}
```

### 3. 修改组件

```tsx
// 替换硬编码数据
// const data = [ ... ];  // 删除硬编码
const { data, loading, error } = useXxx();  // 使用 hook

if (loading) return <LoadingSkeleton />;
if (error) return <ErrorMessage message={error} />;
if (!data) return null;

// 使用 data.xxx 渲染，其余 UI 不变
```

## 规则

- Hook 必须使用 `useDashboardContext()` 获取 timeRange 和 region
- 必须处理 loading 和 error 状态
- 必须在 useEffect cleanup 中设置 cancelled 标志防止内存泄漏
- 不改动组件的 UI 结构和样式
- API 函数放在 `src/lib/api.ts`，Hook 放在 `src/lib/hooks/`
