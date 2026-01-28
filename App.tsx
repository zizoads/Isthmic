
import React, { useState, useEffect } from 'react';
import { AgentType, Domain } from './types';
import { translations } from './translations';
import { DomainProvider, useDomainContext } from './context/DomainContext';
import { useMasterBrain } from './hooks/useMasterBrain';

// Hub Dashboards
import IntelligenceHub from './components/hubs/IntelligenceHub';
import AcquisitionDesk from './components/hubs/AcquisitionDesk';
import OperationsHub from './components/hubs/OperationsHub';
import LiquidationEngine from './components/hubs/LiquidationEngine';
import ExecutiveSuite from './components/hubs/ExecutiveSuite';

// UI Components
import CommandPalette from './components/CommandPalette';
import AgentReasoningLab from './components/AgentReasoningLab';
import SonnerNotification from './components/SonnerNotification';
import TickerTape from './components/TickerTape';

const AppContent: React.FC = () => {
  const { 
    domains, setDomains, integrations, stats, notifications, 
    dismissNotification, addLog, connectService, strategy, system, resetQuota
  } = useDomainContext();
  
  const [lang, setLang] = useState<'ar' | 'en'>(() => (localStorage.getItem('ist_lang') as 'ar' | 'en') || 'ar');
  const [activeTab, setActiveTab] = useState<AgentType>(AgentType.INTELLIGENCE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inspectedDomain, setInspectedDomain] = useState<Domain | null>(null);

  const { isScanning, initiateScan } = useMasterBrain(strategy, lang);
  const quotaExhausted = system.status === 'degraded';
  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('ist_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const menuItems = [
    { type: AgentType.INTELLIGENCE, icon: 'fa-brain', label: t.intelligence },
    { type: AgentType.ACQUISITION, icon: 'fa-crosshairs', label: t.acquisition },
    { type: AgentType.OPERATIONS, icon: 'fa-layer-group', label: t.operations },
    { type: AgentType.LIQUIDATION, icon: 'fa-money-bill-wave', label: t.liquidation },
    { type: AgentType.MANAGEMENT, icon: 'fa-file-signature', label: t.management }
  ];

  return (
    <div className="flex h-screen w-full bg-[#030305] text-[#f8fafc] overflow-hidden select-none">
      {/* Precision Quota HUD */}
      {quotaExhausted && (
        <div className="fixed top-0 left-0 w-full z-[1000] bg-red-600/10 border-b border-red-500/20 py-1.5 text-center text-[9px] font-bold uppercase tracking-[0.3em] text-red-500 backdrop-blur-xl flex items-center justify-center gap-3">
          <i className="fas fa-bolt animate-pulse"></i>
          <span>{lang === 'ar' ? 'نظام الذكاء الاصطناعي في وضع الاسترداد (الحد الأقصى للطلبات)' : 'AI SYSTEM IN RECOVERY MODE (RATE LIMIT REACHED)'}</span>
          <button onClick={resetQuota} className="bg-red-500 text-white px-2 py-0.5 rounded text-[8px] hover:bg-white hover:text-red-500 transition-colors">RESET</button>
        </div>
      )}

      <CommandPalette 
        setActiveTab={setActiveTab} 
        onSearchDomain={(name) => {
          const d = domains.find(x => x.name === name);
          if (d) setInspectedDomain(d);
        }} 
      />
      
      {inspectedDomain && (
        <AgentReasoningLab 
          domain={inspectedDomain} 
          lang={lang} 
          onClose={() => setInspectedDomain(null)} 
        />
      )}
      
      {/* Obsidian Sidebar */}
      <aside className={`fixed lg:relative h-full nav-sidebar z-[300] transition-all duration-500 ease-in-out
        ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 lg:w-[260px] -translate-x-full lg:translate-x-0'}
        ${lang === 'ar' ? 'right-0 border-l' : 'left-0 border-r'}
        ${quotaExhausted ? 'pt-8' : ''}
      `}>
        <div className="p-10 flex flex-col items-center">
          <div className="w-10 h-10 surface-layer-1 flex items-center justify-center mb-6 border border-white/5 shadow-xl">
            <i className="fas fa-cube text-indigo-500 text-sm"></i>
          </div>
          <span className="text-[10px] font-bold tracking-[0.6em] text-white/40 uppercase">ISTHMIC PRO</span>
        </div>
        
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map(item => (
            <button 
              key={item.type} 
              onClick={() => { setActiveTab(item.type); setIsSidebarOpen(false); }}
              className={`nav-item w-[calc(100%-24px)] mx-3 ${activeTab === item.type ? 'active' : ''}`}
            >
              <i className={`fas ${item.icon}`}></i>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} 
            className="w-full py-3 rounded-lg text-[9px] font-bold uppercase border border-white/10 hover:border-white/20 transition-all text-white/40 tracking-widest"
          >
            {lang === 'ar' ? 'Language: EN' : 'اللغة: العربية'}
          </button>
        </div>
      </aside>
      
      {/* Main Execution Deck */}
      <main className="flex-1 flex flex-col relative overflow-hidden h-full">
        {/* Top Minimal Header */}
        <header className={`h-14 flex items-center justify-between px-10 border-b border-white/5 bg-transparent backdrop-blur-sm z-[200] ${quotaExhausted ? 'mt-8' : ''}`}>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-white/40 hover:text-white">
               <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
            <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
              Terminal / <span className="text-white">{menuItems.find(i => i.type === activeTab)?.label}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-10">
             <div className="hidden md:flex items-center gap-6">
                <div className="text-right">
                   <div className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Net Value</div>
                   <div className="text-sm font-bold text-white tabular-nums tracking-tight">$ {stats.estimatedPortfolioValue.toLocaleString()}</div>
                </div>
                <div className="w-px h-6 bg-white/5"></div>
                <div className={`flex items-center gap-2 ${quotaExhausted ? 'text-red-500' : 'text-green-500'}`}>
                   <div className={`w-1.5 h-1.5 rounded-full bg-current ${quotaExhausted ? 'animate-pulse' : ''}`}></div>
                   <span className="text-[8px] font-bold uppercase tracking-widest">{quotaExhausted ? 'Rate Limited' : 'Sync: Live'}</span>
                </div>
             </div>
          </div>
        </header>
        
        {/* Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative h-full">
          <div className="max-w-[1400px] mx-auto p-12 lg:p-20 pb-40">
            {activeTab === AgentType.INTELLIGENCE && <IntelligenceHub stats={stats} lang={lang} onInitiateScan={initiateScan} isScanning={isScanning} />}
            {activeTab === AgentType.ACQUISITION && <AcquisitionDesk domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />}
            {activeTab === AgentType.OPERATIONS && <OperationsHub domains={domains} setDomains={setDomains} onInspect={setInspectedDomain} lang={lang} />}
            {activeTab === AgentType.LIQUIDATION && <LiquidationEngine domains={domains} setDomains={setDomains} lang={lang} />}
            {activeTab === AgentType.MANAGEMENT && <ExecutiveSuite domains={domains} stats={stats} integrations={integrations} onConnect={connectService} lang={lang} />}
          </div>
        </div>

        {/* The Obsidian HUD - Minimalist Overlay */}
        <footer className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
           <div className={`hud-card pointer-events-auto shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border transition-all ${quotaExhausted ? 'border-red-500/50' : 'border-white/10'}`}>
              <div className="flex items-center gap-4 border-r border-white/10 pr-6">
                 <div className={`w-1.5 h-1.5 rounded-full ${quotaExhausted ? 'bg-red-500 animate-pulse' : isScanning ? 'bg-indigo-500 animate-pulse' : 'bg-green-500'}`}></div>
                 <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.3em]">
                   {quotaExhausted ? 'Quota Error' : isScanning ? 'Inference active' : 'Grounding ready'}
                 </span>
              </div>
              
              <div className="text-[8px] font-mono text-white/30 tracking-widest uppercase">
                 Isthmic Alpha Node: 0x92f...A2
              </div>

              {(isScanning || quotaExhausted) && (
                <button onClick={() => window.location.reload()} className="bg-white/5 text-white/40 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase hover:bg-red-500 hover:text-white transition-all">
                  {quotaExhausted ? 'Re-Sync' : 'Terminate'}
                </button>
              )}
           </div>
        </footer>
      </main>
      
      <TickerTape lang={lang} />
      <SonnerNotification notifications={notifications} onDismiss={dismissNotification} />
    </div>
  );
};

const App: React.FC = () => (
  <DomainProvider>
    <AppContent />
  </DomainProvider>
);

export default App;
