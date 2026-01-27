
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

  const handleGlobalKill = () => {
    window.location.reload(); 
  };

  return (
    <div className="flex h-screen w-full bg-[#050508] text-slate-300 selection:bg-indigo-500/30 overflow-hidden font-sans">
      <CommandPalette 
        setActiveTab={setActiveTab} 
        onSearchDomain={(name) => {
          const d = domains.find(x => x.name === name);
          if (d) setInspectedDomain(d);
        }} 
      />
      
      {inspectedDomain && <AgentReasoningLab domain={inspectedDomain} onClose={() => setInspectedDomain(null)} />}
      
      <aside className={`fixed lg:relative lg:translate-x-0 w-20 lg:w-72 h-full flex flex-col z-[150] bg-[#0a0a0f] border-r border-white/5 transition-all duration-500
        ${lang === 'ar' ? (isSidebarOpen ? 'translate-x-0 right-0' : 'translate-x-full right-0') : (isSidebarOpen ? 'translate-x-0 left-0' : '-translate-x-full left-0')}
      `}>
        <div className="p-8 flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fas fa-rocket text-white"></i>
          </div>
          <span className="hidden lg:block text-xl font-black tracking-tighter text-white">ISTHMIC</span>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
          {menuItems.map(item => (
            <button key={item.type} onClick={() => { setActiveTab(item.type); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all border group ${activeTab === item.type ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl' : 'border-transparent text-slate-500 hover:bg-white/5 hover:text-white'}`}>
              <i className={`fas ${item.icon} w-6 text-center text-sm lg:text-base`}></i>
              <span className="hidden lg:block text-[11px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-white/[0.02]">
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="w-full py-3 rounded-xl text-[9px] font-black uppercase border border-white/10 hover:bg-white/5 transition-all tracking-widest text-slate-400">
            {lang === 'ar' ? 'ENGLISH' : 'العربية'}
          </button>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 lg:px-16 backdrop-blur-xl bg-[#050508]/60 sticky top-0 z-[120]">
          <div className="flex items-center gap-8">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-400">
               <i className="fas fa-bars-staggered"></i>
            </button>
            <div>
               <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-indigo-500 mb-1">
                 {lang === 'ar' ? 'مركز القيادة' : 'COMMAND CENTER'}
               </h2>
               <div className="text-lg font-black text-white uppercase tracking-tight">
                 {menuItems.find(i => i.type === activeTab)?.label}
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-12">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{t.estimatedValue}</span>
                <span className="text-xl font-black text-white tabular-nums">$ {stats.estimatedPortfolioValue.toLocaleString()}</span>
             </div>
             <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center bg-white/5 cursor-pointer hover:bg-indigo-600 transition-all group" data-tooltip={lang === 'ar' ? 'درع الحماية: النظام محمي ومشفر بالكامل.' : 'Shield: System fully protected and encrypted.'}>
                <i className="fas fa-shield-halved text-slate-400 text-xs group-hover:text-white"></i>
             </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="max-w-[1500px] mx-auto p-6 lg:p-16 pb-40">
            {activeTab === AgentType.INTELLIGENCE && <IntelligenceHub stats={stats} lang={lang} onInitiateScan={initiateScan} isScanning={isScanning} />}
            {activeTab === AgentType.ACQUISITION && <AcquisitionDesk domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />}
            {activeTab === AgentType.OPERATIONS && <OperationsHub domains={domains} setDomains={setDomains} onInspect={setInspectedDomain} lang={lang} />}
            {activeTab === AgentType.LIQUIDATION && <LiquidationEngine domains={domains} setDomains={setDomains} lang={lang} />}
            {activeTab === AgentType.MANAGEMENT && <ExecutiveSuite domains={domains} stats={stats} integrations={integrations} onConnect={connectService} lang={lang} />}
          </div>
        </div>

        <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-auto animate-slide-up">
           <div className="sovereign-dock px-8 py-5 rounded-[32px] flex items-center gap-10 shadow-2xl border border-white/10 group">
              <div className="flex items-center gap-5 pr-10 border-r border-white/10" data-tooltip={lang === 'ar' ? 'حالة النظام اللحظية: يظهر ما إذا كان الذكاء الاصطناعي يعمل حالياً.' : 'Live System Status: Indicates if AI is currently processing tasks.'}>
                 <div className="relative">
                    <div className={`w-3 h-3 rounded-full ${isScanning ? 'bg-indigo-500 animate-pulse' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]'}`}></div>
                    {isScanning && <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-25"></div>}
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">STATUS</span>
                    <span className="text-[10px] font-bold text-white uppercase">{isScanning ? 'AI PROCESSING' : 'READY'}</span>
                 </div>
              </div>

              {isScanning && (
                <div className="flex items-center gap-8 animate-fade-in">
                   <div className="flex flex-col gap-1.5">
                      <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                         <div className="h-full bg-indigo-500 animate-progress shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: '65%' }}></div>
                      </div>
                      <span className="text-[8px] font-mono text-indigo-400 text-center uppercase">Calibrating Nexus...</span>
                   </div>
                   <button 
                    onClick={handleGlobalKill}
                    data-tooltip={t.tooltip_kill_switch}
                    className="flex items-center gap-3 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border border-red-500/20 shadow-lg"
                   >
                     <i className="fas fa-power-off"></i>
                     <span>STOP ALL</span>
                   </button>
                </div>
              )}

              <div className="flex items-center gap-3 pl-10 border-l border-white/10 opacity-60 group-hover:opacity-100 transition-opacity" data-tooltip={lang === 'ar' ? 'سرعة الاستجابة اللحظية لخوادم Gemini.' : 'Real-time response latency of Gemini servers.'}>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                   <i className="fas fa-bolt text-amber-500 text-[10px]"></i>
                </div>
                <div className="flex flex-col">
                   <span className="text-[8px] font-black text-slate-500 uppercase">LATENCY</span>
                   <span className="text-[10px] font-mono text-white">42ms</span>
                </div>
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
