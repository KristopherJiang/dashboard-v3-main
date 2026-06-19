import React, { useState } from 'react';
import { 
  Globe, 
  MessageSquare, 
  Target,
  SmilePlus,
  Activity,
  MapPin,
  Filter,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Star,
  Award,
  Zap,
  Smartphone,
  BarChart3,
  BrainCircuit,
  Search,
  Sparkles,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useDashboardContext } from '../lib/DashboardContext';

import MarketExposureASO from './MarketExposureASO';

const TrendBadge = ({ change }: { change: number }) => {
  const isPositive = change >= 0;
  return (
    <div className={`flex items-center gap-0.5 text-[10px] font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-500'}`}>
      {isPositive ? <ArrowUpRight size={10} strokeWidth={3} /> : <ArrowDownRight size={10} strokeWidth={3} />}
      {Math.abs(change)}%
    </div>
  );
};

const DonutChart = ({ score }: { score: number }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="24" cy="24" r={radius} stroke="#e2e8f0" strokeWidth="3" fill="transparent" />
        <circle 
          cx="24" cy="24" r={radius} stroke="#2563eb" strokeWidth="3" fill="transparent" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[11px] font-black text-slate-800 leading-none">{score}</span>
      </div>
    </div>
  );
};

const MiniCard = ({ label, value, change }: { label: string, value: number, change: number }) => (
  <div className="bg-white border border-slate-200/70 p-3 rounded-xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300">
    <div className="text-slate-400 text-[9px] font-black mb-1.5 uppercase tracking-widest">{label}</div>
    <div className="flex items-end justify-between">
      <div className="text-lg font-black text-slate-900 tracking-tight leading-none">{value}k</div>
      <TrendBadge change={change} />
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1f2e] border border-slate-700 p-2.5 rounded-lg shadow-2xl">
        <p className="text-slate-400 text-[9px] font-bold mb-1.5 border-b border-slate-700/50 pb-1.5 uppercase tracking-wider">{label} 数据详情</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-300 text-[10px]">{entry.name}：</span>
              </div>
              <span className="text-white font-bold text-[10px]">{Number(entry.value).toFixed(1)}k</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const GlobalIntelligence = () => {
  const [activeTab, setActiveTab] = useState('ASO');
  const [selectedBrand, setSelectedBrand] = useState('Vantage');
  const { timeRange, selectedRegion } = useDashboardContext();

  const timeScale = {
    today: 0.03, yesterday: 0.035, thisWeek: 0.21, mtd: 1.0, lastMonth: 0.95, ytd: 4.8, last90: 2.9, custom: 1.2
  }[timeRange] || 1.0;

  const rScale: Record<string, number> = {
    GLOBAL: 1.0, ASIA_VN: 0.15, EU_UK: 0.12, ASIA_IN: 0.2, MENA_AE: 0.08, GS_AU: 0.06,
  };
  const regionScale = rScale[selectedRegion] || 0.04;
  const m = timeScale * regionScale;

  // We map the global multi-region to a simplified category structure here 
  // since the SEO data expects generic buckets
  const regionBucket = selectedRegion === 'GLOBAL' ? 'Global' :
                       selectedRegion.startsWith('ASIA') ? 'Asia' :
                       selectedRegion.startsWith('EU') ? 'EU' :
                       selectedRegion.startsWith('LATAM') ? 'Latam' :
                       selectedRegion.startsWith('MENA') ? 'Mena' :
                       selectedRegion.startsWith('AFRICA') ? 'Africa' : 'Others';

  const baseSeoData: Record<string, any> = {
    'Global': {
      kpis: {
        authorityScore: { value: 92, change: 5, status: '优秀', percentile: '92%' },
        organicTraffic: { value: 42.1, change: 3.2 },
        organicKeywords: { value: 38.5, change: 2.1 },
        paidTraffic: { value: 12.5, change: -1.5 },
        paidKeywords: { value: 8.2, change: -3.4 }
      },
      chart: Array.from({ length: 12 }, (_, i) => ({ month: `${i + 1}月`, brand: 30 + i, organic: 25 + i * 1.5, paid: 8 + Math.sin(i)*2 }))
    },
    'Asia': {
      kpis: {
        authorityScore: { value: 88, change: 2, status: '良好', percentile: '85%' },
        organicTraffic: { value: 15.4, change: 8.4 },
        organicKeywords: { value: 12.1, change: 5.2 },
        paidTraffic: { value: 5.2, change: 1.2 },
        paidKeywords: { value: 2.1, change: -0.5 }
      },
      chart: Array.from({ length: 12 }, (_, i) => ({ month: `${i + 1}月`, brand: 10 + i, organic: 8 + i, paid: 2 + i }))
    },
    'Mena': { kpis: { authorityScore: { value: 75, change: 1, status: '稳定', percentile: '70%' }, organicTraffic: { value: 8.2, change: 4.1 }, organicKeywords: { value: 6.5, change: 3.2 }, paidTraffic: { value: 2.1, change: 0.5 }, paidKeywords: { value: 1.2, change: 0.2 } }, chart: Array.from({ length: 12 }, (_, i) => ({ month: `${i + 1}月`, brand: 5 + i, organic: 4 + i, paid: 1 })) },
    'EU': { kpis: { authorityScore: { value: 85, change: -1, status: '良好', percentile: '82%' }, organicTraffic: { value: 22.1, change: -2.1 }, organicKeywords: { value: 18.5, change: 1.1 }, paidTraffic: { value: 4.5, change: -5.5 }, paidKeywords: { value: 3.2, change: -2.4 } }, chart: Array.from({ length: 12 }, (_, i) => ({ month: `${i + 1}月`, brand: 20 + i, organic: 18 + i, paid: 4 })) },
    'Latam': { kpis: { authorityScore: { value: 70, change: 3, status: '上升', percentile: '65%' }, organicTraffic: { value: 5.4, change: 12.4 }, organicKeywords: { value: 4.1, change: 8.2 }, paidTraffic: { value: 1.2, change: 2.5 }, paidKeywords: { value: 0.8, change: 1.4 } }, chart: Array.from({ length: 12 }, (_, i) => ({ month: `${i + 1}月`, brand: 4 + i, organic: 3 + i, paid: 1 })) },
    'Africa': { kpis: { authorityScore: { value: 62, change: 0.5, status: '潜力', percentile: '55%' }, organicTraffic: { value: 2.1, change: 1.2 }, organicKeywords: { value: 1.8, change: 0.9 }, paidTraffic: { value: 0.5, change: -0.2 }, paidKeywords: { value: 0.3, change: -0.1 } }, chart: Array.from({ length: 12 }, (_, i) => ({ month: `${i + 1}月`, brand: 2 + i, organic: 1 + i, paid: 0.5 })) },
    'Others': { kpis: { authorityScore: { value: 55, change: 0.2, status: '平稳', percentile: '45%' }, organicTraffic: { value: 1.5, change: 0.5 }, organicKeywords: { value: 1.2, change: 0.3 }, paidTraffic: { value: 0.2, change: -0.1 }, paidKeywords: { value: 0.1, change: 0 } }, chart: Array.from({ length: 12 }, (_, i) => ({ month: `${i + 1}月`, brand: 1 + i, organic: 1 + i, paid: 0.2 })) },
  };

  const rawSeoData = baseSeoData[regionBucket] || baseSeoData['Global'];
  
  // Scale the local KPI properties
  const currentSeoData = {
    kpis: {
        authorityScore: rawSeoData.kpis.authorityScore, // Score doesn't scale linearly with traffic
        organicTraffic: { value: Math.round((rawSeoData.kpis.organicTraffic.value * m) * 10) / 10, change: rawSeoData.kpis.organicTraffic.change },
        organicKeywords: { value: Math.round((rawSeoData.kpis.organicKeywords.value * m) * 10) / 10, change: rawSeoData.kpis.organicKeywords.change },
        paidTraffic: { value: Math.round((rawSeoData.kpis.paidTraffic.value * m) * 10) / 10, change: rawSeoData.kpis.paidTraffic.change },
        paidKeywords: { value: Math.round((rawSeoData.kpis.paidKeywords.value * m) * 10) / 10, change: rawSeoData.kpis.paidKeywords.change }
    },
    chart: rawSeoData.chart.map((pt: any) => ({
      ...pt,
      brand: pt.brand * m,
      organic: pt.organic * m,
      paid: pt.paid * m
    }))
  };

  const brands = [
    { rank: 1, name: 'Vantage', change: '+5%', changeType: 'up', score: '92%' },
    { rank: 2, name: 'Exness', change: '+1%', changeType: 'up', score: '89.8%' },
    { rank: 3, name: 'XM', change: '-1%', changeType: 'down', score: '85.2%' },
    { rank: 4, name: 'OctaFX', change: '+5%', changeType: 'up', score: '78%' },
    { rank: 5, name: 'FBS', change: '-2%', changeType: 'down', score: '76.9%' },
  ];

  const visibilityTrendData = {
    'Vantage': [
      { time: '1月', value: 95 }, { time: '2月', value: 85 }, { time: '3月', value: 92 },
      { time: '4月', value: 78 }, { time: '5月', value: 82 }, { time: '6月', value: 88 },
      { time: '7月', value: 91 }, { time: '8月', value: 78 }, { time: '9月', value: 82 },
      { time: '10月', value: 88 }, { time: '11月', value: 92 }, { time: '12月', value: 95 },
    ],
    'Exness': [
      { time: '1月', value: 80 }, { time: '2月', value: 82 }, { time: '3月', value: 85 },
      { time: '4月', value: 88 }, { time: '5月', value: 85 }, { time: '6月', value: 89 },
      { time: '7月', value: 87 }, { time: '8月', value: 88 }, { time: '9月', value: 89 },
      { time: '10月', value: 88 }, { time: '11月', value: 89.8 }, { time: '12月', value: 89.5 },
    ],
    'XM': [
      { time: '1月', value: 90 }, { time: '2月', value: 88 }, { time: '3月', value: 85 },
      { time: '4月', value: 82 }, { time: '5月', value: 80 }, { time: '6月', value: 85 },
      { time: '7月', value: 82 }, { time: '8月', value: 84 }, { time: '9月', value: 86 },
      { time: '10月', value: 85 }, { time: '11月', value: 85.2 }, { time: '12月', value: 84 },
    ],
    'OctaFX': [
      { time: '1月', value: 70 }, { time: '2月', value: 72 }, { time: '3月', value: 75 },
      { time: '4月', value: 78 }, { time: '5月', value: 75 }, { time: '6月', value: 72 },
      { time: '7月', value: 75 }, { time: '8月', value: 76 }, { time: '9月', value: 78 },
      { time: '10月', value: 77 }, { time: '11月', value: 78 }, { time: '12月', value: 79 },
    ],
    'FBS': [
      { time: '1月', value: 80 }, { time: '2月', value: 78 }, { time: '3月', value: 75 },
      { time: '4月', value: 72 }, { time: '5月', value: 75 }, { time: '6月', value: 78 },
      { time: '7月', value: 75 }, { time: '8月', value: 74 }, { time: '9月', value: 76 },
      { time: '10月', value: 75 }, { time: '11月', value: 76.9 }, { time: '12月', value: 77 },
    ]
  };

  const currentBrandData = brands.find(b => b.name === selectedBrand) || brands[0];
  const vantageTrend = visibilityTrendData['Vantage'];
  const compTrend = selectedBrand !== 'Vantage' ? visibilityTrendData[selectedBrand as keyof typeof visibilityTrendData] : null;

  const combinedTrendData = vantageTrend.map((v, i) => ({
    time: v.time,
    vantage: v.value,
    comp: compTrend ? compTrend[i].value : undefined
  }));

  // --- SEO/GEO 模拟数据 ---
  const trafficSeries = [
    { label: 'Branded', value: '42.1k', color: 'bg-gray-900', stroke: '#111827', points: [30, 35, 32, 45, 40, 55, 60] },
    { label: 'Organic', value: '38.5k', color: 'bg-gray-500', stroke: '#6b7280', points: [20, 25, 28, 35, 33, 42, 38] },
    { label: 'Paid', value: '12.5k', color: 'bg-gray-300', stroke: '#d1d5db', points: [15, 12, 18, 14, 10, 15, 12] },
  ];

  const rankingDistribution = [
    { label: 'Top 3', count: 156, percent: 15, color: 'bg-gray-900', keywords: ['Forex', 'Trading', 'Broker'] },
    { label: 'Top 10', count: 482, percent: 35, color: 'bg-gray-500', keywords: ['MT4', 'App', 'Spread'] },
    { label: 'Top 50', count: 1204, percent: 50, color: 'bg-gray-200', keywords: ['Demo', 'Leverage'] },
  ];

  const geoCoreMetrics = [
    { label: 'VISIBILITY', value: '88.4', trend: '+2.1', icon: Globe, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'PREVALENCE', value: '64.2', trend: '+1.5', icon: Target, color: 'text-violet-500', bg: 'bg-violet-50' },
    { label: 'MENTIONS', value: '2.8k', trend: '+412', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'SENTIMENT', value: '92%', trend: '+4%', icon: SmilePlus, color: 'text-emerald-400', bg: 'bg-emerald-50' },
  ];



  return (
    <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col min-h-[500px]">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-md">
            <Activity className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">市场曝光度</h2>
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
              <MapPin size={10} /> {regionBucket.toUpperCase()} SNAPSHOT
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
            {['ASO', 'SEO', 'GEO'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-1 flex flex-col h-[calc(100%-80px)]">
        {activeTab === 'ASO' && (
          <div className="flex-1 overflow-hidden animate-in fade-in duration-300">
            <MarketExposureASO />
          </div>
        )}
        
        {activeTab === 'SEO' && (
          <div className="flex-1 flex flex-col gap-4 animate-in fade-in duration-300 overflow-y-auto pr-2 pb-2">
            {/* Authority Score Card */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between hover:border-blue-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    权威评分 <Info size={12} className="text-slate-300" />
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">
                      {currentSeoData.kpis.authorityScore.value}
                    </span>
                    <TrendBadge change={currentSeoData.kpis.authorityScore.change} />
                  </div>
                </div>
                <DonutChart score={currentSeoData.kpis.authorityScore.value} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-wider border border-blue-100 flex items-center gap-1">
                    <Award size={10} /> 行业领先
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 tracking-tight">
                    超过 <span className="text-slate-900">{currentSeoData.kpis.authorityScore.percentile}</span> 同类站点
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  站点权威性持续提升，整体品牌搜索权重优于同行业平均水平。
                </p>
              </div>
            </div>

            {/* Compact 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3">
              <MiniCard label="自然流量" value={currentSeoData.kpis.organicTraffic.value} change={currentSeoData.kpis.organicTraffic.change} />
              <MiniCard label="自然关键词" value={currentSeoData.kpis.organicKeywords.value} change={currentSeoData.kpis.organicKeywords.change} />
              <MiniCard label="付费流量" value={currentSeoData.kpis.paidTraffic.value} change={currentSeoData.kpis.paidTraffic.change} />
              <MiniCard label="付费关键词" value={currentSeoData.kpis.paidKeywords.value} change={currentSeoData.kpis.paidKeywords.change} />
            </div>

            {/* Chart Section */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex flex-col gap-2 mb-4">
                <div className="space-y-0.5">
                  <h2 className="text-xs font-black text-slate-900 tracking-tight">流量趋势分析</h2>
                  <p className="text-slate-400 text-[9px] font-medium">展示近十二个月的多维度流量表现</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {[
                    { label: '品牌流量', color: '#3b82f6' },
                    { label: '自然流量', color: '#34d399' },
                    { label: '付费流量', color: '#f59e0b' }
                  ].map((dot, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dot.color }} />
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{dot.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={currentSeoData.chart} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBrand" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} dy={5} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} tickFormatter={(val) => `${val}k`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
                    <Area type="monotone" dataKey="brand" name="品牌流量" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorBrand)" activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} />
                    <Area type="monotone" dataKey="organic" name="自然流量" stroke="#34d399" strokeWidth={2} fillOpacity={1} fill="url(#colorOrganic)" activeDot={{ r: 4, fill: '#34d399', strokeWidth: 0 }} />
                    <Area type="monotone" dataKey="paid" name="付费流量" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorPaid)" activeDot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'GEO' && (
          <div className="flex-1 flex flex-col gap-4 animate-in fade-in duration-300">
            {/* AI Visibility Table (Image 2) */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="grid grid-cols-3 gap-2 mb-3 pb-3 border-b border-gray-100">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">AI Visibility</div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-4 overflow-hidden">
                      <div className="absolute top-0 left-0 w-8 h-8 rounded-full border-[4px] border-gray-100"></div>
                      <div className="absolute top-0 left-0 w-8 h-8 rounded-full border-[4px] border-transparent border-t-rose-400 border-l-orange-400 transform -rotate-45"></div>
                      <div className="absolute bottom-0 left-1/2 w-4 h-0.5 bg-gray-400 origin-left transform -translate-x-1/2 -rotate-45 rounded-full"></div>
                      <div className="absolute bottom-[-2px] left-1/2 w-1.5 h-1.5 bg-gray-600 rounded-full transform -translate-x-1/2"></div>
                    </div>
                    <span className="text-xl font-black text-blue-600">31</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Mentions</div>
                  <div className="text-xl font-black text-blue-600">3.3K</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cited Pages</div>
                  <div className="text-xl font-black text-blue-600">4.1K</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'ChatGPT', icon: BrainCircuit, mentions: '489', cited: '2.3K', color: 'text-emerald-400', bg: 'bg-emerald-50' },
                  { name: 'AI Overview', icon: Search, mentions: '1.1K', cited: '919', color: 'text-blue-500', bg: 'bg-blue-50' },
                  { name: 'AI Mode', icon: Sparkles, mentions: '724', cited: '1.6K', color: 'text-indigo-500', bg: 'bg-indigo-50' },
                  { name: 'Gemini', icon: Star, mentions: '1K', cited: '325', color: 'text-purple-500', bg: 'bg-purple-50' },
                ].map((item, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-2 items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-md ${item.bg} flex items-center justify-center shrink-0`}>
                        <item.icon size={10} className={item.color} />
                      </div>
                      <span className="text-xs font-bold text-gray-700 truncate">{item.name}</span>
                    </div>
                    <div className="text-xs font-bold text-gray-600">{item.mentions}</div>
                    <div className="text-xs font-bold text-gray-600">{item.cited}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visibility Score Trend (Image 3 left) */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Visibility score</div>
                  <div className="flex items-center gap-6">
                    <div className="text-xl font-black text-gray-900">{currentBrandData.score}</div>
                    {selectedBrand !== 'Vantage' && (
                      <div className="flex items-center gap-3 text-[10px] font-bold">
                         <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> <span className="text-gray-600">Vantage</span></div>
                         <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div> <span className="text-gray-600">{selectedBrand}</span></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="h-40 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={combinedTrendData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVisGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={true} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} 
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                      ticks={[0, 50, 100]}
                    />
                    <Tooltip 
                      cursor={{ stroke: '#cbd5e1', strokeWidth: 1.5 }} 
                      content={(props: any) => {
                        if (props.active && props.payload && props.payload.length) {
                           return (
                             <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100 min-w-[120px]">
                               <div className="text-[10px] font-bold text-slate-400 mb-2 pb-1 border-b border-slate-50 uppercase tracking-widest">{props.label} 分数</div>
                               <div className="space-y-1.5">
                                 {props.payload.map((entry: any, index: number) => {
                                    const isComp = entry.dataKey === 'comp';
                                    const name = isComp ? selectedBrand : 'Vantage';
                                    const color = isComp ? '#8b5cf6' : '#34d399';
                                    return (
                                      <div key={index} className="flex justify-between items-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
                                          <span className="text-[10px] font-bold text-slate-600">{name}</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-900">{entry.value}%</span>
                                      </div>
                                    );
                                 })}
                               </div>
                             </div>
                           );
                        }
                        return null;
                      }} 
                    />
                    {compTrend && (
                      <Area 
                        type="monotone" 
                        dataKey="comp" 
                        stroke="#8b5cf6" 
                        strokeWidth={2} 
                        fill="transparent" 
                        strokeDasharray="4 4"
                      />
                    )}
                    <Area type="monotone" dataKey="vantage" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorVisGreen)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Brand Industry Ranking (Image 3 right) */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex-1">
              <div className="flex flex-col mb-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Brand Industry Ranking</div>
                <span className="text-[9px] text-gray-400 mt-1">点击下方竞品可将数据添加至上方趋势图进行对比分析</span>
              </div>
              <div className="space-y-1">
                {brands.map((brand, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedBrand(brand.name)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${selectedBrand === brand.name ? 'bg-gray-50 border border-gray-100' : 'hover:bg-gray-50/50 border border-transparent'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 w-3">{brand.rank}</span>
                      <span className={`text-xs font-bold ${selectedBrand === brand.name ? 'text-gray-900' : 'text-gray-600'}`}>{brand.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold flex items-center gap-0.5 ${brand.changeType === 'up' ? 'text-emerald-400' : 'text-rose-500'}`}>
                        {brand.changeType === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {brand.change.replace('+', '').replace('-', '')}
                      </span>
                      <span className="text-xs font-black text-gray-900 w-8 text-right">{brand.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalIntelligence;
