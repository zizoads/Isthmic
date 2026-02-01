
import React, { useState, useRef } from 'react';
import IntegrationCenter from '../IntegrationCenter';
import PricingTerminal from '../PricingTerminal';
import SovereignReportBuilder from '../SovereignReportBuilder';
import AnalyticsDashboard from '../AnalyticsDashboard';
import MarketMomentumChart from '../MarketMomentumChart';
import { Domain, PlatformStats, ServiceIntegration } from '../../types';
import { useDomainContext } from '../../context/DomainContext';
import { NotificationService } from '../../services/NotificationService';

interface Props {
  domains: Domain[];
  stats: PlatformStats;
  integrations: ServiceIntegration[];
  lang: 'ar' | 'en';
}

const ExecutiveSuite: React.FC<Props> = ({ domains, stats, integrations, lang }) => {
  const { activeProfile, exportVault, importVault, monetization, addLog, setActiveProfile, logout } = useDomainContext();
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'integrations' | 'reports' | 'vault'>('profile');
  const [showPricing, setShowPricing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!activeProfile) return null;

  const handleTogglePref = async (key: string) => {
    const nextPrefs = {
      ...(activeProfile.preferences || { emailAlerts: true, sniperNotifications: true, reportReadiness: true }),
      [key]: !((activeProfile.preferences as any)?.[key] ?? true)
    };
    const success = await NotificationService.updatePreferences(activeProfile.id, nextPrefs);
    if (success) {
      setActiveProfile({ ...activeProfile, preferences: nextPrefs });
      addLog('System', lang === 'ar' ? 'تم تحديث التفضيلات السيادية' : 'Sovereign preferences updated', 'success');
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) importVault(event.target.result as string);
    };
    reader.readAsText(file);
  };

  const currentPlan = monetization.plans[activeProfile.subscriptionTier];

  const availableTabs = [
    { id: 'profile', label: lang === 'ar' ? 'الهوية' : 'Identity', icon: 'fa-user-tie' },
    { id: 'stats', label: lang === 'ar' ? 'الأداء' : 'Performance', icon: 'fa-chart-pie' },
    { id: 'integrations', label: lang === 'ar' ? 'بوابات الربط' : 'Gateways', icon: 'fa-plug' },
    { id: 'reports', label: lang === 'ar' ? 'التقارير' : 'Briefing', icon: 'fa-file-signature' },
    { id: 'vault', label: lang === 'ar' ? 'الخزنة' : 'Vault', icon: 'fa-vault' }
  ];

  const getGraceDaysLeft = () => {
    const signupDate = new Date(activeProfile.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - signupDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - diffDays);
  };

  return (
    <div className="space-y-12 animate-precision pb-32" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {showPricing && <PricingTerminal onClose={() => setShowPricing(false)} lang={lang} />}

      <section className="relative bg-[#111113] border border-white/5 rounded-[40px] p-8 lg:p-12 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
          <div className="relative group">
            <div className="w-24 h-24 rounded-[30px] border-2 border-[#c5a059]/30 p-1.5 transition-transform duration-700 group-hover:rotate-6">
              <img src={activeProfile.avatar} className="w-full h-full rounded-[25px] object-cover" alt="Sovereign Avatar" />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 border-4 border-[#111113] rounded-full ${activeProfile.emailConfirmedAt ? 'bg-green-500' : 'bg-amber-500'}`}></div>
          </div>
          
          <div className="flex-1 space-y-2 text-center lg:text-left">
            <h2 className="text-3xl lg:text-5xl prestige-heading text-white italic leading-none">
              {activeProfile.name}
            </h2>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 items-center">
              <span className="text-[#c5a059] text-[9px] font-black uppercase tracking-[0.2em] bg-[#c5a059]/10 px-3 py-1 rounded-full border border-[#c5a059]/20">
                Tier: {activeProfile.subscriptionTier}
              </span>
              <button onClick={() => setShowPricing(true)} className="text-white text-[8px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all">
                Upgrade Access
              </button>
            </div>
          </div>

          <div className="flex bg-[#0a0a0c] p-1 rounded-2xl border border-white/5 shadow-2xl overflow-x-auto no-scrollbar max-w-full">
            {availableTabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`flex flex-col items-center gap-1 px-5 py-3 rounded-xl transition-all flex-shrink-0
                  ${activeTab === tab.id ? 'bg-[#d4af37] text-black shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}
              >
                <i className={`fas ${tab.icon} text-xs`}></i>
                <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <i className="fas fa-crown absolute right-[-40px] top-[-40px] text-white/5 text-[200px] pointer-events-none -rotate-12"></i>
      </section>

      <div className="min-h-[500px]">
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
            <div className="lg:col-span-2 space-y-8">
              <div className="square-card p-10">
                <h3 className="text-lg font-bold text-white italic mb-8 border-b border-white/5 pb-4">Sovereign Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Linked Email</label>
                    <div className="text-white text-base font-medium">{activeProfile.email}</div>
                    {!activeProfile.emailConfirmedAt && (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                         <div className="text-amber-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                            <i className="fas fa-exclamation-triangle"></i> Verification Overdue
                         </div>
                         <p className="text-[9px] text-slate-500 italic mt-2">
                           You have <span className="text-white font-bold">{getGraceDaysLeft()} days</span> remaining.
                         </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Usage Quota</label>
                    <div className="text-white text-xs font-bold uppercase">
                      {activeProfile.usageStats.scansThisMonth} / {currentPlan.maxScans} AI Cycles
                    </div>
                  </div>
                </div>
              </div>

              <div className="square-card p-10">
                <h3 className="text-lg font-bold text-white italic mb-8 border-b border-white/5 pb-4">Intelligence Preferences</h3>
                <div className="space-y-6">
                   {[
                     { id: 'emailAlerts', label: 'Financial Event Dispatch', desc: 'Encrypted email notifications for liquidation events.' },
                     { id: 'sniperNotifications', label: 'Golden Sniper Pulse', desc: 'Real-time alerts for high-alpha expiring domains.' }
                   ].map(pref => (
                     <div key={pref.id} className="flex justify-between items-center group">
                        <div className="space-y-1">
                           <div className="text-sm font-bold text-white uppercase tracking-tight">{pref.label}</div>
                           <div className="text-[9px] text-slate-500 uppercase">{pref.desc}</div>
                        </div>
                        <button onClick={() => handleTogglePref(pref.id)} className={`w-12 h-6 rounded-full relative transition-all duration-500 ${ (activeProfile.preferences as any)?.[pref.id] ?? true ? 'bg-indigo-600' : 'bg-white/10' }`}>
                           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-500 ${ (activeProfile.preferences as any)?.[pref.id] ?? true ? 'right-1' : 'left-1' }`}></div>
                        </button>
                     </div>
                   ))}
                </div>
              </div>
            </div>
            <div className="space-y-8">
               <div className="square-card p-8 bg-gradient-to-br from-[#161618] to-[#0a0a0c]">
                  <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6">System PHI</h3>
                  <div className="space-y-6">
                    <div className="text-4xl font-black text-white italic">0.999</div>
                    <div className="text-[9px] text-slate-600 uppercase">Latency Integrity Verified</div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="animate-slide-up space-y-12">
            <AnalyticsDashboard stats={stats} lang={lang} />
            <div className="glass-panel p-8 lg:p-12">
               <h3 className="text-xl font-bold text-white italic mb-10 text-center">Global Market Sentiment</h3>
               <MarketMomentumChart lang={lang} />
            </div>
          </div>
        )}

        {activeTab === 'integrations' && <IntegrationCenter integrations={integrations} lang={lang} />}
        {activeTab === 'reports' && <SovereignReportBuilder stats={stats} domains={domains} lang={lang} />}
        
        {activeTab === 'vault' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
             <div className="square-card p-12 bg-gradient-to-br from-[#111113] to-[#0a0a0c] border-white/5 relative overflow-hidden group">
                <div className="relative z-10 space-y-8">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-[#c5a059]/10 rounded-2xl flex items-center justify-center text-[#c5a059] border border-[#c5a059]/20"><i className="fas fa-vault text-xl"></i></div>
                      <div><h3 className="text-2xl prestige-heading text-white italic">Operational Vault</h3><p className="text-[#c5a059] text-[9px] font-black uppercase tracking-[0.2em] mt-1">Encryption Mode: XOR_Sovereign</p></div>
                   </div>
                   <div className="flex flex-wrap gap-4 pt-4">
                      <button onClick={exportVault} className="bg-white text-black px-8 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all shadow-xl"><i className="fas fa-file-export mr-2"></i> Export Backup</button>
                      <button onClick={() => fileInputRef.current?.click()} className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"><i className="fas fa-file-import mr-2"></i> Restore Environment</button>
                      <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".json" />
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutiveSuite;
