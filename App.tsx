
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
    <div className="flex h-screen w-full bg-[#020204] text-slate-300 overflow-hidden font-sans selection:bg-indigo-500/30">
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
      <aside className={`fixed lg:relative h-full flex flex-col z-[300] bg-[#08090d]/80 backdrop-blur-xl border-white/5 transition-all duration-500 ease-in-out
        ${lang === 'ar' ? 'border-l' : 'border-r'}
        ${isSidebarOpen ? 'w-64' : 'w-20 lg:w-64'}
        ${lang === 'ar' ? (isSidebarOpen ? 'right-0' : '-right-full lg:right-0') : (isSidebarOpen ? 'left-0' : '-left-full lg:left-0')}
      `}>
        <div className="p-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group cursor-pointer hover:rotate-12 transition-transform">
            <i className="fas fa-cube text-white text-sm"></i>
          </div>
          <span className="hidden lg:block text-xs font-black tracking-[0.3em] text-white uppercase shimmer-text">ISTHMIC PRO</span>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-2">
          {menuItems.map(item => (
            <button 
              key={item.type} 
              onClick={() => { setActiveTab(item.type); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative overflow-hidden
                ${activeTab === item.type 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/10' 
                  : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
            >
              <i className={`fas ${item.icon} w-6 text-center text-sm lg:text-base`}></i>
              <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">{item.label}</span>
              {activeTab === item.type && <div className="absolute inset-y-0 left-0 w-1 bg-white"></div>}
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-3">
          <button 
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} 
            className="w-full py-3 rounded-xl text-[9px] font-black uppercase border border-white/5 hover:bg-white/5 transition-all text-slate-400"
          >
            {lang === 'ar' ? 'ENGLISH' : 'العربية'}
          </button>
        </div>
      </aside>
      
      {/* Main Command Deck */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 lg:px-12 bg-[#020204]/60 backdrop-blur-md sticky top-0 z-[200] border-b border-white/5">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="lg:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400"
            >
               <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
            <div className="flex items-center gap-5">
               <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-indigo-500">{t.platformName}</h2>
               <div className="w-px h-4 bg-white/10 hidden sm:block"></div>
               <div className="text-sm font-black text-white uppercase hidden sm:block italic tracking-tight">
                 {menuItems.find(i => i.type === activeTab)?.label}
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-10">
             <div className="hidden md:flex items-center gap-6">
                <div className="text-right">
                   <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.estimatedValue}</div>
                   <div className="text-lg font-black text-green-500 tabular-nums">$ {stats.estimatedPortfolioValue.toLocaleString()}</div>
                </div>
                <div className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center bg-white/5 group hover:bg-indigo-600 transition-all cursor-help" data-tooltip={lang === 'ar' ? 'التشفير السيادي نشط' : 'Sovereign Encryption Active'}>
                   <i className="fas fa-shield-halved text-slate-500 text-xs group-hover:text-white"></i>
                </div>
             </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-[1500px] mx-auto p-6 lg:p-12 pb-40">
            {activeTab === AgentType.INTELLIGENCE && <IntelligenceHub stats={stats} lang={lang} onInitiateScan={initiateScan} isScanning={isScanning} />}
            {activeTab === AgentType.ACQUISITION && <AcquisitionDesk domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />}
            {activeTab === AgentType.OPERATIONS && <OperationsHub domains={domains} setDomains={setDomains} onInspect={setInspectedDomain} lang={lang} />}
            {activeTab === AgentType.LIQUIDATION && <LiquidationEngine domains={domains} setDomains={setDomains} lang={lang} />}
            {activeTab === AgentType.MANAGEMENT && <ExecutiveSuite domains={domains} stats={stats} integrations={integrations} onConnect={connectService} lang={lang} />}
          </div>
        </div>

        {/* Global Operational Status */}
        <footer className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[400]">
           <div className="glass-panel px-8 py-4 rounded-3xl flex items-center gap-10 shadow-2xl">
              <div className="flex items-center gap-4 pr-8 border-r border-white/10">
                 <div className={`w-2.5 h-2.5 rounded-full ${isScanning ? 'bg-indigo-500 animate-pulse shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'}`}></div>
                 <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{isScanning ? 'AI PROCESSING' : 'SYSTEM NOMINAL'}</span>
              </div>
              
              {isScanning && (
                <div className="flex items-center gap-8 animate-fade-in">
                   <div className="w-40 h-1 bg-white/5 rounded-full overflow-hidden relative">
                      <div className="h-full bg-indigo-500 w-1/2 animate-progress"></div>
                      <div className="scanning-line"></div>
                   </div>
                   <button onClick={() => window.location.reload()} className="text-red-500 hover:text-red-400 text-[10px] font-black uppercase tracking-widest">{t.stopProcess}</button>
                </div>
              )}

              <div className="flex items-center gap-5 text-slate-500">
                 <i className="fas fa-network-wired text-[10px]"></i>
                 <span className="text-[10px] font-mono tracking-tighter">NODE: IST-ALPHA-01</span>
              </div>
           </div>
        </footer>
      </main>
      
      <TickerTape lang={lang} />
      <SonnerNotification notifications={notifications} onDismiss={dismissNotification} />
      
      <div className="aurora-orb orb-1 animate-pulse-slow"></div>
      <div className="aurora-orb orb-2 animate-pulse-slow" style={{ animationDelay: '-5s' }}></div>
      <div className="aurora-orb orb-3 animate-pulse-slow" style={{ animationDelay: '-10s' }}></div>
    </div>
  );
};

const App: React.FC = () => (
  <DomainProvider>
    <AppContent />
  </DomainProvider>
);

export default App;
