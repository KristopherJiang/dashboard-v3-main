import React from 'react';
import { 
  X, 
  Sparkles, 
  History, 
  AlertTriangle, 
  TrendingDown, 
  Zap, 
  Activity, 
  ChevronRight, 
  Layers, 
  Clock 
} from 'lucide-react';

interface AIAlertDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAlertDrawer: React.FC<AIAlertDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-8 flex justify-between items-start border-b border-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">AI 智能监控中心</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">3 Nodes Monitoring</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <History size={18} />
            </button>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content - Alert List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          
          {/* Alert Card 1: Critical */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-rose-100 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="text-rose-500 w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-gray-900">网络延迟阈值告警</h3>
                  <span className="text-lg font-black text-rose-600">450ms</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md text-[10px] font-bold text-gray-500">
                    <Layers size={10} /> Asia-Pacific
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md text-[10px] font-bold text-gray-500">
                    <Clock size={10} /> 2M
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                  新加坡节点延迟 450ms，触发高优先级阈值告警。
                </p>
                <div className="flex justify-between items-center">
                  <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    Critical
                  </span>
                  <span className="text-[10px] font-bold text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                    查看详情 <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Card 2: Warning */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-amber-100 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                <TrendingDown className="text-amber-500 w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-gray-900">转化率异常下跌</h3>
                  <span className="text-lg font-black text-amber-600">-24%</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md text-[10px] font-bold text-gray-500">
                    <Layers size={10} /> EU-West
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md text-[10px] font-bold text-gray-500">
                    <Clock size={10} /> 15M
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                  德国移动端骤降 24%，检测到支付网关超时。
                </p>
                <div className="flex justify-between items-center">
                  <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    Warning
                  </span>
                  <span className="text-[10px] font-bold text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                    查看详情 <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Card 3: Optimize */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-blue-100 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <Zap className="text-blue-500 w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-gray-900">用户注册异常波动</h3>
                  <span className="text-lg font-black text-blue-600">+163</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md text-[10px] font-bold text-gray-500">
                    <Layers size={10} /> Global
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md text-[10px] font-bold text-gray-500">
                    <Clock size={10} /> 1H
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                  新增 163 人，建议优化新手承接链路。
                </p>
                <div className="flex justify-between items-center">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    Optimize
                  </span>
                  <span className="text-[10px] font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                    查看详情 <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="bg-[#1a1f2e] rounded-2xl p-4 flex items-center justify-between shadow-xl shadow-gray-900/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Activity className="text-indigo-400 w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">AI 智能诊断</div>
                <div className="text-xs font-medium text-white">建议优先处理新加坡节点延迟风险</div>
              </div>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1">
              详情 <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default AIAlertDrawer;
