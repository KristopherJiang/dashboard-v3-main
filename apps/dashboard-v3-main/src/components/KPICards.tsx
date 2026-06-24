import React from 'react';
import { Info, Landmark, ArrowRight, Wallet, BarChart2, ArrowDown } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, LineChart, Line, ComposedChart, Scatter, ReferenceLine, CartesianGrid
} from 'recharts';

// --- Data Definitions ---

const dataA = [
  { month: 'J', value: 20, previous: 18 }, { month: 'F', value: 25, previous: 22 }, { month: 'M', value: 23, previous: 20 },
  { month: 'A', value: 35, previous: 28 }, { month: 'M', value: 40, previous: 32 }, { month: 'J', value: 45, previous: 38 },
  { month: 'J', value: 50, previous: 42 }, { month: 'A', value: 65, previous: 55 }, { month: 'S', value: 80, previous: 60 },
  { month: 'O', value: 60, previous: 50 }, { month: 'N', value: 70, previous: 55 }, { month: 'D', value: 75, previous: 60 },
];

const dataA2 = [
  { month: '1月', current: 40, lastMonth: 38, lastYear: 35 }, { month: '2月', current: 45, lastMonth: 40, lastYear: 40 }, { month: '3月', current: 40, lastMonth: 45, lastYear: 45 },
  { month: '4月', current: 60, lastMonth: 40, lastYear: 50 }, { month: '5月', current: 75, lastMonth: 60, lastYear: 60 }, { month: '6月', current: 90, lastMonth: 75, lastYear: 70 },
  { month: '7月', current: 95, lastMonth: 90, lastYear: 75 }, { month: '8月', current: 110, lastMonth: 95, lastYear: 85 }, { month: '9月', current: 130, lastMonth: 110, lastYear: 95 },
  { month: '10月', current: 115, lastMonth: 130, lastYear: 80 }, { month: '11月', current: 115, lastMonth: 115, lastYear: 80 }, { month: '12月', current: 125, lastMonth: 115, lastYear: 90 },
];

const dataB = [
  { month: '1月', value: 30, lastMonth: 28, lastYear: 25, okr: 35, isUp: true }, { month: '2月', value: 35, lastMonth: 30, lastYear: 30, okr: 35, isUp: true },
  { month: '3月', value: 40, lastMonth: 35, lastYear: 35, okr: 45, isUp: true }, { month: '4月', value: 35, lastMonth: 40, lastYear: 40, okr: 45, isUp: false },
  { month: '5月', value: 50, lastMonth: 35, lastYear: 45, okr: 55, isUp: true }, { month: '6月', value: 60, lastMonth: 50, lastYear: 50, okr: 55, isUp: true },
  { month: '7月', value: 55, lastMonth: 60, lastYear: 60, okr: 70, isUp: false }, { month: '8月', value: 75, lastMonth: 55, lastYear: 65, okr: 70, isUp: true },
  { month: '9月', value: 85, lastMonth: 75, lastYear: 70, okr: 80, isUp: true }, { month: '10月', value: 80, lastMonth: 85, lastYear: 75, okr: 90, isUp: false },
  { month: '11月', value: 95, lastMonth: 80, lastYear: 80, okr: 90, isUp: true }, { month: '12月', value: 90, lastMonth: 95, lastYear: 85, okr: 100, isUp: false },
];

const dataC = [
  { month: '1月', actual: 40, lastMonth: 38, lastYear: 35, predict: null, barValue: 40 }, { month: '2月', actual: 52, lastMonth: 40, lastYear: 45, predict: null, barValue: 52 },
  { month: '3月', actual: 45, lastMonth: 52, lastYear: 40, predict: null, barValue: 45 }, { month: '4月', actual: 60, lastMonth: 45, lastYear: 50, predict: null, barValue: 60 },
  { month: '5月', actual: 55, lastMonth: 60, lastYear: 55, predict: null, barValue: 55 }, { month: '6月', actual: 70, lastMonth: 55, lastYear: 60, predict: null, barValue: 70 },
  { month: '7月', actual: 65, lastMonth: 70, lastYear: 65, predict: null, barValue: 65 }, { month: '8月', actual: 80, lastMonth: 65, lastYear: 70, predict: null, barValue: 80 },
  { month: '9月', actual: 75, lastMonth: 80, lastYear: 75, predict: null, barValue: 75 }, { month: '10月', actual: 85, lastMonth: 75, lastYear: 80, predict: null, barValue: 85 },
  { month: '11月', actual: 92, lastMonth: null, lastYear: 85, predict: null, barValue: 92 }, { month: '12月', actual: 105, lastMonth: null, lastYear: 90, predict: null, barValue: 105 },
];

const dataD = [
  { month: 'J', current: 300, previous: 200 }, { month: 'F', current: 400, previous: 250 },
  { month: 'M', current: 350, previous: 300 }, { month: 'A', current: 700, previous: 450 },
  { month: 'M', current: 500, previous: 400 }, { month: 'J', current: 600, previous: 500 },
  { month: 'J', current: 550, previous: 450 }, { month: 'A', current: 800, previous: 600 },
  { month: 'S', current: 750, previous: 550 }, { month: 'O', current: 900, previous: 700 },
  { month: 'N', current: 850, previous: 650 }, { month: 'D', current: 1000, previous: 800 },
];

const dataE = [
  { month: 'Jan', deposit: 4000, withdrawal: -2000 }, { month: 'Feb', deposit: 5000, withdrawal: -2500 },
  { month: 'Mar', deposit: 4500, withdrawal: -3000 }, { month: 'Apr', deposit: 6000, withdrawal: -2000 },
  { month: 'May', deposit: 7000, withdrawal: -3500 }, { month: 'Jun', deposit: 6500, withdrawal: -4000 },
  { month: 'Jul', deposit: 8000, withdrawal: -3000 }, { month: 'Aug', deposit: 9000, withdrawal: -4500 },
  { month: 'Sep', deposit: 13400, withdrawal: -4500 }, { month: 'Oct', deposit: 11000, withdrawal: -5000 },
  { month: 'Nov', deposit: 12000, withdrawal: -6000 }, { month: 'Dec', deposit: 14000, withdrawal: -5500 },
].reverse();

const dataRetentionMonthly = [
  { month: '1月', d7: 58.5, d30: 18.2, d7LastYear: 55.0, d30LastYear: 15.0 },
  { month: '2月', d7: 59.2, d30: 18.5, d7LastYear: 56.0, d30LastYear: 15.5 },
  { month: '3月', d7: 60.1, d30: 19.1, d7LastYear: 57.0, d30LastYear: 16.2 },
  { month: '4月', d7: 61.2, d30: 19.4, d7LastYear: 58.2, d30LastYear: 17.0 },
  { month: '5月', d7: 60.8, d30: 19.2, d7LastYear: 59.0, d30LastYear: 17.5 },
  { month: '6月', d7: 61.5, d30: 19.8, d7LastYear: 60.0, d30LastYear: 18.0 },
  { month: '7月', d7: 62.1, d30: 20.2, d7LastYear: 60.5, d30LastYear: 18.5 },
  { month: '8月', d7: 62.5, d30: 20.5, d7LastYear: 61.0, d30LastYear: 19.0 },
  { month: '9月', d7: 61.8, d30: 19.9, d7LastYear: 60.8, d30LastYear: 18.8 },
  { month: '10月', d7: 62.3, d30: 20.3, d7LastYear: 61.2, d30LastYear: 19.2 },
  { month: '11月', d7: 63.5, d30: 21.0, d7LastYear: 61.8, d30LastYear: 19.8 },
  { month: '12月', d7: 64.2, d30: 21.5, d7LastYear: 62.0, d30LastYear: 20.0 },
];


const dataConversion1 = [
  { month: '1月', current: 18.6, lastMonth: 18.0, lastYear: 17.5, target: 22.0 }, { month: '2月', current: 19.3, lastMonth: 18.6, lastYear: 18.0, target: 22.0 },
  { month: '3月', current: 19.5, lastMonth: 19.3, lastYear: 18.5, target: 22.0 }, { month: '4月', current: 20.1, lastMonth: 19.5, lastYear: 19.0, target: 22.0 },
  { month: '5月', current: 20.8, lastMonth: 20.1, lastYear: 19.5, target: 22.0 }, { month: '6月', current: 21.2, lastMonth: 20.8, lastYear: 20.0, target: 22.0 },
  { month: '7月', current: 21.5, lastMonth: 21.2, lastYear: 20.5, target: 22.0 }, { month: '8月', current: 22.5, lastMonth: 21.5, lastYear: 21.0, target: 22.0 },
  { month: '9月', current: 21.6, lastMonth: 22.5, lastYear: 20.8, target: 22.0 }, { month: '10月', current: 22.1, lastMonth: 21.6, lastYear: 21.2, target: 22.0 },
  { month: '11月', current: 24.0, lastMonth: 22.1, lastYear: 22.0, target: 22.0 }, { month: '12月', current: 24.5, lastMonth: 24.0, lastYear: 22.5, target: 22.0 },
];

const dataConversion2 = [
  { month: '1月', current: 44.2, lastMonth: 43.5, lastYear: 42.0, target: 55.0 }, { month: '2月', current: 45.1, lastMonth: 44.2, lastYear: 43.0, target: 55.0 },
  { month: '3月', current: 46.1, lastMonth: 45.1, lastYear: 44.5, target: 55.0 }, { month: '4月', current: 46.5, lastMonth: 46.1, lastYear: 45.0, target: 55.0 },
  { month: '5月', current: 47.3, lastMonth: 46.5, lastYear: 46.0, target: 55.0 }, { month: '6月', current: 47.8, lastMonth: 47.3, lastYear: 46.5, target: 55.0 },
  { month: '7月', current: 48.2, lastMonth: 47.8, lastYear: 47.0, target: 55.0 }, { month: '8月', current: 48.0, lastMonth: 48.2, lastYear: 47.5, target: 55.0 },
  { month: '9月', current: 48.2, lastMonth: 48.0, lastYear: 47.8, target: 55.0 }, { month: '10月', current: 49.1, lastMonth: 48.2, lastYear: 48.0, target: 55.0 },
  { month: '11月', current: 50.0, lastMonth: 49.1, lastYear: 48.5, target: 55.0 }, { month: '12月', current: 50.5, lastMonth: 50.0, lastYear: 49.0, target: 55.0 },
];

// --- Custom Components & Tooltips ---

const OKRLineShape = (props: any) => {
  const { cx, cy } = props;
  const width = 14;
  return <line x1={cx - width/2} y1={cy} x2={cx + width/2} y2={cy} stroke="#1f2937" strokeWidth={2} />;
};

const GenericChartTooltip = ({ active, payload, label, valuePrefix = '', valueSuffix = '' }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const currentVal = data.current ?? data.value ?? data.actual;
    const prevVal = data.lastMonth ?? data.previous;
    const yoyVal = data.lastYear;
    const title = data.fullRange || label;
    return (
      <div className="bg-gray-900 text-white p-3 rounded-xl shadow-xl text-[11px] border border-gray-700 min-w-[140px]">
        <div className="text-gray-400 mb-2 font-bold border-b border-gray-800 pb-1.5">{title}</div>
        <div className="flex justify-between mb-1">
          <span className="text-gray-300">当前:</span>
          <span className="font-bold text-emerald-400">{valuePrefix}{currentVal}{valueSuffix}</span>
        </div>
        {prevVal !== undefined && prevVal !== null && (
        <div className="flex justify-between mb-1">
          <span className="text-gray-300">上一周期:</span>
          <span className="font-bold text-white">{valuePrefix}{prevVal}{valueSuffix}</span>
        </div>
        )}
        {yoyVal !== undefined && yoyVal !== null && (
        <div className="flex justify-between">
          <span className="text-gray-300">去年同期:</span>
          <span className="font-bold text-white">{valuePrefix}{yoyVal}{valueSuffix}</span>
        </div>
        )}
      </div>
    );
  }
  return null;
};

const TooltipRetention = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const title = data.fullRange || label;
    return (
      <div className="bg-gray-900 text-white p-3 rounded-xl shadow-xl text-[11px] border border-gray-700 min-w-[140px]">
        <div className="text-gray-400 mb-2 font-bold border-b border-gray-800 pb-1.5">{title}</div>
        <div className="space-y-2.5">
          <div>
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-blue-400 font-bold">D7 当前:</span>
              <span className="font-bold text-white">{data.d7}%</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-400">
              <span>去年同期:</span>
              <span>{data.d7LastYear}%</span>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-800">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-orange-400 font-bold">D30 当前:</span>
              <span className="font-bold text-white">{data.d30}%</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-400">
              <span>去年同期:</span>
              <span>{data.d30LastYear}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// --- Card Renderers ---

const CardWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow h-full min-h-[420px]">
    {children}
  </div>
);

const CardHeader = ({ title }: any) => (
  <div className="flex justify-between items-start mb-2">
    <div className="flex items-center gap-1.5 text-gray-500">
      <span className="text-sm font-medium">{title}</span>
    </div>
  </div>
);

const getTrendConfig = (timeCtx: any, baseSeed: number) => {
  let v1 = baseSeed, v2 = baseSeed * 2.3;

  if (timeCtx.granularity === 'daily') {
    v1 = baseSeed * 1.1; v2 = baseSeed * 1.8;
  } else if (timeCtx.granularity === 'weekly') {
    v1 = baseSeed * 1.4; v2 = baseSeed * 2.8;
  } else if (timeCtx.diffDays > 300) {
    v1 = baseSeed * 3.5; v2 = baseSeed * 7.2;
  }

  return {
    timeCtx,
    value1: `+${v1.toFixed(1)}%`,
    value2: `+${v2.toFixed(1)}%`,
  };
};

const CardValue = ({ value, timeCtx, value1, value2 }: any) => {
  const isUp1 = value1.startsWith('+');
  const isUp2 = value2.startsWith('+');
  return (
    <div className="mb-4">
      <div className="text-3xl font-bold text-gray-900 tracking-tight mb-2">{value}</div>
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 relative group cursor-help w-max">
        <span className={`px-1.5 py-0.5 rounded ${isUp1 ? 'text-emerald-400 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
          {timeCtx.label1} {value1}
        </span>
        <span className="text-gray-300">/</span>
        <span className={`px-1.5 py-0.5 rounded ${isUp2 ? 'text-emerald-400 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
          {timeCtx.label2} {value2}
        </span>
        
        {/* Hover Badges Tooltip */}
        <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-72 bg-gray-900 text-white text-[10px] p-3.5 rounded-xl shadow-xl z-50 normal-case tracking-normal text-left border border-gray-800">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between"><span className="text-gray-400 min-w-[80px]">当前期间:</span><span className="font-medium text-white">{timeCtx.currStr}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 min-w-[80px]">上一等宽周期:</span><span className="font-medium text-indigo-300">{timeCtx.prevStr}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 min-w-[80px]">去年同一期间:</span><span className="font-medium text-indigo-300">{timeCtx.yoyStr}</span></div>
            </div>
            <div className="absolute bottom-full left-6 border-4 border-transparent border-b-gray-900"></div>
        </div>
      </div>
    </div>
  );
};



const NetDepositChart = ({ scale, timeCtx }: { scale: number, timeCtx: any }) => {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const rawMonthData = [
    { deposit: 4500, withdrawal: 2000, depositLastYear: 3800, withdrawalLastYear: 1800 },
    { deposit: 5200, withdrawal: 1800, depositLastYear: 4500, withdrawalLastYear: 1500 },
    { deposit: 4800, withdrawal: 3000, depositLastYear: 4200, withdrawalLastYear: 2800 },
    { deposit: 7000, withdrawal: 2500, depositLastYear: 6000, withdrawalLastYear: 2200 },
    { deposit: 8500, withdrawal: 4000, depositLastYear: 7500, withdrawalLastYear: 3500 },
    { deposit: 9500, withdrawal: 3500, depositLastYear: 8000, withdrawalLastYear: 3200 },
    { deposit: 10000, withdrawal: 5000, depositLastYear: 9000, withdrawalLastYear: 4800 },
    { deposit: 11500, withdrawal: 6000, depositLastYear: 10000, withdrawalLastYear: 5500 },
    { deposit: 13400, withdrawal: 4500, depositLastYear: 12000, withdrawalLastYear: 4200 },
    { deposit: 11000, withdrawal: 5500, depositLastYear: 9500, withdrawalLastYear: 5800 },
    { deposit: 11500, withdrawal: 4000, depositLastYear: 10500, withdrawalLastYear: 3800 },
    { deposit: 12500, withdrawal: 4800, depositLastYear: 11000, withdrawalLastYear: 4500 },
  ];
  
  const monthDataWithLabels = React.useMemo(() => {
    let pointCount = rawMonthData.length;
    if (timeCtx.granularity === 'daily') {
      pointCount = Math.min(Math.max(timeCtx.diffDays, 7), 12);
    } else if (timeCtx.granularity === 'weekly') {
      pointCount = Math.min(Math.max(Math.ceil(timeCtx.diffDays / 7), 4), 12);
    } else {
      pointCount = 12;
    }

    return rawMonthData.slice(-pointCount).map((d, index) => {
        let newLabel = '';
        let fullRange = '';
        const offset = (pointCount - 1) - index; 
        if (timeCtx.granularity === 'daily') {
            const dt = new Date(timeCtx.end);
            dt.setDate(dt.getDate() - offset);
            newLabel = `${(dt.getMonth()+1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')}`;
            fullRange = `${dt.getFullYear()}.${(dt.getMonth()+1).toString().padStart(2, '0')}.${dt.getDate()}`;
        } else if (timeCtx.granularity === 'weekly') {
            const weekEnd = new Date(timeCtx.end);
            weekEnd.setDate(weekEnd.getDate() - (offset * 7));
            const weekStart = new Date(weekEnd);
            weekStart.setDate(weekStart.getDate() - 6);
            newLabel = `W${pointCount - offset}`; 
            fullRange = `${newLabel} (${(weekStart.getMonth()+1).toString().padStart(2, '0')}.${weekStart.getDate()} - ${(weekEnd.getMonth()+1).toString().padStart(2, '0')}.${weekEnd.getDate()})`;
        } else {
            const dt = new Date(timeCtx.end);
            dt.setMonth(dt.getMonth() - offset);
            newLabel = `${dt.getMonth() + 1}月`;
            fullRange = `${dt.getFullYear()}年 ${newLabel}`;
        }
        return {
          deposit: d.deposit * scale,
          withdrawal: d.withdrawal * scale,
          depositLastYear: d.depositLastYear * scale,
          withdrawalLastYear: d.withdrawalLastYear * scale,
          label: newLabel,
          fullRange
        }
    });
  }, [scale, timeCtx]);

  const width = 320;
  const height = 250;

  const maxVal = Math.max(...monthDataWithLabels.map(d => Math.max(d.deposit, d.withdrawal))) * 1.1;
  const chartWidth = 120; 
  const barHeight = 13;
  const gap = height / monthDataWithLabels.length;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const index = Math.floor((y / rect.height) * monthDataWithLabels.length);
    if (index >= 0 && index < monthDataWithLabels.length) setActiveIndex(index);
  };

  return (
    <div 
      className="relative flex-1 w-full min-h-[220px] flex items-center justify-center cursor-default mt-6 mb-2"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setActiveIndex(null)}
      ref={containerRef}
    >
      <svg viewBox={`0 -25 ${width} ${height + 25}`} className="w-full h-full overflow-visible">
        <line x1={width / 2} y1={-15} x2={width / 2} y2={height} stroke="#e2e8f0" strokeWidth="1" />
        
        <text x={width/2 - 25} y={-15} textAnchor="end" className="fill-gray-400 text-[10px] font-bold tracking-wider">WITHDRAWAL (出金)</text>
        <text x={width/2 + 25} y={-15} textAnchor="start" className="fill-gray-400 text-[10px] font-bold tracking-wider">DEPOSIT (入金)</text>

        {monthDataWithLabels.map((d, i) => {
          const yPos = i * gap + gap/2;
          const depWidth = (d.deposit / maxVal) * chartWidth;
          const withWidth = (d.withdrawal / maxVal) * chartWidth;
          const isHovered = activeIndex === i;

          return (
            <g key={i} className="transition-all duration-300">
              <text 
                x={width / 2} 
                y={yPos + 3.5} 
                textAnchor="middle" 
                className={`text-[10px] font-bold ${isHovered ? 'fill-gray-900' : 'fill-gray-400'}`}
              >
                {d.label}
              </text>

              {/* Ghost Bar - Withdrawal (Last Year) */}
              <rect 
                x={width / 2 - 20 - ((d.withdrawalLastYear || 0) / maxVal) * chartWidth} 
                y={yPos - barHeight / 2} 
                width={((d.withdrawalLastYear || 0) / maxVal) * chartWidth} 
                height={barHeight} 
                rx={3} 
                className="fill-slate-200 opacity-40 shadow-sm"
              />

              <rect 
                x={width / 2 - 20 - withWidth} 
                y={yPos - barHeight / 2} 
                width={Math.max(2, withWidth)} 
                height={barHeight} 
                rx={3} 
                className={`fill-rose-200 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-60'}`}
              />

              {/* Ghost Bar - Deposit (Last Year) */}
              <rect 
                x={width / 2 + 20} 
                y={yPos - barHeight / 2} 
                width={((d.depositLastYear || 0) / maxVal) * chartWidth} 
                height={barHeight} 
                rx={3} 
                className="fill-slate-200 opacity-40 shadow-sm"
              />

              <rect 
                x={width / 2 + 20} 
                y={yPos - barHeight / 2} 
                width={Math.max(2, depWidth)} 
                height={barHeight} 
                rx={3} 
                className={`fill-emerald-400 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-60'}`}
              />
            </g>
          );
        })}
      </svg>

      {activeIndex !== null && (
        <div 
          className="absolute z-20 bg-gray-900 text-white p-3 rounded-xl shadow-xl pointer-events-none transition-all duration-75 border border-gray-700"
          style={{ 
            top: `${(activeIndex * gap / height) * 100}%`,
            right: '-10px',
            transform: 'translateY(-50%)'
          }}
        >
          <div className="text-[10px] font-black text-gray-400 mb-2 border-b border-gray-800 pb-1.5">{monthDataWithLabels[activeIndex].fullRange || monthDataWithLabels[activeIndex].label}</div>
          <div className="space-y-1.5 min-w-[120px]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300">入金:</span>
              <span className="font-bold text-emerald-400">+${Math.floor(monthDataWithLabels[activeIndex].deposit).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300">出金:</span>
              <span className="font-bold text-rose-400">-${Math.floor(monthDataWithLabels[activeIndex].withdrawal).toLocaleString()}</span>
            </div>
            <div className="pt-1.5 border-t border-gray-700 flex justify-between items-center text-xs">
              <span className="text-white font-medium">净额:</span>
              <span className="font-bold">${Math.floor(monthDataWithLabels[activeIndex].deposit - monthDataWithLabels[activeIndex].withdrawal).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RetentionChart = ({ data }: { data: any[] }) => {
  return (
    <div className="flex-1 w-full min-h-[140px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorD30" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
            dy={10} 
          />
          <YAxis hide domain={['dataMin - 5', 'auto']} />
          <Tooltip 
            content={<TooltipRetention />} 
            cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }} 
          />
          
          {/* 去年同期 D7 - 灰色虚线 */}
          <Line 
            type="monotone" 
            dataKey="d7LastYear" 
            stroke="#cbd5e1" 
            strokeWidth={1} 
            strokeDasharray="4 4" 
            dot={false}
            activeDot={false} 
          />

          {/* 去年同期 D30 - 灰色虚线 */}
          <Line 
            type="monotone" 
            dataKey="d30LastYear" 
            stroke="#cbd5e1" 
            strokeWidth={1.5} 
            strokeDasharray="4 4" 
            dot={false}
            activeDot={false} 
          />

          {/* D7 留存 - 蓝色细线 (领先指标) */}
          <Line 
            type="monotone" 
            dataKey="d7" 
            stroke="#3b82f6" 
            strokeWidth={1.5} 
            dot={{ r: 2, fill: '#3b82f6', strokeWidth: 1, stroke: '#fff' }} 
            activeDot={{ r: 4 }} 
          />
          
          {/* D30 留存 - 橙色实线面积图 (核心指标) */}
          <Area 
            type="monotone" 
            dataKey="d30" 
            stroke="#f97316" 
            strokeWidth={2.5} 
            fill="url(#colorD30)"
            dot={{ r: 3.5, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} 
            activeDot={{ r: 5, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} 
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Main Component ---
import { useDashboardContext } from '../lib/DashboardContext';

const renderShortDate = (d: Date) => `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`;

export default function KPICards() {
  const { timeRange, selectedRegion, customDateRange } = useDashboardContext();
  
  const timeCtx = React.useMemo(() => {
    const TODAY = new Date();
    let start = new Date(TODAY);
    let end = new Date(TODAY);

    if (timeRange === 'today') {
      start.setHours(0,0,0,0);
    } else if (timeRange === 'yesterday') {
      start.setDate(TODAY.getDate() - 1);
      end.setDate(TODAY.getDate() - 1);
      start.setHours(0,0,0,0);
    } else if (timeRange === 'thisWeek') {
      const day = TODAY.getDay() === 0 ? 6 : TODAY.getDay() - 1;
      start.setDate(TODAY.getDate() - day);
      start.setHours(0,0,0,0);
    } else if (timeRange === 'mtd') {
      start.setDate(1);
      start.setHours(0,0,0,0);
    } else if (timeRange === 'lastMonth') {
      start.setMonth(TODAY.getMonth() - 1, 1);
      start.setHours(0,0,0,0);
      end = new Date(TODAY.getFullYear(), TODAY.getMonth(), 0);
    } else if (timeRange === 'ytd') {
      start.setMonth(0, 1);
      start.setHours(0,0,0,0);
    } else if (timeRange === 'last90') {
      start.setDate(TODAY.getDate() - 90);
      start.setHours(0,0,0,0);
    } else if (timeRange === 'custom' && customDateRange?.start) {
      start = new Date(customDateRange.start);
      start.setHours(0,0,0,0);
      end = new Date(customDateRange.end || customDateRange.start);
    }
    
    end.setHours(23,59,59,999);

    const diffDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    let granularity = 'daily';
    let subTitle = '按日趋势分布 (虚线为去年同日或等宽周期)';
    let retSubTitle = '按日趋势分布 (橙代表D30，蓝代表D7)';
    let cvSubTitle = '按日趋势分布 (前置节点与转化结果人数对比)';
    if (diffDays > 14 && diffDays <= 84) {
      granularity = 'weekly';
      subTitle = '按周滚动趋势 (虚线为去年同周或等宽周期)';
      retSubTitle = '按周滚动趋势 (橙代表D30，蓝代表D7)';
      cvSubTitle = '按周滚动趋势 (前置节点与转化结果人数对比)';
    } else if (diffDays > 84) {
      granularity = 'monthly';
      subTitle = '按月汇聚趋势 (虚线为去年同期或等宽周期)';
      retSubTitle = '按月汇聚趋势 (橙代表D30，蓝代表D7)';
      cvSubTitle = '按月汇聚趋势 (前置节点与转化结果人数对比)';
    }

    const prevStart = new Date(start);
    prevStart.setDate(start.getDate() - diffDays);
    const prevEnd = new Date(end);
    prevEnd.setDate(end.getDate() - diffDays);

    const yoyStart = new Date(start);
    yoyStart.setFullYear(start.getFullYear() - 1);
    const yoyEnd = new Date(end);
    yoyEnd.setFullYear(end.getFullYear() - 1);

    let label1 = 'PoP';
    if (timeRange === 'today' || timeRange === 'yesterday') label1 = 'DoD';
    else if (timeRange === 'thisWeek') label1 = 'WoW';
    else if (timeRange === 'mtd' || timeRange === 'lastMonth') label1 = 'MoM';
    else if (timeRange === 'ytd' || timeRange === 'last90') label1 = 'QoQ';

    return {
      diffDays, granularity, subTitle, retSubTitle, cvSubTitle,
      currStr: `${renderShortDate(start)} 至 ${renderShortDate(end)}`,
      prevStr: `${renderShortDate(prevStart)} 至 ${renderShortDate(prevEnd)}`,
      yoyStr: `${renderShortDate(yoyStart)} 至 ${renderShortDate(yoyEnd)}`,
      label1,
      label2: 'YoY',
      end
    }
  }, [timeRange, customDateRange]);

  const remapChartData = React.useCallback((baseData: any[]) => {
    // 动态计算该维度下应当显示的数据点数量
    let pointCount = baseData.length;
    if (timeCtx.granularity === 'daily') {
      pointCount = Math.min(Math.max(timeCtx.diffDays, 7), 14); 
    } else if (timeCtx.granularity === 'weekly') {
      pointCount = Math.min(Math.max(Math.ceil(timeCtx.diffDays / 7), 4), 12);
    } else {
      pointCount = 12; 
    }

    // 截取数据并生成新的标签
    return baseData.slice(-pointCount).map((d, index) => {
        let newLabel = d.month;
        let fullRange = '';
        const offset = (pointCount - 1) - index; 
        
        if (timeCtx.granularity === 'daily') {
            const dt = new Date(timeCtx.end);
            dt.setDate(dt.getDate() - offset);
            newLabel = `${(dt.getMonth()+1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')}`;
            fullRange = `${dt.getFullYear()}.${(dt.getMonth()+1).toString().padStart(2, '0')}.${dt.getDate().toString().padStart(2, '0')}`;
        } else if (timeCtx.granularity === 'weekly') {
            const weekEnd = new Date(timeCtx.end);
            weekEnd.setDate(weekEnd.getDate() - (offset * 7));
            const weekStart = new Date(weekEnd);
            weekStart.setDate(weekStart.getDate() - 6);
            newLabel = `W${pointCount - offset}`; 
            fullRange = `${newLabel} (${(weekStart.getMonth()+1).toString().padStart(2, '0')}.${weekStart.getDate()} - ${(weekEnd.getMonth()+1).toString().padStart(2, '0')}.${weekEnd.getDate()})`;
        } else {
            const dt = new Date(timeCtx.end);
            dt.setMonth(dt.getMonth() - offset);
            newLabel = `${dt.getMonth() + 1}月`;
            fullRange = `${dt.getFullYear()}年 ${newLabel}`;
        }
        return { ...d, month: newLabel, fullRange };
    });
  }, [timeCtx]);

  const dynDataA2 = React.useMemo(() => remapChartData(dataA2), [remapChartData]);
  const dynDataB = React.useMemo(() => remapChartData(dataB), [remapChartData]);
  const dynDataC = React.useMemo(() => remapChartData(dataC), [remapChartData]);
  const dynDataConversion1 = React.useMemo(() => remapChartData(dataConversion1), [remapChartData]);
  const dynDataConversion2 = React.useMemo(() => remapChartData(dataConversion2), [remapChartData]);
  const dynDataRetentionMonthly = React.useMemo(() => remapChartData(dataRetentionMonthly), [remapChartData]);
  
  // Dynamic scale multiplier for demonstration of time dimension changes
  const timeScale = {
    today: 0.03,
    yesterday: 0.035,
    thisWeek: 0.21,
    mtd: 1.0,
    lastMonth: 0.95,
    ytd: 4.8,
    last90: 2.9,
    custom: 1.2
  }[timeRange] || 1.0;

  const rScale: Record<string, number> = {
    GLOBAL: 1.0,
    ASIA_VN: 0.15,
    EU_UK: 0.12,
    ASIA_IN: 0.2,
    MENA_AE: 0.08,
    GS_AU: 0.06,
  };
  const regionScale = rScale[selectedRegion] || 0.04;

  const m = timeScale * regionScale;

  const trendA = getTrendConfig(timeCtx, 9.4);
  const trendFTD = getTrendConfig(timeCtx, 12.2);
  const trendFTT = getTrendConfig(timeCtx, 15.6);
  const trendDep = getTrendConfig(timeCtx, 23.3);
  const trendVol = getTrendConfig(timeCtx, 25.6);
  const trendConv1 = getTrendConfig(timeCtx, 2.4);
  const trendConv2 = getTrendConfig(timeCtx, 1.8);
  const trendRet = getTrendConfig(timeCtx, 1.2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      
      {/* 1. 注册人数 */}
      <CardWrapper>
        <CardHeader title="注册人数" />
        <CardValue value={Math.floor(12480 * m).toLocaleString()} {...trendA} />
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-[10px] text-gray-400 font-medium">{timeCtx.subTitle}</span>
        </div>
        <div className="flex-1 w-full min-h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dynDataA2} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} dy={10} />
              <Tooltip content={<GenericChartTooltip />} cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="current" fill="url(#colorBar)" barSize={12} radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="lastMonth" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" dot={false} activeDot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardWrapper>

      {/* 2. FTD人数 */}
      <CardWrapper>
        <CardHeader title="FTD人数" />
        <CardValue value={Math.floor(2995 * m).toLocaleString()} {...trendFTD} />
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-[10px] text-gray-400 font-medium">{timeCtx.subTitle}</span>
        </div>
        <div className="flex-1 w-full min-h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dynDataB} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} dy={10} />
              <Tooltip content={<GenericChartTooltip />} cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="value" fill="url(#colorBar)" barSize={12} radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="lastMonth" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" dot={false} activeDot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardWrapper>

      {/* 3. FTT人数 */}
      <CardWrapper>
        <CardHeader title="FTT人数" />
        <CardValue value={Math.floor(1497 * m).toLocaleString()} {...trendFTT} />
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-[10px] text-gray-400 font-medium">{timeCtx.subTitle}</span>
        </div>
        <div className="flex-1 w-full min-h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dynDataB} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} dy={10} />
              <Tooltip content={<GenericChartTooltip />} cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="value" fill="url(#colorBar)" barSize={12} radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="lastMonth" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" dot={false} activeDot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardWrapper>

      {/* 4. Net Deposit */}
      <CardWrapper>
        <CardHeader title="Net Deposit (净入金)" />
        <CardValue value={`$${Math.floor(1542060 * m).toLocaleString()}`} {...trendDep} />
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] text-gray-400 font-medium tracking-tight">{timeCtx.subTitle} (出金/入金对比)</span>
        </div>
        
        <NetDepositChart scale={m} timeCtx={timeCtx} />
      </CardWrapper>

      {/* 5. 总交易量Trading Volume */}
      <CardWrapper>
        {/* 保真标题排版 */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="text-sm font-bold text-slate-700">总交易量</span>
            <span className="text-sm text-slate-500 font-medium">Trading Volume</span>
          </div>
        </div>
        
        {/* 保真数值与标签排版 */}
        <div className="mb-4">
          <div className="text-3xl font-black text-[#1a1f2e] tracking-tighter mb-2">${Math.floor(15420600 * m).toLocaleString()}</div>
          <div className="flex items-center gap-3 text-[11px] font-bold">
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-400">
              {timeCtx.label1} {trendVol.value1}
            </span>
            <span className="text-slate-300 font-normal">/</span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-400">
              {timeCtx.label2} {trendVol.value2}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-[10px] text-gray-400 font-medium">{timeCtx.subTitle}</span>
        </div>

        <div className="flex-1 w-full min-h-[140px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dynDataC} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorAreaVol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
                dy={10} 
              />
              <Tooltip 
                content={<GenericChartTooltip />} 
                cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }} 
              />
              
              {/* 去年同期 - 灰色虚线 */}
              <Line 
                type="natural" 
                dataKey="lastYear" 
                stroke="#cbd5e1" 
                strokeWidth={1.5} 
                strokeDasharray="4 4" 
                dot={{ r: 2.5, fill: '#cbd5e1', stroke: 'none' }}
                activeDot={{ r: 4, fill: '#cbd5e1' }}
              />
              
              {/* 主趋势线 - 深色平滑线 */}
              <Area 
                type="natural" 
                dataKey="actual" 
                stroke="#1a1f2e" 
                strokeWidth={3} 
                fill="url(#colorAreaVol)"
                dot={{ r: 4.5, fill: '#1a1f2e', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6, fill: '#1a1f2e', strokeWidth: 2, stroke: '#fff' }} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardWrapper>

      {/* 6. 注册 -> FTD 转化率 */}
      <CardWrapper>
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-gray-500 relative group cursor-pointer mb-2">
              <span className="text-sm font-medium">注册 → FTD 转化率</span>
              <Info className="w-3.5 h-3.5 opacity-50" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl z-20 whitespace-normal">
                注册用户中完成首次入金的比例
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight mb-2">24.0%</div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-3">
              <span className="px-1.5 py-0.5 rounded text-emerald-400 bg-emerald-50">{timeCtx.label1} {trendConv1.value1}</span>
              <span className="text-gray-300">/</span>
              <span className="px-1.5 py-0.5 rounded text-emerald-400 bg-emerald-50">{timeCtx.label2} {trendConv1.value2}</span>
            </div>
            <div className="flex items-center px-1">
              <span className="text-[10px] text-gray-400 font-medium tracking-tight">{timeCtx.cvSubTitle}</span>
            </div>
          </div>
          
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100/50 flex flex-col items-center min-w-[100px]">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Landmark size={12} strokeWidth={2.5} />
                <span className="text-[9px] font-black uppercase tracking-wider">注册人数</span>
              </div>
              <span className="text-sm font-black text-slate-800">{Math.floor(12480 * m).toLocaleString()}</span>
            </div>
            <div className="my-1.5 text-slate-300">
               <ArrowDown size={12} className="text-slate-300" />
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                <Wallet size={12} strokeWidth={2.5} />
                <span className="text-[9px] font-black uppercase tracking-wider">FTD人数</span>
              </div>
              <span className="text-sm font-black text-slate-800">{Math.floor(2995 * m).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full min-h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dynDataConversion1} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorConv1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
              <YAxis hide domain={[0, 'auto']} />
              <Tooltip content={<GenericChartTooltip valueSuffix="%" />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="current" stroke="none" fill="url(#colorConv1)" />
              <Line type="monotone" dataKey="lastYear" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3 3" dot={{ r: 1.5, fill: '#94a3b8', stroke: 'none' }} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="current" stroke="#34d399" strokeWidth={2.5} dot={{ r: 3.5, fill: '#34d399', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5, fill: '#34d399', strokeWidth: 2, stroke: '#fff' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardWrapper>

      {/* 7. FTD -> FTT 转化率 */}
      <CardWrapper>
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-gray-500 relative group cursor-pointer mb-2">
              <span className="text-sm font-medium">FTD → FTT 转化率</span>
              <Info className="w-3.5 h-3.5 opacity-50" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl z-20 whitespace-normal">
                首次入金用户中完成首次交易的比例
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight mb-2">50.0%</div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
              <span className="px-1.5 py-0.5 rounded text-emerald-400 bg-emerald-50">{timeCtx.label1} {trendConv2.value1}</span>
              <span className="text-gray-300">/</span>
              <span className="px-1.5 py-0.5 rounded text-emerald-400 bg-emerald-50">{timeCtx.label2} {trendConv2.value2}</span>
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] text-gray-400 font-medium tracking-tight">{timeCtx.cvSubTitle}</span>
            </div>
          </div>
          
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100/50 flex flex-col items-center min-w-[100px]">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Wallet size={12} strokeWidth={2.5} />
                <span className="text-[9px] font-black uppercase tracking-wider">FTD人数</span>
              </div>
              <span className="text-sm font-black text-slate-800">{Math.floor(2995 * m).toLocaleString()}</span>
            </div>
            <div className="my-1.5 text-slate-300">
               <ArrowDown size={12} className="text-slate-300" />
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-orange-500 mb-1">
                <BarChart2 size={12} strokeWidth={2.5} />
                <span className="text-[9px] font-black uppercase tracking-wider">FTT人数</span>
              </div>
              <span className="text-sm font-black text-slate-800">{Math.floor(1497 * m).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full min-h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dynDataConversion2} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorConv2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
              <YAxis hide domain={[0, 'auto']} />
              <Tooltip content={<GenericChartTooltip valueSuffix="%" />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="current" stroke="none" fill="url(#colorConv2)" />
              <Line type="monotone" dataKey="lastYear" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3 3" dot={{ r: 1.5, fill: '#94a3b8', stroke: 'none' }} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="current" stroke="#f97316" strokeWidth={2.5} dot={{ r: 3.5, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardWrapper>

      {/* 8. FTT后 D30 留存率 */}
      <CardWrapper>
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-gray-500 mb-2">
              <span className="text-sm font-medium">FTT后 D30 留存率</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight mb-2">20.0%</div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
              <span className="px-1.5 py-0.5 rounded text-emerald-400 bg-emerald-50">{timeCtx.label1} {trendRet.value1}</span>
              <span className="text-gray-300">/</span>
              <span className="px-1.5 py-0.5 rounded text-emerald-400 bg-emerald-50">{timeCtx.label2} {trendRet.value2}</span>
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] text-gray-400 font-medium tracking-tight">{timeCtx.retSubTitle}</span>
            </div>
          </div>
        </div>

        <RetentionChart data={dynDataRetentionMonthly} />
      </CardWrapper>

    </div>
  );
}
