
import React, { useState, useEffect } from 'react';
import { AgentType, Domain, PlatformStats, ActivityLog, PlatformStrategy, ServiceIntegration } from './types';
import { translations } from './translations';
import DiscoveryDashboard from './components/DiscoveryDashboard';
import EvaluationDashboard from './components/EvaluationDashboard';
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
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
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
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const addLog = (agent: string, message: string, type: ActivityLog['type'] = 'info') => {
    const newLog: ActivityLog = {
      id: Math.random().toString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      agent, message, type
    };
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

  const viewportClass = {
    desktop: 'w-full',
    tablet: 'max-w-[768px] mx-auto border-x shadow-2xl bg-white dark:bg-[#0d1117]',
    mobile: 'max-w-[375px] mx-auto border-x shadow-2xl bg-white dark:bg-[#0d1117]'
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden font-sans transition-colors duration-500 ${isDark ? 'bg-[#0a0c10] text-white' : 'bg-slate-50 text-slate-900'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Sidebar */}
      <aside className={`fixed lg:relative lg:translate-x-0 w-72 h-full flex flex-col z-[150] shadow-2xl transition-all duration-500 
        ${isFullscreen ? 'hidden' : 'flex'}
        ${isDark ? 'bg-[#0d1117] border-slate-800' : 'bg-white border-slate-200'} 
        ${lang === 'ar' 
          ? (isSidebarOpen ? 'translate-x-0 right-0 border-l' : 'translate-x-full right-0 border-l') 
          : (isSidebarOpen ? 'translate-x-0 left-0 border-r' : '-translate-x-full left-0 border-r')}
      `}>
        <div className={`p-8 border-b flex items-center justify-between gap-4 ${isDark ? 'border-slate-800/50' : 'border-slate-200'}`}>
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg"><i className="fas fa-rocket text-white"></i></div>
               <h1 className="text-xl font-black tracking-tighter uppercase">{t.platformName}</h1>
             </div>
             <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 p-2">
               <i className="fas fa-times text-xl"></i>
             </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.label}
              onClick={() => { setActiveTab(item.type as any); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-4 py-3 transition-all rounded-xl border border-transparent ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                activeTab === item.type 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : isDark ? 'text-slate-500 hover:bg-white/5 hover:text-slate-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <i className={`fas ${item.icon} w-6 text-center text-sm`}></i>
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-sm font-black truncate">{item.label}</span>
                <span className="text-[8px] opacity-50 uppercase tracking-tighter truncate">{item.desc}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className={`p-6 space-y-4 border-t ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
           <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-black text-slate-500 uppercase">{t.integrityScore}</span>
              <span className="text-[9px] font-black text-indigo-500">{integrityScore.toFixed(0)}%</span>
           </div>
           <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${integrityScore}%` }}></div>
           </div>
           <div className="flex gap-2">
              <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="flex-1 py-2 rounded-lg text-[9px] font-black uppercase border border-slate-700 hover:bg-white/5">{lang === 'ar' ? 'English' : 'العربية'}</button>
              <button onClick={() => setIsDark(!isDark)} className="flex-1 py-2 rounded-lg text-[9px] font-black uppercase border border-slate-700 hover:bg-white/5">{isDark ? 'Light' : 'Dark'}</button>
           </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className={`flex-1 flex flex-col min-w-0 h-screen transition-all relative ${isDark ? 'bg-[#0a0c10]' : 'bg-slate-50'}`}>
        
        {/* Header */}
        <header className={`h-20 border-b flex items-center justify-between px-6 lg:px-10 sticky top-0 z-[120] transition-colors ${isDark ? 'bg-[#0a0c10]/80 border-slate-800/50' : 'bg-white/80 border-slate-200'} backdrop-blur-xl`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className={`${isFullscreen ? 'flex' : 'lg:hidden'} text-slate-500 w-10 h-10 border rounded-xl items-center justify-center bg-white dark:bg-slate-900 shadow-sm`}>
              <i className="fas fa-bars"></i>
            </button>
            <div className="hidden sm:block">
              <h2 className={`text-base lg:text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {sidebarItems.find(i => i.type === activeTab)?.label}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-8">
             <div className={`hidden md:flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/5`}>
                <button onClick={() => setViewportMode('desktop')} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${viewportMode === 'desktop' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-400'}`}><i className="fas fa-desktop text-[10px]"></i></button>
                <button onClick={() => setViewportMode('tablet')} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${viewportMode === 'tablet' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-400'}`}><i className="fas fa-tablet-alt text-[10px]"></i></button>
                <button onClick={() => setViewportMode('mobile')} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${viewportMode === 'mobile' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-400'}`}><i className="fas fa-mobile-alt text-[10px]"></i></button>
             </div>
             
             <div className={`flex flex-col items-end`}>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t.estimatedValue}</span>
                <span className={`text-sm lg:text-lg font-black ${isDark ? 'text-green-400' : 'text-green-600'}`}>$ {stats.estimatedPortfolioValue.toLocaleString()}</span>
             </div>

             <button onClick={() => setIsFullscreen(!isFullscreen)} className="hidden sm:flex w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 items-center justify-center text-slate-400 hover:text-indigo-500 transition-all">
                <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
             </button>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className={`${viewportClass[viewportMode]} min-h-full p-4 lg:p-10 transition-all duration-500`}>
            <div className="max-w-7xl mx-auto pb-20">
              {activeTab === 'INTEGRATIONS' && <IntegrationCenter integrations={integrations} onConnect={() => {}} lang={lang} />}
              {activeTab === AgentType.MASTER_BRAIN && <MasterBrainDashboard stats={stats} activityLogs={[]} strategy={strategy} setStrategy={setStrategy} lang={lang} />}
              {activeTab === AgentType.NEXUS_PRIME && <NexusPrimeDashboard addLog={addLog} setDomains={setDomains} lang={lang} />}
              {activeTab === 'PIPELINE' && <PipelineDashboard domains={domains} setDomains={setDomains} onInspect={() => {}} lang={lang} />}
              {activeTab === AgentType.DISCOVERY && <DiscoveryDashboard domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />}
              {activeTab === AgentType.EVALUATION && <EvaluationDashboard domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />}
              {activeTab === 'PORTFOLIO' && <PortfolioManager domains={domains} setDomains={setDomains} lang={lang} />}
              {activeTab === 'EXECUTIVE' && <ExecutiveReportDashboard domains={domains} stats={stats} lang={lang} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
