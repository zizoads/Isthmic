
import React, { useState } from 'react';
import { AgentType, Domain } from './types';
import { DomainProvider, useDomainContext } from './context/DomainContext';
import { useMasterBrain } from './hooks/useMasterBrain';

// Auth & Components
import AuthForm from './components/AuthForm';
import IntelligenceHub from './components/hubs/IntelligenceHub';
import AcquisitionDesk from './components/hubs/AcquisitionDesk';
import OperationsHub from './components/hubs/OperationsHub';
import LiquidationEngine from './components/hubs/LiquidationEngine';
import ExecutiveSuite from './components/hubs/ExecutiveSuite';
import AdminHub from './components/hubs/AdminHub';

// UI
import CommandPalette from './components/CommandPalette';
import AgentReasoningLab from './components/AgentReasoningLab';
import SonnerNotification from './components/SonnerNotification';
import TickerTape from './components/TickerTape';

const AppContent: React.FC = () => {
  const { activeProfile, logout, domains, setDomains, stats, strategy, isInitialLoading, activityLogs, addLog } = useDomainContext();
  const [activeTab, setActiveTab] = useState<AgentType>(AgentType.INTELLIGENCE);
  const [inspectedDomain, setInspectedDomain] = useState<Domain | null>(null);
  const { isScanning, initiateScan, activeWorkflow } = useMasterBrain(strategy, 'en');

  if (isInitialLoading) return (
    <div className="h-screen bg-[#0a0a0c] flex flex-col items-center justify-center space-y-8">
       <div className="w-16 h-16 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
       <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#d4af37] opacity-50">Sovereign_Identity_Sync</p>
    </div>
  );

  if (!activeProfile) return <AuthForm />;

  const navItems = [
    { id: AgentType.INTELLIGENCE, label: 'Intelligence', icon: 'fa-brain' },
    { id: AgentType.ACQUISITION, label: 'Acquisition', icon: 'fa-crosshairs' },
    { id: AgentType.OPERATIONS, label: 'Operations', icon: 'fa-layer-group' },
    { id: AgentType.LIQUIDATION, label: 'Liquidation', icon: 'fa-money-bill-wave' },
    { id: AgentType.MANAGEMENT, label: 'Executive', icon: 'fa-user-tie' }
  ];

  return (
    <div className="system-shell">
      <div className="bg-grid"></div>
      <div className="noise-bg"></div>
      
      <CommandPalette setActiveTab={setActiveTab} onSearchDomain={(n) => setInspectedDomain(domains.find(d => d.name === n) || null)} />
      {inspectedDomain && <AgentReasoningLab domain={inspectedDomain} lang="en" onClose={() => setInspectedDomain(null)} />}

      <header className="header">
        <div className="flex items-center gap-8">
           <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center font-serif text-[#d4af37] text-2xl shadow-2xl">I</div>
           <h1 className="prestige-title text-2xl tracking-tighter italic text-white hidden sm:block">Isthmic Pro.</h1>
        </div>
        
        <div className="flex items-center gap-10">
           <div className="hidden md:flex items-center gap-4 px-6 py-2 bg-white/5 border border-white/10 rounded-full">
              <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse shadow-[0_0_10px_#d4af37]"></div>
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">System: Alpha</span>
           </div>
           <button onClick={logout} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-red-500 transition-all hover:rotate-90">
              <i className="fas fa-power-off text-lg"></i>
           </button>
        </div>
      </header>

      <aside className="sidebar">
        <nav className="space-y-4">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center gap-5 px-8 py-5 rounded-2xl transition-all font-bold uppercase text-[10px] tracking-[0.2em]
                ${activeTab === item.id 
                  ? 'bg-white text-black shadow-2xl scale-[1.02]' 
                  : 'bg-transparent text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <i className={`fas ${item.icon} text-sm w-6`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-10 left-6 right-6 p-6 glass-panel border-white/10">
           <div className="flex items-center gap-4">
              <img src={activeProfile.avatar} className="w-10 h-10 rounded-xl border border-white/20 shadow-xl" alt="P" />
              <div className="min-w-0">
                 <div className="text-xs font-black truncate uppercase text-white">{activeProfile.name}</div>
                 <div className="text-[9px] font-bold text-[#d4af37] uppercase opacity-60 tracking-widest">{activeProfile.subscriptionTier}</div>
              </div>
           </div>
        </div>
      </aside>

      <main className="main">
        <div className="max-w-7xl mx-auto space-y-16">
          {activeTab === AgentType.INTELLIGENCE && <IntelligenceHub stats={stats} lang="en" onInitiateScan={initiateScan} isScanning={isScanning} activeWorkflow={activeWorkflow} />}
          {activeTab === AgentType.ACQUISITION && <AcquisitionDesk domains={domains} setDomains={setDomains} addLog={addLog} lang="en" />}
          {activeTab === AgentType.OPERATIONS && <OperationsHub domains={domains} setDomains={setDomains} onInspect={setInspectedDomain} lang="en" />}
          {activeTab === AgentType.LIQUIDATION && <LiquidationEngine domains={domains} setDomains={setDomains} lang="en" />}
          {activeTab === AgentType.MANAGEMENT && <ExecutiveSuite domains={domains} stats={stats} integrations={[]} onConnect={()=>{}} lang="en" />}
          {activeTab === AgentType.ADMIN_PANEL && <AdminHub />}
        </div>
      </main>

      <TickerTape lang="en" />
      <SonnerNotification notifications={activityLogs.map(l => ({ ...l, type: l.type as any }))} onDismiss={()=>{}} />
    </div>
  );
};

const App: React.FC = () => (
  <DomainProvider><AppContent /></DomainProvider>
);
export default App;
