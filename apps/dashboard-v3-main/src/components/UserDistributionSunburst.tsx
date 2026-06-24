import React, { useState, useEffect } from 'react';
import { Layers, Globe, Users, Lightbulb, Info, Megaphone, User, Leaf, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { useDashboardContext } from '../lib/DashboardContext';

const UserDistributionSunburst = () => {
  const [localRegion, setLocalRegion] = useState('Global');
  const [drilledBlock, setDrilledBlock] = useState<string | null>(null);
  const { timeRange, selectedRegion } = useDashboardContext();

  // 地区列表
  const regions = ['Global', 'EU', 'Mena', 'Latam', 'Asia', 'Africa', 'Others'];

  // 根据地区动态生成数据逻辑
  const getRegionalData = (region: string) => {
    // Dynamic time range multiplier
    const timeScale = {
      today: 0.03, yesterday: 0.035, thisWeek: 0.21, mtd: 1.0, lastMonth: 0.95, ytd: 4.8, last90: 2.9, custom: 1.2
    }[timeRange] || 1.0;

    const rScale: Record<string, number> = {
      GLOBAL: 1.0, ASIA_VN: 0.15, EU_UK: 0.12, ASIA_IN: 0.2, MENA_AE: 0.08, GS_AU: 0.06,
    };
    const globalRegionScale = rScale[selectedRegion] || 0.04;

    const m = timeScale * globalRegionScale;

    // Fix double-scaling bug: base users is 11250 globally.
    const total = Math.round(11250 * m); 
    const globalRatio = Math.round(globalRegionScale * 100) + '%';
    
    // 基础比例
    const retailPct = 0.66;
    const ibPct = 0.34;
    
    const retailVal = Math.round(total * retailPct);
    const ibVal = total - retailVal;

    const paidPct = 0.22;
    const kolPct = 0.18;
    const organicPct = 0.16;
    const rafPct = 0.10; 
    
    const paidAdsVal = Math.round(total * paidPct);

    return {
      total,
      globalRatio,
      ib: { val: ibVal, formatPct: '34%' },
      retail: {
        val: retailVal,
        formatPct: '66%',
        children: [
          { 
            key: 'Paid Ads', label: '投放 Paid ads', val: paidAdsVal, pct: '22%', icon: Megaphone,
            subChildren: [
              { key: 'ASA', label: 'ASA', val: Math.round(paidAdsVal * 0.42), pct: '42%', isSub: true },
              { key: 'Google Ads', label: 'Google Ads', val: Math.round(paidAdsVal * 0.38), pct: '38%', isSub: true },
              { key: 'DSP', label: 'DSP', val: Math.round(paidAdsVal * 0.20), pct: '20%', isSub: true },
            ]
          },
          { key: 'KOL', label: 'KOL', val: Math.round(total * kolPct), pct: '18%', icon: User },
          { key: 'Organic', label: 'Organic', val: Math.round(total * organicPct), pct: '16%', icon: Leaf },
          { key: 'RAF', label: 'RAF', val: Math.round(total * rafPct), pct: '10%', icon: Users },
        ]
      }
    };
  };

  const [data, setData] = useState(getRegionalData('Global'));

  useEffect(() => {
    setData(getRegionalData(selectedRegion));
    setDrilledBlock(null); // Reset drill-down on region change
  }, [selectedRegion]);

  const activeChildren = drilledBlock 
    ? data.retail.children.find((c: any) => c.key === drilledBlock)?.subChildren || []
    : data.retail.children;

  const handleBlockClick = (key: string, hasArrow: boolean) => {
    if (hasArrow) {
      setDrilledBlock(key);
    }
  };

  return (
    <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md z-40 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg shrink-0">
            <Layers size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none text-slate-900">新增用户来源构成矩阵</h1>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] mt-1">Multi-Tier Growth Attribution</p>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
        
        {/* Top Summary Cards */}
        <div className="grid grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden shrink-0">
          <div className="bg-white p-5 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} className="text-emerald-400" />
              <span className="text-xs text-slate-500 font-bold tracking-tight">总新增用户</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl font-black text-slate-900 tracking-tighter">{data.total.toLocaleString()}</span>
              <span className="text-xs font-bold text-slate-400">人</span>
            </div>
          </div>
          <div className="bg-white p-5 flex flex-col items-center justify-center">
             <div className="flex items-center gap-2 mb-2">
              <Globe size={18} className="text-emerald-400" />
              <span className="text-xs text-slate-500 font-bold tracking-tight">占全球新增比例</span>
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tighter">{data.globalRatio}</div>
          </div>
        </div>

        {/* Matrix Visual Area */}
        <div className="flex gap-[2px] rounded overflow-hidden mt-6 mb-4">
          
          {/* Left Column: Retail */}
          <div className="flex flex-col gap-[2px] min-w-0" style={{ flex: `${data.retail.val} 1 0%` }}>
            {/* Upper Main Stats */}
            <div className="bg-[#5a8c61] p-6 flex flex-col justify-center min-h-[160px]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-base font-bold text-white tracking-wide">Retail</span>
              </div>
              <div className="text-base font-bold text-white mb-1">{data.retail.formatPct}</div>
              <div className="text-base font-medium text-white/90">{data.retail.val.toLocaleString()}</div>
            </div>

            {/* Lower Breakdown Section */}
            <div className="flex gap-[2px] min-h-[160px] relative transition-all duration-500 ease-in-out">
              {drilledBlock && (
                <div 
                  className="bg-[#7b9683] flex flex-col justify-center items-center cursor-pointer hover:bg-[#688270] transition-colors"
                  style={{ width: '48px', flexShrink: 0 }}
                  onClick={() => setDrilledBlock(null)}
                  title="Back to Retail Breakdown"
                >
                  <ChevronLeft size={24} className="text-white" strokeWidth={2.5} />
                </div>
              )}
              {activeChildren.map((child: any) => {
                const hasArrow = !drilledBlock && child.key === 'Paid Ads';
                return (
                  <div 
                    key={child.key} 
                    className={`bg-[#b3ceb8] p-3 flex flex-col justify-center relative group transition-colors min-w-0 overflow-hidden ${hasArrow ? 'cursor-pointer hover:bg-[#a5c5ac]' : 'hover:bg-[#a5c5ac]'}`} 
                    style={{ flex: `${child.val} 1 0%` }}
                    onClick={() => handleBlockClick(child.key, hasArrow)}
                  >
                    <div className="flex justify-between items-center mb-1.5 gap-1">
                      <div className="text-[13px] font-bold text-slate-800 tracking-wide leading-tight" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {child.label}
                      </div>
                      {hasArrow && (
                        <div className="w-5 h-5 shrink-0 bg-white/50 rounded border border-white/50 flex items-center justify-center shadow-sm group-hover:bg-white group-hover:scale-105 transition-all">
                          <ChevronRight size={12} className="text-slate-800" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="text-[13px] font-bold text-slate-800 mb-0.5 leading-none">{child.pct}</div>
                      <div className="text-[13px] font-medium text-slate-800/90 leading-none">{child.val.toLocaleString()}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: IB & Affiliate */}
          <div className="bg-[#222a35] p-6 flex flex-col justify-center relative group transition-colors hover:bg-[#2a3441] min-w-0" style={{ flex: `${data.ib.val} 1 0%` }}>
             <div className="text-base font-bold text-white tracking-wide mb-2">IB & Affiliate</div>
             <div className="flex flex-col">
                <div className="text-base font-bold text-white mb-1">{data.ib.formatPct}</div>
                <div className="text-base font-medium text-white/90">{data.ib.val.toLocaleString()}</div>
             </div>
          </div>
        </div>

        <div className="bg-[#fafcfb] p-5 rounded-xl border border-[#e0ebe3] flex items-start gap-3 text-[13px] text-[#4f7b58] font-medium leading-relaxed transition-all duration-300">
          <Lightbulb size={18} className="text-[#5a8c61] shrink-0 mt-0.5" />
          {drilledBlock === 'Paid Ads' ? (
            <span className="animate-in fade-in duration-500">
              结构洞察：Paid Ads 共贡献 {Math.floor(data.retail.children.find((c: any) => c.key === 'Paid Ads')?.val || 0).toLocaleString()} 名新增用户。其中 <strong>ASA</strong> 渠道表现最为强劲，转化占比达 42%（{Math.floor((data.retail.children.find((c: any) => c.key === 'Paid Ads')?.val || 0) * 0.42).toLocaleString()}人），<strong>Google Ads</strong> 稳定输出占比 38%。
            </span>
          ) : (
            <span className="animate-in fade-in duration-500">
              结构洞察：Retail 贡献 {data.retail.formatPct} 的新增，其中付费广告占比最高（{data.retail.children.find((c: any) => c.key === 'Paid Ads')?.pct || '0%'}），KOL 贡献 {data.retail.children.find((c: any) => c.key === 'KOL')?.pct || '0%'}，自然流量 {data.retail.children.find((c: any) => c.key === 'Organic')?.pct || '0%'}，IB & Affiliate 贡献 {data.ib.formatPct}。
            </span>
          )}
        </div>

      </div>

      {/* Footer */}
      <footer className="px-6 py-5 bg-white border-t border-slate-100 flex items-center gap-8 justify-start shrink-0">
         <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
           <div className="w-4 h-4 rounded-sm bg-[#5a8c61]"></div> 
           <span>Retail</span>
         </div>
         <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
           <div className="w-4 h-4 rounded-sm bg-[#222a35]"></div> 
           <span>IB & Affiliate</span>
         </div>
         <div className="flex items-center gap-2 text-xs font-medium text-slate-500 ml-4">
           <div className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center bg-white shadow-sm">
             <ChevronRight size={12} className="text-slate-500" strokeWidth={2} />
           </div>
           <span>表示存在下级渠道，可下钻查看详情</span>
         </div>
      </footer>
    </div>
  );
};

export default UserDistributionSunburst;

