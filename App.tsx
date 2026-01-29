
import React, { useState, useEffect } from 'react';
import { AgentType, Domain } from './types';
import { DomainProvider, useDomainContext } from './context/DomainContext';
import { useMasterBrain } from './hooks/useMasterBrain';
import { AuthService } from './services/AuthService';

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
  const { isInitialLoading, loadWorkspaceData } = useDomainContext() as any;
  const [view, setView] = useState<'login' | 'signup' | 'forgot' | 'recovery' | 'loading'>('login');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [question, setQuestion] = useState('What was your first school?');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fetchedQuestion, setFetchedQuestion] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password || !answer) { setError('All fields including Security Answer required'); return; }
    setView('loading');
    try {
      const user = await AuthService.signup(name, email, password, question, answer);
      await loadWorkspaceData(user);
    } catch (e: any) {
      setError(e.message);
      setView('signup');
    }
  };

  const handleLogin = async () => {
    setView('loading');
    try {
      const user = await AuthService.login(email, password);
      await loadWorkspaceData(user);
    } catch (e: any) {
      setError(e.message);
      setView('login');
    }
  };

  const startRecovery = async () => {
    try {
      const q = await AuthService.getQuestion(email);
      setFetchedQuestion(q);
      setView('recovery');
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleReset = async () => {
    try {
      await AuthService.recoverWithQuestion(email, answer, password);
      setError("Success! Account recovered. Please login.");
      setView('login');
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (isInitialLoading || view === 'loading') return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0c] gap-10">
      <div className="relative">
        <div className="w-20 h-20 border-2 border-white/5 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-t-[#c5a059] border-transparent rounded-full animate-spin"></div>
        <i className="fas fa-database absolute inset-0 flex items-center justify-center text-[#c5a059] animate-pulse"></i>
      </div>
      <div className="text-[9px] font-black text-white uppercase tracking-[0.5em] animate-pulse">Connecting to Central Registry...</div>
    </div>
  );

  return (
    <div className="h-screen bg-[#0a0a0c] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="z-10 w-full max-w-xl space-y-10 animate-precision">
        
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-[#c5a059]/10 rounded-3xl flex items-center justify-center text-[#c5a059] mx-auto border border-[#c5a059]/20 shadow-2xl">
             <i className={`fas ${view === 'signup' ? 'fa-id-card' : view === 'recovery' ? 'fa-user-shield' : 'fa-vault'} text-3xl`}></i>
          </div>
          <h1 className="text-5xl prestige-heading text-white italic tracking-tighter">Isthmic Pro</h1>
          <p className="text-slate-600 uppercase text-[8px] font-black tracking-[0.4em]">Hybrid Centralized Database</p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10 lg:p-14 shadow-3xl">
          
          {view === 'login' && (
            <div className="space-y-6 animate-slide-up">
               <div className="space-y-4">
                  <input 
                    type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none"
                  />
                  <input 
                    type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none"
                  />
                  {error && <p className="text-red-500 text-[9px] font-black uppercase text-center">{error}</p>}
                  <button onClick={handleLogin} className="w-full bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all">
                    Access Private Registry
                  </button>
                  <div className="flex justify-between items-center px-2">
                     <button onClick={() => setView('signup')} className="text-[#c5a059] text-[9px] font-black uppercase">New Account</button>
                     <button onClick={() => setView('forgot')} className="text-slate-600 text-[9px] font-black uppercase">Lost Access?</button>
                  </div>
               </div>
            </div>
          )}

          {view === 'signup' && (
            <div className="space-y-6 animate-slide-up">
               <div className="space-y-4">
                  <input 
                    type="text" placeholder="Owner Name" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none"
                  />
                  <input 
                    type="email" placeholder="Gmail Address" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none"
                  />
                  <input 
                    type="password" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none"
                  />
                  
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest text-center">Security Question for Recovery</p>
                    <select value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white text-xs">
                       <option>What was your first school?</option>
                       <option>What is your mother's maiden name?</option>
                       <option>What was the name of your first pet?</option>
                       <option>In what city were you born?</option>
                    </select>
                    <input 
                      type="text" placeholder="Your Answer (Save this carefully)" value={answer} onChange={(e) => setAnswer(e.target.value)}
                      className="w-full bg-black/40 border border-[#c5a059]/30 rounded-2xl px-6 py-4 text-white outline-none"
                    />
                  </div>

                  {error && <p className="text-red-500 text-[9px] font-black uppercase text-center">{error}</p>}
                  <button onClick={handleSignup} className="w-full bg-[#c5a059] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                    Register Central Account
                  </button>
                  <button onClick={() => setView('login')} className="w-full text-slate-600 text-[9px] font-black uppercase text-center py-2">Back to Login</button>
               </div>
            </div>
          )}

          {view === 'forgot' && (
            <div className="space-y-6 animate-slide-up">
               <div className="text-center space-y-2">
                  <h3 className="text-white prestige-heading text-xl italic">Account Lookup</h3>
                  <p className="text-slate-500 text-[9px] font-bold uppercase">Enter email to fetch security question</p>
               </div>
               <div className="space-y-4">
                  <input 
                    type="email" placeholder="Enter your registered email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none"
                  />
                  {error && <p className="text-red-500 text-[9px] font-black uppercase text-center">{error}</p>}
                  <button onClick={startRecovery} className="w-full bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Verify Account
                  </button>
                  <button onClick={() => setView('login')} className="w-full text-slate-600 text-[9px] font-black uppercase text-center">Back</button>
               </div>
            </div>
          )}

          {view === 'recovery' && (
            <div className="space-y-6 animate-slide-up">
               <div className="text-center space-y-2">
                  <h3 className="text-[#c5a059] prestige-heading text-xl italic">Verify Ownership</h3>
                  <p className="text-white text-[10px] font-bold uppercase bg-white/5 p-4 rounded-xl">{fetchedQuestion}</p>
               </div>
               <div className="space-y-4">
                  <input 
                    type="text" placeholder="Your Answer" value={answer} onChange={(e) => setAnswer(e.target.value)}
                    className="w-full bg-black/40 border border-[#c5a059]/40 rounded-2xl px-6 py-4 text-white outline-none"
                  />
                  <input 
                    type="password" placeholder="Set New Password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none"
                  />
                  {error && <p className="text-red-500 text-[9px] font-black uppercase text-center">{error}</p>}
                  <button onClick={handleReset} className="w-full bg-green-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Recover Account Now
                  </button>
                  <button onClick={() => setView('login')} className="w-full text-slate-600 text-[9px] font-black uppercase text-center">Cancel</button>
               </div>
            </div>
          )}
        </div>
        
        <p className="text-center text-[8px] text-slate-700 font-bold uppercase tracking-[0.3em] opacity-40">
           Global Auth Layer • Sovereign Data Vault • Multi-Agent AI
        </p>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { 
    activeProfile, logout, domains, setDomains, integrations, stats, notifications, 
    dismissNotification, addLog, connectService, strategy, syncStatus
  } = useDomainContext() as any;
  
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
      
      <aside 
        style={{ gridArea: 'sidebar' }}
        className={`z-sidebar bg-[#111113] border-white/5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isSidebarOpen ? 'translate-x-0 w-full lg:w-[var(--sidebar-width)]' : '-translate-x-full lg:translate-x-0 w-[var(--sidebar-width)]'} 
          fixed lg:static top-0 bottom-0 left-0 border-r
        `}
      >
        <div className="p-10 lg:p-14 flex flex-col h-full">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-5">
              <div className="icon-box bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059]">
                <i className="fas fa-cube text-xl"></i>
              </div>
              <span className="text-[12px] font-black tracking-[0.5em] text-white uppercase italic">Isthmic</span>
            </div>
          </div>
          
          <nav className="flex-1 space-y-4">
            <button onClick={() => {setActiveTab(AgentType.INTELLIGENCE); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl ${activeTab === AgentType.INTELLIGENCE ? 'bg-white/5 text-white border-white/10' : 'text-slate-500'}`}>
              <i className="fas fa-brain"></i> <span className="text-[10px] font-black uppercase">Intelligence</span>
            </button>
            <button onClick={() => {setActiveTab(AgentType.ACQUISITION); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl ${activeTab === AgentType.ACQUISITION ? 'bg-white/5 text-white border-white/10' : 'text-slate-500'}`}>
              <i className="fas fa-crosshairs"></i> <span className="text-[10px] font-black uppercase">Acquisition</span>
            </button>
            <button onClick={() => {setActiveTab(AgentType.OPERATIONS); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl ${activeTab === AgentType.OPERATIONS ? 'bg-white/5 text-white border-white/10' : 'text-slate-500'}`}>
              <i className="fas fa-layer-group"></i> <span className="text-[10px] font-black uppercase">Operations</span>
            </button>
            <button onClick={() => {setActiveTab(AgentType.LIQUIDATION); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl ${activeTab === AgentType.LIQUIDATION ? 'bg-white/5 text-white border-white/10' : 'text-slate-500'}`}>
              <i className="fas fa-money-bill-wave"></i> <span className="text-[10px] font-black uppercase">Liquidation</span>
            </button>
            <button onClick={() => {setActiveTab(AgentType.MANAGEMENT); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl ${activeTab === AgentType.MANAGEMENT ? 'bg-white/5 text-white border-white/10' : 'text-slate-500'}`}>
              <i className="fas fa-file-signature"></i> <span className="text-[10px] font-black uppercase">Management</span>
            </button>
          </nav>

          <div className="pt-8 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <img src={activeProfile.avatar} className="w-10 h-10 rounded-xl" alt="Avatar" />
                <div className="text-left">
                  <div className="text-white text-xs font-bold italic">{activeProfile.name}</div>
                  <div className="text-[8px] text-green-500 font-black uppercase tracking-tighter italic">Cloud Auth Active</div>
                </div>
             </div>
             <button onClick={logout} className="text-slate-500 hover:text-red-500"><i className="fas fa-power-off"></i></button>
          </div>
        </div>
      </aside>
      
      <header style={{ gridArea: 'header' }} className="z-header flex items-center justify-between px-10 lg:px-14 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-xl">
        <div className="flex items-center gap-8">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden icon-box bg-white/5 text-slate-400">
             <i className="fas fa-bars"></i>
          </button>
          <div className="text-white prestige-heading text-lg">Command Console</div>
        </div>
        <div className="flex items-center gap-8 text-right">
           <div className="hidden md:block">
              <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Est. Portfolio Value</div>
              <div className="text-xl font-light text-white prestige-heading">$ {stats.estimatedPortfolioValue.toLocaleString()}</div>
           </div>
           <div className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase ${syncStatus === 'healthy' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/20'}`}>
              <i className="fas fa-database mr-2"></i> Registry Secured
           </div>
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
