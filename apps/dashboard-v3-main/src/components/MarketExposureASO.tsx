import React, { useState } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  ScatterChart, Scatter, ZAxis, Cell
} from 'recharts';
import { Search, Percent, Target, Hash, Award, Zap, Activity, Clock, Calendar } from 'lucide-react';

// --- 模拟数据：扩展至一年的维度 ---
const kpiData = {
  cvr: { value: '18.5%', change: 2.4, isUp: true },
  organicRatio: { value: '64.2%', change: 1.5, isUp: true }, // 已修改为自然下载量占比
  totalKeywords: { value: '1,240', change: 45, isUp: true },
  top3Keywords: { value: '158', change: 12, isUp: true }
};

// 模拟 12 个月的数据
const yearlyRankingData = [
  { month: '1月', top1_3: 80, top4_10: 150, top10_50: 300, tail: 500 },
  { month: '2月', top1_3: 85, top4_10: 160, top10_50: 320, tail: 480 },
  { month: '3月', top1_3: 95, top4_10: 180, top10_50: 350, tail: 450 },
  { month: '4月', top1_3: 110, top4_10: 200, top10_50: 380, tail: 420 },
  { month: '5月', top1_3: 105, top4_10: 190, top10_50: 400, tail: 400 },
  { month: '6月', top1_3: 120, top4_10: 220, top10_50: 420, tail: 380 },
  { month: '7月', top1_3: 140, top4_10: 250, top10_50: 450, tail: 350 },
  { month: '8月', top1_3: 135, top4_10: 240, top10_50: 440, tail: 300 },
  { month: '9月', top1_3: 160, top4_10: 280, top10_50: 460, tail: 250 },
  { month: '10月', top1_3: 175, top4_10: 310, top10_50: 480, tail: 200 },
  { month: '11月', top1_3: 190, top4_10: 340, top10_50: 420, tail: 150 },
  { month: '12月', top1_3: 210, top4_10: 380, top10_50: 310, tail: 80 },
];

const semanticCoreData = [
  { name: 'forex trading', rank: 2, downloads: 35000 },
  { name: 'stock market', rank: 40, downloads: 29000 },
  { name: 'crypto wallet', rank: 11, downloads: 16500 },
  { name: 'investing app', rank: 30, downloads: 11500 },
  { name: 'trading signals', rank: 8, downloads: 18500 },
  { name: 'day trading', rank: 3, downloads: 21000 },
  { name: 'money manager', rank: 7, downloads: 14200 },
  { name: 'pips calc', rank: 6, downloads: 9000 },
  { name: 'finance news', rank: 46, downloads: 4200 },
  { name: 'margin calculator', rank: 25, downloads: 3800 },
  ...Array.from({ length: 40 }, (_, i) => ({
    name: `kw-${i}`,
    rank: Math.floor(Math.random() * 50) + 1,
    downloads: Math.floor(Math.random() * 5000),
  }))
];

// --- 专业色调定义：青、蓝、绿、灰 ---
const COLORS = {
  top1_3: '#06b6d4',   // Cyan 500
  top4_10: '#3b82f6',  // Blue 500
  top10_50: '#34d399', // Emerald 500
  tail: '#94a3b8'      // Slate 400
};

const getBubbleColor = (rank: number) => {
  if (rank <= 3) return COLORS.top1_3;
  if (rank <= 10) return COLORS.top4_10;
  if (rank <= 50) return COLORS.top10_50;
  return COLORS.tail; 
};

// --- 子组件 ---

const FancyKPI = ({ label, value, change, isUp, icon: Icon, colorClass }: any) => (
  <div className="group relative flex-1 bg-white/60 backdrop-blur-md rounded-2xl p-3 border border-slate-200/50 shadow-sm transition-all duration-300 hover:shadow-md">
    <div className={`absolute -top-px left-4 w-6 h-[2px] bg-gradient-to-r from-transparent ${colorClass} to-transparent opacity-40`}></div>
    <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase mb-1 tracking-wider">
      <Icon size={12} className="opacity-50" />
      {label}
    </div>
    <div className="flex items-end justify-between">
      <span className="text-lg font-black text-slate-800 tracking-tight leading-none">{value}</span>
      <div className={`flex items-center text-[9px] font-black px-1.5 py-0.5 rounded-full ${isUp ? 'text-emerald-400 bg-emerald-50' : 'text-rose-500 bg-rose-50'}`}>
        {isUp ? '↑' : '↓'}{change}%
      </div>
    </div>
  </div>
);

const SectionHeader = ({ title, icon: Icon, rightContent }: any) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <div className="p-1.5 bg-slate-800 rounded-lg">
        <Icon size={14} className="text-white" />
      </div>
      <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">{title}</h3>
    </div>
    {rightContent}
  </div>
);

// --- 主组件 ---

export default function MarketExposureASO() {
  return (
        <div className="flex flex-col h-full rounded-2xl animate-in fade-in duration-300 gap-4">
          {/* 1. Core KPIs */}
          <div className="flex gap-3 h-20 shrink-0">
            <FancyKPI 
              label="转化率 CVR" 
              value={kpiData.cvr.value} 
              change={kpiData.cvr.change} 
              isUp icon={Target} 
              colorClass="via-cyan-500" 
            />
            <FancyKPI 
              label="自然下载量占比 (%)" 
              value={kpiData.organicRatio.value} 
              change={kpiData.organicRatio.change} 
              isUp icon={Percent} 
              colorClass="via-blue-500" 
            />
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-4">
          {/* 2. Ranking Area (Yearly View) */}
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <SectionHeader 
              title="关键词覆盖与排名" 
              icon={Search} 
            />
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
                <p className="text-[8px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                  <Hash size={10} /> 关键词覆盖数
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-slate-800 tracking-tighter">{kpiData.totalKeywords.value}</span>
                  <span className="text-[9px] font-bold text-cyan-500">+{kpiData.totalKeywords.change}</span>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
                <p className="text-[8px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                  <Award size={10} /> 关键词Top3覆盖数
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-slate-800 tracking-tighter">{kpiData.top3Keywords.value}</span>
                  <span className="text-[9px] font-bold text-blue-500">+{kpiData.top3Keywords.change}</span>
                </div>
              </div>
            </div>

            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyRankingData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="color1_3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.top1_3} stopOpacity={0.6}/>
                      <stop offset="100%" stopColor={COLORS.top1_3} stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="color4_10" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.top4_10} stopOpacity={0.4}/>
                      <stop offset="100%" stopColor={COLORS.top4_10} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="color10_50" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.top10_50} stopOpacity={0.3}/>
                      <stop offset="100%" stopColor={COLORS.top10_50} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    tick={{fontSize: 8, fill: '#94a3b8', fontWeight: 700}} 
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd" 
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 8, fill: '#cbd5e1'}} />
                  <Tooltip 
                    content={({ active, payload, label }: any) => {
                      if (active && payload && payload.length) {
                        const order = ['Top 1-3', 'Top 4-10', 'Top 10-50', '50-250'];
                        const sortedPayload = [...payload].sort((a, b) => {
                          return order.indexOf(a.name) - order.indexOf(b.name);
                        });
                        return (
                          <div className="bg-slate-900 rounded-xl p-4 shadow-xl z-50 min-w-[120px]">
                            <p className="text-white text-xs font-bold mb-1">{label}</p>
                            <p className="text-slate-400 text-[9px] font-bold mb-3 pb-2 border-b border-white/10 uppercase tracking-widest">关键词排名分布</p>
                            <div className="flex flex-col gap-2">
                              {sortedPayload.map((entry: any, index: number) => (
                                <div key={index} className="flex justify-between items-center gap-4 text-[10px]">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                    <span style={{ color: entry.color }} className="font-bold">{entry.name}</span>
                                  </div>
                                  <span className="text-white font-black">{entry.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area name="Top 1-3" type="monotone" dataKey="top1_3" stackId="1" stroke={COLORS.top1_3} strokeWidth={2} fill="url(#color1_3)" />
                  <Area name="Top 4-10" type="monotone" dataKey="top4_10" stackId="1" stroke={COLORS.top4_10} strokeWidth={1} fill="url(#color4_10)" />
                  <Area name="Top 10-50" type="monotone" dataKey="top10_50" stackId="1" stroke={COLORS.top10_50} strokeWidth={1} fill="url(#color10_50)" />
                  <Area name="50-250" type="monotone" dataKey="tail" stackId="1" stroke={COLORS.tail} strokeWidth={1} fill={COLORS.tail} fillOpacity={0.05} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2">
              {[
                { label: 'Top 1-3', color: COLORS.top1_3 },
                { label: 'Top 4-10', color: COLORS.top4_10 },
                { label: 'Top 10-50', color: COLORS.top10_50 },
                { label: '50-250', color: COLORS.tail }
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Semantic Core Matrix */}
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm relative">
            <SectionHeader 
              title="关键词展示矩阵" 
              icon={Target} 
              rightContent={<Activity size={12} className="text-cyan-500 animate-pulse" />}
            />
            
            <div className="h-[200px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: -25 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" />
                  <XAxis 
                    type="number" 
                    dataKey="rank" 
                    domain={[0, 50]} 
                    tick={{fontSize: 9, fill: '#94a3b8', fontWeight: 800}}
                    axisLine={{stroke: '#f1f5f9'}}
                    tickLine={false}
                    label={{ value: '关键词排名', position: 'insideBottom', offset: -10, fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="downloads" 
                    tick={{fontSize: 8, fill: '#cbd5e1'}} 
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: any) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(v)}
                    label={{ value: '带来的流量', angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                  />
                  <ZAxis type="number" dataKey="downloads" range={[40, 450]} />
                  <Tooltip 
                    cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 shadow-2xl p-3 rounded-xl min-w-[150px] border border-slate-700 z-50">
                            <p className="text-[11px] font-black text-white mb-2 border-b border-white/10 pb-1.5 truncate italic">
                              关键词: {d.name}
                            </p>
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold">
                                <span className="text-slate-400">排名:</span>
                                <span className="text-cyan-400">#{d.rank}</span>
                              </div>
                              <div className="flex justify-between text-[10px] font-bold">
                                <span className="text-slate-400">带来的流量:</span>
                                <span className="text-blue-400">{d.downloads.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter data={semanticCoreData}>
                    {semanticCoreData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getBubbleColor(entry.rank)} 
                        fillOpacity={0.6}
                        stroke={getBubbleColor(entry.rank)}
                        strokeWidth={entry.rank <= 10 ? 2 : 1}
                        className="transition-all duration-500 hover:fill-opacity-100 cursor-pointer"
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 flex justify-center gap-4">
               {[
                 { label: '核心 (1-3)', color: COLORS.top1_3 },
                 { label: '重要 (4-10)', color: COLORS.top4_10 },
                 { label: '增长 (11-50)', color: COLORS.top10_50 }
               ].map(item => (
                 <div key={item.label} className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{item.label}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
  );
}
