
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    domains, setDomains, strategy, integrations, stats, notifications, 
    dismissNotification, addLog, connectService 
  } = useDomainContext();
  
  const [lang, setLang] = useState<'ar' | 'en'>(() => (localStorage.getItem('ist_lang') as 'ar' | 'en') || 'ar');
  const [activeTab, setActiveTab] = useState<AgentType>(AgentType.INTELLIGENCE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inspectedDomain, setInspectedDomain] = useState<Domain | null>(null);

  const { isScanning, initiateScan, activeWorkflow } = useMasterBrain(strategy, lang);

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
    <div className="flex h-screen w-full bg-[#050508] text-slate-200 selection:bg-indigo-500/30 overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <CommandPalette 
        setActiveTab={setActiveTab} 
        onSearchDomain={(name) => {
          const d = domains.find(x => x.name === name);
          if (d) setInspectedDomain(d);
        }} 
      />
      
      {inspectedDomain && <AgentReasoningLab domain={inspectedDomain} onClose={() => setInspectedDomain(null)} />}
      
      {/* Sidebar - Compact and Professional */}
      <aside className={`fixed lg:relative lg:translate-x-0 w-20 lg:w-72 h-full flex flex-col z-[150] transition-all duration-500 bg-[#0a0a0f] border-r border-white/5 shadow-2xl
        ${lang === 'ar' ? (isSidebarOpen ? 'translate-x-0 right-0 border-l' : 'translate-x-full right-0 border-l') : (isSidebarOpen ? 'translate-x-0 left-0 border-r' : '-translate-x-full left-0 border-r')}
      `}>
        <div className="p-6 lg:p-8 flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fas fa-rocket text-white"></i>
          </div>
          <span className="hidden lg:block text-xl font-black uppercase tracking-tighter text-white">ISTHMIC</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 py-6">
          {menuItems.map(item => (
            <button key={item.type} onClick={() => { setActiveTab(item.type); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-4 py-4 transition-all rounded-xl border group ${activeTab === item.type ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl' : 'border-transparent text-slate-500 hover:bg-white/5 hover:text-white'}`}>
              <i className={`fas ${item.icon} w-6 text-center text-sm lg:text-base`}></i>
              <span className="hidden lg:block text-[11px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="w-full py-3 rounded-lg text-[9px] font-black uppercase border border-white/10 hover:bg-white/5 transition-all text-slate-400">
            {lang === 'ar' ? 'ENGLISH' : 'العربية'}
          </button>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Header - Transparent Blur */}
        <header className="h-16 lg:h-20 border-b border-white/5 flex items-center justify-between px-6 lg:px-12 backdrop-blur-xl bg-[#050508]/60 sticky top-0 z-[120]">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-400">
              <i className="fas fa-bars"></i>
            </button>
            <h2 className="text-xs lg:text-sm font-black tracking-[0.3em] uppercase text-indigo-400">
              {menuItems.find(i => i.type === activeTab)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-8">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{t.estimatedValue}</span>
                <span className="text-lg font-black text-white">$ {stats.estimatedPortfolioValue.toLocaleString()}</span>
             </div>
             <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 cursor-pointer hover:bg-white/10 transition-all">
                <i className="fas fa-bell text-slate-400 text-xs"></i>
             </div>
          </div>
        </header>
        
        {/* Content - World Class Spacing */}
        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="max-w-[1400px] mx-auto p-6 lg:p-12 pb-32">
            {activeTab === AgentType.INTELLIGENCE && (
              <IntelligenceHub 
                stats={stats} 
                lang={lang} 
                onInitiateScan={initiateScan} 
                isScanning={isScanning} 
              />
            )}
            {activeTab === AgentType.ACQUISITION && (
              <AcquisitionDesk 
                domains={domains}
                setDomains={setDomains}
                addLog={addLog}
                lang={lang} 
              />
            )}
            {activeTab === AgentType.OPERATIONS && (
              <OperationsHub 
                domains={domains}
                setDomains={setDomains}
                onInspect={setInspectedDomain} 
                lang={lang} 
              />
            )}
            {activeTab === AgentType.LIQUIDATION && (
              <LiquidationEngine 
                domains={domains}
                setDomains={setDomains}
                lang={lang} 
              />
            )}
            {activeTab === AgentType.MANAGEMENT && (
              <ExecutiveSuite 
                domains={domains}
                stats={stats} 
                integrations={integrations}
                onConnect={connectService}
                lang={lang} 
              />
            )}
          </div>
        </div>

        {/* The Sovereign Dock - Floating Navigation & Control */}
        <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-auto">
           <div className="sovereign-dock px-6 py-4 rounded-[28px] flex items-center gap-8 shadow-2xl">
              <div className="flex items-center gap-4 pr-6 border-r border-white/10">
                 <div className={`w-3 h-3 rounded-full ${isScanning ? 'bg-indigo-500 animate-pulse' : 'bg-green-500'}`}></div>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                   {isScanning ? (lang === 'ar' ? 'جاري التحليل...' : 'PROCESSING AI...') : (lang === 'ar' ? 'النظام خامل' : 'SYSTEM READY')}
                 </span>
              </div>

              {isScanning && (
                <div className="flex items-center gap-4">
                   <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full animate-progress" style={{ width: '60%' }}></div>
                   </div>
                   <button 
                    onClick={() => window.location.reload()} // Global Kill-Switch
                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                   >
                     <i className="fas fa-stop"></i>
                     <span>{lang === 'ar' ? 'إيقاف كلي' : 'STOP ALL'}</span>
                   </button>
                </div>
              )}

              <div className="flex items-center gap-2 pl-6 border-l border-white/10 text-slate-500">
                <i className="fas fa-bolt text-[10px]"></i>
                <span className="text-[9px] font-bold">GEMINI 3 PRO</span>
              </div>
           </div>
        </footer>
      </main>
      
      <SonnerNotification notifications={notifications} onDismiss={dismissNotification} />
      <TickerTape lang={lang} />
    </div>
  );
};

const App: React.FC = () => (
  <DomainProvider>
    <AppContent />
  </DomainProvider>
);

export default App;
