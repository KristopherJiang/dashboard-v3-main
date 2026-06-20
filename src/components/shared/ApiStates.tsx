// Loading Skeleton 和 Error 组件 — 统一的加载/错误 UI

import React from 'react';

/** 全屏 Skeleton 加载态 */
export function SkeletonLoader() {
  return (
    <div className="w-full h-full min-h-[200px] flex flex-col gap-4 p-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3" />
      <div className="flex-1 bg-gray-100 rounded-xl" />
    </div>
  );
}

/** 行级 Skeleton（用于卡片网格内部） */
export function SkeletonRow() {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-2/3" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
    </div>
  );
}

/** 紧凑骨架：用于 KPI 卡片和小型图表区域 */
export function SkeletonCard() {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[420px] animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-2/3 mb-6" />
      <div className="flex-1 bg-gray-50 rounded-xl" />
    </div>
  );
}

/** 错误提示 */
export function ApiError({ message }: { message: string }) {
  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center">
      <div className="text-center">
        <div className="text-rose-500 text-sm font-bold mb-1">
          数据加载失败
        </div>
        <div className="text-gray-400 text-xs">{message}</div>
      </div>
    </div>
  );
}

/** 行级错误（紧凑） */
export function ApiErrorInline({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <div className="text-rose-500 text-xs font-bold mb-0.5">加载失败</div>
        <div className="text-gray-400 text-[10px]">{message}</div>
      </div>
    </div>
  );
}
