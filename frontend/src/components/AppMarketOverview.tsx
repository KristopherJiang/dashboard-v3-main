import React, { useState, useEffect } from 'react';
import {
  Target,
  Star,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ThumbsUp,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Calendar,
  ChevronDown,
  Trophy,
  Lightbulb,
  MessageSquare,
  Activity,
  List,
  ChevronUp,
  Clock,
  User,
  X,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { useDashboardContext } from '../lib/DashboardContext';
import { fetchSensorTowerData } from '../lib/sensorTowerApi';

const AppMarketOverview = () => {
  const [platform, setPlatform] = useState('App Store');
  const [trendTab, setTrendTab] = useState('评论量');
  const [selectedComp, setSelectedComp] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const { timeRange, selectedRegion } = useDashboardContext();

  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const negativeReviews = [
    {
      id: 1,
      text: 'App crashes frequently. Very frustrating when trying to close a position.',
      date: '2024-06-28',
      rating: 1,
      tag: '稳定性',
    },
    {
      id: 2,
      text: 'Withdrawal has been pending for 3 days. Support is not answering.',
      date: '2024-06-26',
      rating: 1,
      tag: '出金',
    },
    {
      id: 3,
      text: 'Cannot login since yesterday. Kept saying wrong password but I just reset it.',
      date: '2024-06-25',
      rating: 2,
      tag: '登录',
    },
    {
      id: 4,
      text: 'Charts are lagging significantly during high volatility.',
      date: '2024-06-22',
      rating: 2,
      tag: '行情',
    },
    {
      id: 5,
      text: 'Customer service takes forever to reply. Disappointed.',
      date: '2024-06-20',
      rating: 1,
      tag: '服务',
    },
    {
      id: 6,
      text: 'Terrible execution speed. Slippage is insane compared to other brokers.',
      date: '2024-06-18',
      rating: 1,
      tag: '交易体验',
    },
    {
      id: 7,
      text: 'Verification process is a nightmare. Sent my documents 3 times already.',
      date: '2024-06-15',
      rating: 2,
      tag: '开户',
    },
    {
      id: 8,
      text: 'The new UI update is horrible. The old one was much easier to navigate.',
      date: '2024-06-14',
      rating: 2,
      tag: '易用性',
    },
  ];

  useEffect(() => {
    let active = true;
    const loadRealData = async () => {
      setLoading(true);
      try {
        const rawData = await fetchSensorTowerData(platform as any, selectedRegion, timeRange);
        if (active) {
          const processed = rawData.map((item) => {
            const hasComp = !!selectedComp;
            // Scale and map competitor attributes dynamically
            const variance =
              selectedComp === 'Exness' ? 1.0 : selectedComp === 'TradeMaster' ? 0.8 : 0.7;

            return {
              ...item,
              displayReviews: `${(item.reviews / 1000).toFixed(1)}k`,
              compScore: hasComp
                ? Number(
                    (item.compScore ? item.compScore * variance : item.score * 0.95).toFixed(1),
                  )
                : undefined,
              compDownloads: hasComp
                ? Math.round(
                    item.compDownloads ? item.compDownloads * variance : item.downloads * 1.15,
                  )
                : undefined,
              compReviews: hasComp
                ? Math.round(item.compReviews ? item.compReviews * variance : item.reviews * 1.2)
                : undefined,
            };
          });
          setTrendData(processed);
        }
      } catch (err) {
        console.error('Error loading Sensor Tower data:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadRealData();
    return () => {
      active = false;
    };
  }, [platform, selectedRegion, timeRange, selectedComp]);

  const timeScale =
    {
      today: 0.03,
      yesterday: 0.035,
      thisWeek: 0.21,
      mtd: 1.0,
      lastMonth: 0.95,
      ytd: 4.8,
      last90: 2.9,
      custom: 1.2,
    }[timeRange] || 1.0;

  const rScale: Record<string, number> = {
    GLOBAL: 1.0,
    ASIA_VN: 0.15,
    EU_UK: 0.12,
    ASIA_IN: 0.2,
    MENA_AE: 0.08,
    GS_AU: 0.06,
  };
  const regionScale = rScale[selectedRegion] || 0.04;
  const m = timeScale * regionScale;

  const getChartConfig = () => {
    switch (trendTab) {
      case '下载量':
        return { key: 'downloads', compKey: 'compDownloads', label: 'downloads' };
      case '评分':
        return { key: 'score', compKey: 'compScore', label: 'score' };
      case '评论量':
      default:
        return { key: 'reviews', compKey: 'compReviews', label: 'reviews' };
    }
  };

  const chartConfig = getChartConfig();

  return (
    <div className="h-full bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-md">
            <Target className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">应用市场口碑摘要</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-medium text-gray-500">核心口碑表现与竞品对比</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-semibold">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                Sensor Tower API Live
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
            {['App Store', 'Google Play', 'Trustpilot'].map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${platform === p ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-4">
        {/* Top 2 Cards (After removing Card 3) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-4">
          {/* Card 1: 核心口碑概览 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-1.5 mb-6">
              <span className="text-base font-bold text-gray-900">核心口碑概览</span>
              <Info size={14} className="text-gray-400" />
            </div>

            <div className="flex items-center gap-6 mb-5">
              <div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[44px] font-black text-slate-800 tracking-tighter leading-none">
                    4.7
                  </span>
                  <span className="text-lg font-bold text-gray-400">/ 5.0</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                  ))}
                  <div className="relative">
                    <Star size={18} className="text-amber-400" />
                    <div className="absolute top-0 left-0 overflow-hidden w-[70%]">
                      <Star size={18} className="fill-amber-400 text-amber-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-start pb-2">
                <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm mb-1">
                  <TrendingUp size={16} />
                  <span className="text-base">0.2</span>
                </div>
                <div className="text-[11px] text-gray-400 font-medium">较上月</div>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100 mb-6 mt-2"></div>

            <div className="grid grid-cols-3 gap-0 mb-6 divide-x divide-gray-100">
              <div className="pr-2">
                <div className="text-[11px] text-gray-500 font-medium mb-2">评论总量</div>
                <div className="text-xl font-bold text-slate-800 mb-2">
                  {Math.round(23.5 * m * 10) / 10}k
                </div>
                <div className="flex items-center gap-1 text-emerald-500 text-[11px] font-bold mb-1">
                  <ArrowUpRight size={12} />
                  <span>12%</span>
                </div>
                <div className="text-[10px] text-gray-400 font-medium">较上月</div>
              </div>

              <div className="px-4">
                <div className="text-[11px] text-gray-500 font-medium mb-2">5星占比</div>
                <div className="text-xl font-bold text-slate-800 mb-2">71%</div>
                <div className="flex items-center gap-1 text-emerald-500 text-[11px] font-bold mb-1">
                  <ArrowUpRight size={12} />
                  <span>3%</span>
                </div>
                <div className="text-[10px] text-gray-400 font-medium">较上月</div>
              </div>

              <div className="pl-4">
                <div className="text-[11px] text-gray-500 font-medium mb-2">好评率 (4-5星)</div>
                <div className="text-xl font-bold text-slate-800 mb-2">89%</div>
                <div className="flex items-center gap-1 text-emerald-500 text-[11px] font-bold mb-1">
                  <ArrowUpRight size={12} />
                  <span>2%</span>
                </div>
                <div className="text-[10px] text-gray-400 font-medium">较上月</div>
              </div>
            </div>

            <div className="mt-auto bg-[#f0fcf6] rounded-xl p-3 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm">
                <ThumbsUp size={13} className="text-white fill-white" />
              </div>
              <div className="text-xs text-gray-700 leading-tight font-medium">
                口碑质量领先主要竞品，但评论规模仍有提升
                <span className="text-emerald-500 font-bold">空间</span>。
              </div>
            </div>
          </div>

          {/* Card 2: 评论主题洞察 */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
            <div className="text-sm font-bold text-gray-900 mb-6">
              评论主题洞察 <span className="text-xs text-gray-400 font-normal">(近30天)</span>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-6">
              {/* 正向 */}
              <div>
                <div className="text-[10px] font-bold text-emerald-400 mb-4">正向主题 TOP 3</div>
                <div className="space-y-4">
                  {[
                    { name: '易用性', pct: 28, change: 4, color: 'bg-emerald-400' },
                    { name: '交易体验', pct: 18, change: 2, color: 'bg-emerald-400' },
                    { name: '速度/流畅', pct: 12, change: 1, color: 'bg-emerald-400' },
                  ].map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-700 font-medium">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{item.pct}%</span>
                          <span className="text-[9px] text-emerald-400 font-bold flex items-center">
                            <ArrowUpRight size={10} />
                            {item.change}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${item.pct * 2}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* 负向 */}
              <div>
                <div className="text-[10px] font-bold text-rose-600 mb-4">负向主题 TOP 3</div>
                <div className="space-y-4">
                  {[
                    { name: '应用崩溃', pct: 12, change: 4, color: 'bg-rose-500' },
                    { name: '提现问题', pct: 9, change: 2, color: 'bg-rose-500' },
                    { name: '登录问题', pct: 6, change: 1, color: 'bg-rose-500' },
                  ].map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-700 font-medium">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{item.pct}%</span>
                          <span className="text-[9px] text-rose-500 font-bold flex items-center">
                            <ArrowUpRight size={10} />
                            {item.change}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${item.pct * 4}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 代表性差评原声 - 优化布局 */}
            <div className="mt-auto flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
                  <span className="text-[13px] font-bold text-slate-800">代表性差评原声</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-rose-50 text-rose-500 border border-rose-100 rounded-md font-bold">
                    REVIEWS
                  </span>
                </div>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-700 font-bold bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full transition-colors cursor-pointer group"
                >
                  点击展开更多{' '}
                  <ArrowUpRight
                    size={12}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </button>
              </div>

              <div className="bg-rose-50/20 border border-rose-100/40 rounded-2xl overflow-hidden">
                <div className="h-[100px] overflow-y-auto snap-y snap-mandatory scrollbar-hide p-2 space-y-2">
                  {negativeReviews.slice(0, 5).map((review) => (
                    <div
                      key={review.id}
                      className="snap-start bg-white border border-rose-100/50 rounded-xl p-3 shadow-sm hover:border-rose-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <p className="text-xs text-slate-700 leading-relaxed font-medium italic">
                            "{review.text}"
                          </p>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-1">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={8}
                                className={
                                  i < review.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-slate-200 text-slate-200'
                                }
                              />
                            ))}
                          </div>
                          <span className="text-[9px] px-1 bg-rose-50 text-rose-400 font-bold border border-rose-100/50 rounded">
                            {review.tag}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center">
                            <User size={10} className="text-slate-400" />
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold">匿名用户</span>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-slate-400">
                          <Clock size={10} />
                          {review.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Review Overlay (Localized Modal) */}
            {isReviewModalOpen && (
              <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200">
                {/* Overlay Header */}
                <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100 bg-white relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0 border border-rose-100/50">
                      <AlertCircle size={14} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 leading-none mb-1">
                        全部代表性差评原声
                      </h3>
                      <p className="text-[10px] text-gray-400 font-medium leading-none">
                        Representative Negative Reviews
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsReviewModalOpen(false)}
                    className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0 group"
                  >
                    <X size={14} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                {/* Overlay Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/50">
                  {negativeReviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm rounded-xl p-4 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <p className="text-xs text-gray-800 leading-relaxed font-medium">
                            "{review.text}"
                          </p>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-1.5">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={10}
                                className={
                                  i < review.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-slate-100 text-slate-200'
                                }
                              />
                            ))}
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 bg-rose-50 text-rose-500 font-bold border border-rose-100/50 rounded">
                            {review.tag}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-50 pt-2.5">
                        <div className="flex items-center gap-1.5 line-clamp-1">
                          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                            <User size={10} className="text-slate-400" />
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium">匿名用户</span>
                          <span className="text-slate-200 mx-0.5">|</span>
                          <span className="text-[10px] text-slate-500 font-medium">{platform}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0">
                          <Clock size={10} />
                          {review.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Analysis Section (Always Expanded) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          {/* Trend Chart */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-sm font-bold text-gray-900">{trendTab}趋势</span>
                {selectedComp && (
                  <div className="flex items-center gap-3 mt-2 text-[10px] font-bold">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>{' '}
                      <span className="text-gray-600">Vantage</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>{' '}
                      <span className="text-gray-600">{selectedComp}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
                {['评论量', '评分', '下载量'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTrendTab(t)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-colors ${trendTab === t ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end gap-6 mb-6">
              <div className="text-3xl font-black text-gray-900 tracking-tight">23.5k</div>
              <div className="flex gap-4 pb-1">
                <div>
                  <div className="flex items-center gap-0.5 text-emerald-400 text-xs font-bold">
                    <ArrowUpRight size={12} /> 12%
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">较上月</div>
                </div>
                <div>
                  <div className="flex items-center gap-0.5 text-emerald-400 text-xs font-bold">
                    <ArrowUpRight size={12} /> 48%
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">较去年同期</div>
                </div>
                <div className="border-l border-gray-100 pl-4">
                  <div className="text-[10px] text-gray-500 mb-0.5">vs 竞品均值</div>
                  <div className="text-rose-500 text-xs font-bold">-8%</div>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 20, right: 10, left: -5, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                    domain={['auto', 'auto']}
                    tickFormatter={(val) => {
                      if (trendTab === '评分') return val.toFixed(1);
                      if (val >= 1000000) return (val / 1000000).toFixed(1) + 'm';
                      if (val >= 1000) return (val / 1000).toFixed(0) + 'k';
                      return val;
                    }}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 'bold' }}
                    dy={10}
                  />
                  <Tooltip
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1.5 }}
                    content={(props: any) => {
                      if (props.active && props.payload && props.payload.length) {
                        const isScore = trendTab === '评分';
                        const formatVal = (val: number) => {
                          if (isScore) return val.toFixed(1);
                          if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
                          return val;
                        };
                        return (
                          <div className="bg-white p-3.5 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 min-w-[140px]">
                            <div className="text-[11px] font-bold text-slate-400 mb-2.5 pb-2 border-b border-slate-50 uppercase tracking-widest">
                              {props.label} · {trendTab}
                            </div>
                            <div className="space-y-2">
                              {props.payload.map((entry: any, index: number) => {
                                const isComp = entry.dataKey.startsWith('comp');
                                const name = isComp && selectedComp ? selectedComp : 'Vantage';
                                const color = isComp ? '#8b5cf6' : '#34d399';
                                return (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center gap-6"
                                  >
                                    <div className="flex items-center gap-1.5">
                                      <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: color }}
                                      ></div>
                                      <span className="text-xs font-bold text-slate-600">
                                        {name}
                                      </span>
                                    </div>
                                    <span className="text-sm font-black text-slate-900">
                                      {formatVal(entry.value)}
                                    </span>
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

                  {/* Competitor Trend Line (if selected) */}
                  {selectedComp && (
                    <Area
                      type="monotone"
                      dataKey={chartConfig.compKey}
                      stroke="#8b5cf6" // purple for competitor
                      strokeWidth={2}
                      fillOpacity={0.1}
                      fill="#8b5cf6"
                      activeDot={{ r: 5, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* Vantage Trend Line */}
                  <Area
                    type="monotone"
                    dataKey={chartConfig.key}
                    stroke="#34d399"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorGreen)"
                    activeDot={{ r: 6, fill: '#34d399', stroke: '#fff', strokeWidth: 3 }}
                  >
                    {trendTab === '评论量' && !selectedComp && (
                      <LabelList
                        dataKey="displayReviews"
                        position="top"
                        offset={10}
                        style={{ fontSize: '10px', fill: '#475569', fontWeight: 'bold' }}
                      />
                    )}
                  </Area>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Theme Insights */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex flex-col mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-50 rounded flex items-center justify-center">
                  <List size={14} className="text-emerald-400" />
                </div>
                <span className="text-sm font-bold text-gray-900">竞品对比</span>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 ml-8">
                点击下方竞品可将数据添加至左侧趋势图进行多维对比分析
              </span>
            </div>

            <div className="flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="pb-3 text-[10px] font-bold text-gray-400 font-medium">应用</th>
                    <th className="pb-3 text-[10px] font-bold text-gray-400 font-medium text-right">
                      评分 (/5.0)
                    </th>
                    <th className="pb-3 text-[10px] font-bold text-gray-400 font-medium text-right">
                      评论总量
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    {
                      name: 'Vantage',
                      isSelf: true,
                      logo: 'V',
                      rating: 4.7,
                      ratingChange: 0.2,
                      reviews: '23.5k',
                      reviewsChange: 12,
                    },
                    {
                      name: 'Exness',
                      isSelf: false,
                      logo: 'EX',
                      rating: 4.5,
                      ratingChange: 0.1,
                      reviews: '28.9k',
                      reviewsChange: 18,
                    },
                    {
                      name: 'TradeMaster',
                      isSelf: false,
                      logo: 'TM',
                      rating: 4.4,
                      ratingChange: -0.1,
                      reviews: '19.8k',
                      reviewsChange: 5,
                    },
                    {
                      name: 'MetaNext',
                      isSelf: false,
                      logo: 'MN',
                      rating: 4.6,
                      ratingChange: 0.3,
                      reviews: '15.6k',
                      reviewsChange: 8,
                    },
                  ].map((comp, idx) => (
                    <tr
                      key={comp.name}
                      onClick={() =>
                        !comp.isSelf &&
                        setSelectedComp(selectedComp === comp.name ? null : comp.name)
                      }
                      className={`group ${!comp.isSelf ? 'cursor-pointer hover:bg-slate-50' : ''} ${selectedComp === comp.name ? 'bg-purple-50/50' : ''}`}
                    >
                      <td className="py-2.5 rounded-l-lg pl-2">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${comp.isSelf ? 'bg-gray-900' : comp.name === 'Exness' ? 'bg-amber-500' : comp.name === 'TradeMaster' ? 'bg-blue-600' : 'bg-purple-600'} ${selectedComp === comp.name ? 'ring-2 ring-purple-200 ring-offset-1' : ''}`}
                          >
                            {comp.logo}
                          </div>
                          <span
                            className={`text-xs font-bold ${selectedComp === comp.name ? 'text-purple-700' : 'text-gray-900'}`}
                          >
                            {comp.name}
                          </span>
                          {comp.isSelf && (
                            <span className="text-[9px] text-gray-400 leading-none ml-0.5">
                              (本应用)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-xs font-bold text-gray-900">{comp.rating}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-right rounded-r-lg pr-2">
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-xs font-bold text-gray-900">{comp.reviews}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppMarketOverview;
