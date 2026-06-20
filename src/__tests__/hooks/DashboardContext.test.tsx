/**
 * DashboardContext 单元测试
 * 验证全局状态管理的正确性
 */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { DashboardProvider, useDashboardContext } from '@/lib/DashboardContext';

function wrapper({ children }: { children: ReactNode }) {
  return <DashboardProvider>{children}</DashboardProvider>;
}

describe('DashboardContext', () => {
  it('should provide default values', () => {
    const { result } = renderHook(() => useDashboardContext(), { wrapper });

    expect(result.current.timeRange).toBe('mtd');
    expect(result.current.selectedRegion).toBe('GLOBAL');
  });

  it('should update timeRange', () => {
    const { result } = renderHook(() => useDashboardContext(), { wrapper });

    act(() => {
      result.current.setTimeRange('ytd');
    });

    expect(result.current.timeRange).toBe('ytd');
  });

  it('should update selectedRegion', () => {
    const { result } = renderHook(() => useDashboardContext(), { wrapper });

    act(() => {
      result.current.setSelectedRegion('ASIA_VN');
    });

    expect(result.current.selectedRegion).toBe('ASIA_VN');
  });

  it('should update customDateRange', () => {
    const { result } = renderHook(() => useDashboardContext(), { wrapper });
    const start = new Date('2026-01-01');
    const end = new Date('2026-01-31');

    act(() => {
      result.current.setCustomDateRange({ start, end });
    });

    expect(result.current.customDateRange.start).toEqual(start);
    expect(result.current.customDateRange.end).toEqual(end);
  });

  it('should throw when used outside DashboardProvider', () => {
    expect(() => {
      renderHook(() => useDashboardContext());
    }).toThrow('useDashboardContext must be used within a DashboardProvider');
  });
});
