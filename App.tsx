
import React, { useState, useEffect } from 'react';
import { AgentType, Domain } from './types';
import { DomainProvider, useDomainContext } from './context/DomainContext';
import { useMasterBrain } from './hooks/useMasterBrain';

// Optimized Hubs
import IntelligenceHub from './components/hubs/IntelligenceHub';
import AcquisitionDesk from './components/hubs/AcquisitionDesk';
import OperationsHub from './components/hubs/OperationsHub';
import LiquidationEngine from './components/hubs/LiquidationEngine';
import ExecutiveSuite from './components/hubs/ExecutiveSuite';

// UI
import CommandPalette from './components/CommandPalette';
import AgentReasoningLab from './components/AgentReasoningLab';
import SonnerNotification from './components/SonnerNotification';
import TickerTape from './components/TickerTape';

const LoginScreen: React.FC = () => {
  const { isInitialLoading, signup, login } = useDomainContext() as any;
  const [view, setView] = useState<'login' | 'signup' | 'loading'>('login');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    if (!name || !email || !password) { setError('Please fill all fields'); return; }
    setError(null);
    setView('loading');
    try {
      await signup(name, email, password);
    } catch (e: any) {
      setError(e.message || "Signup failed");
      setView('signup');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) { setError('Email and Password required'); return; }
    setError(null);
    setView('loading');
    try {
      await login(email, password);
    } catch (e: any) {
      setError(e.message || "Invalid credentials");
      setView('login');
    }
  };

  if (isInitialLoading || view === 'loading') return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0c] gap-10">
      <div className="relative">
        <div className="w-24 h-24 border-2 border-white/5 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-t-[#c5a059] border-transparent rounded-full animate-spin"></div>
        <i className="fas fa-cloud-bolt absolute inset-0 flex items-center justify-center text-[#c5a059] text-2xl animate-pulse"></i>
      </div>
      <div className="text-[10px] font-black text-white uppercase tracking-[0.6em] animate-pulse">Connecting to Sovereign Cloud...</div>
    </div>
  );

  return (
    <div className="h-screen bg-[#0a0a0c] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="z-10 w-full max-w-xl space-y-10">
        
        <div className="text-center space-y-4">
          <h1 className="text-5xl prestige-heading text-white italic tracking-tighter">Isthmic Pro</h1>
          <p className="text-slate-600 uppercase text-[8px] font-black tracking-[0.4em]">Real-Time Database Auth</p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10 shadow-3xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold text-center">
              <i className="fas fa-exclamation-circle mr-2"></i> {error}
            </div>
          )}

          {view === 'login' ? (
            <div className="space-y-6">
               <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#c5a059]/50" />
               <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#c5a059]/50" />
               <button onClick={handleLogin} className="w-full bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all">Enter Console</button>
               <button onClick={() => setView('signup')} className="w-full text-[#c5a059] text-[9px] font-black uppercase">Create New Identity</button>
            </div>
          ) : (
            <div className="space-y-6">
               <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white outline-none" />
               <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white outline-none" />
               <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white outline-none" />
               <button onClick={handleSignup} className="w-full bg-[#c5a059] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Register Asset</button>
               <button onClick={() => setView('login')} className="w-full text-slate-600 text-[9px] font-black uppercase">Back to Login</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { activeProfile, logout, domains, setDomains, integrations, stats, notifications, dismissNotification, addLog, connectService, strategy } = useDomainContext() as any;
  const [activeTab, setActiveTab] = useState<AgentType>(AgentType.INTELLIGENCE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inspectedDomain, setInspectedDomain] = useState<Domain | null>(null);
  const { isScanning, initiateScan } = useMasterBrain(strategy, 'en');

  if (!activeProfile) return <LoginScreen />;

  return (
    <div className="app-shell relative bg-[#0a0a0c] selection:bg-[#c5a059]/30">
      <CommandPalette setActiveTab={setActiveTab} onSearchDomain={(name) => {
        const d = domains.find((x: any) => x.name === name);
        if (d) setInspectedDomain(d);
      }} />
      
      {inspectedDomain && <AgentReasoningLab domain={inspectedDomain} lang="en" onClose={() => setInspectedDomain(null)} />}
      
      <aside style={{ gridArea: 'sidebar' }} className={`z-sidebar bg-[#111113] border-white/5 transition-all duration-700 fixed lg:static top-0 bottom-0 left-0 border-r ${isSidebarOpen ? 'translate-x-0 w-full lg:w-[var(--sidebar-width)]' : '-translate-x-full lg:translate-x-0 w-[var(--sidebar-width)]'}`}>
        <div className="p-10 flex flex-col h-full">
          <div className="flex items-center gap-5 mb-16">
            <div className="icon-box bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059]"><i className="fas fa-cube text-xl"></i></div>
            <span className="text-[12px] font-black tracking-[0.5em] text-white uppercase italic">Isthmic</span>
          </div>
          <nav className="flex-1 space-y-4">
            <button onClick={() => {setActiveTab(AgentType.INTELLIGENCE); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl ${activeTab === AgentType.INTELLIGENCE ? 'bg-white/5 text-white' : 'text-slate-500'}`}><i className="fas fa-brain"></i> <span className="text-[10px] font-black uppercase">Intelligence</span></button>
            <button onClick={() => {setActiveTab(AgentType.ACQUISITION); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl ${activeTab === AgentType.ACQUISITION ? 'bg-white/5 text-white' : 'text-slate-500'}`}><i className="fas fa-crosshairs"></i> <span className="text-[10px] font-black uppercase">Acquisition</span></button>
            <button onClick={() => {setActiveTab(AgentType.OPERATIONS); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl ${activeTab === AgentType.OPERATIONS ? 'bg-white/5 text-white' : 'text-slate-500'}`}><i className="fas fa-layer-group"></i> <span className="text-[10px] font-black uppercase">Operations</span></button>
            <button onClick={() => {setActiveTab(AgentType.LIQUIDATION); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl ${activeTab === AgentType.LIQUIDATION ? 'bg-white/5 text-white' : 'text-slate-500'}`}><i className="fas fa-money-bill-wave"></i> <span className="text-[10px] font-black uppercase">Liquidation</span></button>
            <button onClick={() => {setActiveTab(AgentType.MANAGEMENT); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl ${activeTab === AgentType.MANAGEMENT ? 'bg-white/5 text-white' : 'text-slate-500'}`}><i className="fas fa-file-signature"></i> <span className="text-[10px] font-black uppercase">Management</span></button>
          </nav>
          <div className="pt-8 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <img src={activeProfile.avatar} className="w-10 h-10 rounded-xl" alt="Avatar" />
                <div className="text-left">
                  <div className="text-white text-xs font-bold italic">{activeProfile.name}</div>
                  <div className="text-[8px] text-green-500 font-black uppercase italic tracking-tighter">Live Cloud</div>
                </div>
             </div>
             <button onClick={logout} className="text-slate-500 hover:text-red-500"><i className="fas fa-power-off"></i></button>
          </div>
        </div>
      </aside>
      
      <header style={{ gridArea: 'header' }} className="z-header flex items-center justify-between px-10 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-xl">
        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden icon-box bg-white/5 text-slate-400"><i className="fas fa-bars"></i></button>
        <div className="text-white prestige-heading text-lg">Command Console</div>
        <div className="px-4 py-2 rounded-xl text-[8px] font-black uppercase bg-green-500/10 text-green-500 border border-green-500/20 flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          Database: Online
        </div>
      </header>
      
      <main style={{ gridArea: 'main' }} className="content-scroller no-scrollbar p-6">
        <div className="max-w-[1600px] mx-auto">
          {activeTab === AgentType.INTELLIGENCE && <IntelligenceHub stats={stats} lang="en" onInitiateScan={initiateScan} isScanning={isScanning} />}
          {activeTab === AgentType.ACQUISITION && <AcquisitionDesk domains={domains} setDomains={setDomains} addLog={addLog} lang="en" />}
          {activeTab === AgentType.OPERATIONS && <OperationsHub domains={domains} setDomains={setDomains} onInspect={setInspectedDomain} lang="en" />}
          {activeTab === AgentType.LIQUIDATION && <LiquidationEngine domains={domains} setDomains={setDomains} lang="en" />}
          {activeTab === AgentType.MANAGEMENT && <ExecutiveSuite domains={domains} stats={stats} integrations={integrations} onConnect={connectService} lang="en" />}
        </div>
      </main>

      <TickerTape lang="en" />
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
