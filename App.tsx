
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

const LandingPage: React.FC<{ onAuth: () => void }> = ({ onAuth }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-[#c5a059]/30 overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] lg:w-[50%] h-[50%] bg-[#c5a059]/5 blur-[120px] lg:blur-[180px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] lg:w-[40%] h-[40%] bg-indigo-500/5 blur-[100px] lg:blur-[150px] rounded-full"></div>
      </div>

      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-xl px-6 lg:px-10 py-4 lg:py-6">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#c5a059]/10 border border-[#c5a059]/20 rounded-xl flex items-center justify-center text-[#c5a059]">
              <i className="fas fa-cube text-sm lg:text-base"></i>
            </div>
            <span className="text-[10px] lg:text-[12px] font-black tracking-[0.3em] lg:tracking-[0.4em] uppercase italic">Isthmic Pro</span>
          </div>
          <button 
            onClick={onAuth}
            className="px-5 lg:px-8 py-2.5 lg:py-3 bg-white text-black text-[9px] lg:text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-[#c5a059] hover:text-white transition-all shadow-2xl"
          >
            Access Terminal
          </button>
        </div>
      </nav>

      <section className="relative pt-32 lg:pt-48 pb-20 lg:pb-32 px-6 lg:px-10 text-center">
        <div className="max-w-5xl mx-auto space-y-8 lg:space-y-12">
          <div className="space-y-4 lg:space-y-6">
            <div className="flex justify-center items-center gap-4 lg:gap-6 mb-4 lg:mb-8">
               <div className="h-[1px] w-8 lg:w-12 bg-[#c5a059]/30"></div>
               <span className="text-[#c5a059] text-[8px] lg:text-[10px] font-black uppercase tracking-[0.4em] lg:tracking-[0.5em]">Industrial Grade AI Suite</span>
               <div className="h-[1px] w-8 lg:w-12 bg-[#c5a059]/30"></div>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-9xl font-light prestige-heading italic leading-tight lg:leading-none tracking-tighter">
              Sovereign Digital <br className="hidden md:block" /> Asset Management
            </h1>
            <p className="text-slate-500 text-sm md:text-lg lg:text-xl max-w-2xl mx-auto font-medium italic leading-relaxed">
              Multi-agent intelligence engineered for high-velocity discovery, forensic valuation, and global liquidation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 lg:gap-6 pt-4 lg:pt-8">
            <button onClick={onAuth} className="px-10 lg:px-14 py-4 lg:py-6 bg-[#c5a059] text-black text-[10px] lg:text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-[#c5a059]/20">
              Join the Command
            </button>
            <button className="px-10 lg:px-14 py-4 lg:py-6 bg-white/5 border border-white/10 text-[10px] lg:text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
              Platform Wiki
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-10 py-20 lg:py-32 bg-[#050507] border-y border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: 'Assets Inferred', value: '1.2M+', sub: 'Global Market Sweep' },
            { label: 'Capital Velocity', value: '$420M+', sub: 'Liquidation Volume' },
            { label: 'Success Ratio', value: '94.2%', sub: 'AI Closing Rate' },
            { label: 'Active Nodes', value: '12.4K', sub: 'Multi-Agent Workers' }
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2 lg:space-y-4">
              <div className="text-[9px] lg:text-[10px] font-black text-[#c5a059] uppercase tracking-widest opacity-50">{stat.label}</div>
              <div className="text-4xl lg:text-6xl font-light prestige-heading">{stat.value}</div>
              <div className="text-[7px] lg:text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] lg:tracking-[0.3em]">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-10 py-24 lg:py-48">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-8 bg-[#111113] border border-white/5 rounded-[32px] lg:rounded-[48px] p-8 lg:p-16 relative overflow-hidden group">
            <div className="relative z-10 space-y-6 lg:space-y-8">
              <h3 className="text-3xl lg:text-4xl prestige-heading italic">Autonomous Intelligence</h3>
              <p className="text-slate-400 text-base lg:text-lg leading-relaxed max-w-xl">
                Isthmic Pro reasons. Our multi-agent brain identifies market gaps and technical leverage before they become public knowledge.
              </p>
              <div className="grid grid-cols-2 gap-6 lg:gap-8 pt-4 lg:pt-8">
                <div className="space-y-3 lg:space-y-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#c5a059]"><i className="fas fa-microchip"></i></div>
                  <div className="text-[10px] lg:text-xs font-black uppercase tracking-widest">Neural Logic</div>
                </div>
                <div className="space-y-3 lg:space-y-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#c5a059]"><i className="fas fa-satellite-dish"></i></div>
                  <div className="text-[10px] lg:text-xs font-black uppercase tracking-widest">Global Sync</div>
                </div>
              </div>
            </div>
            <i className="fas fa-brain absolute right-[-40px] lg:right-[-50px] bottom-[-40px] lg:bottom-[-50px] text-white/5 text-[150px] lg:text-[300px] pointer-events-none group-hover:text-[#c5a059]/5 transition-colors duration-700"></i>
          </div>

          <div className="lg:col-span-4 bg-[#c5a059] text-black rounded-[32px] lg:rounded-[48px] p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10 mb-8 lg:mb-0">
              <h3 className="text-2xl lg:text-3xl prestige-heading italic mb-4 lg:mb-6">Forensic Audit</h3>
              <p className="text-black/70 text-sm leading-relaxed font-medium">
                Surgical OSINT audits that strip back ownership history and trademark risks in seconds.
              </p>
            </div>
            <div className="relative z-10 space-y-1 lg:space-y-2">
              <div className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">Confidence Score</div>
              <div className="text-4xl lg:text-5xl font-light prestige-heading">99.8%</div>
            </div>
            <i className="fas fa-shield-halved absolute right-[-20px] lg:right-[-30px] top-[-20px] lg:top-[-30px] text-black/5 text-[120px] lg:text-[200px] pointer-events-none"></i>
          </div>
        </div>
      </section>

      <footer className="px-6 lg:px-10 py-12 lg:py-20 border-t border-white/5 bg-[#050507]">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 lg:gap-10">
          <div className="flex items-center gap-4 grayscale opacity-50">
             <i className="fas fa-cube"></i>
             <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em] lg:tracking-[0.5em]">Isthmic Pro</span>
          </div>
          <div className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-slate-600 text-center">
            © 2024 Sovereign Asset Management Protocol. All rights reserved.
          </div>
          <div className="flex gap-6 lg:gap-8 text-slate-500">
             <i className="fab fa-twitter hover:text-[#c5a059] cursor-pointer"></i>
             <i className="fab fa-linkedin hover:text-[#c5a059] cursor-pointer"></i>
             <i className="fab fa-github hover:text-[#c5a059] cursor-pointer"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

const LoginScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
      <div className="w-12 h-12 border-4 border-t-[#c5a059] border-white/10 rounded-full animate-spin mb-6"></div>
      <div className="text-[9px] text-white font-black tracking-widest animate-pulse uppercase">Verifying Sovereign Identity...</div>
    </div>
  );

  return (
    <div className="h-screen bg-[#0a0a0c] flex items-center justify-center p-6 font-sans overflow-y-auto">
      <div className="w-full max-w-md space-y-6 lg:space-y-8 my-auto relative z-10">
        <button 
          onClick={onBack}
          className="absolute -top-12 lg:-top-16 left-0 text-[9px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-2"
        >
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>

        <div className="text-center">
          <h1 className="text-3xl lg:text-4xl font-light text-white italic tracking-tighter">Isthmic Pro</h1>
          <p className="text-[#c5a059] text-[8px] lg:text-[9px] font-black uppercase tracking-[0.4em] mt-2">Strategic Asset Command</p>
        </div>

        <div className="bg-[#111113] border border-white/5 rounded-[24px] lg:rounded-[32px] p-6 lg:p-8 shadow-2xl">
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
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-bold text-center leading-relaxed">
              {error}
            </div>
          )}

          {view === 'login' ? (
            <div className="space-y-4">
              <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-[#c5a059]/50" />
              <input type="password" placeholder="كلمة السر" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-[#c5a059]/50" />
              <button onClick={handleLogin} disabled={serverStatus === 'offline'} className="w-full bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all disabled:opacity-50">دخول آمن</button>
              <button onClick={() => setView('signup')} className="w-full text-slate-500 text-[10px] font-bold uppercase py-2 tracking-widest">إنشاء هوية جديدة</button>
            </div>
          ) : (
            <div className="space-y-4">
              <input type="text" placeholder="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-[#c5a059]/50" />
              <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-[#c5a059]/50" />
              <input type="password" placeholder="كلمة السر" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-[#c5a059]/50" />
              <button onClick={handleSignup} disabled={serverStatus === 'offline'} className="w-full bg-[#c5a059] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-50">تسجيل الهوية</button>
              <button onClick={() => setView('login')} className="w-full text-slate-500 text-[10px] font-bold uppercase py-2 tracking-widest">العودة لتسجيل الدخول</button>
            </div>
          )}
        </div>
      </div>
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] noise-bg"></div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { activeProfile, isEmailConfirmed, logout, domains, setDomains, integrations, stats, notifications, dismissNotification, addLog, connectService, strategy } = useDomainContext() as any;
  const [activeTab, setActiveTab] = useState<AgentType>(AgentType.INTELLIGENCE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inspectedDomain, setInspectedDomain] = useState<Domain | null>(null);
  const [view, setView] = useState<'landing' | 'auth'>('landing');
  const { isScanning, initiateScan } = useMasterBrain(strategy, 'en');

  if (!activeProfile) {
    if (view === 'auth') return <LoginScreen onBack={() => setView('landing')} />;
    return <LandingPage onAuth={() => setView('auth')} />;
  }

  const isAdmin = activeProfile.role === 'Admin';

  return (
    <div className="app-shell bg-[#0a0a0c] selection:bg-[#c5a059]/30 overflow-hidden">
      <CommandPalette setActiveTab={setActiveTab} onSearchDomain={(name) => {
        const d = domains.find((x: any) => x.name === name);
        if (d) setInspectedDomain(d);
      }} />
      
      {inspectedDomain && <AgentReasoningLab domain={inspectedDomain} lang="en" onClose={() => setInspectedDomain(null)} />}
      
      <aside className={`z-[200] bg-[#111113] border-white/5 transition-all duration-500 fixed lg:static top-0 bottom-0 left-0 border-r ${isSidebarOpen ? 'translate-x-0 w-full lg:w-[var(--sidebar-width)] shadow-2xl' : '-translate-x-full lg:translate-x-0 w-[var(--sidebar-width)]'}`}>
        <div className="p-8 lg:p-10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-12 lg:mb-16">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#c5a059]/10 border border-[#c5a059]/20 rounded-xl flex items-center justify-center text-[#c5a059] shadow-2xl"><i className="fas fa-cube text-base lg:text-xl"></i></div>
              <span className="text-[10px] lg:text-[12px] font-black tracking-[0.5em] text-white uppercase italic">Isthmic</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-white p-2">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <nav className="flex-1 space-y-3 lg:space-y-4 overflow-y-auto no-scrollbar pr-2">
            {isAdmin && (
              <button onClick={() => {setActiveTab(AgentType.ADMIN_PANEL); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-4 lg:gap-6 px-6 lg:px-8 py-4 rounded-2xl ${activeTab === AgentType.ADMIN_PANEL ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-slate-500 hover:text-white transition-colors'}`}><i className="fas fa-shield-halved"></i> <span className="text-[9px] lg:text-[10px] font-black uppercase">Admin Hub</span></button>
            )}
            <button onClick={() => {setActiveTab(AgentType.INTELLIGENCE); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-4 lg:gap-6 px-6 lg:px-8 py-4 rounded-2xl ${activeTab === AgentType.INTELLIGENCE ? 'bg-white/5 text-white shadow-xl' : 'text-slate-500 hover:text-white transition-colors'}`}><i className="fas fa-brain"></i> <span className="text-[9px] lg:text-[10px] font-black uppercase">Intelligence</span></button>
            <button onClick={() => {setActiveTab(AgentType.ACQUISITION); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-4 lg:gap-6 px-6 lg:px-8 py-4 rounded-2xl ${activeTab === AgentType.ACQUISITION ? 'bg-white/5 text-white shadow-xl' : 'text-slate-500 hover:text-white transition-colors'}`}><i className="fas fa-crosshairs"></i> <span className="text-[9px] lg:text-[10px] font-black uppercase">Acquisition</span></button>
            <button onClick={() => {setActiveTab(AgentType.OPERATIONS); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-4 lg:gap-6 px-6 lg:px-8 py-4 rounded-2xl ${activeTab === AgentType.OPERATIONS ? 'bg-white/5 text-white shadow-xl' : 'text-slate-500 hover:text-white transition-colors'}`}><i className="fas fa-layer-group"></i> <span className="text-[9px] lg:text-[10px] font-black uppercase">Operations</span></button>
            <button onClick={() => {setActiveTab(AgentType.LIQUIDATION); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-4 lg:gap-6 px-6 lg:px-8 py-4 rounded-2xl ${activeTab === AgentType.LIQUIDATION ? 'bg-white/5 text-white shadow-xl' : 'text-slate-500 hover:text-white transition-colors'}`}><i className="fas fa-money-bill-wave"></i> <span className="text-[9px] lg:text-[10px] font-black uppercase">Liquidation</span></button>
            <button onClick={() => {setActiveTab(AgentType.MANAGEMENT); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-4 lg:gap-6 px-6 lg:px-8 py-4 rounded-2xl ${activeTab === AgentType.MANAGEMENT ? 'bg-[#c5a059] text-black shadow-2xl' : 'text-slate-500 hover:text-white transition-colors'}`}><i className="fas fa-user-circle"></i> <span className="text-[9px] lg:text-[10px] font-black uppercase">Executive Suite</span></button>
          </nav>
          <div className="pt-6 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-3 lg:gap-4">
                <img src={activeProfile.avatar} className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl" alt="Avatar" />
                <div className="text-left">
                  <div className="text-white text-[10px] lg:text-xs font-bold italic truncate max-w-[100px]">{activeProfile.name}</div>
                  <div className="text-[7px] lg:text-[8px] text-[#c5a059] font-black uppercase italic tracking-tighter">Sovereign Link</div>
                </div>
             </div>
             <button onClick={logout} className="text-slate-500 hover:text-red-500 transition-colors"><i className="fas fa-power-off"></i></button>
          </div>
        </div>
      </aside>
      
      <header className="z-[100] flex items-center justify-between px-6 lg:px-10 border-b border-white/5 bg-[#0a0a0c]/90 backdrop-blur-2xl">
        <div className="flex items-center gap-4 lg:gap-6">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden icon-box bg-white/5 text-slate-400 hover:text-white transition-colors w-10 h-10 flex items-center justify-center rounded-xl border border-white/10"><i className="fas fa-bars"></i></button>
          <div className="text-white prestige-heading text-lg lg:text-xl italic tracking-tighter">Command Console</div>
        </div>
        
        <div className="flex items-center gap-4 lg:gap-6">
          {!isEmailConfirmed && (
            <button onClick={() => setActiveTab(AgentType.MANAGEMENT)} className="px-3 lg:px-4 py-2 rounded-xl text-[7px] lg:text-[8px] font-black uppercase bg-red-500/10 text-red-500 border border-red-500/20 hidden sm:flex items-center gap-2 animate-pulse">
              <i className="fas fa-user-shield"></i> Pending
            </button>
          )}
          <div className="px-3 lg:px-4 py-2 rounded-xl text-[7px] lg:text-[8px] font-black uppercase bg-green-500/10 text-green-500 border border-green-500/20 flex items-center gap-2 lg:gap-3">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            Secured
          </div>
        </div>
      </header>
      
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
