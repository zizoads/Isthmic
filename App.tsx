
import React, { useState, useEffect } from 'react';
import { AgentType, Domain, PlatformStats, ActivityLog, PlatformStrategy, ServiceIntegration } from './types';
import { translations } from './translations';
import DiscoveryDashboard from './components/DiscoveryDashboard';
import EvaluationDashboard from './components/EvaluationDashboard';
import PurchaseDashboard from './components/PurchaseDashboard';
import MessagingDashboard from './components/MessagingDashboard';
import NegotiationDashboard from './components/NegotiationDashboard';
import MasterBrainDashboard from './components/MasterBrainDashboard';
import PortfolioManager from './components/PortfolioManager';
import ExecutiveReportDashboard from './components/ExecutiveReportDashboard';
import PipelineDashboard from './components/PipelineDashboard';
import IntegrationCenter from './components/IntegrationCenter';
import NexusPrimeDashboard from './components/NexusPrimeDashboard';

const App: React.FC = () => {
  const [lang, setLang] = useState<'ar' | 'en'>(() => (localStorage.getItem('domainer_lang') as 'ar' | 'en') || 'ar');
  const [isDark, setIsDark] = useState<boolean>(() => localStorage.getItem('domainer_theme') !== 'light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<AgentType | 'PORTFOLIO' | 'VALUE_PROOF' | 'EXECUTIVE' | 'PIPELINE' | 'INTEGRATIONS'>(AgentType.MASTER_BRAIN);
  const [domains, setDomains] = useState<Domain[]>(() => {
    const saved = localStorage.getItem('domainer_pro_domains');
    return saved ? JSON.parse(saved) : [];
  });

  const [strategy, setStrategy] = useState<PlatformStrategy>({
    totalBudget: 25000,
    maxPricePerDomain: 500,
    targetTLDs: ['.com'],
    minLiquidityScore: 60,
    targetROI: 300,
    minHoldingPeriod: 3,
    riskTolerance: 'Balanced',
    autoEvaluate: false,
    autoPilotMode: false,
    investmentThesis: ''
  });

  const [stats, setStats] = useState<PlatformStats>({
    totalDiscovered: 0,
    totalPurchased: 0,
    messagesSent: 0,
    openRate: 0,
    repliesReceived: 0,
    avgProfit: 0,
    totalSpent: 0,
    estimatedPortfolioValue: 0,
    dataIntegrity: 0,
    systemResilienceStatus: 'nominal'
  });
  
  const [integrations, setIntegrations] = useState<ServiceIntegration[]>([
    { id: '1', name: 'NameBio Data Feed', provider: 'namebio', status: 'simulated', impactArea: 'Historical Sales Comp' },
    { id: '2', name: 'Hunter Intelligence', provider: 'hunter', status: 'simulated', impactArea: 'Lead Discovery' },
    { id: '3', name: 'WhoisXML Registry', provider: 'whois', status: 'simulated', impactArea: 'Ownership Verification' },
    { id: '4', name: 'Moz SEO Metrics', provider: 'moz', status: 'simulated', impactArea: 'Authority Data' },
    { id: '5', name: 'Escrow Security', provider: 'escrow', status: 'simulated', impactArea: 'Transaction Settlement' }
  ]);

  const integrityScore = (integrations.filter(i => i.status === 'connected').length / integrations.length) * 100;

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: '1', time: '10:00:00', agent: 'System', message: 'System in simulation mode. Connect APIs for full fidelity.', type: 'info' }
  ]);

  useEffect(() => {
    localStorage.setItem('domainer_pro_domains', JSON.stringify(domains));
    const purchased = domains.filter(d => d.status === 'purchased');
    const spent = purchased.reduce((acc, d) => acc + (d.acquisitionCost || d.price), 0);
    const value = purchased.reduce((acc, d) => acc + (d.estimatedProfit || d.price * 2), 0);

    setStats(prev => ({
      ...prev,
      totalDiscovered: domains.length,
      totalPurchased: purchased.length,
      totalSpent: spent,
      estimatedPortfolioValue: value,
      dataIntegrity: integrityScore,
      systemResilienceStatus: integrityScore === 100 ? 'nominal' : 'degraded'
    }));
  }, [domains, integrityScore]);

  useEffect(() => {
    localStorage.setItem('domainer_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('domainer_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const addLog = (agent: string, message: string, type: ActivityLog['type'] = 'info') => {
    const newLog: ActivityLog = {
      id: Math.random().toString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      agent, message, type
    };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const handleConnectIntegration = (id: string, key: string) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'connected', apiKey: key } : i));
    addLog('System', `Connected ${integrations.find(x => x.id === id)?.name} successfully.`, 'success');
  };

  const sidebarItems = [
    { type: AgentType.MASTER_BRAIN, icon: 'fa-brain', label: t.masterBrain, desc: t.masterDesc },
    { type: AgentType.NEXUS_PRIME, icon: 'fa-microchip', label: t.nexusPrime, desc: t.nexusDesc },
    { type: 'INTEGRATIONS', icon: 'fa-plug', label: t.integrations, desc: t.intDesc },
    { type: 'PIPELINE', icon: 'fa-layer-group', label: t.pipeline, desc: t.pipeDesc },
    { type: AgentType.DISCOVERY, icon: 'fa-search', label: t.discovery, desc: t.discDesc },
    { type: AgentType.EVALUATION, icon: 'fa-chart-pie', label: t.evaluation, desc: t.evalDesc },
    { type: 'PORTFOLIO', icon: 'fa-vault', label: t.portfolio, desc: t.portDesc },
    { type: 'EXECUTIVE', icon: 'fa-file-invoice-dollar', label: t.executive, desc: t.execDesc },
  ];

  return (
    <div className={`flex h-screen w-full overflow-hidden font-sans transition-colors duration-500 ${isDark ? 'bg-[#0a0c10] text-white' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative lg:translate-x-0 w-72 h-full flex flex-col z-[100] shadow-2xl transition-all duration-500 
        ${isDark ? 'bg-[#0d1117] border-slate-800' : 'bg-white border-slate-200'} 
        ${lang === 'ar' ? (isSidebarOpen ? 'translate-x-0 border-l' : 'translate-x-full border-l') : (isSidebarOpen ? 'translate-x-0 border-r' : '-translate-x-full border-r')}
      `}>
        <div className={`p-8 border-b flex items-center justify-between gap-4 ${isDark ? 'border-slate-800/50' : 'border-slate-200'}`}>
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg"><i className="fas fa-rocket text-white"></i></div>
               <h1 className={`text-xl font-black tracking-tighter uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                 {t.platformName.split(' ')[0]}<span className="text-indigo-500 font-light">{t.platformName.split(' ')[1]}</span>
               </h1>
             </div>
             <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400">
               <i className="fas fa-times text-xl"></i>
             </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.label}
              onClick={() => {
                setActiveTab(item.type as any);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 transition-all rounded-xl border border-transparent ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                activeTab === item.type 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : isDark ? 'text-slate-500 hover:bg-white/5 hover:text-slate-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <i className={`fas ${item.icon} w-6 text-center`}></i>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">{item.label}</span>
                <span className="text-[8px] opacity-50 uppercase tracking-tighter">{item.desc}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className={`p-6 space-y-4 border-t ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
           <div className="flex justify-between items-center">
              <span className="text-[9px] font-black text-slate-500 uppercase">{t.integrityScore}</span>
              <span className={`text-[9px] font-black ${integrityScore > 50 ? 'text-green-500' : 'text-amber-500'}`}>{integrityScore.toFixed(0)}%</span>
           </div>
           <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${integrityScore}%` }}></div>
           </div>
           
           <div className="flex gap-2 pt-2">
              <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase border transition-all ${isDark ? 'border-slate-700 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                {lang === 'ar' ? 'English' : 'العربية'}
              </button>
              <button onClick={() => setIsDark(!isDark)} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase border transition-all ${isDark ? 'border-slate-700 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                {isDark ? <i className="fas fa-sun mr-1"></i> : <i className="fas fa-moon mr-1"></i>}
                {isDark ? t.lightMode : t.darkMode}
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col min-w-0 h-screen transition-colors duration-500 ${isDark ? 'bg-[#0a0c10]' : 'bg-slate-50'}`}>
        
        {/* Header - Fixed & Responsive */}
        <header className={`h-20 border-b flex items-center justify-between px-6 lg:px-10 sticky top-0 z-50 transition-colors duration-500 ${isDark ? 'bg-[#0a0c10]/70 border-slate-800/50' : 'bg-white/70 border-slate-200'} backdrop-blur-2xl`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-500 w-10 h-10 border rounded-xl flex items-center justify-center">
              <i className="fas fa-bars"></i>
            </button>
            <div className="hidden sm:block">
              <h2 className={`text-lg lg:text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {sidebarItems.find(i => i.type === activeTab)?.label}
              </h2>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${integrityScore === 100 ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></span>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate max-w-[150px]">
                  {integrityScore === 100 ? t.proMode : t.simMode}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-10">
             <div className={`flex flex-col ${lang === 'ar' ? 'items-start' : 'items-end'}`}>
                <span className="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.estimatedValue}</span>
                <span className={`text-sm lg:text-lg font-black ${isDark ? 'text-green-400' : 'text-green-600'}`}>$ {stats.estimatedPortfolioValue.toLocaleString()}</span>
             </div>
             <div className="hidden md:flex gap-2">
                <button onClick={() => setIsDark(!isDark)} className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isDark ? 'border-slate-700 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                   {isDark ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
                </button>
                <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className={`w-10 h-10 rounded-full border flex items-center justify-center text-[10px] font-black transition-all ${isDark ? 'border-slate-700 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                   {lang === 'ar' ? 'EN' : 'AR'}
                </button>
             </div>
          </div>
        </header>

        {/* Dynamic Content Container */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto pb-10">
            {activeTab === 'INTEGRATIONS' && <IntegrationCenter integrations={integrations} onConnect={handleConnectIntegration} />}
            {activeTab === AgentType.MASTER_BRAIN && <MasterBrainDashboard stats={stats} activityLogs={activityLogs} strategy={strategy} setStrategy={setStrategy} />}
            {activeTab === AgentType.NEXUS_PRIME && <NexusPrimeDashboard addLog={addLog} setDomains={setDomains} />}
            {activeTab === 'PIPELINE' && <PipelineDashboard domains={domains} setDomains={setDomains} onInspect={(d) => setActiveTab(AgentType.EVALUATION)} />}
            {activeTab === AgentType.DISCOVERY && <DiscoveryDashboard domains={domains} setDomains={setDomains} addLog={addLog} />}
            {activeTab === AgentType.EVALUATION && <EvaluationDashboard domains={domains} setDomains={setDomains} addLog={addLog} />}
            {activeTab === 'PORTFOLIO' && <PortfolioManager domains={domains} setDomains={setDomains} />}
            {activeTab === 'EXECUTIVE' && <ExecutiveReportDashboard domains={domains} stats={stats} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
