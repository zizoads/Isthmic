
import React, { useState, useEffect, useMemo } from 'react';
import { AgentType, Domain, PlatformStats, ServiceIntegration } from './types';
import { translations } from './translations';
import { DomainProvider, useDomainContext } from './context/DomainContext';
import { useMasterBrain } from './hooks/useMasterBrain';

// Merged Hub Dashboards
import IntelligenceHub from './components/hubs/IntelligenceHub';
import AcquisitionDesk from './components/hubs/AcquisitionDesk';
import OperationsHub from './components/hubs/OperationsHub';
import LiquidationEngine from './components/hubs/LiquidationEngine';
import ExecutiveSuite from './components/hubs/ExecutiveSuite';

// Core UI & Utility Imports
import CommandPalette from './components/CommandPalette';
import AgentReasoningLab from './components/AgentReasoningLab';
import SonnerNotification from './components/SonnerNotification';

const AppContent: React.FC = () => {
  // Destructure setDomains, setIntegrations and addLog from context to fix prop errors
  const { 
    domains, setDomains, strategy, integrations, setIntegrations,
    notifications, dismissNotification, addLog
  } = useDomainContext();
  
  const [lang, setLang] = useState<'ar' | 'en'>(() => (localStorage.getItem('ist_lang') as 'ar' | 'en') || 'ar');
  const [isDark, setIsDark] = useState<boolean>(() => localStorage.getItem('ist_theme') !== 'light');
  const [activeTab, setActiveTab] = useState<AgentType>(AgentType.INTELLIGENCE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inspectedDomain, setInspectedDomain] = useState<Domain | null>(null);

  const { isScanning, initiateScan } = useMasterBrain(strategy, lang);

  // Implementation for handleConnect to pass to ExecutiveSuite
  const handleConnect = (id: string, key: string) => {
    setIntegrations(prev => {
      const exists = prev.find(i => i.id === id);
      if (exists) {
        return prev.map(i => i.id === id ? { ...i, status: 'connected' } : i);
      }
      return [...prev, { 
        id, 
        provider: id, 
        status: 'connected', 
        name: id, 
        impactArea: 'Integration' 
      } as ServiceIntegration];
    });
    addLog('System', `Connected to ${id}`, 'success');
  };

  useEffect(() => {
    localStorage.setItem('ist_lang', lang);
    localStorage.setItem('ist_theme', isDark ? 'dark' : 'light');
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [lang, isDark]);

  const stats: PlatformStats = useMemo(() => {
    const purchased = domains.filter(d => d.status === 'purchased');
    const spent = purchased.reduce((acc, d) => acc + (d.price || 0), 0);
    const value = purchased.reduce((acc, d) => acc + (d.price ? d.price * 3.5 : 0), 0);
    return {
      totalDiscovered: domains.length,
      totalPurchased: purchased.length,
      messagesSent: 0,
      openRate: 85,
      repliesReceived: 0,
      avgProfit: 250,
      totalSpent: spent,
      estimatedPortfolioValue: value,
      systemResilienceStatus: integrations.length > 0 ? 'nominal' : 'degraded'
    };
  }, [domains, integrations]);

  const t = translations[lang];

  const menuItems = [
    { type: AgentType.INTELLIGENCE, icon: 'fa-brain', label: t.intelligence },
    { type: AgentType.ACQUISITION, icon: 'fa-crosshairs', label: t.acquisition },
    { type: AgentType.OPERATIONS, icon: 'fa-layer-group', label: t.operations },
    { type: AgentType.LIQUIDATION, icon: 'fa-money-bill-wave', label: t.liquidation },
    { type: AgentType.MANAGEMENT, icon: 'fa-file-signature', label: t.management }
  ];

  return (
    <div className={`flex h-full w-full overflow-hidden transition-all duration-500 bg-background text-foreground`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <CommandPalette setActiveTab={setActiveTab} onSearchDomain={(name) => {
        const d = domains.find(x => x.name === name);
        if (d) setInspectedDomain(d);
      }} />
      
      {inspectedDomain && <AgentReasoningLab domain={inspectedDomain} onClose={() => setInspectedDomain(null)} />}
      
      <aside className={`fixed lg:relative lg:translate-x-0 w-72 h-full flex flex-col z-[150] shadow-2xl transition-all duration-500 bg-background border-border 
        ${lang === 'ar' ? (isSidebarOpen ? 'translate-x-0 right-0 border-l' : 'translate-x-full right-0 border-l') : (isSidebarOpen ? 'translate-x-0 left-0 border-r' : '-translate-x-full left-0 border-r')}
      `}>
        <div className="p-8 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg"><i className="fas fa-rocket text-primary-foreground"></i></div>
          <h1 className="text-xl font-black tracking-tighter uppercase">{t.platformName}</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-4 scrollbar-hide">
          {menuItems.map(item => (
            <button key={item.type} onClick={() => { setActiveTab(item.type); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-4 py-4 transition-all rounded-2xl border border-transparent ${activeTab === item.type ? 'bg-primary text-primary-foreground shadow-lg' : 'text-slate-500 hover:bg-accent hover:text-foreground'}`}>
              <i className={`fas ${item.icon} w-6 text-center text-sm`}></i>
              <span className="text-sm font-black uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-border bg-slate-900/50 flex gap-2">
           <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase border border-border hover:bg-accent">{lang === 'ar' ? 'English' : 'العربية'}</button>
           <button onClick={() => setIsDark(!isDark)} className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase border border-border hover:bg-accent">{isDark ? 'Light' : 'Dark'}</button>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className={`h-20 border-b flex items-center justify-between px-6 lg:px-10 flex-shrink-0 z-[120] backdrop-blur-xl bg-background/80 border-border`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-500 w-10 h-10 border border-border rounded-xl flex items-center justify-center"><i className="fas fa-bars"></i></button>
            <h2 className="text-base lg:text-xl font-black tracking-tight uppercase tracking-tighter">
              {menuItems.find(i => i.type === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t.estimatedValue}</span>
                <span className="text-sm lg:text-lg font-black text-green-600 tracking-tighter">$ {stats.estimatedPortfolioValue.toLocaleString()}</span>
             </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-hide">
          <div className="p-4 lg:p-10 transition-all duration-500 max-w-7xl mx-auto pb-24">
            {activeTab === AgentType.INTELLIGENCE && (
              <IntelligenceHub 
                stats={stats} 
                lang={lang} 
                onInitiateScan={initiateScan} 
                isScanning={isScanning} 
              />
            )}
            {activeTab === AgentType.ACQUISITION && (
              <AcquisitionDesk 
                domains={domains}
                setDomains={setDomains}
                addLog={addLog}
                lang={lang} 
              />
            )}
            {activeTab === AgentType.OPERATIONS && (
              <OperationsHub 
                domains={domains}
                setDomains={setDomains}
                onInspect={setInspectedDomain} 
                lang={lang} 
              />
            )}
            {activeTab === AgentType.LIQUIDATION && (
              <LiquidationEngine 
                domains={domains}
                setDomains={setDomains}
                lang={lang} 
              />
            )}
            {activeTab === AgentType.MANAGEMENT && (
              <ExecutiveSuite 
                domains={domains}
                stats={stats} 
                integrations={integrations}
                onConnect={handleConnect}
                lang={lang} 
              />
            )}
          </div>
        </div>
      </main>
      
      <SonnerNotification notifications={notifications} onDismiss={dismissNotification} />
    </div>
  );
};

const App: React.FC = () => (
  <DomainProvider>
    <AppContent />
  </DomainProvider>
);

export default App;
