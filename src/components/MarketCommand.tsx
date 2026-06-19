import React, { useState, useMemo } from 'react';
import { 
  Globe, 
  Search, 
  Smartphone, 
  Cpu, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Trophy,
  Activity,
  BarChart3
} from 'lucide-react';
import { useDashboardContext } from '../lib/DashboardContext';

const MarketCommand = () => {
  const [activeTab, setActiveTab] = useState('ASO'); // ASO, GEO, SEO
  const [mode, setMode] = useState('Absolute'); // Absolute (绝对值), Growth (增速)
  const [hoveredCountry, setHoveredCountry] = useState<any>(null);
  const { timeRange, selectedRegion } = useDashboardContext();

  // Dynamic scale multipliers
  const timeScale = {
    today: 0.03, yesterday: 0.035, thisWeek: 0.21, mtd: 1.0, lastMonth: 0.95, ytd: 4.8, last90: 2.9, custom: 1.2
  }[timeRange] || 1.0;

  const rScale: Record<string, number> = {
    GLOBAL: 1.0, ASIA_VN: 0.15, EU_UK: 0.12, ASIA_IN: 0.2, MENA_AE: 0.08, GS_AU: 0.06,
  };
  const regionScale = rScale[selectedRegion] || 0.04;
  const m = timeScale * regionScale;

  // 1. 核心指标配置 (定义不同 Tab 下的文案和图标)
  const config: any = {
    ASO: { 
      tabLabel: 'ASO 洞察', 
      metricName: '自然下载量', 
      icon: Smartphone, 
      unit: 'k',
      deltaLabel: '较上一周期'
    },
    GEO: { 
      tabLabel: 'GEO 洞察', 
      metricName: 'AI 搜索可见度', 
      icon: Cpu, 
      unit: '',
      deltaLabel: '可见度变化'
    },
    SEO: { 
      tabLabel: 'SEO 洞察', 
      metricName: '自然搜索流量', 
      icon: Search, 
      unit: 'k',
      deltaLabel: '较上一周期'
    }
  };

  const activeConfig = config[activeTab];

  // 2. 模拟国家数据 (包含所有需要的国家) - 注入动态放缩 m
  const allCountries = useMemo(() => [
    { id: 'US', name: '美国', coords: { top: '38%', left: '22%' }, tier: 1, aso: { val: Math.round(2800 * m), delta: Math.round(85 * m), growth: 3.1 }, geo: { val: 92, delta: 2, growth: 2.2 }, seo: { val: Math.round(3200 * m), delta: Math.round(120 * m), growth: 3.8 }, comps: ['Exness', 'Capital.com'] },
    { id: 'IN', name: '印度', coords: { top: '48%', left: '71%' }, tier: 1, aso: { val: Math.round(2450 * m), delta: Math.round(320 * m), growth: 15.0 }, geo: { val: 72, delta: 14, growth: 24.1 }, seo: { val: Math.round(1850 * m), delta: Math.round(280 * m), growth: 17.8 }, comps: ['PU Prime', 'Exness'] },
    { id: 'VN', name: '越南', coords: { top: '52%', left: '79%' }, tier: 2, aso: { val: Math.round(1850 * m), delta: Math.round(350 * m), growth: 23.3 }, geo: { val: 75, delta: 18, growth: 31.6 }, seo: { val: Math.round(920 * m), delta: Math.round(145 * m), growth: 18.7 }, comps: ['PU Prime', 'Exness'] },
    { id: 'AE', name: '阿联酋', coords: { top: '47%', left: '63%' }, tier: 2, aso: { val: Math.round(1550 * m), delta: Math.round(245 * m), growth: 18.8 }, geo: { val: 94, delta: 4, growth: 4.4 }, seo: { val: Math.round(1250 * m), delta: Math.round(180 * m), growth: 16.8 }, comps: ['Exness', 'CFI'] },
    { id: 'AU', name: '澳大利亚', coords: { top: '75%', left: '88%' }, tier: 2, aso: { val: Math.round(820 * m), delta: Math.round(8 * m), growth: 0.9 }, geo: { val: 88, delta: 0, growth: 0.0 }, seo: { val: Math.round(950 * m), delta: Math.round(35 * m), growth: 3.8 }, comps: ['Plus500', 'Capital.com'] },
    { id: 'GB', name: '英国', coords: { top: '28%', left: '48.5%' }, tier: 1, aso: { val: Math.round(1100 * m), delta: Math.round(15 * m), growth: 1.4 }, geo: { val: 89, delta: 1, growth: 1.1 }, seo: { val: Math.round(1350 * m), delta: Math.round(45 * m), growth: 3.4 }, comps: ['Capital.com', 'Plus500'] },
    { id: 'JP', name: '日本', coords: { top: '37%', left: '86%' }, tier: 1, aso: { val: Math.round(1950 * m), delta: Math.round(-85 * m), growth: -4.2 }, geo: { val: 78, delta: -5, growth: -6.0 }, seo: { val: Math.round(1210 * m), delta: Math.round(-35 * m), growth: -2.8 }, comps: ['Exness', 'CFI'] },
    { id: 'TH', name: '泰国', coords: { top: '55%', left: '77%' }, tier: 2, aso: { val: Math.round(1450 * m), delta: Math.round(180 * m), growth: 14.2 }, geo: { val: 71, delta: 6, growth: 9.2 }, seo: { val: Math.round(1100 * m), delta: Math.round(95 * m), growth: 9.4 }, comps: ['Exness', 'XM'] },
    { id: 'MY', name: '马来西亚', coords: { top: '60%', left: '77.5%' }, tier: 2, aso: { val: Math.round(1280 * m), delta: Math.round(90 * m), growth: 7.5 }, geo: { val: 68, delta: 4, growth: 6.2 }, seo: { val: Math.round(1150 * m), delta: Math.round(120 * m), growth: 11.6 }, comps: ['Exness', 'FXTM'] },
    { id: 'RU', name: '俄罗斯', coords: { top: '20%', left: '70%' }, tier: 1, aso: { val: Math.round(1650 * m), delta: Math.round(-180 * m), growth: -9.8 }, geo: { val: 58, delta: -12, growth: -17.2 }, seo: { val: Math.round(1900 * m), delta: Math.round(-50 * m), growth: -2.6 }, comps: ['Exness', 'CFI'] },
    { id: 'PK', name: '巴基斯坦', coords: { top: '45%', left: '68%' }, tier: 2, aso: { val: Math.round(980 * m), delta: Math.round(140 * m), growth: 16.7 }, geo: { val: 45, delta: 3, growth: 7.1 }, seo: { val: Math.round(620 * m), delta: Math.round(45 * m), growth: 7.8 }, comps: ['Exness', 'XM'] },
    { id: 'ID', name: '印尼', coords: { top: '62%', left: '81%' }, tier: 2, aso: { val: Math.round(1600 * m), delta: Math.round(120 * m), growth: 8.1 }, geo: { val: 68, delta: 5, growth: 7.9 }, seo: { val: Math.round(840 * m), delta: Math.round(60 * m), growth: 7.7 }, comps: ['Exness', 'CFI'] },
    { id: 'PH', name: '菲律宾', coords: { top: '50%', left: '83%' }, tier: 2, aso: { val: Math.round(1200 * m), delta: Math.round(110 * m), growth: 10.1 }, geo: { val: 62, delta: 4, growth: 6.9 }, seo: { val: Math.round(750 * m), delta: Math.round(55 * m), growth: 7.9 }, comps: ['Exness', 'XM'] },
    { id: 'CO', name: '哥伦比亚', coords: { top: '52%', left: '28%' }, tier: 2, aso: { val: Math.round(560 * m), delta: Math.round(45 * m), growth: 8.7 }, geo: { val: 41, delta: 2, growth: 5.1 }, seo: { val: Math.round(380 * m), delta: Math.round(20 * m), growth: 5.6 }, comps: ['Exness', 'XM'] },
    { id: 'SA', name: '沙特', coords: { top: '46%', left: '60%' }, tier: 2, aso: { val: Math.round(1200 * m), delta: Math.round(100 * m), growth: 9.1 }, geo: { val: 82, delta: 6, growth: 7.9 }, seo: { val: Math.round(950 * m), delta: Math.round(85 * m), growth: 9.8 }, comps: ['CFI', 'Exness'] }
  ], [m]);

  // 根据当前 Tab 过滤展示的国家
  const countriesData = useMemo(() => {
    const geoList = ['US', 'IN', 'VN', 'AE', 'AU', 'GB', 'JP', 'TH', 'MY', 'RU'];
    const asoList = ['PK', 'TH', 'ID', 'PH', 'VN', 'JP', 'GB', 'AE', 'AU', 'CO'];
    const seoList = ['VN', 'TH', 'IN', 'MY', 'AE', 'RU', 'SA'];

    const activeList = activeTab === 'GEO' ? geoList : activeTab === 'ASO' ? asoList : seoList;
    return allCountries.filter(c => activeList.includes(c.id));
  }, [activeTab, allCountries]);

  // 3. 动态计算气泡样式
  const getMarkerStyle = (country: any) => {
    const data = country[activeTab.toLowerCase()];
    const baseSize = country.tier === 1 ? 22 : country.tier === 2 ? 14 : 10;
    
    if (mode === 'Growth') {
      const growth = data.growth;
      const isPositive = growth >= 0;
      const magnitude = Math.min(Math.abs(growth) / 25, 1);
      const color = isPositive ? [16, 185, 129] : [239, 68, 68];
      return {
        backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${0.4 + magnitude * 0.6})`,
        borderColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.9)`,
        size: baseSize + (magnitude * 14),
        shadow: `0 0 12px rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.4)`
      };
    } else {
      const ratio = Math.min(data.val / (activeTab === 'GEO' ? 100 : 4500), 1);
      return {
        backgroundColor: `rgba(5, 150, 105, ${0.3 + ratio * 0.7})`,
        borderColor: `rgba(5, 150, 105, 0.9)`,
        size: baseSize + (ratio * 12),
        shadow: `0 0 10px rgba(5, 150, 105, 0.2)`
      };
    }
  };

  return (
    <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden min-h-[500px]">
        
        {/* 顶部导航 */}
        <div className="px-6 pt-6 pb-4 flex justify-between items-start z-10 flex-wrap gap-4">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
              <Globe className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">全球市场曝光度</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unified Market Intelligence</p>
              </div>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            {['Absolute', 'Growth'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-8 py-2.5 rounded-xl text-[12px] font-bold transition-all duration-300 ${mode === m ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {m === 'Absolute' ? '绝对值模式' : '增速模式'}
              </button>
            ))}
          </div>
        </div>

        {/* 1. 核心指标切换栏 (ASO/GEO/SEO) */}
        <div className="px-6 flex gap-10 z-10 border-b border-slate-50">
          {['ASO', 'GEO', 'SEO'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[13px] font-bold pb-4 border-b-2 transition-all relative ${activeTab === tab ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-300 hover:text-slate-500'}`}
            >
              {config[tab].tabLabel}
            </button>
          ))}
        </div>

        {/* 地图区域 */}
        <div className="relative flex-1 min-h-[400px] w-full bg-white flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 px-10 py-6 opacity-[0.35] pointer-events-none transition-opacity duration-500 flex items-center justify-center">
             <img 
               src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" 
               alt="world map" 
               className="w-full h-full object-contain grayscale mix-blend-darken" 
             />
          </div>

          {/* 地图上的数据气泡 */}
          {countriesData.map(country => {
            const style = getMarkerStyle(country);
            return (
              <div 
                key={country.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={{ top: country.coords.top, left: country.coords.left }}
              >
                {/* 3. 国家名称标签 */}
                <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 whitespace-nowrap pointer-events-none group-hover:text-slate-900 transition-colors">
                  {country.name}
                </span>

                <div 
                  className="rounded-full border-2 border-white transition-all duration-300 cursor-pointer hover:scale-125 hover:z-30"
                  onMouseEnter={() => setHoveredCountry(country)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  style={{ 
                    width: style.size, 
                    height: style.size, 
                    backgroundColor: style.backgroundColor,
                    borderColor: style.borderColor,
                    boxShadow: style.shadow
                  }}
                />
              </div>
            );
          })}

          {/* 悬浮提示框（深色卡片） */}
          {hoveredCountry && (
            <div className="absolute right-6 bottom-6 w-[220px] bg-gradient-to-br from-[#111827] to-[#030712] rounded-2xl p-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] border border-slate-800/80 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-base font-black tracking-tight text-white leading-tight mb-0.5">{hoveredCountry.name}</h3>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{activeConfig.metricName}</p>
                  </div>
                  <div className="p-1.5 bg-slate-800/80 rounded-lg border border-slate-700">
                    <activeConfig.icon size={14} className="text-emerald-400" />
                  </div>
                </div>

                <div className="mb-3">
                 <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white tracking-tighter">
                      {mode === 'Absolute' 
                        ? `${hoveredCountry[activeTab.toLowerCase()].val}${activeConfig.unit}`
                        : `${hoveredCountry[activeTab.toLowerCase()].growth >= 0 ? '+' : ''}${hoveredCountry[activeTab.toLowerCase()].growth}%`
                      }
                    </span>
                    {mode === 'Growth' && (
                      <span className="text-[9px] text-slate-400 font-bold">增速</span>
                    )}
                 </div>
                </div>

                <div className="bg-slate-800/40 rounded-lg p-2.5 mb-3 border border-white/5">
                 <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">{activeConfig.deltaLabel}</p>
                      <div className="flex items-center gap-0.5">
                        {hoveredCountry[activeTab.toLowerCase()].delta >= 0 
                          ? <ArrowUpRight size={10} className="text-emerald-400" /> 
                          : <ArrowDownRight size={10} className="text-rose-400" />
                        }
                        <span className={`text-xs font-black ${hoveredCountry[activeTab.toLowerCase()].delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {hoveredCountry[activeTab.toLowerCase()].delta >= 0 ? '+' : '-'}{Math.abs(hoveredCountry[activeTab.toLowerCase()].delta)}{activeConfig.unit}
                        </span>
                      </div>
                    </div>
                    <div className="h-5 w-px bg-slate-700/50 mx-1.5"></div>
                    <div className="space-y-0.5 text-right">
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">当前数值</p>
                      <p className="text-xs font-bold text-slate-300">
                        {hoveredCountry[activeTab.toLowerCase()].val}{activeConfig.unit}
                      </p>
                    </div>
                 </div>
                </div>

                <div className="pt-2.5 border-t border-slate-800">
                  <div className="flex items-center gap-1 mb-2">
                    <Trophy size={10} className="text-amber-400" />
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">当前地区竞品 TOP2</p>
                  </div>
                  <div className="flex gap-1.5">
                    {hoveredCountry.comps.slice(0, 2).map((comp: string, idx: number) => (
                      <div key={idx} className="flex-1 bg-slate-800/30 border border-slate-700/50 px-1.5 py-1 rounded-md flex items-center justify-center gap-1">
                        <span className="text-emerald-400 font-black text-[8px]">#</span>
                        <span className="text-[9px] font-bold text-slate-200 truncate">{comp}</span>
                      </div>
                    ))}
                  </div>
                </div>
            </div>
          )}
        </div>

        {/* 底部图例 */}
        <div className="px-6 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-wrap gap-6 justify-between items-center">
          <div className="flex flex-wrap items-center gap-6 xl:gap-12">
             <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">热度映射刻度</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-400">Low / Decline</span>
                  <div className="h-2 w-32 xl:w-48 rounded-full bg-slate-200 overflow-hidden">
                    <div className={`h-full transition-all duration-700 ${mode === 'Absolute' ? 'bg-emerald-400' : 'bg-gradient-to-r from-rose-500 via-slate-300 to-emerald-400'}`} style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-800">High / Growth</span>
                </div>
             </div>
             
             <div className="flex items-center gap-4 xl:border-l xl:border-slate-200 xl:pl-6">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                  <Zap size={20} className="text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">市场趋势概览</p>
                  <p className="text-[12px] font-bold text-slate-700 italic">在 {activeTab} 模块下，{mode === 'Absolute' ? '核心' : '新兴'}市场展现出明显的梯队分布。</p>
                </div>
             </div>
          </div>
        </div>

    </div>
  );
};

export default MarketCommand;
