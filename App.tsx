
import React, { useState, useEffect, useMemo } from 'react';
import { AgentType, Domain, UserProfile } from './types';
import { t } from './translations';
import { DomainProvider, useDomainContext } from './context/DomainContext';
import { useMasterBrain } from './hooks/useMasterBrain';

// Optimized Hubs
import IntelligenceHub from './components/hubs/IntelligenceHub';
import AcquisitionDesk from './components/hubs/AcquisitionDesk';
import OperationsHub from './components/hubs/OperationsHub';
import LiquidationEngine from './components/hubs/LiquidationEngine';
import ExecutiveSuite from './components/hubs/ExecutiveSuite';

// Core UI
import CommandPalette from './components/CommandPalette';
import AgentReasoningLab from './components/AgentReasoningLab';
import SonnerNotification from './components/SonnerNotification';
import TickerTape from './components/TickerTape';

const LoginScreen: React.FC = () => {
  const { login, signup, requestRecoveryCode, resetPassword, loginWithGoogle, isInitialLoading } = useDomainContext();
  const [view, setView] = useState<'login' | 'signup' | 'forgot' | 'reset' | 'loading'>('login');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [receivedOtp, setReceivedOtp] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    if (!name || !email || password.length < 6) { setError('Name, Email and 6+ char password required'); return; }
    setView('loading');
    try {
      await signup(name, email, password);
    } catch (e: any) {
      setError(e.message);
      setView('signup');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) { setError('Email and Password required'); return; }
    setView('loading');
    try {
      await login(email, password);
    } catch (e: any) {
      setError(e.message);
      setView('login');
    }
  };

  const handleForgot = async () => {
    if (!email.includes('@')) { setError('Valid Gmail required'); return; }
    setView('loading');
    const code = await requestRecoveryCode(email);
    setReceivedOtp(code);
    setError(`DEBUG: Check console for code or use: ${code}`); // تظهر كإشعار للمستخدم
    setView('reset');
  };

  const handleReset = async () => {
    if (otp !== receivedOtp) { setError('Invalid OTP code'); return; }
    if (password.length < 6) { setError('New password must be 6+ chars'); return; }
    setView('loading');
    await resetPassword(email, password);
    setError('Password reset successful. Please login.');
    setView('login');
  };

  if (isInitialLoading || view === 'loading') return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0c] gap-10">
      <div className="relative">
        <div className="w-24 h-24 border-2 border-white/5 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-t-[#c5a059] border-transparent rounded-full animate-spin"></div>
        <i className="fas fa-fingerprint absolute inset-0 flex items-center justify-center text-[#c5a059] animate-pulse"></i>
      </div>
      <div className="text-[10px] font-black text-white uppercase tracking-[0.5em] animate-pulse">Synchronizing Identity Vault...</div>
    </div>
  );

  return (
    <div className="h-screen bg-[#0a0a0c] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="z-10 w-full max-w-xl space-y-12 animate-precision">
        
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-[#c5a059]/10 to-transparent rounded-[38px] flex items-center justify-center text-[#c5a059] mx-auto border border-[#c5a059]/20 shadow-2xl relative overflow-hidden">
             <i className={`fas ${view === 'signup' ? 'fa-user-plus' : view === 'forgot' ? 'fa-envelope-open-text' : 'fa-vault'} text-4xl`}></i>
             <div className="absolute inset-0 bg-[#c5a059]/5 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <h1 className="text-6xl prestige-heading text-white italic tracking-tighter">Isthmic Pro</h1>
            <p className="text-slate-500 uppercase text-[9px] font-black tracking-[0.5em] opacity-60">Sovereign Asset Management</p>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-[42px] p-10 lg:p-14 shadow-3xl relative overflow-hidden">
          
          {view === 'login' && (
            <div className="space-y-8 animate-slide-up">
               <div className="text-center space-y-2">
                  <h3 className="text-white prestige-heading text-2xl italic">Welcome Back</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Access your Private Vault</p>
               </div>
               <div className="space-y-4">
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-5 text-white text-sm outline-none focus:ring-1 focus:ring-[#c5a059]/30"
                  />
                  <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-5 text-white text-sm outline-none focus:ring-1 focus:ring-[#c5a059]/30"
                  />
                  {error && <p className="text-red-500 text-[9px] font-black uppercase text-center">{error}</p>}
                  <button onClick={handleLogin} className="w-full bg-white text-black py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all shadow-2xl">
                    Sign In to Command
                  </button>
                  <div className="flex justify-between items-center px-4">
                     <button onClick={() => setView('signup')} className="text-[#c5a059] text-[9px] font-black uppercase tracking-widest">Create Account</button>
                     <button onClick={() => setView('forgot')} className="text-slate-600 text-[9px] font-black uppercase tracking-widest">Forgot Password?</button>
                  </div>
               </div>
               <div className="flex items-center gap-6 py-2">
                  <div className="h-[1px] flex-1 bg-white/5"></div>
                  <span className="text-[10px] text-slate-700 font-bold uppercase tracking-widest">Or Secure Link</span>
                  <div className="h-[1px] flex-1 bg-white/5"></div>
               </div>
               <button onClick={loginWithGoogle} className="w-full bg-white/5 text-white border border-white/10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-4">
                 <i className="fab fa-google"></i> Google Identity
               </button>
            </div>
          )}

          {view === 'signup' && (
            <div className="space-y-8 animate-slide-up">
               <div className="text-center space-y-2">
                  <h3 className="text-white prestige-heading text-2xl italic">Initialize Identity</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Create your Sovereign Profile</p>
               </div>
               <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(null); }}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-5 text-white text-sm outline-none focus:ring-1 focus:ring-[#c5a059]/30"
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-5 text-white text-sm outline-none focus:ring-1 focus:ring-[#c5a059]/30"
                  />
                  <input 
                    type="password" 
                    placeholder="Vault Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-5 text-white text-sm outline-none focus:ring-1 focus:ring-[#c5a059]/30"
                  />
                  {error && <p className="text-red-500 text-[9px] font-black uppercase text-center">{error}</p>}
                  <button onClick={handleSignup} className="w-full bg-white text-black py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all shadow-2xl">
                    Generate My Vault
                  </button>
                  <button onClick={() => setView('login')} className="w-full text-slate-600 text-[9px] font-black uppercase tracking-widest py-2">Already have a vault? Login</button>
               </div>
            </div>
          )}

          {view === 'forgot' && (
            <div className="space-y-8 animate-slide-up">
               <div className="text-center space-y-2">
                  <h3 className="text-white prestige-heading text-2xl italic">Recover Access</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Enter Gmail for Verification Code</p>
               </div>
               <div className="space-y-4">
                  <input 
                    type="email" 
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-5 text-white text-sm outline-none focus:ring-1 focus:ring-[#c5a059]/30"
                  />
                  {error && <p className="text-[#c5a059] text-[9px] font-black uppercase text-center bg-[#c5a059]/10 p-4 rounded-xl">{error}</p>}
                  <button onClick={handleForgot} className="w-full bg-white text-black py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all shadow-2xl">
                    Request Recovery Code
                  </button>
                  <button onClick={() => setView('login')} className="w-full text-slate-600 text-[9px] font-black uppercase tracking-widest py-2">Back to Login</button>
               </div>
            </div>
          )}

          {view === 'reset' && (
            <div className="space-y-8 animate-slide-up">
               <div className="text-center space-y-2">
                  <h3 className="text-white prestige-heading text-2xl italic">Finalize Reset</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Verify identity and choose new password</p>
               </div>
               <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="6-Digit Code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value); setError(null); }}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-5 text-white text-2xl text-center font-mono tracking-[0.5em] outline-none focus:ring-1 focus:ring-[#c5a059]/30"
                  />
                  <input 
                    type="password" 
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-5 text-white text-sm outline-none focus:ring-1 focus:ring-[#c5a059]/30"
                  />
                  {error && <p className="text-red-500 text-[9px] font-black uppercase text-center">{error}</p>}
                  <button onClick={handleReset} className="w-full bg-[#c5a059] text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl">
                    Confirm Identity & Update
                  </button>
                  <button onClick={() => setView('login')} className="w-full text-slate-600 text-[9px] font-black uppercase tracking-widest py-2">Cancel</button>
               </div>
            </div>
          )}

          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#c5a059]/5 to-transparent pointer-events-none"></div>
        </div>

        <p className="text-center text-[9px] text-slate-700 font-bold uppercase tracking-[0.3em] opacity-40">
           End-to-End Cryptography • Zero-Knowledge Identity
        </p>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-at-c from-[#c5a059]/5 to-transparent pointer-events-none"></div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { 
    activeProfile, logout, domains, setDomains, integrations, stats, notifications, 
    dismissNotification, addLog, connectService, strategy, syncStatus, lastSyncTime
  } = useDomainContext();
  
  const [activeTab, setActiveTab] = useState<AgentType>(AgentType.INTELLIGENCE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inspectedDomain, setInspectedDomain] = useState<Domain | null>(null);

  const { isScanning, initiateScan } = useMasterBrain(strategy, 'en');

  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  }, []);

  const menuItems = useMemo(() => [
    { id: 'm1', type: AgentType.INTELLIGENCE, icon: 'fa-brain', label: t.intelligence },
    { id: 'm2', type: AgentType.ACQUISITION, icon: 'fa-crosshairs', label: t.acquisition },
    { id: 'm3', type: AgentType.OPERATIONS, icon: 'fa-layer-group', label: t.operations },
    { id: 'm4', type: AgentType.LIQUIDATION, icon: 'fa-money-bill-wave', label: t.liquidation },
    { id: 'm5', type: AgentType.MANAGEMENT, icon: 'fa-file-signature', label: t.management }
  ], []);

  if (!activeProfile) return <LoginScreen />;

  return (
    <div className="app-shell relative bg-[#0a0a0c] selection:bg-[#c5a059]/30">
      <CommandPalette setActiveTab={setActiveTab} onSearchDomain={(name) => {
        const d = domains.find(x => x.name === name);
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
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-white p-2">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <nav className="flex-1 space-y-4">
            {menuItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.type); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl transition-all group relative
                  ${activeTab === item.type 
                    ? 'bg-white/5 text-white border border-white/10' 
                    : 'text-slate-500 hover:text-white hover:bg-white/[0.02]'}`}
              >
                <i className={`fas ${item.icon} text-sm ${activeTab === item.type ? 'text-[#c5a059]' : ''}`}></i>
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-8 border-t border-white/5 space-y-6">
            <div className="px-8 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={activeProfile.avatar} className="w-10 h-10 rounded-xl" alt="Identity" />
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#111113] 
                      ${syncStatus === 'healthy' ? 'bg-green-500' : syncStatus === 'syncing' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'}`}></div>
                  </div>
                  <div className="text-left">
                    <div className="text-white text-xs font-bold prestige-heading italic">{activeProfile.name}</div>
                    <div className="text-[8px] text-slate-600 font-black uppercase tracking-widest">
                       {syncStatus === 'syncing' ? 'Cloud Syncing...' : syncStatus === 'healthy' ? 'Anchor Secured' : 'Sync Warning'}
                    </div>
                  </div>
               </div>
               <button onClick={logout} className="text-slate-500 hover:text-red-500 text-[10px]"><i className="fas fa-power-off"></i></button>
            </div>
          </div>
        </div>
      </aside>
      
      <header 
        style={{ gridArea: 'header' }}
        className="z-header flex items-center justify-between px-10 lg:px-14 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-xl"
      >
        <div className="flex items-center gap-8">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden icon-box bg-white/5 text-slate-400">
             <i className="fas fa-bars"></i>
          </button>
          <div className="hidden sm:flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span className="opacity-40">Precision_v8.0</span>
            <i className="fas fa-chevron-right text-[8px] opacity-10"></i>
            <span className="text-white prestige-heading text-lg">{menuItems.find(i => i.type === activeTab)?.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="hidden md:flex flex-col items-end">
              <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">{t.estimatedValue}</div>
              <div className="text-xl font-light text-white prestige-heading">$ {stats.estimatedPortfolioValue.toLocaleString()}</div>
           </div>
           <div className={`icon-box rounded-2xl border transition-all ${syncStatus === 'healthy' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-[#c5a059]/10 border-[#c5a059]/20 text-[#c5a059]'}`}>
              <i className={`fas ${syncStatus === 'healthy' ? 'fa-cloud-check' : 'fa-user-shield'}`}></i>
           </div>
        </div>
      </header>
      
      <main 
        style={{ gridArea: 'main' }}
        className="content-scroller no-scrollbar"
      >
        <div className="max-w-[1600px] mx-auto animate-precision">
          {activeTab === AgentType.INTELLIGENCE && <IntelligenceHub stats={stats} lang="en" onInitiateScan={initiateScan} isScanning={isScanning} />}
          {activeTab === AgentType.ACQUISITION && <AcquisitionDesk domains={domains} setDomains={setDomains} addLog={addLog} lang="en" />}
          {activeTab === AgentType.OPERATIONS && <OperationsHub domains={domains} setDomains={setDomains} onInspect={setInspectedDomain} lang="en" />}
          {activeTab === AgentType.LIQUIDATION && <LiquidationEngine domains={domains} setDomains={setDomains} lang="en" />}
          {activeTab === AgentType.MANAGEMENT && <ExecutiveSuite domains={domains} stats={stats} integrations={integrations} onConnect={connectService} lang="en" />}
        </div>
      </main>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-overlay pointer-events-none w-full max-w-[90vw] md:max-w-xl">
         <div className="pointer-events-auto bg-[#161618]/95 backdrop-blur-3xl border border-white/10 p-5 rounded-[28px] shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex items-center justify-between">
            <div className="flex items-center gap-5 border-r border-white/5 pr-6">
               <div className={`w-2.5 h-2.5 rounded-full ${isScanning ? 'bg-[#c5a059] animate-pulse' : 'bg-green-500'}`}></div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">{isScanning ? 'SYNTHESIZING' : 'STANDBY'}</span>
                  <span className="text-[7px] text-slate-600 font-bold uppercase data-mono">Core_Link_Active</span>
               </div>
            </div>
            <button onClick={initiateScan} className="bg-white text-black px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all">
               {isScanning ? <i className="fas fa-circle-notch fa-spin"></i> : 'INITIATE'}
            </button>
         </div>
      </div>
      
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
