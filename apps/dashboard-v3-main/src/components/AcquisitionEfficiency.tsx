import React, { useState } from 'react';
import { UserPlus, Contact, FileCheck, Wallet, BarChart2, AlertTriangle, Lightbulb, ChevronDown, Calendar, HelpCircle } from 'lucide-react';

const funnelData = [
  { 
    step: 1, 
    title: '注册', 
    subtitle: 'Sign Up', 
    icon: UserPlus, 
    users: 12480, 
    pctOfTotal: 100, 
    stepCvr: null, 
    cumCvr: 100, 
    dropoff: null, 
    dropoffPct: null,
    color: 'bg-[#419466]',
    topW: 100,
    botW: 85
  },
  { 
    step: 2, 
    title: 'Live Account', 
    subtitle: '开户', 
    icon: Contact, 
    users: 9984, 
    pctOfTotal: 80, 
    stepCvr: 80.0, 
    cumCvr: 80.0, 
    dropoff: 2496, 
    dropoffPct: 20.0,
    color: 'bg-[#55a677]',
    topW: 85,
    botW: 70
  },
  { 
    step: 3, 
    title: 'Live KYC', 
    subtitle: '完成KYC', 
    icon: FileCheck, 
    users: 5990, 
    pctOfTotal: 48, 
    stepCvr: 60.0, 
    cumCvr: 48.0, 
    dropoff: 3994, 
    dropoffPct: 20.0,
    color: 'bg-[#69b888]',
    topW: 70,
    botW: 55
  },
  { 
    step: 4, 
    title: 'FTD', 
    subtitle: '首次入金', 
    icon: Wallet, 
    users: 2995, 
    pctOfTotal: 24, 
    stepCvr: 50.0, 
    cumCvr: 24.0, 
    dropoff: 2995, 
    dropoffPct: 50.0,
    color: 'bg-[#7dca99]',
    topW: 55,
    botW: 40
  },
  { 
    step: 5, 
    title: 'FTT', 
    subtitle: '首次交易', 
    icon: BarChart2, 
    users: 1497, 
    pctOfTotal: 12, 
    stepCvr: 50.0, 
    cumCvr: 12.0, 
    dropoff: 1498, 
    dropoffPct: 50.0,
    color: 'bg-[#a3e3bc]',
    topW: 40,
    botW: 25
  },
];

export default function AcquisitionEfficiency() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">获客转化全链路漏斗</h2>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[240px_1fr_100px_120px_100px] gap-4 items-end pb-3 border-b border-gray-100 mb-2 text-xs font-medium text-gray-500">
        <div className="pl-4">用户阶段</div>
        <div className="text-center">用户数 (人)</div>
        <div className="text-center group relative">
          <div className="flex items-center justify-center gap-1">
            Step CVR
            <HelpCircle size={12} className="text-gray-400 cursor-help" />
          </div>
          <span className="text-[10px] text-gray-400 font-normal">(环比转化率)</span>
          <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-[10px] p-2 rounded shadow-xl z-50 normal-case tracking-normal font-normal">
            Step CVR = 相邻阶段转化率，反映漏斗中每一步的流失紧迫度。
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
        <div className="text-center group relative">
          <div className="flex items-center justify-center gap-1">
            Cumulative CVR
            <HelpCircle size={12} className="text-gray-400 cursor-help" />
          </div>
          <span className="text-[10px] text-gray-400 font-normal">(累计转化率)</span>
          <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-[10px] p-2 rounded shadow-xl z-50 normal-case tracking-normal font-normal">
            Cumulative CVR = 相对注册用户的累计转化率，反映最终业务目标的达成效率。
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
        <div className="text-right pr-4">
          流失人数<br/>
          <span className="text-[10px] text-gray-400 font-normal">(人)</span>
        </div>
      </div>

      {/* Funnel Rows */}
      <div className="flex flex-col mb-6">
        {funnelData.map((step, index) => {
          const Icon = step.icon;
          const isHovered = hoveredStep === index;
          
          // 根据索引选择颜色，与 UserDistributionSunburst 中的色域对齐
          const colors = ['bg-[#60996D]', 'bg-[#72A87E]', 'bg-[#84B78F]', 'bg-[#96C6A0]', 'bg-[#A8D5B1]'];
          const barColor = colors[index] || step.color;
          
          return (
            <div 
              key={index} 
              className={`grid grid-cols-[240px_1fr_100px_120px_100px] gap-4 items-center py-3 border-b border-gray-100 last:border-0 transition-colors relative ${isHovered ? 'bg-gray-50' : ''}`}
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              {/* Tooltip on Hover */}
              {isHovered && (
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full mb-2 z-10 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl w-48 pointer-events-none">
                  <div className="font-bold mb-1">{step.title} 阶段详情</div>
                  <div className="flex justify-between text-gray-300 mb-1">
                    <span>总人数:</span>
                    <span className="text-white font-medium">{step.users.toLocaleString()}</span>
                  </div>
                  {step.dropoff && (
                    <div className="flex justify-between text-gray-300">
                      <span>流失人数:</span>
                      <span className="text-rose-400 font-medium">{step.dropoff.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
 
              {/* Col 1: Stage */}
              <div className="flex items-center gap-3 pl-4">
                <div className={`w-6 h-6 rounded-full ${barColor} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
                  {step.step}
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-400 flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 leading-tight">{step.title}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{step.subtitle}</div>
                </div>
              </div>
 
              {/* Col 2: Funnel Bar */}
              <div className="flex justify-center px-2">
                <div 
                  className={`${barColor} h-14 flex flex-col items-center justify-center text-white transition-all duration-300 w-full max-w-[320px]`}
                  style={{ 
                    clipPath: `polygon(${(100 - step.topW) / 2}% 0%, ${100 - (100 - step.topW) / 2}% 0%, ${100 - (100 - step.botW) / 2}% 100%, ${(100 - step.botW) / 2}% 100%)`,
                  }}
                >
                  <span className="text-lg font-bold leading-none mb-0.5">{step.users.toLocaleString()}</span>
                  <span className="text-[10px] font-medium opacity-90">({step.pctOfTotal}%)</span>
                </div>
              </div>

              {/* Col 3: Step CVR */}
              <div className="text-center font-bold text-sm">
                {step.stepCvr ? (
                  <span className={step.stepCvr >= 70 ? 'text-emerald-400' : step.stepCvr > 50 ? 'text-orange-500' : 'text-rose-600'}>
                    {step.stepCvr.toFixed(1)}%
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>

              {/* Col 4: Cumulative CVR */}
              <div className="text-center font-bold text-sm">
                {step.cumCvr === 100 ? (
                  <span className="text-gray-700">100%</span>
                ) : (
                  <span className="text-emerald-400">{step.cumCvr.toFixed(1)}%</span>
                )}
              </div>

              {/* Col 5: Dropoff */}
              <div className="text-right pr-4 flex flex-col items-end justify-center gap-1">
                {step.dropoff ? (
                  <div className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                    ↓ {step.dropoff.toLocaleString()}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm font-bold pl-2">—</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-6 px-4 text-xs font-medium text-gray-600">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          健康 (≥70%)
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          关注 (50%-70%)
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-rose-500"></div>
          风险 (&lt;50%)
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-2 gap-6 mt-auto">
        {/* Left Card: Issues */}
        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex flex-col group hover:shadow-lg hover:shadow-slate-500/5 transition-all duration-300">
          <div className="flex items-center gap-2 text-rose-600 font-bold mb-4 text-[10px] uppercase tracking-widest">
            <AlertTriangle size={14} />
            最大流失环节
          </div>
          
          <div className="space-y-4 mb-4 flex-1">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm tracking-tight">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
                  Live Account → Live KYC
                </div>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">流失最多</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 pl-7 font-medium">
                <span>流失人数: <span className="text-rose-600 font-bold">3,994</span></span>
                <span>Step CVR: <span className="text-rose-600 font-bold">60.0%</span></span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm tracking-tight">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                  Live KYC → FTD
                </div>
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">转化率较低</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 pl-7 font-medium">
                <span>流失人数: <span className="text-rose-600 font-bold">2,995</span></span>
                <span>Step CVR: <span className="text-rose-600 font-bold">50.0%</span></span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-600 font-medium leading-relaxed">
            <Lightbulb size={14} className="text-amber-500 shrink-0 mt-0.5" />
            当前结论：入金前与首次交易激活存在明显损耗，需重点优化。
          </div>
        </div>

        {/* Right Card: Actions */}
        <div className="bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100/60 group hover:shadow-lg hover:shadow-emerald-400/5 transition-all duration-300">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-4 text-[10px] uppercase tracking-widest">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            </div>
            建议动作 (Next Actions)
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="px-1.5 py-0.5 bg-emerald-400 text-white text-[10px] font-bold rounded mt-0.5">P1</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-gray-900">优化 KYC → FTD (入金转化)</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-50/50 border border-emerald-200/60 px-1.5 py-0.5 rounded">优先级最高</span>
                </div>
                <ul className="text-xs text-gray-600 list-disc pl-4 space-y-0.5">
                  <li>优化入金流程，减少操作步骤</li>
                  <li>设计首存激励，提高入金意愿</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="px-1.5 py-0.5 bg-emerald-400 text-white text-[10px] font-bold rounded mt-0.5">P2</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-gray-900">优化 FTD → FTT (首交易激活)</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-50/50 border border-emerald-200/60 px-1.5 py-0.5 rounded">优先级高</span>
                </div>
                <ul className="text-xs text-gray-600 list-disc pl-4 space-y-0.5">
                  <li>提供新手引导，降低交易门槛</li>
                  <li>上线首单任务/奖励，激励完成首单</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="px-1.5 py-0.5 bg-emerald-300 text-white text-[10px] font-bold rounded mt-0.5">P3</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-gray-900">深度拆解定位问题来源</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-50/50 border border-emerald-200/60 px-1.5 py-0.5 rounded">优先级中</span>
                </div>
                <ul className="text-xs text-gray-600 list-disc pl-4 space-y-0.5">
                  <li>按渠道 (Paid / IB / Organic) 拆解漏斗</li>
                  <li>按地区 (Vietnam / SEA / Global) 拆解漏斗</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
    </div>
  );
}
