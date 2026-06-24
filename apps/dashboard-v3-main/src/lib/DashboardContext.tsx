import React, { createContext, useContext, useState, ReactNode } from 'react';

export type TimeRange = 'today' | 'yesterday' | 'thisWeek' | 'mtd' | 'lastMonth' | 'ytd' | 'last90' | 'custom';

// Relaxed RegionKey to allow the 60+ countries
export type RegionKey = string;

export interface DateRange {
  start: Date;
  end: Date;
}

interface DashboardContextType {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  selectedRegion: RegionKey;
  setSelectedRegion: (region: RegionKey) => void;
  customDateRange: DateRange;
  setCustomDateRange: (range: DateRange) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [timeRange, setTimeRange] = useState<TimeRange>('mtd');
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>('GLOBAL');
  
  const TODAY = new Date();
  const [customDateRange, setCustomDateRange] = useState<DateRange>({ start: TODAY, end: TODAY });

  return (
    <DashboardContext.Provider value={{ 
      timeRange, setTimeRange, 
      selectedRegion, setSelectedRegion,
      customDateRange, setCustomDateRange
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
}

