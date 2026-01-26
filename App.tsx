
import React, { useState, useEffect } from 'react';
import { AgentType, Domain, PlatformStats, ActivityLog, Notification, PlatformStrategy } from './types';
import DiscoveryDashboard from './components/DiscoveryDashboard';
import EvaluationDashboard from './components/EvaluationDashboard';
import PurchaseDashboard from './components/PurchaseDashboard';
import MessagingDashboard from './components/MessagingDashboard';
import NegotiationDashboard from './components/NegotiationDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import MasterBrainDashboard from './components/MasterBrainDashboard';
import FeedbackDashboard from './components/FeedbackDashboard';
import PortfolioManager from './components/PortfolioManager';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AgentType | 'PORTFOLIO'>(AgentType.MASTER_BRAIN);
  const [domains, setDomains] = useState<Domain[]>(() => {
    const saved = localStorage.getItem('domainer_pro_domains');
    return saved ? JSON.parse(saved) : [];
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // حفظ التغييرات فوراً في localStorage
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
    { type: AgentType.DISCOVERY, icon: 'fa-search', label: 'Discovery' },
    { type: AgentType.EVALUATION, icon: 'fa-chart-pie', label: 'Evaluation' },
    { type: AgentType.PURCHASE, icon: 'fa-shopping-cart', label: 'Purchase' },
    { type: 'PORTFOLIO', icon: 'fa-vault', label: 'Portfolio Vault' },
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
          
          <div className="mt-10 px-4">
             <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] font-black text-slate-500 uppercase">Auto-Pilot</span>
                   <button 
                    onClick={() => setStrategy(s => ({...s, autoPilotMode: !s.autoPilotMode}))}
                    className={`w-8 h-4 rounded-full transition-all relative ${strategy.autoPilotMode ? 'bg-indigo-500' : 'bg-slate-700'}`}
                   >
                     <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${strategy.autoPilotMode ? 'left-4.5' : 'left-0.5'}`}></div>
                   </button>
                </div>
                <div className="text-[9px] text-slate-400 leading-tight">
                  Agents will act independently based on strategy.
                </div>
             </div>
          </div>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 rounded-l-[40px] shadow-2xl shadow-black my-2 mr-2">
        <header className="h-20 bg-white/50 backdrop-blur-xl border-b flex items-center justify-between px-10 sticky top-0 z-10 rounded-tl-[40px]">
          <div className="flex items-center gap-8">
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{sidebarItems.find(i => i.type === activeTab)?.label}</h2>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">System Operational</span>
              </div>
            </div>
            
            <div className="hidden md:flex relative group">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"></i>
              <input 
                type="text" 
                placeholder="Search Assets (Ctrl+K)" 
                className="bg-slate-100/50 border-none rounded-2xl pl-12 pr-4 py-2.5 text-xs font-bold w-64 focus:w-80 transition-all outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Portfolio</span>
              <span className="text-lg font-black text-slate-900">${stats.estimatedPortfolioValue.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative w-11 h-11 bg-white border border-slate-100 text-slate-500 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm flex items-center justify-center"
            >
              <i className="fas fa-bell"></i>
              {notifications.some(n => !n.read) && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            {activeTab === AgentType.MASTER_BRAIN && <MasterBrainDashboard stats={stats} activityLogs={activityLogs} strategy={strategy} setStrategy={setStrategy} />}
            {activeTab === AgentType.DISCOVERY && <DiscoveryDashboard domains={domains} setDomains={setDomains} addLog={addLog} />}
            {activeTab === AgentType.EVALUATION && <EvaluationDashboard domains={domains} setDomains={setDomains} addLog={addLog} />}
            {activeTab === AgentType.PURCHASE && <PurchaseDashboard domains={domains} setDomains={setDomains} />}
            {activeTab === 'PORTFOLIO' && <PortfolioManager domains={domains} setDomains={setDomains} />}
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
