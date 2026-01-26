
import React, { useState, useEffect, useRef } from 'react';
import { AgentType, Domain, PlatformStats, ActivityLog, PlatformStrategy } from './types';
import DiscoveryDashboard from './components/DiscoveryDashboard';
import EvaluationDashboard from './components/EvaluationDashboard';
import PurchaseDashboard from './components/PurchaseDashboard';
import MessagingDashboard from './components/MessagingDashboard';
import NegotiationDashboard from './components/NegotiationDashboard';
import MasterBrainDashboard from './components/MasterBrainDashboard';
import PortfolioManager from './components/PortfolioManager';
import ValueProofDashboard from './components/ValueProofDashboard';
import ExecutiveReportDashboard from './components/ExecutiveReportDashboard';
import CommandPalette from './components/CommandPalette';
import AgentReasoningLab from './components/AgentReasoningLab';
import SonnerNotification from './components/SonnerNotification';
import { getTrendingSectorsAI, brainstormDomainsAI } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AgentType | 'PORTFOLIO' | 'VALUE_PROOF' | 'MARKETPLACE' | 'AUCTION_RADAR' | 'VALUE_MULTIPLIER' | 'DROP_SNIPER' | 'EXECUTIVE'>(AgentType.MASTER_BRAIN);
  const [domains, setDomains] = useState<Domain[]>(() => {
    const saved = localStorage.getItem('domainer_pro_domains');
    return saved ? JSON.parse(saved) : [];
  });
  const [isMasterScanning, setIsMasterScanning] = useState(false);
  const [hasProKey, setHasProKey] = useState(false);
  const [selectedDomainForLab, setSelectedDomainForLab] = useState<Domain | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const isCancelledRef = useRef(false);
  
  const [strategy, setStrategy] = useState<PlatformStrategy>({
    totalBudget: 25000,
    maxPricePerDomain: 100,
    targetTLDs: ['.com', '.ai'],
    minLiquidityScore: 7,
    targetROI: 400,
    minHoldingPeriod: 12,
    riskTolerance: 'Balanced',
    autoEvaluate: true,
    autoPilotMode: false
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: '1', time: '10:00:00', agent: 'System', message: 'النظام جاهز. جميع البيانات مستقاة من بحث جوجل المباشر.', type: 'info' }
  ]);
  
  const [stats, setStats] = useState<PlatformStats>({
    totalDiscovered: domains.length,
    totalPurchased: domains.filter(d => d.status === 'purchased').length,
    messagesSent: 0,
    openRate: 64,
    repliesReceived: 0,
    avgProfit: 142,
    totalSpent: domains.filter(d => d.status === 'purchased').reduce((acc, curr) => acc + (curr.acquisitionCost || curr.price), 0),
    estimatedPortfolioValue: domains.filter(d => d.status === 'purchased').reduce((acc, curr) => acc + (curr.estimatedProfit || 0), 0)
  });

  useEffect(() => {
    const checkKeyStatus = async () => {
      try {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setHasProKey(hasKey);
      } catch (e) {
        setHasProKey(false);
      }
    };
    checkKeyStatus();
  }, []);

  useEffect(() => {
    localStorage.setItem('domainer_pro_domains', JSON.stringify(domains));
    const purchased = domains.filter(d => d.status === 'purchased');
    const spent = purchased.reduce((acc, curr) => acc + (curr.acquisitionCost || curr.price), 0);
    const estValue = purchased.reduce((acc, curr) => acc + (curr.estimatedProfit || 0), 0);
    setStats(prev => ({
      ...prev,
      totalDiscovered: domains.length,
      totalPurchased: purchased.length,
      totalSpent: spent,
      estimatedPortfolioValue: estValue,
      unrealizedGains: estValue - spent
    }));
  }, [domains]);

  const addNotification = (agent: string, message: string, type: any = 'info') => {
    const id = Math.random().toString();
    setNotifications(prev => [{ id, agent, message, type }, ...prev].slice(0, 5));
    // إزالة التلقائية بعد 5 ثوانٍ
    setTimeout(() => dismissNotification(id), 5000);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addLog = (agent: string, message: string, type: ActivityLog['type'] = 'info') => {
    const newLog: ActivityLog = {
      id: Math.random().toString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      agent,
      message,
      type
    };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 50));
    if (type === 'critical' || type === 'success') {
      addNotification(agent, message, type);
    }
  };

  const resetAllData = () => {
    if (window.confirm('هل أنت متأكد؟ سيتم مسح جميع النطاقات والبيانات الحالية للبدء من جديد.')) {
      setDomains([]);
      localStorage.removeItem('domainer_pro_domains');
      addLog('System', 'تم تصفير جميع البيانات بنجاح.', 'warning');
    }
  };

  const initiateMasterScan = async () => {
    isCancelledRef.current = false;
    setIsMasterScanning(true);
    addLog('Master Brain', `بدء المسح وتحليل مبيعات السوق الحقيقية...`, 'critical');
    
    try {
      const trendingSectors = await getTrendingSectorsAI();
      if (isCancelledRef.current) return;
      
      let allNewDomains: Domain[] = [];
      for (const sectorData of trendingSectors.slice(0, 2)) {
        if (isCancelledRef.current) break;
        const suggestedObjects = await brainstormDomainsAI(sectorData.sector);
        const newDomains: Domain[] = suggestedObjects.slice(0, 3).map((obj: any) => ({
          id: Math.random().toString(),
          name: obj.name.toLowerCase(),
          price: obj.estimatedPrice, 
          status: 'available',
          contentStatus: 'none',
          lastChecked: new Date().toISOString(),
          sector: sectorData.sector,
          probability: obj.probability,
          justification: obj.justification,
          workflow: {
            currentStep: 'Discovered',
            history: [`Discovered in ${sectorData.sector} sector with ${obj.probability} confidence.`],
            contextData: { sectorData }
          }
        }));
        allNewDomains = [...allNewDomains, ...newDomains];
      }
      
      setDomains(prev => [...allNewDomains, ...prev]);
      setActiveTab(AgentType.DISCOVERY);
    } catch (error) {
      addLog('Master Brain', 'خطأ في جلب البيانات الدقيقة.', 'critical');
    } finally {
      setIsMasterScanning(false);
    }
  };

  const sidebarItems = [
    { type: AgentType.MASTER_BRAIN, icon: 'fa-brain', label: 'العقل المدبر', desc: 'الإعدادات المالية' },
    { type: 'EXECUTIVE', icon: 'fa-file-invoice-dollar', label: 'التقرير التنفيذي', desc: 'تحليل الأرباح' },
    { type: AgentType.DISCOVERY, icon: 'fa-search', label: 'الاستكشاف', desc: 'البحث عن فرص' },
    { type: AgentType.EVALUATION, icon: 'fa-chart-pie', label: 'التقييم', desc: 'فحص المخاطر' },
    { type: AgentType.PURCHASE, icon: 'fa-shopping-cart', label: 'الشراء', desc: 'إتمام الصفقات' },
    { type: 'PORTFOLIO', icon: 'fa-vault', label: 'المحفظة (الخزنة)', desc: 'إدارة أصولك' },
    { type: 'VALUE_PROOF', icon: 'fa-magic', label: 'إثبات القيمة', desc: 'توليد المفاهيم' },
    { type: AgentType.MESSAGING, icon: 'fa-envelope', label: 'المراسلات', desc: 'التواصل مع المشترين' },
    { type: AgentType.NEGOTIATION, icon: 'fa-handshake', label: 'التفاوض', desc: 'إغلاق المبيعات' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0c10] font-sans" dir="rtl">
      <CommandPalette domains={domains} setActiveTab={setActiveTab} onSearchDomain={(name) => {
        const d = domains.find(x => x.name === name);
        if (d) { setSelectedDomainForLab(d); setActiveTab(AgentType.EVALUATION); }
      }} />
      
      {selectedDomainForLab && <AgentReasoningLab domain={selectedDomainForLab} onClose={() => setSelectedDomainForLab(null)} />}
      
      <SonnerNotification notifications={notifications} onDismiss={dismissNotification} />

      <aside className="w-72 bg-[#0d1117] border-l border-slate-800 text-white flex flex-col z-20 shadow-2xl">
        <div className="p-8 border-b border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-rocket"></i>
             </div>
             <h1 className="text-xl font-black tracking-tighter uppercase">DOMAINE<span className="text-indigo-400 font-light">PRO</span></h1>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="px-4 mb-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">عمليات الأصول</div>
          <div className="space-y-1">
            {sidebarItems.map(item => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.type as any)}
                className={`w-full flex items-center gap-4 px-4 py-3 text-right transition-all rounded-xl border border-transparent ${
                  activeTab === item.type 
                    ? 'bg-indigo-600/10 text-white border-indigo-500/30 shadow-inner' 
                    : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <i className={`fas ${item.icon} w-6 text-center ${activeTab === item.type ? 'text-indigo-400' : ''}`}></i>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold">{item.label}</span>
                  <span className="text-[8px] opacity-50">{item.desc}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 px-4">
            <button 
              onClick={resetAllData}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
            >
              <i className="fas fa-trash-alt w-6"></i>
              <span className="text-sm font-bold">تصفير النظام</span>
            </button>
          </div>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 rounded-r-[40px] shadow-2xl my-2 ml-2 border-r border-white/10 relative">
        <header className="h-20 bg-white/70 backdrop-blur-2xl border-b flex items-center justify-between px-10 sticky top-0 z-10 rounded-tr-[40px]">
          <div className="flex items-center gap-6">
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{sidebarItems.find(i => i.type === activeTab)?.label}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isMasterScanning ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></span>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    {isMasterScanning ? 'جاري تحليل الأسعار الحقيقية...' : 'تم ربط الأسعار ببيانات السوق الحية'}
                  </span>
                </div>
                <div className="px-2 py-0.5 bg-slate-100 rounded text-[8px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                   CMD + K
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-10">
            {hasProKey && (
              <div className="bg-indigo-600/10 text-indigo-600 px-4 py-2 rounded-xl border border-indigo-600/20 flex items-center gap-2">
                 <i className="fas fa-crown text-[10px]"></i>
                 <span className="text-[10px] font-black uppercase tracking-widest">PRO Enterprise Mode</span>
              </div>
            )}
            <div className="flex flex-col items-start">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">قيمة المحفظة التقديرية</span>
              <span className="text-lg font-black text-green-600">$ {stats.estimatedPortfolioValue.toLocaleString()}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            {activeTab === AgentType.MASTER_BRAIN && <MasterBrainDashboard stats={stats} activityLogs={activityLogs} strategy={strategy} setStrategy={setStrategy} onInitiateScan={initiateMasterScan} isScanning={isMasterScanning} onKeyUpdate={() => setHasProKey(true)} />}
            {activeTab === 'EXECUTIVE' && <ExecutiveReportDashboard domains={domains} stats={stats} />}
            {activeTab === AgentType.DISCOVERY && <DiscoveryDashboard domains={domains} setDomains={setDomains} addLog={addLog} />}
            {activeTab === AgentType.EVALUATION && <EvaluationDashboard domains={domains} setDomains={setDomains} addLog={addLog} onInspectDomain={setSelectedDomainForLab} />}
            {activeTab === AgentType.PURCHASE && <PurchaseDashboard domains={domains} setDomains={setDomains} />}
            {activeTab === 'PORTFOLIO' && <PortfolioManager domains={domains} setDomains={setDomains} />}
            {activeTab === 'VALUE_PROOF' && <ValueProofDashboard domains={domains} />}
            {activeTab === AgentType.MESSAGING && <MessagingDashboard domains={domains} setDomains={setDomains} />}
            {activeTab === AgentType.NEGOTIATION && <NegotiationDashboard domains={domains} setDomains={setDomains} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
