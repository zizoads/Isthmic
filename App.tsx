import React, { useState, useEffect, useCallback } from 'react';
import { AgentType, Domain, PlatformStats, PlatformStrategy, ServiceIntegration, ActivityLog } from './types';
import { translations } from './translations';
import DiscoveryDashboard from './components/DiscoveryDashboard';
import EvaluationDashboard from './components/EvaluationDashboard';
import MasterBrainDashboard from './components/MasterBrainDashboard';
import PortfolioManager from './components/PortfolioManager';
import ExecutiveReportDashboard from './components/ExecutiveReportDashboard';
import PipelineDashboard from './components/PipelineDashboard';
import IntegrationCenter from './components/IntegrationCenter';
import NexusPrimeDashboard from './components/NexusPrimeDashboard';
import SonnerNotification from './components/SonnerNotification';

const App: React.FC = () => {
  const [lang, setLang] = useState<'ar' | 'en'>(() => (localStorage.getItem('domainer_lang') as 'ar' | 'en') || 'ar');
  const [isDark, setIsDark] = useState<boolean>(() => localStorage.getItem('domainer_theme') !== 'light');
  const [activeTab, setActiveTab] = useState<string>(AgentType.MASTER_BRAIN);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const [domains, setDomains] = useState<Domain[]>(() => {
    const saved = localStorage.getItem('ist_domains');
    return saved ? JSON.parse(saved) : [];
  });

  const [strategy, setStrategy] = useState<PlatformStrategy>(() => {
    const saved = localStorage.getItem('ist_strategy');
    return saved ? JSON.parse(saved) : {
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
    };
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
    systemResilienceStatus: 'nominal'
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const addLog = useCallback((agent: string, message: string, type: ActivityLog['type'] = 'info') => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString(),
      agent,
      message,
      type
    };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 50));
    
    // Trigger notification for non-info logs
    if (type !== 'info') {
      const notification = { id: newLog.id, agent, message, type };
      setNotifications(prev => [...prev, notification]);
      setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== notification.id)), 5000);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ist_domains', JSON.stringify(domains));
    localStorage.setItem('ist_strategy', JSON.stringify(strategy));
    
    const purchased = domains.filter(d => d.status === 'purchased');
    const spent = purchased.reduce((acc, d) => acc + (d.price || 0), 0);
    const value = purchased.reduce((acc, d) => acc + (d.price ? d.price * 2.5 : 0), 0); // Simplified valuation

    setStats(prev => ({
      ...prev,
      totalDiscovered: domains.length,
      totalPurchased: purchased.length,
      totalSpent: spent,
      estimatedPortfolioValue: value,
    }));
  }, [domains, strategy]);

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

  const t = translations[lang];

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
    <div className={`flex h-full w-full overflow-hidden font-sans transition-colors duration-500 ${isDark ? 'bg-[#0a0c10] text-white' : 'bg-slate-50 text-slate-900'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      <aside className={`fixed lg:relative lg:translate-x-0 w-72 h-full flex flex-col z-[150] shadow-2xl transition-all duration-500 
        ${isDark ? 'bg-[#0d1117] border-slate-800' : 'bg-white border-slate-200'} 
        ${lang === 'ar' 
          ? (isSidebarOpen ? 'translate-x-0 right-0 border-l' : 'translate-x-full right-0 border-l') 
          : (isSidebarOpen ? 'translate-x-0 left-0 border-r' : '-translate-x-full left-0 border-r')}
      `}>
        <div className="p-8 border-b flex items-center justify-between gap-4 border-slate-800/50">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg"><i className="fas fa-rocket text-white"></i></div>
             <h1 className="text-xl font-black tracking-tighter uppercase">{t.platformName}</h1>
           </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.type}
              onClick={() => { setActiveTab(item.type); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-4 py-3 transition-all rounded-xl border border-transparent ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                activeTab === item.type 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : isDark ? 'text-slate-500 hover:bg-white/5 hover:text-slate-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <i className={`fas ${item.icon} w-6 text-center text-sm`}></i>
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-sm font-black">{item.label}</span>
                <span className="text-[8px] opacity-50 uppercase tracking-tighter truncate">{item.desc}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-6 space-y-4 border-t border-slate-800 bg-slate-900/50">
           <div className="flex gap-2">
              <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="flex-1 py-2 rounded-lg text-[9px] font-black uppercase border border-slate-700 hover:bg-white/5">{lang === 'ar' ? 'English' : 'العربية'}</button>
              <button onClick={() => setIsDark(!isDark)} className="flex-1 py-2 rounded-lg text-[9px] font-black uppercase border border-slate-700 hover:bg-white/5">{isDark ? 'Light' : 'Dark'}</button>
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className={`h-20 border-b flex items-center justify-between px-6 lg:px-10 flex-shrink-0 z-[120] backdrop-blur-xl ${isDark ? 'bg-[#0a0c10]/80 border-slate-800/50' : 'bg-white/80 border-slate-200'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-500 w-10 h-10 border rounded-xl flex items-center justify-center bg-white dark:bg-slate-900">
              <i className="fas fa-bars"></i>
            </button>
            <h2 className={`text-base lg:text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {sidebarItems.find(i => i.type === activeTab)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t.estimatedValue}</span>
                <span className={`text-sm lg:text-lg font-black ${isDark ? 'text-green-400' : 'text-green-600'}`}>$ {stats.estimatedPortfolioValue.toLocaleString()}</span>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="p-4 lg:p-10 transition-all duration-500 max-w-7xl mx-auto pb-24">
            {activeTab === 'INTEGRATIONS' && <IntegrationCenter integrations={[]} onConnect={() => {}} lang={lang} />}
            {activeTab === AgentType.MASTER_BRAIN && <MasterBrainDashboard stats={stats} activityLogs={activityLogs} strategy={strategy} setStrategy={setStrategy} lang={lang} />}
            {activeTab === AgentType.NEXUS_PRIME && <NexusPrimeDashboard addLog={addLog} setDomains={setDomains} lang={lang} />}
            {activeTab === 'PIPELINE' && <PipelineDashboard domains={domains} setDomains={setDomains} onInspect={() => {}} lang={lang} />}
            {activeTab === AgentType.DISCOVERY && <DiscoveryDashboard domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />}
            {activeTab === AgentType.EVALUATION && <EvaluationDashboard domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />}
            {activeTab === 'PORTFOLIO' && <PortfolioManager domains={domains} setDomains={setDomains} lang={lang} />}
            {activeTab === 'EXECUTIVE' && <ExecutiveReportDashboard domains={domains} stats={stats} lang={lang} />}
          </div>
        </div>
      </main>

      <SonnerNotification notifications={notifications} onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} />
    </div>
  );
};

export default App;