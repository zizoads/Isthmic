
import React, { useState, useEffect } from 'react';
import { AgentType, Domain, PlatformStats, ActivityLog, PlatformStrategy, ServiceIntegration } from './types';
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
    { id: '1', name: 'NameBio Data Feed', provider: 'namebio', status: 'simulated', impactArea: 'دقة أسعار المبيعات التاريخية' },
    { id: '2', name: 'Hunter Intelligence', provider: 'hunter', status: 'simulated', impactArea: 'صيد البريد الإلكتروني الحقيقي' },
    { id: '3', name: 'WhoisXML Registry', provider: 'whois', status: 'simulated', impactArea: 'التحقق من ملكية النطاق' },
    { id: '4', name: 'Moz SEO Metrics', provider: 'moz', status: 'simulated', impactArea: 'بيانات الروابط والسلطة (DA)' },
    { id: '5', name: 'Escrow Security', provider: 'escrow', status: 'simulated', impactArea: 'إتمام الصفقات المالية الحقيقية' }
  ]);

  const integrityScore = (integrations.filter(i => i.status === 'connected').length / integrations.length) * 100;

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: '1', time: '10:00:00', agent: 'System', message: 'النظام في وضع المحاكاة. اربط الحسابات لفعالية كاملة.', type: 'info' }
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
    addLog('System', `تم ربط ${integrations.find(x => x.id === id)?.name} بنجاح.`, 'success');
  };

  const sidebarItems = [
    { type: AgentType.MASTER_BRAIN, icon: 'fa-brain', label: 'العقل المدبر', desc: 'الإعدادات المالية' },
    { type: AgentType.NEXUS_PRIME, icon: 'fa-microchip', label: 'NEXUS PRIME', desc: 'الشريك الاستراتيجي المتقدم' },
    { type: 'INTEGRATIONS', icon: 'fa-plug', label: 'الربط الحقيقي', desc: 'إدارة حسابات الـ API' },
    { type: 'PIPELINE', icon: 'fa-layer-group', label: 'خط الإنتاج', desc: 'إدارة التدفق' },
    { type: AgentType.DISCOVERY, icon: 'fa-search', label: 'الاستكشاف', desc: 'البحث عن فرص' },
    { type: AgentType.EVALUATION, icon: 'fa-chart-pie', label: 'التقييم', desc: 'فحص المخاطر' },
    { type: 'PORTFOLIO', icon: 'fa-vault', label: 'المحفظة', desc: 'إدارة أصولك' },
    { type: 'EXECUTIVE', icon: 'fa-file-invoice-dollar', label: 'التقرير التنفيذي', desc: 'تحليل الأرباح' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0c10] font-sans" dir="rtl">
      <aside className="w-72 bg-[#0d1117] border-l border-slate-800 text-white flex flex-col z-20 shadow-2xl">
        <div className="p-8 border-b border-slate-800/50 flex items-center gap-4">
             <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg"><i className="fas fa-rocket"></i></div>
             <h1 className="text-xl font-black tracking-tighter uppercase">DOMAINE<span className="text-indigo-400 font-light">PRO</span></h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.type as any)}
              className={`w-full flex items-center gap-4 px-4 py-3 text-right transition-all rounded-xl border border-transparent ${
                activeTab === item.type ? 'bg-indigo-600 text-white border-indigo-500/30 shadow-inner' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
              } ${item.type === AgentType.NEXUS_PRIME ? 'border-indigo-500/20' : ''}`}
            >
              <i className={`fas ${item.icon} w-6 text-center ${activeTab === item.type ? 'text-white' : ''}`}></i>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">{item.label}</span>
                <span className="text-[8px] opacity-50">{item.desc}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-6 bg-slate-900/50 border-t border-slate-800">
           <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-black text-slate-500 uppercase">مصداقية البيانات</span>
              <span className={`text-[9px] font-black ${integrityScore > 50 ? 'text-green-500' : 'text-amber-500'}`}>{integrityScore.toFixed(0)}%</span>
           </div>
           <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${integrityScore}%` }}></div>
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 rounded-r-[40px] shadow-2xl my-2 ml-2 relative">
        <header className="h-20 bg-white/70 backdrop-blur-2xl border-b flex items-center justify-between px-10 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">{sidebarItems.find(i => i.type === activeTab)?.label}</h2>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${integrityScore === 100 ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></span>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                {integrityScore === 100 ? 'وضع العمل الاحترافي نشط' : 'وضع المحاكاة: الاستدلال المستقل نشط'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-10">
             <div className="flex flex-col items-start">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">المحفظة التقديرية</span>
                <span className="text-lg font-black text-green-600">$ {stats.estimatedPortfolioValue.toLocaleString()}</span>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto h-full">
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
