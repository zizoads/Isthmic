
import React, { useState, useEffect } from 'react';
import { AgentType, Domain, PlatformStats, ActivityLog, Notification, PlatformStrategy } from './types';
import DiscoveryDashboard from './components/DiscoveryDashboard';
import EvaluationDashboard from './components/EvaluationDashboard';
import PurchaseDashboard from './components/PurchaseDashboard';
import MessagingDashboard from './components/MessagingDashboard';
import NegotiationDashboard from './components/NegotiationDashboard';
import MasterBrainDashboard from './components/MasterBrainDashboard';
import FeedbackDashboard from './components/FeedbackDashboard';
import PortfolioManager from './components/PortfolioManager';
import ValueProofDashboard from './components/ValueProofDashboard';
import MarketplaceDashboard from './components/MarketplaceDashboard';
import AuctionWatchDashboard from './components/AuctionWatchDashboard';
import ValueMultiplierDashboard from './components/ValueMultiplierDashboard';
import DropSniperDashboard from './components/DropSniperDashboard';
import ExecutiveReportDashboard from './components/ExecutiveReportDashboard';
import { getTrendingSectorsAI, brainstormDomainsAI } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AgentType | 'PORTFOLIO' | 'VALUE_PROOF' | 'MARKETPLACE' | 'AUCTION_RADAR' | 'VALUE_MULTIPLIER' | 'DROP_SNIPER' | 'EXECUTIVE'>(AgentType.MASTER_BRAIN);
  const [domains, setDomains] = useState<Domain[]>(() => {
    const saved = localStorage.getItem('domainer_pro_domains');
    return saved ? JSON.parse(saved) : [];
  });
  const [isMasterScanning, setIsMasterScanning] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [strategy, setStrategy] = useState<PlatformStrategy>({
    minProfitMargin: 15,
    maxDomainPrice: 15,
    dailyMessageLimit: 10,
    riskTolerance: 'Balanced',
    autoEvaluate: true,
    autoPilotMode: false
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: '1', time: 'Now', agent: 'System', message: 'Platform Command Center Online.', type: 'info' }
  ]);
  
  const [stats, setStats] = useState<PlatformStats>({
    totalDiscovered: 0,
    totalPurchased: 0,
    messagesSent: 0,
    openRate: 64,
    repliesReceived: 0,
    avgProfit: 12,
    totalSpent: 0,
    estimatedPortfolioValue: 0
  });

  useEffect(() => {
    localStorage.setItem('domainer_pro_domains', JSON.stringify(domains));
  }, [domains]);

  const addLog = (agent: string, message: string, type: ActivityLog['type'] = 'info') => {
    const newLog: ActivityLog = {
      id: Math.random().toString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agent,
      message,
      type
    };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const initiateMasterScan = async () => {
    setIsMasterScanning(true);
    addLog('Master Brain', 'Initiating Global Market Synthesis...', 'critical');
    
    try {
      // 1. Find hottest sectors
      const trendingSectors = await getTrendingSectorsAI();
      addLog('Master Brain', `Identified ${trendingSectors.length} high-growth sectors: ${trendingSectors.map((s:any) => s.sector).join(', ')}`, 'success');
      
      let allNewDomains: Domain[] = [];
      
      // 2. Discover domains for each sector
      for (const sectorData of trendingSectors.slice(0, 3)) { // Limit to 3 for speed
        addLog('Discovery', `Deep-scanning ${sectorData.sector} market...`, 'info');
        const suggestedNames = await brainstormDomainsAI(sectorData.sector + " " + sectorData.suggestedKeywords.join(" "));
        
        const newDomains: Domain[] = suggestedNames.slice(0, 3).map((name: string) => ({
          id: Math.random().toString(),
          name: name.toLowerCase(),
          price: Math.floor(Math.random() * 50) + 20,
          status: 'available',
          contentStatus: 'none',
          lastChecked: new Date().toISOString(),
          sector: sectorData.sector,
          probability: Math.random() * 0.4 + 0.4 // Base probability
        }));
        
        allNewDomains = [...allNewDomains, ...newDomains];
      }
      
      setDomains(prev => [...allNewDomains, ...prev]);
      addLog('Master Brain', `Global Synthesis Complete. Added ${allNewDomains.length} strategic assets to buffer.`, 'success');
      setActiveTab(AgentType.DISCOVERY);
    } catch (error) {
      addLog('Master Brain', 'Global Synthesis Failed due to network latency.', 'critical');
    } finally {
      setIsMasterScanning(false);
    }
  };

  useEffect(() => {
    const purchased = domains.filter(d => d.status === 'purchased');
    const spent = purchased.reduce((acc, curr) => acc + curr.price, 0);
    const estValue = purchased.reduce((acc, curr) => acc + (curr.estimatedProfit || 0), 0);
    
    setStats(prev => ({
      ...prev,
      totalDiscovered: domains.length,
      totalPurchased: purchased.length,
      totalSpent: spent,
      estimatedPortfolioValue: estValue
    }));
  }, [domains]);

  const sidebarItems = [
    { type: AgentType.MASTER_BRAIN, icon: 'fa-brain', label: 'Master Brain' },
    { type: 'EXECUTIVE', icon: 'fa-file-invoice-dollar', label: 'Executive Intel' },
    { type: AgentType.DISCOVERY, icon: 'fa-search', label: 'Discovery' },
    { type: AgentType.EVALUATION, icon: 'fa-chart-pie', label: 'Evaluation' },
    { type: AgentType.PURCHASE, icon: 'fa-shopping-cart', label: 'Purchase' },
    { type: 'DROP_SNIPER', icon: 'fa-crosshairs', label: 'Drop Sniper' },
    { type: 'PORTFOLIO', icon: 'fa-vault', label: 'Portfolio Vault' },
    { type: 'VALUE_PROOF', icon: 'fa-magic', label: 'Value Proof Engine' },
    { type: 'VALUE_MULTIPLIER', icon: 'fa-layer-group', label: 'Value Multiplier' },
    { type: 'AUCTION_RADAR', icon: 'fa-satellite-dish', label: 'Auction Radar' },
    { type: 'MARKETPLACE', icon: 'fa-globe-americas', label: 'Marketplace Sync' },
    { type: AgentType.MESSAGING, icon: 'fa-envelope', label: 'Messaging' },
    { type: AgentType.NEGOTIATION, icon: 'fa-handshake', label: 'Negotiation' },
    { type: AgentType.FEEDBACK, icon: 'fa-sync', label: 'Feedback & Learning' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0c10]">
      <aside className="w-64 bg-[#0d1117] border-r border-slate-800 text-white flex flex-col z-20 shadow-2xl">
        <div className="p-8 border-b border-slate-800/50 flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3 transition-transform">
            <i className="fas fa-rocket"></i>
          </div>
          <h1 className="text-xl font-black tracking-tighter">DOMAINE<span className="text-indigo-400 font-light">PRO</span></h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="px-4 mb-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Autonomous Agents</div>
          <div className="space-y-1">
            {sidebarItems.map(item => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.type as any)}
                className={`w-full flex items-center gap-4 px-4 py-3 text-sm font-bold transition-all rounded-xl border border-transparent ${
                  activeTab === item.type 
                    ? 'bg-indigo-600/10 text-white border-indigo-500/30 shadow-inner' 
                    : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <i className={`fas ${item.icon} w-5 text-center ${activeTab === item.type ? 'text-indigo-400' : ''}`}></i>
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 rounded-l-[40px] shadow-2xl shadow-black my-2 mr-2">
        <header className="h-20 bg-white/50 backdrop-blur-xl border-b flex items-center justify-between px-10 sticky top-0 z-10 rounded-tl-[40px]">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">{sidebarItems.find(i => i.type === activeTab)?.label}</h2>
            <div className="flex items-center gap-2">
              <span className="w-red-500 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Reporting Mode: Institutional Grade</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={initiateMasterScan}
              disabled={isMasterScanning}
              className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-3 shadow-lg"
            >
              {isMasterScanning ? <i className="fas fa-sync-alt fa-spin"></i> : <><i className="fas fa-bolt"></i> Master Scan</>}
            </button>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Status</span>
              <span className="text-lg font-black text-green-600">Optimal ROI</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            {activeTab === AgentType.MASTER_BRAIN && <MasterBrainDashboard stats={stats} activityLogs={activityLogs} strategy={strategy} setStrategy={setStrategy} onInitiateScan={initiateMasterScan} isScanning={isMasterScanning} />}
            {activeTab === 'EXECUTIVE' && <ExecutiveReportDashboard domains={domains} stats={stats} />}
            {activeTab === AgentType.DISCOVERY && <DiscoveryDashboard domains={domains} setDomains={setDomains} addLog={addLog} />}
            {activeTab === AgentType.EVALUATION && <EvaluationDashboard domains={domains} setDomains={setDomains} addLog={addLog} />}
            {activeTab === AgentType.PURCHASE && <PurchaseDashboard domains={domains} setDomains={setDomains} />}
            {activeTab === 'DROP_SNIPER' && <DropSniperDashboard />}
            {activeTab === 'PORTFOLIO' && <PortfolioManager domains={domains} setDomains={setDomains} />}
            {activeTab === 'VALUE_PROOF' && <ValueProofDashboard domains={domains} />}
            {activeTab === 'VALUE_MULTIPLIER' && <ValueMultiplierDashboard domains={domains} />}
            {activeTab === 'AUCTION_RADAR' && <AuctionWatchDashboard domains={domains} />}
            {activeTab === 'MARKETPLACE' && <MarketplaceDashboard domains={domains} />}
            {activeTab === AgentType.MESSAGING && <MessagingDashboard domains={domains} setDomains={setDomains} />}
            {activeTab === AgentType.NEGOTIATION && <NegotiationDashboard domains={domains} setDomains={setDomains} />}
            {activeTab === AgentType.FEEDBACK && <FeedbackDashboard domains={domains} stats={stats} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
