import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, MapPin, Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDashboardContext, RegionKey } from '../lib/DashboardContext';

// Define regions and countries structure based on the provided explicit data
const REGION_STRUCTURE = [
  {
    id: 'Global',
    label: 'Global',
    countries: [{ id: 'GLOBAL', name: '全球聚合视角', en: 'Worldwide' }]
  },
  {
    id: 'Asia',
    label: 'Asia',
    countries: [
      { id: 'ASIA_IN', name: '印度', en: 'India' },
      { id: 'ASIA_PH', name: '菲律宾', en: 'Philippines' },
      { id: 'ASIA_VN', name: '越南', en: 'Vietnam', isHot: true },
      { id: 'ASIA_PK', name: '巴基斯坦', en: 'Pakistan' },
      { id: 'ASIA_ID', name: '印度尼西亚', en: 'Indonesia' },
      { id: 'ASIA_MY', name: '马来西亚', en: 'Malaysia' },
      { id: 'ASIA_TH', name: '泰国', en: 'Thailand' },
      { id: 'ASIA_KR', name: '韩国', en: 'South Korea' },
      { id: 'ASIA_BD', name: '孟加拉国', en: 'Bangladesh' },
      { id: 'ASIA_UZ', name: '乌兹别克斯坦', en: 'Uzbekistan' },
      { id: 'ASIA_JP', name: '日本', en: 'Japan' },
      { id: 'ASIA_NP', name: '尼泊尔', en: 'Nepal' },
      { id: 'ASIA_HK', name: '中国香港', en: 'Hong Kong' },
      { id: 'ASIA_TJ', name: '塔吉克斯坦', en: 'Tajikistan' },
      { id: 'ASIA_KH', name: '柬埔寨', en: 'Cambodia' },
      { id: 'ASIA_RU', name: '俄罗斯', en: 'Russia' },
      { id: 'ASIA_TM', name: '土库曼斯坦', en: 'Turkmenistan' },
      { id: 'ASIA_KG', name: '吉尔吉斯斯坦', en: 'Kyrgyzstan' },
      { id: 'ASIA_TW', name: '中国台湾', en: 'Taiwan' },
    ]
  },
  {
    id: 'EU',
    label: 'EU',
    countries: [
      { id: 'EU_UK', name: '英国', en: 'UK', isHot: true },
      { id: 'EU_DE', name: '德国', en: 'Germany' },
      { id: 'EU_FR', name: '法国', en: 'France' },
      { id: 'EU_NL', name: '荷兰', en: 'Netherlands' },
      { id: 'EU_ES', name: '西班牙', en: 'Spain' },
      { id: 'EU_IT', name: '意大利', en: 'Italy' },
      { id: 'EU_PL', name: '波兰', en: 'Poland' },
      { id: 'EU_BE', name: '比利时', en: 'Belgium' },
      { id: 'EU_IE', name: '爱尔兰', en: 'Ireland' },
      { id: 'EU_CH', name: '瑞士', en: 'Switzerland' },
      { id: 'EU_BG', name: '保加利亚', en: 'Bulgaria' },
      { id: 'EU_SE', name: '瑞典', en: 'Sweden' },
      { id: 'EU_NO', name: '挪威', en: 'Norway' },
      { id: 'EU_AT', name: '奥地利', en: 'Austria' },
      { id: 'EU_PT', name: '葡萄牙', en: 'Portugal' },
      { id: 'EU_GR', name: '希腊', en: 'Greece' },
      { id: 'EU_DK', name: '丹麦', en: 'Denmark' },
      { id: 'EU_HU', name: '匈牙利', en: 'Hungary' },
      { id: 'EU_LT', name: '立陶宛', en: 'Lithuania' },
      { id: 'EU_FI', name: '芬兰', en: 'Finland' },
      { id: 'EU_SK', name: '斯洛伐克', en: 'Slovakia' },
      { id: 'EU_EE', name: '爱沙尼亚', en: 'Estonia' },
      { id: 'EU_HR', name: '克罗地亚', en: 'Croatia' },
      { id: 'EU_LU', name: '卢森堡', en: 'Luxembourg' },
    ]
  },
  {
    id: 'Latam',
    label: 'Latam',
    countries: [
      { id: 'LATAM_CO', name: '哥伦比亚', en: 'Colombia' },
      { id: 'LATAM_BR', name: '巴西', en: 'Brazil' },
      { id: 'LATAM_EC', name: '厄瓜多尔', en: 'Ecuador' },
      { id: 'LATAM_AR', name: '阿根廷', en: 'Argentina' },
      { id: 'LATAM_MX', name: '墨西哥', en: 'Mexico' },
      { id: 'LATAM_PE', name: '秘鲁', en: 'Peru' },
      { id: 'LATAM_CL', name: '智利', en: 'Chile' },
      { id: 'LATAM_BO', name: '玻利维亚', en: 'Bolivia' },
    ]
  },
  {
    id: 'Mena',
    label: 'Mena',
    countries: [
      { id: 'MENA_AE', name: '阿联酋', en: 'UAE', isHot: true },
      { id: 'MENA_MA', name: '摩洛哥', en: 'Morocco' },
      { id: 'MENA_SA', name: '沙特阿拉伯', en: 'Saudi Arabia' },
      { id: 'MENA_QA', name: '卡塔尔', en: 'Qatar' },
      { id: 'MENA_IL', name: '以色列', en: 'Israel' },
      { id: 'MENA_EG', name: '埃及', en: 'Egypt' },
      { id: 'MENA_KW', name: '科威特', en: 'Kuwait' },
      { id: 'MENA_JO', name: '约旦', en: 'Jordan' },
      { id: 'MENA_DZ', name: '阿尔及利亚', en: 'Algeria' },
      { id: 'MENA_TR', name: '土耳其', en: 'Turkey' },
      { id: 'MENA_OM', name: '阿曼', en: 'Oman' },
    ]
  },
  {
    id: 'Africa',
    label: 'Africa',
    countries: [
      { id: 'AFRICA_NG', name: '尼日利亚', en: 'Nigeria' },
      { id: 'AFRICA_ZA', name: '南非', en: 'South Africa' },
      { id: 'AFRICA_KE', name: '肯尼亚', en: 'Kenya' },
      { id: 'AFRICA_GH', name: '加纳', en: 'Ghana' },
      { id: 'AFRICA_UG', name: '乌干达', en: 'Uganda' },
    ]
  },
  {
    id: 'GS-Others',
    label: 'GS-Others',
    countries: [
      { id: 'GS_PF', name: '法属波利尼西亚', en: 'French Polynesia' },
      { id: 'GS_AU', name: '澳大利亚', en: 'Australia', isHot: true },
      { id: 'GS_NZ', name: '新西兰', en: 'New Zealand' }
    ]
  }
];

// Focus targets exclusively based on red text logic
const FAVORITES = [
  { id: 'GLOBAL', label: '全球大盘', sub: 'Global' },
  { id: 'ASIA_VN', label: '越南', sub: 'Vietnam', isHot: true },
  { id: 'EU_UK', label: '英国', sub: 'UK', isHot: true },
  { id: 'MENA_AE', label: '阿联酋', sub: 'UAE', isHot: true },
  { id: 'GS_AU', label: '澳大利亚', sub: 'Australia', isHot: true },
];

const GlobalRegionPicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('Asia');
  const { selectedRegion, setSelectedRegion } = useDashboardContext();
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to find the current label
  const getCurrentLabel = () => {
    for (const r of REGION_STRUCTURE) {
      const c = r.countries.find(c => c.id === selectedRegion);
      if (c) return c.name === '全球聚合视角' ? 'Global' : c.name;
    }
    return 'Global';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeRegionData = REGION_STRUCTURE.find(r => r.id === activeTab) || REGION_STRUCTURE[1];

  return (
    <div className="relative" ref={containerRef}>
      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-800 shadow-sm hover:border-gray-300 hover:shadow-md transition-all group"
      >
        <div className="bg-gray-50 p-1.5 rounded-lg group-hover:bg-gray-100 transition-colors">
          <MapPin className="w-4 h-4 text-gray-500" />
        </div>
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">地区维度</span>
          <span className="text-[13px]">{getCurrentLabel()}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute right-0 top-full mt-2 w-[740px] bg-white border border-gray-100 shadow-2xl rounded-2xl z-[100] flex h-[480px] overflow-hidden"
          >
            {/* Column 1: Favorites (重点国家) */}
            <div className="w-[160px] bg-slate-50/50 border-r border-gray-100 p-3 flex flex-col shrink-0">
              <div className="px-3 py-2 mb-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-1.5">
                  常用重点国家
                </span>
              </div>
              <div className="space-y-1 overflow-y-auto pr-1 pb-4 flex-1 custom-scrollbar">
                {FAVORITES.map((fav) => (
                  <button
                    key={fav.id}
                    onClick={() => {
                      setSelectedRegion(fav.id as RegionKey);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                      selectedRegion === fav.id 
                      ? 'bg-gray-900 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex flex-col items-start leading-none relative w-full">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold">{fav.label}</span>
                        {selectedRegion === fav.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`text-[8px] uppercase tracking-tighter ${selectedRegion === fav.id ? 'text-gray-300' : 'text-gray-400'}`}>
                          {fav.sub}
                        </span>
                        {fav.isHot && !selectedRegion && (
                          <span className="relative flex h-1.5 w-1.5 ml-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: Region Main Menu (Tier 1) */}
            <div className="w-[150px] bg-white border-r border-gray-100 p-3 h-full flex flex-col shrink-0 overflow-y-auto">
              <div className="px-3 py-2 mb-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-1.5">
                  主目录
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {REGION_STRUCTURE.map(r => {
                  const isCurrentTab = activeTab === r.id;
                  const isGlobalSelected = r.id === 'Global' && selectedRegion === 'GLOBAL';
                  
                  return (
                    <button 
                       key={r.id}
                       onMouseEnter={() => setActiveTab(r.id)}
                       onClick={() => {
                           setActiveTab(r.id);
                           // Special case: Global is a valid selection, but others are just tabs
                           if (r.id === 'Global') {
                               setSelectedRegion('GLOBAL');
                               setIsOpen(false);
                           }
                       }}
                       className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                         isGlobalSelected
                         ? 'bg-gray-900 text-white shadow-md' 
                         : isCurrentTab 
                           ? 'bg-indigo-50 text-indigo-700' 
                           : 'text-gray-700 hover:bg-gray-50'
                       }`}
                    >
                       <span className="flex items-center gap-2">
                         {r.label}
                         {isGlobalSelected && <Check size={12} className="text-emerald-400" />}
                       </span>
                       <ChevronRight size={14} className={`transition-opacity ${isGlobalSelected ? 'opacity-0' : isCurrentTab ? 'opacity-100 text-indigo-400' : 'opacity-0'}`} />
                    </button>
                  );
                })}
            </div>
            </div>

            {/* Column 3: Countries Grid (Tier 2) */}
            <div className="flex-1 p-5 overflow-y-auto custom-scrollbar bg-slate-50/30">
              {activeTab === 'Global' ? (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-80 pt-10">
                    <Globe size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-lg font-black text-gray-800">全域聚合视角</h3>
                    <p className="text-xs text-gray-500 mt-2 max-w-[200px]">点击即可直接选中全球数据作为汇总参考盘。</p>
                 </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                     <h4 className="text-sm font-black tracking-tight text-gray-900 border-b-2 border-indigo-500 pb-2 -mb-[9px]">{activeRegionData.label} 地区</h4>
                     <span className="text-xs text-gray-400 font-medium">共 {activeRegionData.countries.length} 个地区</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                     {activeRegionData.countries.map(country => {
                       const isActive = selectedRegion === country.id;
                       return (
                         <button
                           key={country.id}
                           onClick={() => {
                               setSelectedRegion(country.id as RegionKey);
                               setIsOpen(false);
                           }}
                           className={`relative flex flex-col items-start p-2.5 rounded-xl text-left transition-all border ${
                             isActive 
                             ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                             : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                           }`}
                         >
                           <span className={`text-xs font-bold leading-none ${isActive ? 'text-indigo-700' : 'text-gray-700'}`}>
                             {country.name}
                           </span>
                           <span className={`text-[9px] mt-1 tracking-tight ${isActive ? 'text-indigo-400' : 'text-gray-400'}`}>
                             {country.en}
                           </span>
                           {isActive && (
                               <div className="absolute top-2 right-2 flex items-center justify-center w-3.5 h-3.5 bg-indigo-600 rounded-full">
                                   <Check size={8} className="text-white" strokeWidth={4} />
                               </div>
                           )}
                         </button>
                       );
                     })}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalRegionPicker;
