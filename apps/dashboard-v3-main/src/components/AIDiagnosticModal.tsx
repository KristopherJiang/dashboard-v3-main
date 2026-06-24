import React, { useState, useEffect } from 'react';
import { X, Sparkles, Download, Loader2, Bot } from 'lucide-react';

interface AIDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIDiagnosticModal: React.FC<AIDiagnosticModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [displayedText, setDisplayedText] = useState('');

  const fullText = `以下是基于底层数据的诊断报告：

### 1. 执行摘要 (Executive Summary)
目前的获客结构极度扭曲：你们正以 4 倍于自然流量的成本（ASA）去购买一群几乎没有生命周期的“垃圾用户”。**如果下季度不立即砍掉低效的付费投放并重注 RAF 与 IB 渠道，你们的 LTV 增长速度将永远赶不上预算流失的速度。**

---

### 2. 三个核心观察 (Core Observations)

#### ① ASA：昂贵的获客自杀行为
**数据事实：** ASA (Apple) 的 FTD CAC 高达 **145**，是所有渠道中最高的，而其 LTV 仅为 **2.1**（全场最低）。`;

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setDisplayedText('');
      // 模拟 AI 处理时间
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 打字机效果
  useEffect(() => {
    if (!isLoading && isOpen) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) {
          clearInterval(interval);
        }
      }, 20); // 打字速度
      return () => clearInterval(interval);
    }
  }, [isLoading, isOpen, fullText]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* 毛玻璃背景遮罩 */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* 弹窗主体 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-[#111827] text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-lg tracking-wide">AI 深度战略诊断报告</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 min-h-[400px] max-h-[65vh] overflow-y-auto bg-[#FAFAFA]">
          {isLoading ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center space-y-6 text-slate-500">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl animate-pulse opacity-30"></div>
                <div className="bg-white p-4 rounded-full shadow-lg relative z-10">
                  <Bot className="w-10 h-10 text-indigo-600 animate-bounce" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-indigo-600 font-bold">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>AI 正在深度扫描全渠道数据与归因链路...</span>
                </div>
                <p className="text-xs text-slate-400">正在生成执行摘要与风险预警</p>
              </div>
            </div>
          ) : (
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium text-[16px] tracking-wide">
              {displayedText}
              <span className="inline-block w-2 h-5 ml-1 bg-indigo-500 animate-pulse align-middle"></span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-100 px-6 py-4 flex justify-end items-center gap-6">
          <button 
            onClick={onClose}
            className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            关闭
          </button>
          <button 
            disabled={isLoading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              isLoading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-[#111827] text-white hover:bg-slate-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
            }`}
          >
            <Download className="w-4 h-4" />
            下载完整版诊断报告 (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIDiagnosticModal;
