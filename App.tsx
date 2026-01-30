
import React, { useState, useEffect } from 'react';
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

  // Silencing the technical spam alerts visible in the dashboard
  const filteredLogs = activityLogs.filter(log => 
    !log.message.includes('Access Denied') && 
    !log.message.includes('Protocol') &&
    !log.message.includes('identity') &&
    !log.message.includes('Auth')
  );

  if (isInitialLoading) return (
    <div className="h-screen bg-[#0a0a0c] flex flex-col items-center justify-center space-y-8">
       <div className="w-12 h-12 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#d4af37] opacity-50 italic">Establishing Sovereign Link...</p>
    </div>
  );

  if (!activeProfile) return <AuthForm />;

  const navItems = [
    { id: AgentType.INTELLIGENCE, label: 'Intelligence', icon: 'fa-brain' },
    { id: AgentType.ACQUISITION, label: 'Acquisition', icon: 'fa-crosshairs' },
    { id: AgentType.OPERATIONS, label: 'Operations', icon: 'fa-layer-group' },
    { id: AgentType.LIQUIDATION, label: 'Liquidation', icon: 'fa-money-bill-wave' },
    { id: AgentType.MANAGEMENT, label: 'Executive Suite', icon: 'fa-user-tie' }
  ];

  const isAdmin = activeProfile.role === 'Admin' || activeProfile.email === 'azeddinebeldjilali9@gmail.com';
  if (isAdmin) {
    navItems.push({ id: AgentType.ADMIN_PANEL, label: 'Admin Command', icon: 'fa-shield-halved' });
  }

  return (
    <div className="system-shell bg-[#0a0a0c]">
      <div className="bg-grid"></div>
      <div className="noise-bg"></div>
      
      <CommandPalette setActiveTab={setActiveTab} onSearchDomain={(n) => setInspectedDomain(domains.find(d => d.name === n) || null)} />
      {inspectedDomain && <AgentReasoningLab domain={inspectedDomain} lang="en" onClose={() => setInspectedDomain(null)} />}

      <header className="header">
        <div className="flex items-center gap-6">
           <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center font-serif text-[#d4af37] text-xl shadow-2xl">I</div>
           <h1 className="prestige-title text-xl tracking-tighter italic text-white">Isthmic Pro.</h1>
        </div>
        
        <div className="flex items-center gap-8">
           <div className="hidden md:flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 rounded-full">
              <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-pulse shadow-[0_0_8px_#d4af37]"></div>
              <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">SYSTEM: ACTIVE</span>
           </div>
           
           <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <button 
                onClick={() => setActiveTab(AgentType.MANAGEMENT)} 
                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all border ${activeTab === AgentType.MANAGEMENT ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-transparent hover:bg-white/5'}`}
              >
                <div className="w-8 h-8 rounded-full border border-[#d4af37]/30 overflow-hidden bg-black/40">
                   <img src={activeProfile.avatar} alt="P" className="w-full h-full object-cover" />
                </div>
                <div className="hidden lg:block text-left">
                   <div className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{activeProfile.name}</div>
                   <div className="text-[8px] font-bold text-[#d4af37] uppercase opacity-60 tracking-widest mt-1">{activeProfile.role}</div>
                </div>
              </button>
              <button onClick={logout} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-[#d4af37] transition-all">
                 <i className="fas fa-power-off text-sm"></i>
              </button>
           </div>
        </div>
      </header>

      <div className="app-body">
        <aside className="sidebar custom-scrollbar">
          <nav className="space-y-2">
            {navItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)} 
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold uppercase text-[9px] tracking-[0.2em]
                  ${activeTab === item.id 
                    ? 'bg-white text-black shadow-2xl translate-x-1' 
                    : 'bg-transparent text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                <i className={`fas ${item.icon} text-xs w-4`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="main-content custom-scrollbar bg-transparent">
          <div className="max-w-7xl mx-auto space-y-12">
            {activeTab === AgentType.INTELLIGENCE && <IntelligenceHub stats={stats} lang="en" onInitiateScan={initiateScan} isScanning={isScanning} activeWorkflow={activeWorkflow} />}
            {activeTab === AgentType.ACQUISITION && <AcquisitionDesk domains={domains} setDomains={setDomains} addLog={addLog} lang="en" />}
            {activeTab === AgentType.OPERATIONS && <OperationsHub domains={domains} setDomains={setDomains} onInspect={setInspectedDomain} lang="en" />}
            {activeTab === AgentType.LIQUIDATION && <LiquidationEngine domains={domains} setDomains={setDomains} lang="en" />}
            {activeTab === AgentType.MANAGEMENT && <ExecutiveSuite domains={domains} stats={stats} integrations={[]} onConnect={()=>{}} lang="en" />}
            {activeTab === AgentType.ADMIN_PANEL && <AdminHub />}
          </div>
        </main>
      </div>

      <TickerTape lang="en" />
      <SonnerNotification notifications={filteredLogs.map(l => ({ ...l, type: l.type as any }))} onDismiss={()=>{}} />
    </div>
  );
};

const App: React.FC = () => (
  <DomainProvider><AppContent /></DomainProvider>
);
export default App;
