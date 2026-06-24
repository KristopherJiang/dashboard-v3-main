import React, { useState, useEffect } from 'react';
import { Sparkles, Globe, ShieldCheck, ChevronRight, Zap, Smartphone, Star, Info } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const generateData = (base: number, variance: number) => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: i,
    value: Math.floor(base + Math.random() * variance),
  }));
};

const COUNTRIES = [
  { id: 'PK', flag: '🇵🇰', name: '巴基斯坦', city: '卡拉奇', lat: 3100, top: '45%', left: '68%', jitter: '12ms', packetLoss: '0.5%', iosStatus: 'normal', androidStatus: 'normal', iosDesc: 'App Store 正常访问', androidDesc: 'Google Play 正常访问' },
  { id: 'TH', flag: '🇹🇭', name: '泰国', city: '曼谷', lat: 3100, top: '55%', left: '77%', jitter: '15ms', packetLoss: '1.2%', iosStatus: 'normal', androidStatus: 'normal', iosDesc: 'App Store 正常访问', androidDesc: 'Google Play 正常访问' },
  { id: 'ID', flag: '🇮🇩', name: '印度尼西亚', city: '雅加达', lat: 1450, top: '65%', left: '80%', jitter: '5ms', packetLoss: '0.01%', iosStatus: 'normal', androidStatus: 'normal', iosDesc: 'App Store 正常访问', androidDesc: 'Google Play 正常访问' },
  { id: 'PH', flag: '🇵🇭', name: '菲律宾', city: '马尼拉', lat: 2600, top: '55%', left: '83%', jitter: '10ms', packetLoss: '0.05%', iosStatus: 'normal', androidStatus: 'normal', iosDesc: 'App Store 正常访问', androidDesc: 'Google Play 正常访问' },
  { id: 'VN', flag: '🇻🇳', name: '越南', city: '胡志明市', lat: 850, top: '52%', left: '79%', jitter: '2ms', packetLoss: '0.00%', iosStatus: 'normal', androidStatus: 'normal', iosDesc: 'App Store 正常访问', androidDesc: '各探测节点正常访问' },
  { id: 'JP', flag: '🇯🇵', name: '日本', city: '东京', lat: 920, top: '35%', left: '85%', jitter: '1ms', packetLoss: '0.00%', iosStatus: 'normal', androidStatus: 'normal', iosDesc: 'App Store 正常访问', androidDesc: 'Google Play 正常访问' },
  { id: 'GB', flag: '🇬🇧', name: '英国', city: '伦敦', lat: 1100, top: '25%', left: '47%', jitter: '4ms', packetLoss: '0.001%', iosStatus: 'normal', androidStatus: 'normal', iosDesc: 'App Store 正常访问', androidDesc: 'Google Play 正常访问' },
  { id: 'AE', flag: '🇦🇪', name: '阿联酋', city: '迪拜', lat: 1550, top: '47%', left: '63%', jitter: '5ms', packetLoss: '0.05%', iosStatus: 'normal', androidStatus: 'normal', iosDesc: 'App Store 正常访问', androidDesc: 'Google Play 正常访问' },
  { id: 'AU', flag: '🇦🇺', name: '澳大利亚', city: '悉尼', lat: 1800, top: '80%', left: '85%', jitter: '8ms', packetLoss: '0.02%', iosStatus: 'normal', androidStatus: 'normal', iosDesc: 'App Store 正常访问', androidDesc: 'Google Play 正常访问' },
  { id: 'CO', flag: '🇨🇴', name: '哥伦比亚', city: '波哥大', lat: 4500, top: '60%', left: '28%', jitter: '25ms', packetLoss: '12.4%', iosStatus: 'removed', androidStatus: 'normal', iosDesc: 'App Store 已下架', androidDesc: 'Google Play 正常访问' },
];

const WebsiteHealthMonitor = () => {
  const [selected, setSelected] = useState(COUNTRIES[0]);
  const [hoveredCountry, setHoveredCountry] = useState<typeof COUNTRIES[0] | null>(null);
  const [platform, setPlatform] = useState<'app' | 'web'>('app');
  const [trend, setTrend] = useState(generateData(100, 40));
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const displayNode = hoveredCountry || selected;

  const getHealthStatus = (node: typeof COUNTRIES[0]) => {
    if (platform === 'app' && (node.iosStatus === 'removed' || node.androidStatus === 'removed')) return { color: 'rose', text: 'Critical', bg: 'bg-rose-500', textLight: 'text-rose-600' };
    if (node.lat > 4000) return { color: 'rose', text: 'Critical', bg: 'bg-rose-500', textLight: 'text-rose-600' };
    if (node.lat < 2500) return { color: 'emerald', text: 'Healthy', bg: 'bg-emerald-400', textLight: 'text-emerald-400' };
    return { color: 'amber', text: 'Warning', bg: 'bg-amber-500', textLight: 'text-amber-600' };
  };

  const currentStatus = getHealthStatus(displayNode);

  useEffect(() => {
    const base = displayNode.lat;
    setTrend(generateData(base * 0.7, base * 0.3));
  }, [displayNode]);

  const analyzeNodeStatus = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 1500);
  };

  return (
    <div className="h-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative flex flex-col">
      {/* 背景氛围层 */}
      <div className={`absolute top-0 left-0 w-full h-40 transition-colors duration-1000 opacity-5 ${currentStatus.bg}`}></div>

      <div className="relative z-10 p-6 pb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-md">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-gray-900">官网/APP健康度监测</h2>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 shadow-sm" title="此板块为全局实时监测，不受历史时间轴影响">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mt-px">Live</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-1">Global Network Command</p>
            </div>
          </div>
          <div className="flex bg-slate-100/80 p-1 rounded-xl">
            <button
              onClick={() => setPlatform('app')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                platform === 'app' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Smartphone size={14} />
              App
            </button>
            <button
              onClick={() => setPlatform('web')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                platform === 'web' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Globe size={14} />
              Web
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 p-6 flex flex-col">
        {/* Map Area */}
        <div className="relative w-full flex-1 min-h-[14rem] bg-slate-50/50 rounded-2xl border border-slate-100 mb-4 overflow-hidden flex items-center justify-center">
          {/* World Map Background */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg")',
              backgroundSize: '110%',
              backgroundPosition: 'center 40%',
              backgroundRepeat: 'no-repeat',
              filter: 'grayscale(100%)'
            }}
          ></div>

          {/* Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          </svg>

          {/* Nodes */}
          {COUNTRIES.map(country => {
            const isSelected = selected.id === country.id;
            const isAppRemoved = platform === 'app' && (country.iosStatus === 'removed' || country.androidStatus === 'removed');
            const isBothRemoved = platform === 'app' && country.iosStatus === 'removed' && country.androidStatus === 'removed';
            
            return (
              <div 
                key={country.id}
                className="absolute cursor-pointer group z-10 flex items-center gap-1.5"
                style={{ top: country.top, left: country.left, transform: 'translate(-7px, -7px)' }}
                onClick={() => setSelected(country)}
                onMouseEnter={() => setHoveredCountry(country)}
                onMouseLeave={() => setHoveredCountry(null)}
              >
                {/* Dynamic Latency Label (Visible on web tab for yellow/red bubbles) */}
                {platform === 'web' && country.lat >= 2500 && (
                  <div className={`absolute bottom-[18px] left-[7px] -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap shadow-sm text-white ${
                    country.lat < 4000 ? 'bg-amber-500' : 'bg-rose-500'
                  } ${isSelected ? 'scale-110 z-30' : 'opacity-90 group-hover:opacity-100 group-hover:z-30'}`}>
                    {country.lat}ms
                  </div>
                )}

                {/* Bubble Marker and Country Name */}
                <div 
                  className={`shrink-0 rounded-full border-2 border-white transition-all duration-300 ${isSelected ? 'scale-[1.4] ring-4 ring-white/50 z-30' : 'group-hover:scale-125 group-hover:z-30'}`}
                  style={{ 
                    width: 14, 
                    height: 14, 
                    backgroundColor: platform === 'web' 
                      ? (country.lat < 2500 ? '#34d399' : country.lat < 4000 ? '#f59e0b' : '#f43f5e')
                      : (isBothRemoved ? '#f43f5e' : isAppRemoved ? '#f59e0b' : '#34d399'),
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                />
                <div className={`text-[10px] font-bold tracking-wide break-keep whitespace-nowrap transition-colors ${isSelected ? 'text-slate-900 drop-shadow-md' : 'text-slate-600 drop-shadow-sm group-hover:text-slate-800'}`}>
                  {country.name}
                </div>
              </div>
            );
          })}

          {/* App Tab Hover/Selected Map Overlay */}
          
          {/* Map Hover Tooltip */}
          {hoveredCountry && (
            <div className="absolute right-6 bottom-6 w-[230px] bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-700 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
               <div className="flex items-center gap-2 mb-3">
                 <span className="text-xl leading-none">{hoveredCountry.flag}</span>
                 <div className="flex-1">
                   <h3 className="text-sm font-black text-white leading-tight">{hoveredCountry.name}</h3>
                   <p className="text-[10px] text-slate-400 font-bold">{hoveredCountry.city}节点</p>
                 </div>
               </div>
               
               <div className="space-y-2">
                 {platform === 'web' ? (
                   <>
                     <div className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-slate-400">服务状态 (Status)</span>
                       <span className="text-emerald-400 flex items-center gap-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> 正常 (Online)
                       </span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-slate-400">加载速度 (Speed)</span>
                       <span className={hoveredCountry.lat < 2500 ? 'text-emerald-400' : hoveredCountry.lat < 4000 ? 'text-amber-400' : 'text-rose-400'}>{hoveredCountry.lat}ms</span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-slate-400">SLA 评估</span>
                       <span className={hoveredCountry.lat < 2500 ? 'text-emerald-400' : 'text-rose-400'}>
                         {hoveredCountry.lat < 2500 ? '✅ 达标' : '❌ 未达标'}
                       </span>
                     </div>
                   </>
                 ) : (
                   <>
                     <div className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-slate-400 flex items-center gap-1"><Smartphone size={10} /> App Store</span>
                       <span className={hoveredCountry.iosStatus === 'normal' ? 'text-emerald-400' : 'text-rose-400'}>
                         {hoveredCountry.iosStatus === 'normal' ? '正常' : '异常'}
                       </span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-bold mt-2">
                       <span className="text-slate-400 flex items-center gap-1"><Smartphone size={10} /> Google Play</span>
                       <span className={hoveredCountry.androidStatus === 'normal' ? 'text-emerald-400' : 'text-rose-400'}>
                         {hoveredCountry.androidStatus === 'normal' ? '正常' : '异常'}
                       </span>
                     </div>
                   </>
                 )}
               </div>
            </div>
          )}

          {/* Legend Area */}
          {platform === 'web' && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-2 bg-white/90 backdrop-blur-md rounded-full border border-slate-200 shadow-sm z-30">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">良好 (LCP &lt; 2500ms)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">需优化 (2500ms - 4000ms)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">较差 (&gt; 4000ms)</span>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Display Region based on Platform */}
        {platform === 'web' ? (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-slate-100 flex justify-between items-center transition-all">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-sm">
                <div className={`w-6 h-6 rounded-full ${currentStatus.bg}`}></div>
              </div>
              <div>
                <h3 className="text-[14px] font-black tracking-tight text-slate-900">{displayNode.city}</h3>
                <p className="text-[10px] text-slate-400 font-bold tracking-wider">{displayNode.name}节点</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex gap-6 items-end">
                 <div>
                  <div className="text-[10px] text-slate-400 font-bold mb-0.5">当前服务状态</div>
                  <div className="text-sm font-black text-emerald-500 flex items-center gap-1.5 h-[24px]">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     正常 (Online)
                  </div>
                 </div>
                 <div>
                  <div className="text-[10px] text-slate-400 font-bold mb-0.5">加载速度</div>
                  <div className={`text-base font-black leading-none h-[24px] flex items-center ${currentStatus.textLight}`}>{displayNode.lat}ms</div>
                 </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Google Play Card */}
            <div className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center relative transition-all group hover:shadow-md h-[160px]`}>
              <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 shadow-inner`}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="Google Play" className="w-8 h-8" referrerPolicy="no-referrer" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2 font-sans tracking-tight">{displayNode.name} Google Play</h3>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${displayNode.androidStatus === 'removed' ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-emerald-50 text-emerald-500 border border-emerald-100'}`}>
                {displayNode.androidStatus === 'removed' ? '已下架' : '正常上架'}
              </div>
            </div>

            {/* Apple Store Card */}
            <div className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center relative transition-all group hover:shadow-md h-[160px]`}>
              <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 shadow-inner`}>
                <Smartphone className="w-8 h-8 text-slate-900" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2 font-sans tracking-tight">{displayNode.name} Apple Store</h3>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${displayNode.iosStatus === 'removed' ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-emerald-50 text-emerald-500 border border-emerald-100'}`}>
                {displayNode.iosStatus === 'removed' ? '已下架' : '正常上架'}
              </div>
            </div>
          </div>
        )}

        {platform === 'web' ? (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4 mb-4 mt-auto">
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 group relative cursor-help">
                  <ShieldCheck size={14} className="text-emerald-400" /> 
                  性能达标分布 (SLA)
                  <Info size={12} className="text-slate-400/60" />
                  
                  {/* Tooltip Explanation */}
                  <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-slate-800 text-white text-[10px] font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl z-50 normal-case leading-relaxed">
                    <div className="text-emerald-400 mb-1 font-bold">什么是 SLA？</div>
                    该指标代表在全球探测节点中，加载延迟时间达标（即小于2500ms）的节点所占的比例。
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 leading-none">
                  {Math.round((COUNTRIES.filter(c => c.lat < 2500).length / COUNTRIES.length) * 100)}%
                  <span className="text-sm font-bold text-slate-400 ml-2 tracking-tight">全球地区达标</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 uppercase tracking-tighter">
                  Service Level Agreement
                </span>
              </div>
            </div>

            {/* 堆叠进度条 */}
            <div className="w-full h-3 bg-slate-50 rounded-full flex overflow-hidden border border-slate-100">
               {/* 良好 */}
               <div 
                 className="h-full bg-emerald-400 transition-all duration-1000 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.05)]" 
                 style={{ width: `${(COUNTRIES.filter(c => c.lat < 2500).length / COUNTRIES.length) * 100}%` }}
               ></div>
               {/* 需优化 */}
               <div 
                 className="h-full bg-amber-400 transition-all duration-1000 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.05)]" 
                 style={{ width: `${(COUNTRIES.filter(c => c.lat >= 2500 && c.lat <= 4000).length / COUNTRIES.length) * 100}%` }}
               ></div>
               {/* 较差 */}
               <div 
                 className="h-full bg-rose-500 transition-all duration-1000" 
                 style={{ width: `${(COUNTRIES.filter(c => c.lat > 4000).length / COUNTRIES.length) * 100}%` }}
               ></div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <p className="text-[11px] font-bold text-slate-400 italic">基于全球 {COUNTRIES.length} 个核心骨干节点探测</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Healthy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Warning</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Critical</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm border-2 border-emerald-400/60 relative overflow-hidden">
            {/* Header with Icon */}
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={18} className="text-emerald-500" />
              <span className="text-sm font-bold text-slate-800 tracking-tight">全平台状态汇总</span>
            </div>

            {/* Main Stats */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[52px] font-black text-slate-900 leading-none">3</span>
              <span className="text-3xl font-bold text-slate-300 leading-none">/ 90</span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 mb-6 tracking-wide">异常点位 (iOS/安卓) / 总监控点位</p>

            {/* Divider */}
            <div className="h-[1px] w-full bg-slate-100 mb-6 font-bold"></div>

            {/* Detailed Issues List */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.4)]"></div>
                <div className="text-[13px] font-bold text-slate-600">
                  <span className="text-slate-900 font-black">Germany:</span> iOS App Store 已下架
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.4)]"></div>
                <div className="text-[13px] font-bold text-slate-600">
                  <span className="text-slate-900 font-black">India:</span> iOS/安卓 市场均不可访问
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default WebsiteHealthMonitor;
