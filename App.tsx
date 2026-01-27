
import React, { useState, useEffect, useCallback } from 'react';
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

  const { isScanning, initiateScan } = useMasterBrain(strategy, lang);

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
    <div className="flex h-screen w-full bg-[#020204] text-slate-300 overflow-hidden font-sans">
      <CommandPalette 
        setActiveTab={setActiveTab} 
        onSearchDomain={(name) => {
          const d = domains.find(x => x.name === name);
          if (d) setInspectedDomain(d);
        }} 
      />
      
      {/* Fix: Added lang prop to AgentReasoningLab to resolve Type error */}
      {inspectedDomain && <AgentReasoningLab domain={inspectedDomain} lang={lang} onClose={() => setInspectedDomain(null)} />}
      
      <aside className={`fixed lg:relative lg:translate-x-0 w-20 lg:w-64 h-full flex flex-col z-[150] bg-[#08090d] border-r border-white/5 transition-all duration-300
        ${lang === 'ar' ? (isSidebarOpen ? 'translate-x-0 right-0' : 'translate-x-full right-0') : (isSidebarOpen ? 'translate-x-0 left-0' : '-translate-x-full left-0')}
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fas fa-cube text-white text-xs"></i>
          </div>
          <span className="hidden lg:block text-sm font-black tracking-widest text-white italic">ISTHMIC PRO</span>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map(item => (
            <button key={item.type} onClick={() => setActiveTab(item.type)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border group ${activeTab === item.type ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'border-transparent text-slate-500 hover:bg-white/5 hover:text-white'}`}>
              <i className={`fas ${item.icon} w-5 text-center text-xs lg:text-sm`}></i>
              <span className="hidden lg:block text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="w-full py-2 rounded-lg text-[9px] font-bold uppercase border border-white/10 hover:bg-white/5 transition-all text-slate-500">
            {lang === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 lg:px-12 backdrop-blur-md bg-[#020204]/80 sticky top-0 z-[120]">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-400">
               <i className="fas fa-bars"></i>
            </button>
            <div className="flex items-center gap-4">
               <h2 className="text-[10px] font-bold tracking-widest uppercase text-indigo-500">{t.platformName}</h2>
               <div className="w-px h-4 bg-white/10"></div>
               <div className="text-xs font-black text-white uppercase">{menuItems.find(i => i.type === activeTab)?.label}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
             <div className="hidden sm:flex items-center gap-4">
                <div className="text-right">
                   <div className="text-[8px] font-bold text-slate-500 uppercase">{t.estimatedValue}</div>
                   <div className="text-sm font-black text-green-500 tabular-nums">$ {stats.estimatedPortfolioValue.toLocaleString()}</div>
                </div>
                <div className="w-8 h-8 rounded-lg border border-white/5 flex items-center justify-center bg-white/5 cursor-pointer hover:bg-indigo-600 transition-all group" data-tooltip={lang === 'ar' ? 'النظام مشفر ومؤمن بالكامل.' : 'System encrypted and secure.'}>
                   <i className="fas fa-shield-alt text-slate-500 text-[10px] group-hover:text-white"></i>
                </div>
             </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="max-w-[1400px] mx-auto p-6 lg:p-10 pb-32">
            {activeTab === AgentType.INTELLIGENCE && <IntelligenceHub stats={stats} lang={lang} onInitiateScan={initiateScan} isScanning={isScanning} />}
            {activeTab === AgentType.ACQUISITION && <AcquisitionDesk domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />}
            {activeTab === AgentType.OPERATIONS && <OperationsHub domains={domains} setDomains={setDomains} onInspect={setInspectedDomain} lang={lang} />}
            {activeTab === AgentType.LIQUIDATION && <LiquidationEngine domains={domains} setDomains={setDomains} lang={lang} />}
            {activeTab === AgentType.MANAGEMENT && <ExecutiveSuite domains={domains} stats={stats} integrations={integrations} onConnect={connectService} lang={lang} />}
          </div>
        </div>

        <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]">
           <div className="glass-card px-6 py-3 rounded-2xl flex items-center gap-8 shadow-2xl border border-white/10">
              <div className="flex items-center gap-3 pr-6 border-r border-white/5">
                 <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-indigo-500 animate-pulse' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]'}`}></div>
                 <span className="text-[10px] font-black text-white uppercase tracking-wider">{isScanning ? 'AI ACTIVE' : 'SYSTEM READY'}</span>
              </div>
              
              {isScanning && (
                <div className="flex items-center gap-6 animate-fade-in">
                   <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 animate-progress" style={{ width: '45%' }}></div>
                   </div>
                   <button onClick={() => window.location.reload()} className="text-red-500 hover:text-red-400 text-[9px] font-black uppercase tracking-widest">{t.stopProcess}</button>
                </div>
              )}

              <div className="flex items-center gap-4 text-slate-500">
                 <i className="fas fa-network-wired text-[10px]"></i>
                 <span className="text-[9px] font-mono">NODE: IST-01</span>
              </div>
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
