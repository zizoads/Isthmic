
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
  const { 
    activeProfile, 
    logout, 
    domains, 
    setDomains,
    stats, 
    strategy, 
    isInitialLoading, 
    activityLogs,
    addLog
  } = useDomainContext();
  
  const [activeTab, setActiveTab] = useState<AgentType>(AgentType.INTELLIGENCE);
  const [inspectedDomain, setInspectedDomain] = useState<Domain | null>(null);
  const { isScanning, initiateScan, activeWorkflow } = useMasterBrain(strategy, 'en');

  if (isInitialLoading) return (
    <div className="h-screen bg-[#0a0a0c] flex flex-col items-center justify-center">
       <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent animate-spin"></div>
       <p className="mt-4 text-mute text-gold">PROTOCOL_BOOT</p>
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
      
      <CommandPalette setActiveTab={setActiveTab} onSearchDomain={(n) => setInspectedDomain(domains.find(d => d.name === n) || null)} />
      {inspectedDomain && <AgentReasoningLab domain={inspectedDomain} lang="en" onClose={() => setInspectedDomain(null)} />}

      <header className="header">
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center font-serif text-[#d4af37] text-lg shadow-[3px_3px_0px_0px_#000]">I</div>
           <h1 className="prestige-title text-lg tracking-tighter italic text-white">Isthmic</h1>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10">
              <div className="w-1 h-1 bg-[#d4af37] rounded-full animate-pulse"></div>
              <span className="text-[8px] font-black tracking-widest text-slate-500 uppercase">SYS_ACTIVE</span>
           </div>
           <button onClick={logout} className="text-slate-500 hover:text-red-500 transition-colors text-sm">
              <i className="fas fa-power-off"></i>
           </button>
        </div>
      </header>

      <aside className="sidebar">
        <nav className="space-y-1.5">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center gap-3 px-4 py-3 border transition-all font-black uppercase text-[9px] tracking-widest
                ${activeTab === item.id 
                  ? 'bg-[#d4af37] border-black text-black shadow-[3px_3px_0px_0px_#000] -translate-x-0.5 -translate-y-0.5' 
                  : 'bg-transparent border-transparent text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <i className={`fas ${item.icon} text-[10px] w-4`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-3">
           <img src={activeProfile.avatar} className="w-6 h-6 border border-white/10" alt="P" />
           <div className="min-w-0">
              <div className="text-[9px] font-black truncate uppercase tracking-widest text-white">{activeProfile.name}</div>
              <div className="text-[7px] font-bold text-[#d4af37] uppercase opacity-40">{activeProfile.subscriptionTier}</div>
           </div>
        </div>
      </aside>

      <main className="main">
        <div className="max-w-6xl mx-auto stack-lg">
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
