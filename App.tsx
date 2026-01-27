
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AgentType, Domain, PlatformStats, ActivityLog, ServiceIntegration } from './types';
import { translations } from './translations';
import { DomainProvider, useDomainContext } from './context/DomainContext';
import { useMasterBrain } from './hooks/useMasterBrain';

// Decentralized Dashboard Imports
import MasterBrainDashboard from './components/MasterBrainDashboard';
import NexusPrimeDashboard from './components/NexusPrimeDashboard';
import DiscoveryDashboard from './components/DiscoveryDashboard';
import EvaluationDashboard from './components/EvaluationDashboard';
import PurchaseDashboard from './components/PurchaseDashboard';
import DropSniperDashboard from './components/DropSniperDashboard';
import PipelineDashboard from './components/PipelineDashboard';
import PortfolioManager from './components/PortfolioManager';
import ValueProofDashboard from './components/ValueProofDashboard';
import ValueMultiplierDashboard from './components/ValueMultiplierDashboard';
import MarketplaceDashboard from './components/MarketplaceDashboard';
import AuctionWatchDashboard from './components/AuctionWatchDashboard';
import MessagingDashboard from './components/MessagingDashboard';
import NegotiationDashboard from './components/NegotiationDashboard';
import FeedbackDashboard from './components/FeedbackDashboard';
import ExecutiveReportDashboard from './components/ExecutiveReportDashboard';
import IntegrationCenter from './components/IntegrationCenter';

// Core UI & Utility Imports
import CommandPalette from './components/CommandPalette';
import AgentReasoningLab from './components/AgentReasoningLab';
import SonnerNotification from './components/SonnerNotification';

const AppContent: React.FC = () => {
  const { domains, setDomains, strategy, setStrategy, integrations, setIntegrations } = useDomainContext();
  const [lang, setLang] = useState<'ar' | 'en'>(() => (localStorage.getItem('ist_lang') as 'ar' | 'en') || 'ar');
  const [isDark, setIsDark] = useState<boolean>(() => localStorage.getItem('ist_theme') !== 'light');
  const [activeTab, setActiveTab] = useState<AgentType>(AgentType.MASTER_BRAIN);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [inspectedDomain, setInspectedDomain] = useState<Domain | null>(null);
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
    if (type !== 'info') {
      const notification = { id: newLog.id, agent, message, type };
      setNotifications(prev => [...prev, notification]);
      setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== notification.id)), 6000);
    }
  }, []);

  const { isScanning, initiateScan } = useMasterBrain(strategy, lang, setDomains, addLog);

  const handleConnectIntegration = (toolId: string, apiKey: string) => {
    const toolMap: Record<string, string> = {
      'nb-1': 'namebio', 'hi-1': 'hunter', 'mz-1': 'moz', 'tr-1': 'wipo', 'es-1': 'escrow'
    };
    const provider = toolMap[toolId] || 'unknown';
    const newIntegration: ServiceIntegration = {
      id: toolId,
      name: provider.toUpperCase(),
      provider: provider,
      status: 'connected',
      impactArea: 'Full System Access'
    };
    setIntegrations(prev => [...prev.filter(i => i.id !== toolId), newIntegration]);
    addLog('Integration Center', `${provider.toUpperCase()} connected successfully.`, 'success');
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

  const menuGroups = [
    {
      title: lang === 'ar' ? 'الاستخبارات' : 'Intelligence',
      items: [
        { type: AgentType.MASTER_BRAIN, icon: 'fa-brain', label: t.masterBrain },
        { type: AgentType.NEXUS_PRIME, icon: 'fa-microchip', label: t.nexusPrime },
        { type: AgentType.FEEDBACK, icon: 'fa-graduation-cap', label: t.feedback },
      ]
    },
    {
      title: lang === 'ar' ? 'الاستحواذ' : 'Acquisition',
      items: [
        { type: AgentType.DISCOVERY, icon: 'fa-search', label: t.discovery },
        { type: AgentType.EVALUATION, icon: 'fa-gavel', label: t.evaluation },
        { type: AgentType.PURCHASE, icon: 'fa-shopping-cart', label: lang === 'ar' ? 'تنفيذ الشراء' : 'Purchase Action' },
        { type: AgentType.DROP_SNIPER, icon: 'fa-crosshairs', label: t.dropSniper },
      ]
    },
    {
      title: lang === 'ar' ? 'العمليات' : 'Operations',
      items: [
        { type: AgentType.PIPELINE, icon: 'fa-layer-group', label: t.pipeline },
        { type: AgentType.PORTFOLIO, icon: 'fa-vault', label: t.portfolio },
        { type: AgentType.VALUE_PROOF, icon: 'fa-certificate', label: t.valueProof },
        { type: AgentType.VALUE_MULTIPLIER, icon: 'fa-chart-line', label: t.valueMultiplier },
      ]
    },
    {
      title: lang === 'ar' ? 'التسييل' : 'Liquidation',
      items: [
        { type: AgentType.MESSAGING, icon: 'fa-paper-plane', label: t.messaging },
        { type: AgentType.NEGOTIATION, icon: 'fa-comments-dollar', label: t.negotiation },
        { type: AgentType.MARKETPLACE, icon: 'fa-store', label: t.marketplace },
        { type: AgentType.AUCTION_WATCH, icon: 'fa-broadcast-tower', label: t.auctionWatch },
      ]
    },
    {
      title: lang === 'ar' ? 'الإدارة' : 'Management',
      items: [
        { type: AgentType.EXECUTIVE, icon: 'fa-file-signature', label: t.executive },
        { type: AgentType.INTEGRATIONS, icon: 'fa-plug', label: t.integrations },
      ]
    }
  ];

  return (
    <div className={`flex h-full w-full overflow-hidden transition-all duration-500 bg-background text-foreground`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <CommandPalette domains={domains} setActiveTab={setActiveTab} onSearchDomain={(name) => {
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
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-hide">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <h5 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{group.title}</h5>
              {group.items.map(item => (
                <button key={item.type} onClick={() => { setActiveTab(item.type); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-4 px-4 py-3 transition-all rounded-xl border border-transparent ${activeTab === item.type ? 'bg-primary text-primary-foreground shadow-lg' : 'text-slate-500 hover:bg-accent hover:text-foreground'}`}>
                  <i className={`fas ${item.icon} w-5 text-center text-xs`}></i>
                  <span className="text-sm font-black">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="p-6 border-t border-border bg-slate-900/50 flex gap-2">
           <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="flex-1 py-2 rounded-lg text-[10px] font-black uppercase border border-border hover:bg-accent">{lang === 'ar' ? 'English' : 'العربية'}</button>
           <button onClick={() => setIsDark(!isDark)} className="flex-1 py-2 rounded-lg text-[10px] font-black uppercase border border-border hover:bg-accent">{isDark ? 'Light' : 'Dark'}</button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className={`h-20 border-b flex items-center justify-between px-6 lg:px-10 flex-shrink-0 z-[120] backdrop-blur-xl bg-background/80 border-border`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-500 w-10 h-10 border border-border rounded-xl flex items-center justify-center"><i className="fas fa-bars"></i></button>
            <h2 className="text-base lg:text-xl font-black tracking-tight">{t[activeTab.toLowerCase() as keyof typeof t] || activeTab}</h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t.estimatedValue}</span>
                <span className="text-sm lg:text-lg font-black text-green-600">$ {stats.estimatedPortfolioValue.toLocaleString()}</span>
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-hide">
          <div className="p-4 lg:p-10 transition-all duration-500 max-w-7xl mx-auto pb-24">
            {activeTab === AgentType.MASTER_BRAIN && <MasterBrainDashboard stats={stats} activityLogs={activityLogs} strategy={strategy} setStrategy={setStrategy} lang={lang} onInitiateScan={initiateScan} isScanning={isScanning} />}
            {activeTab === AgentType.NEXUS_PRIME && <NexusPrimeDashboard addLog={addLog} setDomains={setDomains} lang={lang} />}
            {activeTab === AgentType.FEEDBACK && <FeedbackDashboard domains={domains} stats={stats} />}
            {activeTab === AgentType.DISCOVERY && <DiscoveryDashboard domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />}
            {activeTab === AgentType.EVALUATION && <EvaluationDashboard domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />}
            {activeTab === AgentType.PURCHASE && <PurchaseDashboard domains={domains} setDomains={setDomains} />}
            {activeTab === AgentType.DROP_SNIPER && <DropSniperDashboard lang={lang} />}
            {activeTab === AgentType.PIPELINE && <PipelineDashboard domains={domains} setDomains={setDomains} onInspect={setInspectedDomain} lang={lang} />}
            {activeTab === AgentType.PORTFOLIO && <PortfolioManager domains={domains} setDomains={setDomains} lang={lang} />}
            {activeTab === AgentType.VALUE_PROOF && <ValueProofDashboard domains={domains} />}
            {activeTab === AgentType.VALUE_MULTIPLIER && <ValueMultiplierDashboard domains={domains} />}
            {activeTab === AgentType.MESSAGING && <MessagingDashboard domains={domains} setDomains={setDomains} />}
            {activeTab === AgentType.NEGOTIATION && <NegotiationDashboard domains={domains} setDomains={setDomains} />}
            {activeTab === AgentType.MARKETPLACE && <MarketplaceDashboard domains={domains} />}
            {activeTab === AgentType.AUCTION_WATCH && <AuctionWatchDashboard domains={domains} />}
            {activeTab === AgentType.EXECUTIVE && <ExecutiveReportDashboard domains={domains} stats={stats} lang={lang} />}
            {activeTab === AgentType.INTEGRATIONS && <IntegrationCenter integrations={integrations} onConnect={handleConnectIntegration} lang={lang} />}
          </div>
        </div>
      </main>
      <SonnerNotification notifications={notifications} onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} />
    </div>
  );
};

const App: React.FC = () => (
  <DomainProvider>
    <AppContent />
  </DomainProvider>
);

export default App;
