import React, { useState } from 'react';
import KPICards from './components/KPICards';
import ChannelEfficiencyMatrix from './components/ChannelEfficiencyMatrix';
import UserDistributionSunburst from './components/UserDistributionSunburst';
import AcquisitionEfficiency from './components/AcquisitionEfficiency';
import Reputation from './components/Reputation';
import AIDiagnosticModal from './components/AIDiagnosticModal';
import WebsiteHealthMonitor from './components/WebsiteHealthMonitor';
import AppMarketOverview from './components/AppMarketOverview';
import GlobalIntelligence from './components/GlobalIntelligence';
import MarketCommand from './components/MarketCommand';
import AIAlertDrawer from './components/AIAlertDrawer';
import CLevelTimePicker from './components/CLevelTimePicker';
import GlobalRegionPicker from './components/GlobalRegionPicker';
import { Calendar, Bell, Sparkles } from 'lucide-react';
import { DashboardProvider } from './lib/DashboardContext';

function DashboardContent() {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <header className="sticky top-0 md:top-4 z-[90] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 backdrop-blur-lg p-4 rounded-xl shadow-sm border border-gray-100/50">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Copilot Data Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Real-time marketing performance & user insights</p>
          </div>
          
          <div className="flex items-center gap-3">
            <GlobalRegionPicker />
            <CLevelTimePicker />
            <button 
              onClick={() => setIsAlertDrawerOpen(true)}
              className="relative p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-white"></span>
              </span>
            </button>
            <button 
              onClick={() => setIsAIModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>智能分析</span>
            </button>
          </div>
        </header>

        {/* KPI Cards */}
        <section>
          <KPICards />
        </section>

        {/* Main Charts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* User Distribution Sunburst takes 5 units (41.6%) */}
          <div className="lg:col-span-5 w-full">
            <UserDistributionSunburst />
          </div>
          {/* Channel Efficiency Matrix takes 7 units (58.3%) */}
          <div className="lg:col-span-7 w-full">
            <ChannelEfficiencyMatrix />
          </div>
        </section>

        {/* Bottom Grid 1 */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 w-full">
            <Reputation />
          </div>
          <div className="lg:col-span-3 w-full">
            <AcquisitionEfficiency />
          </div>
        </section>

        {/* Bottom Grid 2 */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 w-full">
            <WebsiteHealthMonitor />
          </div>
          <div className="lg:col-span-2 w-full">
            <AppMarketOverview />
          </div>
        </section>

        {/* Bottom Grid 3 */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 w-full">
            <GlobalIntelligence />
          </div>
          <div className="lg:col-span-2 w-full">
            <MarketCommand />
          </div>
        </section>

      </div>

      <AIDiagnosticModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
      <AIAlertDrawer isOpen={isAlertDrawerOpen} onClose={() => setIsAlertDrawerOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
