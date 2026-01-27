
import React, { useState, useEffect } from 'react';
import { AgentType, Domain, AgentThought } from './types';
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
    dismissNotification, addLog, connectService, strategy 
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
    <div className="flex h-screen w-full bg-[#010103] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">
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
      
      {/* Sovereign Sidebar */}
      <aside className={`fixed lg:relative h-full flex flex-col z-[300] bg-[#05060a]/95 backdrop-blur-2xl border-white/10 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        ${lang === 'ar' ? 'border-l' : 'border-r'}
        ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 lg:w-64 -translate-x-full lg:translate-x-0'}
        ${lang === 'ar' ? 'right-0' : 'left-0'}
      `}>
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20 group cursor-pointer" aria-hidden="true">
            <i className="fas fa-cube text-white text-lg"></i>
          </div>
          <span className="hidden lg:block text-xs font-black tracking-[0.4em] text-white uppercase shimmer-text">ISTHMIC PRO</span>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2" aria-label="القائمة الرئيسية">
          {menuItems.map(item => (
            <button 
              key={item.type} 
              onClick={() => { setActiveTab(item.type); setIsSidebarOpen(false); }}
              aria-label={item.label}
              aria-current={activeTab === item.type ? 'page' : undefined}
              className={`w-full flex items-center gap-5 px-5 py-4 rounded-2xl transition-all group relative overflow-hidden
                ${activeTab === item.type 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/10' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <i className={`fas ${item.icon} w-6 text-center text-sm lg:text-base group-hover:scale-110 transition-transform`} aria-hidden="true"></i>
              <span className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
              {activeTab === item.type && <div className="absolute inset-y-0 left-0 w-1 bg-white"></div>}
            </button>
          ))}
        </nav>

        <div className="p-6">
          <button 
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} 
            aria-label={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
            className="w-full py-4 rounded-xl text-[9px] font-black uppercase border border-white/10 hover:bg-indigo-600 hover:text-white transition-all text-slate-300 tracking-widest bg-white/5"
          >
            {lang === 'ar' ? 'SWITCH TO ENGLISH' : 'التحويل للعربية'}
          </button>
        </div>
      </aside>
      
      {/* Main Command Deck */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden h-full">
        <header className="h-20 flex items-center justify-between px-6 lg:px-16 bg-[#010103]/80 backdrop-blur-xl sticky top-0 z-[200] border-b border-white/10">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              aria-label="القائمة"
              className="lg:hidden w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition-all"
            >
               <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
            <div className="flex items-center gap-6">
               <h1 className="text-[10px] font-black tracking-[0.4em] uppercase text-indigo-400 hidden sm:block">{t.platformName}</h1>
               <div className="w-px h-5 bg-white/10 hidden sm:block"></div>
               <div className="text-base lg:text-lg font-black text-white uppercase italic tracking-tighter">
                 {menuItems.find(i => i.type === activeTab)?.label}
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
             <div className="hidden md:flex items-center gap-8">
                <div className="text-right">
                   <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.estimatedValue}</div>
                   <div className="text-xl font-black text-white tabular-nums">$ {stats.estimatedPortfolioValue.toLocaleString()}</div>
                </div>
                <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center bg-white/5 group hover:bg-indigo-600 transition-all cursor-help" title={lang === 'ar' ? 'التشفير السيادي نشط' : 'Sovereign Encryption Active'}>
                   <i className="fas fa-shield-halved text-slate-400 text-base group-hover:text-white"></i>
                </div>
             </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar relative h-full">
          <div className="max-w-[1600px] mx-auto p-6 lg:p-16 pb-40">
            {activeTab === AgentType.INTELLIGENCE && <IntelligenceHub stats={stats} lang={lang} onInitiateScan={initiateScan} isScanning={isScanning} />}
            {activeTab === AgentType.ACQUISITION && <AcquisitionDesk domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />}
            {activeTab === AgentType.OPERATIONS && <OperationsHub domains={domains} setDomains={setDomains} onInspect={setInspectedDomain} lang={lang} />}
            {activeTab === AgentType.LIQUIDATION && <LiquidationEngine domains={domains} setDomains={setDomains} lang={lang} />}
            {activeTab === AgentType.MANAGEMENT && <ExecutiveSuite domains={domains} stats={stats} integrations={integrations} onConnect={connectService} lang={lang} />}
          </div>
        </div>

        {/* Global Operational HUD */}
        <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[400] w-full max-w-2xl px-4" aria-live="polite">
           <div className="glass-panel px-8 py-4 rounded-[28px] flex items-center justify-between shadow-2xl border border-white/10 relative overflow-hidden">
              <div className="flex items-center gap-4 pr-6 border-r border-white/10 shrink-0">
                 <div className={`w-2.5 h-2.5 rounded-full ${isScanning ? 'bg-indigo-500 animate-pulse' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]'}`}></div>
                 <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">{isScanning ? 'AI_ACTIVE' : 'READY'}</span>
              </div>
              
              <div className="flex-1 px-6 overflow-hidden">
                 {isScanning ? (
                    <div className="flex items-center gap-4 animate-fade-in">
                       <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden relative">
                          <div className="h-full bg-indigo-500 w-1/3 animate-progress"></div>
                       </div>
                    </div>
                 ) : (
                    <div className="flex items-center gap-4 text-slate-500 animate-fade-in">
                       <span className="text-[8px] font-mono tracking-widest uppercase italic truncate">Node: IST-ALPHA-01 | Status: Grounded</span>
                    </div>
                 )}
              </div>

              {isScanning && (
                <button onClick={() => window.location.reload()} aria-label={t.stopProcess} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shrink-0">
                  {t.stopProcess}
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
