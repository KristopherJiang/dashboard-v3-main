import { Check, ChevronDown, ChevronRight, Globe, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { fetchRegions } from "../lib/api";
import type { RegionKey } from "../lib/DashboardContext";
import { useDashboardContext } from "../lib/DashboardContext";
import { useStaticApi } from "../lib/hooks/useApi";

const GlobalRegionPicker = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<string>("ASIA");
	const { selectedRegion, setSelectedRegion } = useDashboardContext();
	const containerRef = useRef<HTMLDivElement>(null);
	const { data: regionsData } = useStaticApi(fetchRegions);

	const regionStructure = regionsData?.regions || [];
	const favorites = regionsData?.favorites || [];

	const getCurrentLabel = () => {
		for (const r of regionStructure) {
			const c = r.countries.find((c) => c.id === selectedRegion);
			if (c) return c.name === "全球聚合视角" ? "Global" : c.name;
		}
		return "Global";
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const activeRegionData =
		regionStructure.find((r) => r.id === activeTab) || regionStructure[1];

	return (
		<div className="relative" ref={containerRef}>
			{/* Main Trigger Button */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-800 shadow-sm hover:border-gray-300 hover:shadow-md transition-all group"
			>
				<div className="bg-gray-50 p-1.5 rounded-lg group-hover:bg-gray-100 transition-colors">
					<MapPin className="w-4 h-4 text-gray-500" />
				</div>
				<div className="flex flex-col items-start leading-tight">
					<span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">
						地区维度
					</span>
					<span className="text-[13px]">{getCurrentLabel()}</span>
				</div>
				<ChevronDown
					className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{/* Popover */}
			<AnimatePresence mode="wait">
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 10, scale: 0.95 }}
						animate={{ opacity: 1, y: 5, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.95 }}
						transition={{ type: "spring", damping: 20, stiffness: 300 }}
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
								{favorites.map((fav) => (
									<button
										type="button"
										key={fav.id}
										onClick={() => {
											setSelectedRegion(fav.id as RegionKey);
											setIsOpen(false);
										}}
										className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
											selectedRegion === fav.id
												? "bg-gray-900 text-white shadow-lg"
												: "text-gray-600 hover:bg-gray-100"
										}`}
									>
										<div className="flex flex-col items-start leading-none relative w-full">
											<div className="flex items-center justify-between w-full">
												<span className="text-xs font-bold">{fav.label}</span>
												{selectedRegion === fav.id && (
													<Check className="w-3.5 h-3.5 text-emerald-400" />
												)}
											</div>
											<div className="flex items-center gap-1 mt-1">
												<span
													className={`text-[8px] uppercase tracking-tighter ${selectedRegion === fav.id ? "text-gray-300" : "text-gray-400"}`}
												>
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
								{regionStructure.map((r) => {
									const isCurrentTab = activeTab === r.id;
									const isGlobalSelected =
										r.id === "Global" && selectedRegion === "GLOBAL";

									return (
										<button
											type="button"
											key={r.id}
											onMouseEnter={() => setActiveTab(r.id)}
											onClick={() => {
												setActiveTab(r.id);
												// Special case: Global is a valid selection, but others are just tabs
												if (r.id === "Global") {
													setSelectedRegion("GLOBAL");
													setIsOpen(false);
												}
											}}
											className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
												isGlobalSelected
													? "bg-gray-900 text-white shadow-md"
													: isCurrentTab
														? "bg-indigo-50 text-indigo-700"
														: "text-gray-700 hover:bg-gray-50"
											}`}
										>
											<span className="flex items-center gap-2">
												{r.label}
												{isGlobalSelected && (
													<Check size={12} className="text-emerald-400" />
												)}
											</span>
											<ChevronRight
												size={14}
												className={`transition-opacity ${isGlobalSelected ? "opacity-0" : isCurrentTab ? "opacity-100 text-indigo-400" : "opacity-0"}`}
											/>
										</button>
									);
								})}
							</div>
						</div>

						{/* Column 3: Countries Grid (Tier 2) */}
						<div className="flex-1 p-5 overflow-y-auto custom-scrollbar bg-slate-50/30">
							{activeTab === "Global" ? (
								<div className="h-full flex flex-col items-center justify-center text-center opacity-80 pt-10">
									<Globe size={48} className="text-gray-300 mb-4" />
									<h3 className="text-lg font-black text-gray-800">
										全域聚合视角
									</h3>
									<p className="text-xs text-gray-500 mt-2 max-w-[200px]">
										点击即可直接选中全球数据作为汇总参考盘。
									</p>
								</div>
							) : (
								<>
									<div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
										<h4 className="text-sm font-black tracking-tight text-gray-900 border-b-2 border-indigo-500 pb-2 -mb-[9px]">
											{activeRegionData.label} 地区
										</h4>
										<span className="text-xs text-gray-400 font-medium">
											共 {activeRegionData.countries.length} 个地区
										</span>
									</div>

									<div className="grid grid-cols-2 gap-2">
										{activeRegionData.countries.map((country) => {
											const isActive = selectedRegion === country.id;
											return (
												<button
													type="button"
													key={country.id}
													onClick={() => {
														setSelectedRegion(country.id as RegionKey);
														setIsOpen(false);
													}}
													className={`relative flex flex-col items-start p-2.5 rounded-xl text-left transition-all border ${
														isActive
															? "bg-indigo-50 border-indigo-200 shadow-sm"
															: "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
													}`}
												>
													<span
														className={`text-xs font-bold leading-none ${isActive ? "text-indigo-700" : "text-gray-700"}`}
													>
														{country.name}
													</span>
													<span
														className={`text-[9px] mt-1 tracking-tight ${isActive ? "text-indigo-400" : "text-gray-400"}`}
													>
														{country.en}
													</span>
													{isActive && (
														<div className="absolute top-2 right-2 flex items-center justify-center w-3.5 h-3.5 bg-indigo-600 rounded-full">
															<Check
																size={8}
																className="text-white"
																strokeWidth={4}
															/>
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
