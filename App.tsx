
import React, { useState } from 'react';
import { AgentType, Domain } from './types';
import { DomainProvider, useDomainContext } from './context/DomainContext';
import { useMasterBrain } from './hooks/useMasterBrain';
import { AuthService } from './services/AuthService';

// Hubs
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
  const { isInitialLoading, signup, login, setActiveProfile } = useDomainContext() as any;
  const [view, setView] = useState<'login' | 'signup' | 'loading'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleQuickStart = async () => {
    setView('loading');
    try {
      const guest = await AuthService.quickStart();
      setActiveProfile(guest);
    } catch (e: any) {
      setError("فشل الدخول السريع.");
      setView('login');
    }
  };

  const handleSignup = async () => {
    if (!name || !email || !password) { setError('يرجى ملء جميع الحقول'); return; }
    setError(null);
    setView('loading');
    try {
      await signup(name, email, password);
    } catch (e: any) {
      setError("خطأ في الربط السحابي: تأكد من إعدادات المفتاح أو استخدم الدخول السريع.");
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
      setError("بيانات غير صحيحة أو خلل في الاتصال بقاعدة البيانات.");
      setView('login');
    }
  };

  if (isInitialLoading || view === 'loading') return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0c]">
      <div className="w-16 h-16 border-4 border-t-[#c5a059] border-white/10 rounded-full animate-spin mb-6"></div>
      <div className="text-[10px] text-white font-black tracking-widest animate-pulse uppercase italic">Initializing Sovereign Environment...</div>
    </div>
  );

  return (
    <div className="h-screen bg-[#0a0a0c] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#c5a059]/5 blur-[120px] rounded-full"></div>
      
      <div className="w-full max-w-lg z-10 space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-light text-white italic tracking-tighter">Isthmic Pro</h1>
          <p className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.6em] opacity-80">Institutional Asset Command</p>
        </div>

        <div className="bg-[#111113]/80 backdrop-blur-2xl border border-white/5 rounded-[40px] p-10 shadow-3xl space-y-8">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[11px] font-bold text-center">
              <i className="fas fa-exclamation-triangle mr-2"></i> {error}
            </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={handleQuickStart} 
              className="w-full bg-white text-black py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#c5a059] hover:text-white transition-all shadow-xl flex items-center justify-center gap-4"
            >
              <i className="fas fa-bolt"></i> دخول سريع (نمط السيادة المحلية)
            </button>
            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-white/5"></div>
              <span className="text-[9px] text-slate-700 font-black uppercase tracking-widest">أو الربط السحابي</span>
              <div className="h-[1px] flex-1 bg-white/5"></div>
            </div>
          </div>

          {view === 'login' ? (
            <div className="space-y-4">
              <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#c5a059]/40" />
              <input type="password" placeholder="كلمة السر" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#c5a059]/40" />
              <button onClick={handleLogin} className="w-full border border-white/10 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">تسجيل الدخول</button>
              <button onClick={() => setView('signup')} className="w-full text-slate-500 text-[9px] font-black uppercase tracking-widest py-2">إنشاء حساب سحابي جديد</button>
            </div>
          ) : (
            <div className="space-y-4">
              <input type="text" placeholder="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#c5a059]/40" />
              <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#c5a059]/40" />
              <input type="password" placeholder="كلمة السر" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#c5a059]/40" />
              <button onClick={handleSignup} className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">إنشاء وربط الحساب</button>
              <button onClick={() => setView('login')} className="w-full text-slate-500 text-[9px] font-black uppercase tracking-widest py-2">العودة لتسجيل الدخول</button>
            </div>
          )}
        </div>
        
        <p className="text-[9px] text-slate-700 text-center uppercase tracking-[0.3em] font-medium leading-loose">
          Privacy First: All core data is stored in your private browser vault.<br/>
          Cloud sync is optional for multi-device workflows.
        </p>
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
            <button onClick={() => {setActiveTab(AgentType.OPERATIONS); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl ${activeTab === AgentType.OPERATIONS ? 'bg-white/5 text-white' : 'text-slate-500'}`}><i className="fas fa-layer-group"></i> <span className="text-[10px) font-black uppercase">Operations</span></button>
            <button onClick={() => {setActiveTab(AgentType.LIQUIDATION); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl ${activeTab === AgentType.LIQUIDATION ? 'bg-white/5 text-white' : 'text-slate-500'}`}><i className="fas fa-money-bill-wave"></i> <span className="text-[10px] font-black uppercase">Liquidation</span></button>
            <button onClick={() => {setActiveTab(AgentType.MANAGEMENT); setIsSidebarOpen(false)}} className={`w-full flex items-center gap-6 px-8 py-4.5 rounded-2xl ${activeTab === AgentType.MANAGEMENT ? 'bg-white/5 text-white' : 'text-slate-500'}`}><i className="fas fa-file-signature"></i> <span className="text-[10px] font-black uppercase">Management</span></button>
          </nav>
          <div className="pt-8 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <img src={activeProfile.avatar} className="w-10 h-10 rounded-xl" alt="Avatar" />
                <div className="text-left">
                  <div className="text-white text-xs font-bold italic">{activeProfile.name}</div>
                  <div className={`text-[8px] font-black uppercase italic tracking-tighter ${activeProfile.isSyncEnabled ? 'text-green-500' : 'text-amber-500'}`}>
                    {activeProfile.isSyncEnabled ? 'Cloud Sync Active' : 'Sovereign Local Mode'}
                  </div>
                </div>
             </div>
             <button onClick={logout} className="text-slate-500 hover:text-red-500"><i className="fas fa-power-off"></i></button>
          </div>
        </div>
      </aside>
      
      <header style={{ gridArea: 'header' }} className="z-header flex items-center justify-between px-10 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-xl">
        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden icon-box bg-white/5 text-slate-400"><i className="fas fa-bars"></i></button>
        <div className="text-white prestige-heading text-lg">Command Console</div>
        <div className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase border flex items-center gap-3 ${activeProfile.isSyncEnabled ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${activeProfile.isSyncEnabled ? 'bg-green-500' : 'bg-amber-500'}`}></div>
          {activeProfile.isSyncEnabled ? 'Cloud Database: Online' : 'Local Vault: Isolated'}
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
