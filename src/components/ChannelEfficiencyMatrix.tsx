import React, { useState, useMemo } from 'react';
import { 
  Info, ArrowUpDown, ChevronDown, ChevronRight, TrendingUp, 
  AlertCircle, Download, Filter, Target, Zap, DollarSign, 
  Share2, MousePointer2, ExternalLink, HelpCircle
} from 'lucide-react';
import { useDashboardContext } from '../lib/DashboardContext';

const ChannelEfficiencyMatrix = () => {
  const [expandedRows, setExpandedRows] = useState(['retail', 'paid_ads']);
  const { timeRange, selectedRegion } = useDashboardContext();

  // Get dynamic time/region multipliers to sync with Sunburst
  const getMultiplier = () => {
    const timeScale = {
      today: 0.03, yesterday: 0.035, thisWeek: 0.21, mtd: 1.0, lastMonth: 0.95, ytd: 4.8, last90: 2.9, custom: 1.2
    }[timeRange] || 1.0;

    const rScale: Record<string, number> = {
      GLOBAL: 1.0, ASIA_VN: 0.15, EU_UK: 0.12, ASIA_IN: 0.2, MENA_AE: 0.08, GS_AU: 0.06,
    };
    const globalRegionScale = rScale[selectedRegion] || 0.04;

    return timeScale * globalRegionScale;
  };

  // Base total users (same baseline as Sunburst)
  const baseTotalUsers = 11250; 
  const m = getMultiplier();
  const currentTotalNewUsers = Math.round(baseTotalUsers * m);

  // 1. 模拟数据模型 - 引入动态新增用户数 (New Users) 保持同频
  const hierarchicalData = useMemo(() => {
    // 基础比例 (匹配 Sunburst): Retail: 66%, IB: 34%
    // Retail 子项比例 (占全局): Paid: 0.66 * 0.22 = 14.52%, KOL: 0.66 * 0.18 = 11.88%, Organic: 0.66 * 0.16 = 10.56%, RAF: 0.66 * 0.10 = 6.6%
    
    // 我们定义各项的新增用户数，保证总和为 currentTotalNewUsers
    const ib_u = Math.round(currentTotalNewUsers * 0.34);
    const retail_u = currentTotalNewUsers - ib_u;
    
    const paid_u = Math.round(currentTotalNewUsers * 0.66 * 0.22);
    const kol_u = Math.round(currentTotalNewUsers * 0.66 * 0.18);
    const organic_u = Math.round(currentTotalNewUsers * 0.66 * 0.16);
    const raf_u = retail_u - paid_u - kol_u - organic_u; // Balance exactly

    const dsp_u = Math.round(paid_u * 0.20);
    const asa_u = Math.round(paid_u * 0.42);
    const google_u = paid_u - dsp_u - asa_u;

    // 区域成本系数 (Cost Scale)
    const costScale: Record<string, number> = {
      GLOBAL: 1.0, ASIA_VN: 0.35, EU_UK: 2.1, ASIA_IN: 0.22, MENA_AE: 1.4, GS_AU: 1.8,
    };
    const cScale = costScale[selectedRegion] || 1.0;
    
    // LTV 系数 (缓和波动，使得 ROI 在低成本地区略高，高成本地区略低)
    const ltvScale = cScale * 0.7 + 0.3;

    // 辅助函数：应用成本系数
    const c = (base: number) => base * cScale;
    const l = (base: number) => Number((base * ltvScale / cScale).toFixed(1)); // LTV here refers to the ROI multiple. So if ltv is lower than cScale, ROI decreases.

    // 假设每个渠道的基础 CAC
    const bSignup = {
      ib: 5.2, retail: 14.5, kol: 8.5, paid: 18.2,
      dsp: 15.0, asa: 22.0, google: 12.5, organic: 4.2, raf: 5.5
    };

    return [
      {
        id: 'ib_affiliate',
        channel: 'IB & Affiliate',
        level: 1,
        newUsers: ib_u, spend: ib_u * c(bSignup.ib), signup: c(bSignup.ib), kyc: c(12.0), ftd: c(42.0), ftt: c(55.0), roi: 920, ltv: l(8.5)
      },
      {
        id: 'retail',
        channel: 'Retail',
        level: 1,
        newUsers: retail_u, spend: retail_u * c(bSignup.retail), signup: c(bSignup.retail), kyc: c(28.0), ftd: c(98.0), ftt: c(132.0), roi: 508, ltv: l(3.9),
        children: [
          { id: 'kol', channel: 'KOL', level: 2, newUsers: kol_u, spend: kol_u * c(bSignup.kol), signup: c(bSignup.kol), kyc: c(18.0), ftd: c(65.0), ftt: c(82.0), roi: 720, ltv: l(5.8) },
          { 
            id: 'paid_ads', 
            channel: '投放 Paid ads', 
            level: 2, 
            newUsers: paid_u, spend: paid_u * c(bSignup.paid), signup: c(bSignup.paid), kyc: c(38.0), ftd: c(120.0), ftt: c(155.0), roi: 450, ltv: l(3.2),
            children: [
              { id: 'dsp', channel: 'DSP', level: 3, newUsers: dsp_u, spend: dsp_u * c(bSignup.dsp), signup: c(bSignup.dsp), kyc: c(30.0), ftd: c(95.0), ftt: c(125.0), roi: 480, ltv: l(3.5) },
              { id: 'asa', channel: 'ASA', level: 3, newUsers: asa_u, spend: asa_u * c(bSignup.asa), signup: c(bSignup.asa), kyc: c(42.0), ftd: c(145.0), ftt: c(195.0), roi: 320, ltv: l(2.1) },
              { id: 'google_ads', channel: 'Google Ads', level: 3, newUsers: google_u, spend: google_u * c(bSignup.google), signup: c(bSignup.google), kyc: c(25.0), ftd: c(85.0), ftt: c(105.0), roi: 557, ltv: l(4.2) }
            ]
          },
          { id: 'organic', channel: 'Organic', level: 2, newUsers: organic_u, spend: organic_u * c(bSignup.organic), signup: c(bSignup.organic), kyc: c(8.5), ftd: c(35.0), ftt: c(48.0), roi: 1120, ltv: l(9.5) },
          { id: 'raf', channel: 'RAF（Refer a Friend）', level: 2, newUsers: raf_u, spend: raf_u * c(bSignup.raf), signup: c(bSignup.raf), kyc: c(12.0), ftd: c(45.0), ftt: c(58.0), roi: 890, ltv: l(8.2) }
        ]
      }
    ];
  }, [currentTotalNewUsers, selectedRegion]);

  const flattenedData = useMemo(() => {
    const result = [];
    const walk = (nodes) => {
      nodes.forEach(node => {
        result.push(node);
        if (expandedRows.includes(node.id) && node.children) {
          walk(node.children);
        }
      });
    };
    walk(hierarchicalData);
    return result;
  }, [expandedRows, hierarchicalData]);

  // 2. 动态计算每列的最大值，用于热力渐变缩放
  const maxValues = useMemo(() => {
    const vals = { signup: 0, kyc: 0, ftd: 0, ftt: 0, roi: 0, ltv: 0 };
    flattenedData.forEach(row => {
      if (row.level > 1) { // 仅计算执行层，避免 L1 汇总值拉大间距
        vals.signup = Math.max(vals.signup, row.signup);
        vals.kyc = Math.max(vals.kyc, row.kyc);
        vals.ftd = Math.max(vals.ftd, row.ftd);
        vals.ftt = Math.max(vals.ftt, row.ftt);
        vals.roi = Math.max(vals.roi, row.roi);
        vals.ltv = Math.max(vals.ltv, row.ltv);
      }
    });
    return vals;
  }, [flattenedData]);

  const toggleRow = (id) => {
    setExpandedRows(prev => prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]);
  };

  // 3. 高级热力渐变函数
  const getHeatmapStyle = (val, type, columnMax, level) => {
    if (level === 1) return {}; // 第一层保持中性
    const ratio = columnMax > 0 ? val / columnMax : 0;
    // 增加非线性偏移，确保即使是低数值也有基础底色
    const opacity = 0.02 + (ratio * 0.28); 
    const color = type === 'profit' ? '16, 185, 129' : '244, 63, 94';
    return { backgroundColor: `rgba(${color}, ${opacity})` };
  };

  return (
    <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-md">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">各渠道获客成本与 ROI 矩阵</h1>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Intelligent Gradient Attribution Matrix</p>
          </div>
        </div>
      </header>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">获客渠道</th>
              <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">渠道归因新增</th>
              <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">渠道总支出</th>
              <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                <div className="flex items-center justify-end gap-1 relative group">
                  注册成本
                  <HelpCircle size={12} className="text-slate-400 hover:text-slate-600 transition-colors cursor-help" />
                  <div className="absolute top-full right-0 mt-2 hidden group-hover:block w-48 bg-gray-900 text-white text-[10px] p-2.5 rounded-lg shadow-xl z-50 normal-case tracking-normal text-left border border-gray-800">
                    <p className="text-gray-400 leading-relaxed mb-1.5">获取单个新注册用户的平均花费。</p>
                    <p className="text-indigo-300 font-mono bg-indigo-500/10 inline-block px-1.5 py-0.5 rounded">总支出 / 新增注册数</p>
                    <div className="absolute bottom-full right-3 border-4 border-transparent border-b-gray-900"></div>
                  </div>
                </div>
              </th>
              <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                <div className="flex items-center justify-end gap-1 relative group">
                  KYC 成本
                  <HelpCircle size={12} className="text-slate-400 hover:text-slate-600 transition-colors cursor-help" />
                  <div className="absolute top-full right-0 mt-2 hidden group-hover:block w-48 bg-gray-900 text-white text-[10px] p-2.5 rounded-lg shadow-xl z-50 normal-case tracking-normal text-left border border-gray-800">
                    <p className="text-gray-400 leading-relaxed mb-1.5">获取单个成功通过实名认证用户的花费。反映注册用户的真实质量。</p>
                    <p className="text-indigo-300 font-mono bg-indigo-500/10 inline-block px-1.5 py-0.5 rounded">总支出 / KYC通过数</p>
                    <div className="absolute bottom-full right-3 border-4 border-transparent border-b-gray-900"></div>
                  </div>
                </div>
              </th>
              <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                <div className="flex items-center justify-end gap-1 relative group">
                  FTD 成本
                  <HelpCircle size={12} className="text-slate-400 hover:text-slate-600 transition-colors cursor-help" />
                  <div className="absolute top-full right-0 mt-2 hidden group-hover:block w-48 bg-gray-900 text-white text-[10px] p-2.5 rounded-lg shadow-xl z-50 normal-case tracking-normal text-left border border-gray-800">
                    <p className="text-gray-400 leading-relaxed mb-1.5">获取单个首次入金用户的花费。衡量渠道带来资金贡献的核心指标。</p>
                    <p className="text-indigo-300 font-mono bg-indigo-500/10 inline-block px-1.5 py-0.5 rounded">总支出 / 首次入金人数</p>
                    <div className="absolute bottom-full right-3 border-4 border-transparent border-b-gray-900"></div>
                  </div>
                </div>
              </th>
              <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                <div className="flex items-center justify-end gap-1 relative group">
                  FTT 成本
                  <HelpCircle size={12} className="text-slate-400 hover:text-slate-600 transition-colors cursor-help" />
                  <div className="absolute top-full right-0 mt-2 hidden group-hover:block w-48 bg-gray-900 text-white text-[10px] p-2.5 rounded-lg shadow-xl z-50 normal-case tracking-normal text-left border border-gray-800">
                    <p className="text-gray-400 leading-relaxed mb-1.5">获取单个产生首次实际交易用户的花费。直接决定最终的投资回报。</p>
                    <p className="text-indigo-300 font-mono bg-indigo-500/10 inline-block px-1.5 py-0.5 rounded">总支出 / 首次交易人数</p>
                    <div className="absolute bottom-full right-3 border-4 border-transparent border-b-gray-900"></div>
                  </div>
                </div>
              </th>
              <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                <div className="flex items-center justify-end gap-1 relative group">
                  总体 ROI
                  <HelpCircle size={12} className="text-slate-400 hover:text-slate-600 transition-colors cursor-help" />
                  <div className="absolute top-full right-0 mt-2 hidden group-hover:block w-48 bg-gray-900 text-white text-[10px] p-2.5 rounded-lg shadow-xl z-50 normal-case tracking-normal text-left border border-gray-800">
                    <p className="text-gray-400 leading-relaxed mb-1.5">渠道整体投资回报率，反映每投入1美元能换回多少美元的净入金。</p>
                    <p className="text-indigo-300 font-mono bg-indigo-500/10 inline-block px-1.5 py-0.5 rounded">Net Deposit / 渠道总支出</p>
                    <div className="absolute bottom-full right-3 border-4 border-transparent border-b-gray-900"></div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {flattenedData.map((row) => (
              <tr key={row.id} className={`group transition-all duration-300 ${row.level === 1 ? 'bg-slate-50/30' : 'hover:bg-slate-50/60'}`}>
                <td className="p-4">
                  <div className="flex items-center gap-2" style={{ paddingLeft: `${(row.level - 1) * 24}px` }}>
                    {row.children ? (
                      <button onClick={() => toggleRow(row.id)} className={`w-5 h-5 rounded flex items-center justify-center shadow-sm transition-all ${expandedRows.includes(row.id) ? 'bg-white text-slate-600 border border-slate-200' : 'bg-emerald-400 text-white shadow-emerald-400/20'}`}>
                        {expandedRows.includes(row.id) ? <ChevronDown size={12} strokeWidth={3} /> : <ChevronRight size={12} strokeWidth={3} />}
                      </button>
                    ) : <div className="w-5 h-5 flex items-center justify-center opacity-20"><div className="w-1 h-1 rounded-full bg-slate-900" /></div>}
                    <span className={`${row.level === 1 ? 'font-bold text-slate-900 text-sm' : 'font-semibold text-slate-700 text-xs'} truncate`}>{row.channel}</span>
                  </div>
                </td>
                <td className="p-4 text-right font-bold text-slate-700 text-xs tabular-nums">{row.newUsers.toLocaleString()}</td>
                <td className="p-4 text-right font-semibold text-slate-400 text-xs tabular-nums">${row.spend.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                {/* 成本列：数值越大，红色越深 */}
                <td className="p-4 text-right font-bold text-xs tabular-nums transition-colors duration-500" style={getHeatmapStyle(row.signup, 'cost', maxValues.signup, row.level)}>${row.signup.toFixed(1)}</td>
                <td className="p-4 text-right font-bold text-xs tabular-nums transition-colors duration-500" style={getHeatmapStyle(row.kyc, 'cost', maxValues.kyc, row.level)}>${row.kyc.toFixed(1)}</td>
                <td className="p-4 text-right font-bold text-xs tabular-nums transition-colors duration-500" style={getHeatmapStyle(row.ftd, 'cost', maxValues.ftd, row.level)}>${row.ftd.toFixed(1)}</td>
                <td className="p-4 text-right font-bold text-xs tabular-nums transition-colors duration-500" style={getHeatmapStyle(row.ftt, 'cost', maxValues.ftt, row.level)}>${row.ftt.toFixed(1)}</td>
                {/* LTV/CAC 列：数值越大，绿色越深 */}
                <td className="p-4 text-right font-bold text-xs transition-colors duration-500" style={getHeatmapStyle(row.ltv, 'profit', maxValues.ltv, row.level)}>
                  <span className={`${row.ltv > 5 ? 'text-emerald-400' : row.ltv > 3 ? 'text-slate-700' : 'text-rose-600'}`}>{row.ltv}x</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend & Summary Bar */}
      <div className="px-6 py-4 flex justify-between items-center border-t border-slate-50 text-[10px] font-bold uppercase tracking-widest">
         <div className="flex gap-6 items-center">
           <div className="flex items-center gap-1.5">
             <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400/30 border border-emerald-400/50"></div>
             <span className="text-slate-400">效率高 (High Efficiency)</span>
           </div>
           <div className="flex items-center gap-1.5">
             <div className="w-2.5 h-2.5 rounded-sm bg-rose-500/30 border border-rose-500/50"></div>
             <span className="text-slate-400">成本高 (High Cost Alert)</span>
           </div>
         </div>
      </div>

      {/* Insight Cards Section */}
      <div className="px-6 pb-6 pt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
         
         <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50 flex flex-col justify-between h-full group hover:shadow-lg hover:shadow-emerald-400/5 transition-all duration-300">
           <div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] mb-3">
                <TrendingUp size={14} /> BEST CHANNEL
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">SEO (Organic) 稳居首位</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                LTV/CAC 高达 <span className="text-emerald-400 font-bold">12.4x</span>，且获客成本仅为大盘均值的 20%。建议强化内容深度，沉淀长效私域流量。
              </p>
           </div>
         </div>

         <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100/50 flex flex-col justify-between h-full group hover:shadow-lg hover:shadow-rose-500/5 transition-all duration-300">
           <div>
              <div className="flex items-center gap-1.5 text-rose-600 font-bold text-[10px] mb-3">
                <AlertCircle size={14} /> BUDGET ALERT
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">Apple Search Ads 风险</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                FTT 转化成本达 <span className="text-rose-600 font-bold">$195.0</span>，出现成本倒挂迹象。需紧急排查关键词精准度与首屏流失率。
              </p>
           </div>
         </div>

         <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50 flex flex-col justify-between h-full group hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
           <div>
              <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[10px] mb-3">
                <Zap size={14} /> OVERALL INSIGHT
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">全渠道 ROI: 508.4%</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                当前营销组合整体健康。FTT 是提升 ROI 的最大杠杆，建议优化支付链路，减少注册后的首笔转化摩擦。
              </p>
           </div>
         </div>

      </div>

    </div>
  );
};

export default ChannelEfficiencyMatrix;
