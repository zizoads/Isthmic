
import React, { useState, useEffect } from 'react';
import { AgentType, Domain } from './types';
import { DomainProvider, useDomainContext } from './context/DomainContext';
import { useMasterBrain } from './hooks/useMasterBrain';
import { checkSupabaseConnection } from './services/SupabaseClient';

// Hubs
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

const LoginScreen: React.FC = () => {
  const { isInitialLoading, signup, login } = useDomainContext() as any;
  const [view, setView] = useState<'login' | 'signup' | 'loading'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const check = async () => {
      const isOnline = await checkSupabaseConnection();
      setServerStatus(isOnline ? 'online' : 'offline');
    };
    check();
  }, []);

  const handleSignup = async () => {
    if (!name || !email || !password) { setError('يرجى ملء جميع الحقول'); return; }
    setError(null);
    setView('loading');
    try {
      await signup(name, email, password);
    } catch (e: any) {
      setError(e.message);
      setView('signup');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) { setError('الإيميل وكلمة السر مطلوبان'); return; }
    setError(null);
    setView('loading');
    try {
      await login(email, password);
    } catch (e: any) {
      setError(e.message);
      setView('login');
    }
  };

  if (isInitialLoading || view === 'loading') return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0c]">
      <div className="w-16 h-16 border-4 border-t-[#c5a059] border-white/10 rounded-full animate-spin mb-6"></div>
      <div className="text-[10px] text-white font-black tracking-widest animate-pulse uppercase">Verifying Sovereign Identity...</div>
    </div>
  );

  return (
    <div className="h-screen bg-[#0a0a0c] flex items-center justify-center p-6 font-sans overflow-y-auto">
      <div className="w-full max-w-md space-y-8 my-auto">
        <div className="text-center">
          <h1 className="text-4xl font-light text-white italic tracking-tighter">Isthmic Pro</h1>
          <p className="text-[#c5a059] text-[9px] font-black uppercase tracking-[0.4em] mt-2">Strategic Asset Command</p>
        </div>

        <div className="bg-[#111113] border border-white/5 rounded-[32px] p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 border ${
              serverStatus === 'online' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
              serverStatus === 'offline' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-white/5 text-slate-500 border-white/5'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${serverStatus === 'online' ? 'bg-green-500 animate-pulse' : serverStatus === 'offline' ? 'bg-red-500' : 'bg-slate-500'}`}></div>
              {serverStatus === 'online' ? 'Sovereign Cloud: Online' : serverStatus === 'offline' ? 'Sovereign Cloud: Offline' : 'Verifying Cloud...'}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-bold text-center leading-relaxed whitespace-pre-wrap">
              {error}
            </div>
          )}

          {view === 'login' ? (
            <div className="space-y-4">
              <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#c5a059]/50" />
              <input type="password" placeholder="كلمة السر" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#c5a059]/50" />
              <button onClick={handleLogin} disabled={serverStatus === 'offline'} className="w-full bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all disabled:opacity-50">دخول آمن</button>
              <button onClick={() => setView('signup')} className="w-full text-slate-500 text-[10px] font-bold uppercase py-2 tracking-widest">إنشاء هوية جديدة</button>
            </div>
          ) : (
            <div className="space-y-4">
              <input type="text" placeholder="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#c5a059]/50" />
              <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#c5a059]/50" />
              <input type="password" placeholder="كلمة السر" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#c5a059]/50" />
              <button onClick={handleSignup} disabled={serverStatus === 'offline'} className="w-full bg-[#c5a059] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-50">تسجيل الهوية</button>
              <button onClick={() => setView('login')} className="w-full text-slate-500 text-[10px] font-bold uppercase py-2 tracking-widest">العودة لتسجيل الدخول</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { activeProfile, isEmailConfirmed, logout, domains, setDomains, integrations, stats, notifications, dismissNotification, addLog, connectService, strategy } = useDomainContext() as any;
  const [activeTab, setActiveTab] = useState<AgentType>(AgentType.INTELLIGENCE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inspectedDomain, setInspectedDomain] = useState<Domain | null>(null);
  const { isScanning, initiateScan } = useMasterBrain(strategy, 'en');

  if (!activeProfile) return <LoginScreen />;

  const isAdmin = activeProfile.role === 'Admin';

  return (
    <div className="app-shell bg-[#0a0a0c] selection:bg-[#c5a059]/30 overflow-hidden">
      <CommandPalette setActiveTab={setActiveTab} onSearchDomain={(name) => {
        const d = domains.find((x: any) => x.name === name);
        if (d) setInspectedDomain(d);
      }} />
      
      {inspectedDomain && <AgentReasoningLab domain={inspectedDomain} lang="en" onClose={() => setInspectedDomain(null)} />}
      
      {/* Sidebar - Pinned */}
      <aside className={`z-[200] bg-[#111113] border-white/5 transition-all duration-700 fixed lg:static top-0 bottom-0 left-0 border-r ${isSidebarOpen ? 'translate-x-0 w-full lg:w-[var(--sidebar-width)]' : '-translate-x-full lg:translate-x-0 w-[var(--sidebar-width)]'}`}>
        <div className="p-10 flex flex-col h-full">
          <div className="flex items-center gap-5 mb-16">
            <div className="icon-box bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059] shadow-2xl"><i className="fas fa-cube text-xl"></i></div>
            <span className="text-[12px] font-black tracking-[0.5em] text-white uppercase italic">Isthmic</span>
          </div>
          <nav className="flex-1 space-y-4">
            {isAdmin && (
              <button onClick={() => {setActiveTab(AgentType.ADMIN_PANEL); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl ${activeTab === AgentType.ADMIN_PANEL ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-slate-500 hover:text-white transition-colors'}`}><i className="fas fa-shield-halved"></i> <span className="text-[10px] font-black uppercase">Admin Hub</span></button>
            )}
            <button onClick={() => {setActiveTab(AgentType.INTELLIGENCE); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl ${activeTab === AgentType.INTELLIGENCE ? 'bg-white/5 text-white shadow-xl' : 'text-slate-500 hover:text-white transition-colors'}`}><i className="fas fa-brain"></i> <span className="text-[10px] font-black uppercase">Intelligence</span></button>
            <button onClick={() => {setActiveTab(AgentType.ACQUISITION); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl ${activeTab === AgentType.ACQUISITION ? 'bg-white/5 text-white shadow-xl' : 'text-slate-500 hover:text-white transition-colors'}`}><i className="fas fa-crosshairs"></i> <span className="text-[10px] font-black uppercase">Acquisition</span></button>
            <button onClick={() => {setActiveTab(AgentType.OPERATIONS); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl ${activeTab === AgentType.OPERATIONS ? 'bg-white/5 text-white shadow-xl' : 'text-slate-500 hover:text-white transition-colors'}`}><i className="fas fa-layer-group"></i> <span className="text-[10px] font-black uppercase">Operations</span></button>
            <button onClick={() => {setActiveTab(AgentType.LIQUIDATION); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl ${activeTab === AgentType.LIQUIDATION ? 'bg-white/5 text-white shadow-xl' : 'text-slate-500 hover:text-white transition-colors'}`}><i className="fas fa-money-bill-wave"></i> <span className="text-[10px] font-black uppercase">Liquidation</span></button>
            <button onClick={() => {setActiveTab(AgentType.MANAGEMENT); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl ${activeTab === AgentType.MANAGEMENT ? 'bg-[#c5a059] text-black shadow-2xl' : 'text-slate-500 hover:text-white transition-colors'}`}><i className="fas fa-user-circle"></i> <span className="text-[10px] font-black uppercase">Profile & Command</span></button>
          </nav>
          <div className="pt-8 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <img src={activeProfile.avatar} className="w-10 h-10 rounded-xl" alt="Avatar" />
                <div className="text-left">
                  <div className="text-white text-xs font-bold italic">{activeProfile.name}</div>
                  <div className="text-[8px] text-[#c5a059] font-black uppercase italic tracking-tighter">Sovereign Link</div>
                </div>
             </div>
             <button onClick={logout} className="text-slate-500 hover:text-red-500 transition-colors"><i className="fas fa-power-off"></i></button>
          </div>
        </div>
      </aside>
      
      {/* Header - Pinned */}
      <header className="z-[100] flex items-center justify-between px-10 border-b border-white/5 bg-[#0a0a0c]/90 backdrop-blur-2xl">
        <div className="flex items-center gap-6">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden icon-box bg-white/5 text-slate-400 hover:text-white transition-colors"><i className="fas fa-bars"></i></button>
          <div className="text-white prestige-heading text-xl italic tracking-tighter">Command Console</div>
        </div>
        
        <div className="flex items-center gap-6">
          {!isEmailConfirmed && (
            <button onClick={() => setActiveTab(AgentType.MANAGEMENT)} className="px-4 py-2 rounded-xl text-[8px] font-black uppercase bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-2 animate-pulse">
              <i className="fas fa-user-shield"></i> Identity Pending
            </button>
          )}
          <div className="px-4 py-2 rounded-xl text-[8px] font-black uppercase bg-green-500/10 text-green-500 border border-green-500/20 flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            Sync: Secured
          </div>
        </div>
      </header>
      
      {/* Main Content - SCROLLABLE */}
      <main className="no-scrollbar">
        <div className="max-w-[1400px] mx-auto animate-precision">
          {activeTab === AgentType.ADMIN_PANEL && <AdminHub />}
          {activeTab === AgentType.INTELLIGENCE && <IntelligenceHub stats={stats} lang="en" onInitiateScan={initiateScan} isScanning={isScanning} />}
          {activeTab === AgentType.ACQUISITION && <AcquisitionDesk domains={domains} setDomains={setDomains} addLog={addLog} lang="en" />}
          {activeTab === AgentType.OPERATIONS && <OperationsHub domains={domains} setDomains={setDomains} onInspect={setInspectedDomain} lang="en" />}
          {activeTab === AgentType.LIQUIDATION && <LiquidationEngine domains={domains} setDomains={setDomains} lang="en" />}
          {activeTab === AgentType.MANAGEMENT && <ExecutiveSuite domains={domains} stats={stats} integrations={integrations} onConnect={connectService} lang="en" />}
        </div>
      </main>

      {/* Ticker - Pinned Bottom */}
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
