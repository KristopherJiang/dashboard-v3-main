import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ResponsiveContainer, Tooltip, ReferenceLine, ReferenceArea } from 'recharts';
import { AlertCircle, Search, Info, TrendingDown, TrendingUp, Cpu, CheckCircle2, ChevronDown } from 'lucide-react';

const data = [
  { 
    x: -40, y: 70, z: 1800, name: '客服回复慢', sentiment: 'negative', platform: 'Twitter',
    insight: '近期由于物流积压，导致退货咨询激增，客服平均等待时间上升至15分钟。',
    action: '需紧急同步至对应业务部，评估是否启动快速补偿方案或技术修复。'
  },
  { 
    x: -60, y: 45, z: 1000, name: 'APP闪退', sentiment: 'negative', platform: 'App Store',
    insight: '新版本发布后，iOS 16用户频繁报告在结账页面发生闪退。',
    action: '开发团队需紧急排查结账页面的内存泄漏问题，准备发版修复。'
  },
  { 
    x: -20, y: 28, z: 800, name: '包装损坏', sentiment: 'negative', platform: 'Reddit',
    insight: '部分环保包装在长途运输中易破损，导致商品受损投诉增加。',
    action: '联系物流供应商优化打包流程，或考虑更换更坚固的环保材料。'
  },
  { 
    x: 25, y: 82, z: 1100, name: '响应速度快', sentiment: 'positive', platform: 'Twitter',
    insight: '引入AI客服助手后，基础问题的首答时间缩短了80%，用户满意度提升。',
    action: '继续优化AI知识库，扩大自动回复的覆盖范围。'
  },
  { 
    x: 45, y: 58, z: 2500, name: '交易体验好', sentiment: 'positive', platform: 'Trustpilot',
    insight: '新上线的“一键复购”功能大受好评，复购转化率提升了15%。',
    action: '在首页增加“一键复购”的曝光，并考虑加入个性化推荐。'
  },
  { 
    x: 65, y: 35, z: 1200, name: '设计高级', sentiment: 'positive', platform: 'Blogs',
    insight: '品牌视觉升级后，在设计类博客中获得了大量正面评价，提升了品牌调性。',
    action: '将这些正面评价用于社交媒体的PR宣传，扩大品牌影响力。'
  },
];

const CustomScatterNode = (props: any) => {
  const { cx, cy, payload, setActiveNode } = props;
  const radius = Math.sqrt(payload.z) * 0.8; 
  
  const fill = payload.sentiment === 'negative' ? '#cd5c5c' : '#71bc88';
  const glow = payload.sentiment === 'negative' ? 'rgba(205, 92, 92, 0.15)' : 'rgba(113, 188, 136, 0.15)';
  const strokeColor = payload.sentiment === 'negative' ? '#e11d48' : '#34d399';
  
  return (
    <g 
      className="transition-all duration-300 hover:opacity-80 cursor-pointer"
      onMouseEnter={() => setActiveNode(payload)}
    >
      <circle cx={cx} cy={cy} r={radius + 12} fill={glow} stroke={strokeColor} strokeDasharray="3 3" strokeOpacity={0.4} />
      <circle cx={cx} cy={cy} r={radius} fill={fill} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="white" fontSize={11} fontWeight="bold">
        {payload.name}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900 text-white p-3 rounded-xl shadow-xl text-xs border border-gray-700 min-w-[150px]">
        <div className="font-bold mb-2 text-sm">{data.name}</div>
        <div className="flex justify-between mb-1">
          <span className="text-gray-400">情感倾向:</span>
          <span className={`font-bold ${data.sentiment === 'negative' ? 'text-rose-400' : 'text-emerald-400'}`}>
            {data.sentiment === 'negative' ? '负面' : '正面'}
          </span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-gray-400">主要来源:</span>
          <span className="font-medium text-gray-200">{data.platform}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">讨论声量:</span>
          <span className="font-medium text-gray-200">{data.z}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function Reputation() {
  const [activeNode, setActiveNode] = useState(data[0]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-md">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">品牌舆情监控</h2>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">Sentiment & AI Real-Time Monitor</p>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 min-h-[400px] w-full relative pt-6 pb-12 pl-[56px] pr-8 flex flex-col">
        {/* Elegant Y-Axis Title */}
        <div className="absolute left-[12px] top-[45%] -translate-y-1/2 -rotate-90 flex items-center gap-2 text-slate-400 origin-center pointer-events-none whitespace-nowrap">
           <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Impact</span>
           <span className="text-xs font-bold tracking-[0.2em] text-slate-600">传播影响力</span>
        </div>

        {/* Boundary Ticks for Y-Axis (High/Low) to supplement chart ticks */}
        <div className="absolute left-14 top-5 text-[9px] font-bold tracking-widest text-slate-400 uppercase pointer-events-none">High</div>
        <div className="absolute left-14 bottom-14 text-[9px] font-bold tracking-widest text-slate-400 uppercase pointer-events-none">Low</div>

        <ResponsiveContainer width="100%" height="100%" className="z-10 relative flex-1">
          <ScatterChart margin={{ top: 16, right: 10, bottom: 0, left: 0 }}>
            {/* Soft Background quadrants */}
            {/* @ts-ignore */}
            <ReferenceArea x1={-100} x2={0} y1={0} y2={100} fill="#fef2f2" fillOpacity={0.4} />
            {/* @ts-ignore */}
            <ReferenceArea x1={0} x2={100} y1={0} y2={100} fill="#f0fdf4" fillOpacity={0.4} />
            
            {/* Sophisticated Center Crosshairs */}
            <ReferenceLine x={0} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 4" />
            <ReferenceLine y={50} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 4" />

            <XAxis 
              type="number" 
              dataKey="x" 
              domain={[-100, 100]} 
              ticks={[-100, -50, 0, 50, 100]} 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              tickMargin={12}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              domain={[0, 100]} 
              ticks={[0, 25, 50, 75, 100]} 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              tickMargin={12}
            />
            <ZAxis type="number" dataKey="z" range={[100, 2000]} />
            <Tooltip cursor={{ strokeDasharray: '3 3', stroke: '#94a3b8' }} content={<CustomTooltip />} />
            <Scatter data={data} shape={<CustomScatterNode setActiveNode={setActiveNode} />} />
          </ScatterChart>
        </ResponsiveContainer>

        {/* Sophisticated X-Axis Legend */}
        <div className="absolute left-[80px] right-[40px] bottom-2 h-[24px] flex items-center justify-between z-10 pointer-events-none">
          
          <div className="flex items-center gap-1.5 opacity-90">
             <span className="text-rose-400 font-bold text-sm">←</span>
             <div className="flex items-baseline gap-1 text-rose-500">
               <span className="text-xs font-bold tracking-widest">负面</span>
               <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Negative</span>
             </div>
          </div>
          
          <div className="flex items-center gap-2.5 opacity-90">
             <span className="text-[11px] font-bold text-slate-700 tracking-widest">中性的 <span className="text-[10px] uppercase text-slate-400 ml-0.5 tracking-wider">Neutral</span></span>
             <span className="w-1 h-1 rounded-full bg-slate-300"></span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sentiment</span>
          </div>
          
          <div className="flex items-center gap-1.5 opacity-90">
             <div className="flex items-baseline gap-1 text-emerald-400">
               <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Positive</span>
               <span className="text-xs font-bold tracking-widest">正面</span>
             </div>
             <span className="text-emerald-400 font-bold text-sm">→</span>
          </div>
        </div>
      </div>

      {/* Dark Insight Card */}
      <div className="bg-[#1a1f2e] text-white p-5 rounded-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 mt-2 shadow-lg transition-all duration-300">
        {/* Left: Topic */}
        <div className="flex items-start gap-3 min-w-[200px]">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 mt-1 ${
            activeNode.sentiment === 'negative' 
              ? 'bg-rose-500/20 border-rose-500/30' 
              : 'bg-emerald-400/20 border-emerald-400/30'
          }`}>
            {activeNode.sentiment === 'negative' ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div>
            <div className="text-base font-bold mb-2">{activeNode.name}</div>
            <div className="flex gap-2">
              <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-300 font-medium uppercase">{activeNode.platform}</span>
              <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-300 font-medium">声量: {(activeNode.z / 1000).toFixed(1)}K</span>
            </div>
          </div>
        </div>
        
        {/* Middle: AI Insight */}
        <div className="flex-1 md:border-l border-white/10 md:pl-6">
          <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1 mb-2 uppercase tracking-wider">
            <Cpu className="w-3 h-3" /> AI 实时洞察摘要
          </div>
          <div className="text-sm text-gray-200 leading-relaxed">
            {activeNode.insight}
          </div>
        </div>
        
        {/* Right: Action */}
        <div className="flex-1 md:border-l border-white/10 md:pl-6">
          <div className="text-[10px] text-gray-400 font-semibold mb-2 uppercase tracking-wider">建议行动</div>
          <div className={`text-xs p-3 rounded-lg leading-relaxed border ${
            activeNode.sentiment === 'negative'
              ? 'text-rose-300 bg-rose-500/10 border-rose-500/20'
              : 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20'
          }`}>
            {activeNode.action}
          </div>
        </div>
      </div>

    </div>
  );
}
