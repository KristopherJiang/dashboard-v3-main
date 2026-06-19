import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDashboardContext } from '../lib/DashboardContext';

const PRESETS = [
  { id: 'today', label: '今日', sub: 'Today' },
  { id: 'yesterday', label: '昨日', sub: 'Yesterday' },
  { id: 'thisWeek', label: '本周', sub: 'This Week' },
  { id: 'mtd', label: '本月 (MTD)', sub: 'Month to Date' },
  { id: 'lastMonth', label: '上月', sub: 'Last Month' },
  { id: 'ytd', label: '今年以来 (YTD)', sub: 'Year to Date' },
  { id: 'last90', label: '过去 90 天', sub: 'Last 90 Days' },
];

const CLevelTimePicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { timeRange: selectedId, setTimeRange: setSelectedId, customDateRange, setCustomDateRange } = useDashboardContext();
  const [isCompareMode, setIsCompareMode] = useState(true);
  
  // Calendar Navigation State
  const TODAY = new Date(); // Use real current date
  const [viewDate, setViewDate] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth())); 
  
  // Local state for range selection process
  const [selectionStart, setSelectionStart] = useState<Date | null>(customDateRange.start);
  const [selectionEnd, setSelectionEnd] = useState<Date | null>(customDateRange.end);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedPreset = PRESETS.find(p => p.id === selectedId) || PRESETS[3];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calendar Helpers
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0 is Sun
  // Adjust to Mon being first day (0=Mon, 6=Sun)
  const emptyDays = firstDay === 0 ? 6 : firstDay - 1;

  const prevMonth = () => setViewDate(new Date(year, month - 1));
  const nextMonth = () => {
    // Prevent going to future months
    const nextView = new Date(year, month + 1);
    if (nextView <= new Date(TODAY.getFullYear(), TODAY.getMonth())) {
      setViewDate(nextView);
    }
  };

  const isFutureDay = (day: number) => {
    const checkDate = new Date(year, month, day);
    return checkDate > TODAY;
  };

  const isFutureMonth = () => {
    const nextView = new Date(year, month + 1);
    return nextView > new Date(TODAY.getFullYear(), TODAY.getMonth());
  };

  const handleDateClick = (day: number) => {
    if (isFutureDay(day)) return;
    
    const clickDate = new Date(year, month, day);
    
    if (selectionStart && !selectionEnd && clickDate >= selectionStart) {
      setSelectionEnd(clickDate);
      setCustomDateRange({ start: selectionStart, end: clickDate });
      setSelectedId('custom');
    } else {
      setSelectionStart(clickDate);
      setSelectionEnd(null);
      setSelectedId('custom');
    }
  };

  const isSelected = (day: number) => {
    if (selectedId !== 'custom') return false;
    const d = new Date(year, month, day);
    if (selectionStart && !selectionEnd) {
      return d.getTime() === selectionStart.getTime();
    }
    if (selectionStart && selectionEnd) {
      return d >= selectionStart && d <= selectionEnd;
    }
    return false;
  };
  
  const isRangeBound = (day: number) => {
    if (selectedId !== 'custom' || !selectionStart || !selectionEnd) return false;
    const d = new Date(year, month, day);
    return d.getTime() === selectionStart.getTime() || d.getTime() === selectionEnd.getTime();
  };

  const formatShortDate = (d: Date) => `${d.getMonth() + 1}-${d.getDate()}`;

  return (
    <div className="relative" ref={containerRef}>
      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-800 shadow-sm hover:border-gray-300 hover:shadow-md transition-all group"
      >
        <div className="bg-gray-50 p-1.5 rounded-lg group-hover:bg-gray-100 transition-colors">
          <Calendar className="w-4 h-4 text-gray-500" />
        </div>
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">时间维度</span>
          <span className="text-[13px]">
            {selectedId === 'custom' && selectionStart
              ? `${formatShortDate(selectionStart)}${selectionEnd ? ` 至 ${formatShortDate(selectionEnd)}` : '...'}` 
              : selectedPreset.label}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute right-0 top-full mt-2 w-[480px] bg-white border border-gray-100 shadow-2xl rounded-2xl z-[100] overflow-hidden flex"
          >
            {/* Left side: Presets */}
            <div className="w-[180px] bg-slate-50/50 border-r border-gray-100 p-3 space-y-1">
              <div className="px-3 py-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">常用周期</span>
              </div>
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedId(p.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    selectedId === p.id 
                    ? 'bg-gray-900 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-xs font-bold">{p.label}</span>
                    <span className={`text-[8px] uppercase tracking-tighter mt-1 ${selectedId === p.id ? 'text-gray-400' : 'text-gray-400'}`}>
                      {p.sub}
                    </span>
                  </div>
                  {selectedId === p.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>

            {/* Right side: Custom & Calendar View */}
            <div className="flex-1 p-6 flex flex-col">
               <div className="flex justify-between items-center mb-6">
                  <h4 className="text-sm font-black text-gray-900 italic tracking-tight flex items-center gap-2">
                    <Clock size={16} className="text-indigo-600" />
                    自定义区间
                  </h4>
                  <div className="flex items-center gap-1">
                    <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                      <ChevronLeft size={14} />
                    </button>
                    <div className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full min-w-[80px] text-center">
                      {year}年 {month + 1}月
                    </div>
                    {isFutureMonth() ? (
                      <div className="w-[22px]" /> /* Spacer to maintain layout */
                    ) : (
                      <button 
                        onClick={nextMonth} 
                        className="p-1 rounded-lg transition-colors text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      >
                        <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
               </div>

               {/* Dynamic Calendar Grid */}
               <div className="grid grid-cols-7 gap-1 text-center mb-6">
                  {['一', '二', '三', '四', '五', '六', '日'].map(d => (
                    <span key={d} className="text-[10px] font-bold text-gray-300 py-1">{d}</span>
                  ))}
                  {/* Empty spacers */}
                  {Array.from({ length: emptyDays }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8" />
                  ))}
                  {/* Real Days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const d = i + 1;
                    const active = isSelected(d);
                    const isBound = isRangeBound(d);
                    const disabled = isFutureDay(d);
                    return (
                      <button 
                        key={d} 
                        onClick={() => handleDateClick(d)}
                        disabled={disabled}
                        className={`h-8 rounded-lg text-xs font-bold transition-all relative group ${
                          active 
                          ? (isBound ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-100 text-indigo-700')
                          : disabled
                            ? 'text-gray-200 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-indigo-50'
                        }`}
                      >
                        {d}
                        {/* Dot for today */}
                        {year === TODAY.getFullYear() && month === TODAY.getMonth() && d === TODAY.getDate() && !active && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full" />
                        )}
                      </button>
                    );
                  })}
               </div>

               {/* Footer: Comparison Mode Toggle */}
               <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-800">对比模式</span>
                    <span className="text-[9px] text-gray-400 font-medium tracking-tight">自动对比上一周期数据 (PoP)</span>
                  </div>
                  <button 
                    onClick={() => setIsCompareMode(!isCompareMode)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${isCompareMode ? 'bg-emerald-500' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${isCompareMode ? 'translate-x-5' : ''}`}></div>
                  </button>
               </div>
               
               <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    确认应用
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CLevelTimePicker;
