
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AgentType, Domain } from './types';
import { translations } from './translations';
import { DomainProvider, useDomainContext } from './context/DomainContext';
import { useMasterBrain } from './hooks/useMasterBrain';

// Optimized Hubs
import IntelligenceHub from './components/hubs/IntelligenceHub';
import AcquisitionDesk from './components/hubs/AcquisitionDesk';
import OperationsHub from './components/hubs/OperationsHub';
import LiquidationEngine from './components/hubs/LiquidationEngine';
import ExecutiveSuite from './components/hubs/ExecutiveSuite';

// Core UI
import CommandPalette from './components/CommandPalette';
import AgentReasoningLab from './components/AgentReasoningLab';
import SonnerNotification from './components/SonnerNotification';
import TickerTape from './components/TickerTape';

const AppContent: React.FC = () => {
  const { 
    domains, setDomains, integrations, stats, notifications, 
    dismissNotification, addLog, connectService, strategy
  } = useDomainContext();
  
  const [lang, setLang] = useState<'ar' | 'en'>(() => (globalThis.localStorage?.getItem('ist_lang') as 'ar' | 'en') || 'ar');
  const [activeTab, setActiveTab] = useState<AgentType>(AgentType.INTELLIGENCE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inspectedDomain, setInspectedDomain] = useState<Domain | null>(null);

  const { isScanning, initiateScan } = useMasterBrain(strategy, lang);
  const t = translations[lang];

  useEffect(() => {
    globalThis.localStorage?.setItem('ist_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const menuItems = useMemo(() => [
    { id: 'm1', type: AgentType.INTELLIGENCE, icon: 'fa-brain', label: t.intelligence },
    { id: 'm2', type: AgentType.ACQUISITION, icon: 'fa-crosshairs', label: t.acquisition },
    { id: 'm3', type: AgentType.OPERATIONS, icon: 'fa-layer-group', label: t.operations },
    { id: 'm4', type: AgentType.LIQUIDATION, icon: 'fa-money-bill-wave', label: t.liquidation },
    { id: 'm5', type: AgentType.MANAGEMENT, icon: 'fa-file-signature', label: t.management }
  ], [t]);

  return (
    <div className="app-shell relative bg-[#0a0a0c] selection:bg-[#c5a059]/30">
      <CommandPalette setActiveTab={setActiveTab} onSearchDomain={(name) => {
        const d = domains.find(x => x.name === name);
        if (d) setInspectedDomain(d);
      }} />
      
      {inspectedDomain && <AgentReasoningLab domain={inspectedDomain} lang={lang} onClose={() => setInspectedDomain(null)} />}
      
      {/* Precision Sidebar */}
      <aside 
        style={{ gridArea: 'sidebar' }}
        className={`z-sidebar bg-[#111113] border-white/5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isSidebarOpen ? 'translate-x-0 w-full lg:w-[var(--sidebar-width)]' : '-translate-x-full lg:translate-x-0 w-[var(--sidebar-width)]'} 
          fixed lg:static top-0 bottom-0 ${lang === 'ar' ? 'right-0 border-l' : 'left-0 border-r'} 
        `}
      >
        <div className="p-10 lg:p-14 flex flex-col h-full">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-5">
              <div className="icon-box bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059]">
                <i className="fas fa-cube text-xl"></i>
              </div>
              <span className="text-[12px] font-black tracking-[0.5em] text-white uppercase italic">Isthmic</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-white p-2">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <nav className="flex-1 space-y-4">
            {menuItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.type); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl transition-all group relative
                  ${activeTab === item.type 
                    ? 'bg-white/5 text-white border border-white/10' 
                    : 'text-slate-500 hover:text-white hover:bg-white/[0.02]'}`}
              >
                <i className={`fas ${item.icon} text-sm ${activeTab === item.type ? 'text-[#c5a059]' : ''}`}></i>
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-8 border-t border-white/5">
            <button onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')} className="w-full py-4 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-all">
              {lang === 'ar' ? 'Atelier: EN' : 'أتيلييه: AR'}
            </button>
          </div>
        </div>
      </aside>
      
      {/* Fixed Header */}
      <header 
        style={{ gridArea: 'header' }}
        className="z-header flex items-center justify-between px-10 lg:px-14 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-xl"
      >
        <div className="flex items-center gap-8">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden icon-box bg-white/5 text-slate-400">
             <i className="fas fa-bars"></i>
          </button>
          <div className="hidden sm:flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span className="opacity-40">Precision_v7.2</span>
            <i className="fas fa-chevron-right text-[8px] opacity-10"></i>
            <span className="text-white prestige-heading text-lg">{menuItems.find(i => i.type === activeTab)?.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="hidden md:flex flex-col items-end">
              <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">{t.estimatedValue}</div>
              <div className="text-xl font-light text-white prestige-heading">$ {stats.estimatedPortfolioValue.toLocaleString()}</div>
           </div>
           <div className="icon-box bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059]">
              <i className="fas fa-user-shield"></i>
           </div>
        </div>
      </header>
      
      {/* Scrollable Main Stage */}
      <main 
        style={{ gridArea: 'main' }}
        className="content-scroller no-scrollbar"
      >
        <div className="max-w-[1600px] mx-auto animate-precision">
          {activeTab === AgentType.INTELLIGENCE && <IntelligenceHub stats={stats} lang={lang} onInitiateScan={initiateScan} isScanning={isScanning} />}
          {activeTab === AgentType.ACQUISITION && <AcquisitionDesk domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />}
          {activeTab === AgentType.OPERATIONS && <OperationsHub domains={domains} setDomains={setDomains} onInspect={setInspectedDomain} lang={lang} />}
          {activeTab === AgentType.LIQUIDATION && <LiquidationEngine domains={domains} setDomains={setDomains} lang={lang} />}
          {activeTab === AgentType.MANAGEMENT && <ExecutiveSuite domains={domains} stats={stats} integrations={integrations} onConnect={connectService} lang={lang} />}
        </div>
      </main>

      {/* Floating Action HUD */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-overlay pointer-events-none w-full max-w-[90vw] md:max-w-xl">
         <div className="pointer-events-auto bg-[#161618]/95 backdrop-blur-3xl border border-white/10 p-5 rounded-[28px] shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex items-center justify-between">
            <div className="flex items-center gap-5 border-r border-white/5 pr-6">
               <div className={`w-2.5 h-2.5 rounded-full ${isScanning ? 'bg-[#c5a059] animate-pulse' : 'bg-green-500'}`}></div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">{isScanning ? 'SYNTHESIZING' : 'STANDBY'}</span>
                  <span className="text-[7px] text-slate-600 font-bold uppercase data-mono">Core_Link_Active</span>
               </div>
            </div>
            <button onClick={initiateScan} className="bg-white text-black px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all">
               {isScanning ? <i className="fas fa-circle-notch fa-spin"></i> : 'INITIATE'}
            </button>
         </div>
      </div>
      
      <TickerTape lang={lang} />
      <SonnerNotification notifications={notifications} onDismiss={dismissNotification} />
      <div className="noise-bg"></div>
    </div>
  );
};

const App: React.FC = () => (
  <DomainProvider>
    <AppContent />
  </DomainProvider>
);

export default App;
