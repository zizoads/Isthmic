
import React, { useState, useRef } from 'react';
import IntegrationCenter from '../IntegrationCenter';
import PricingTerminal from '../PricingTerminal';
import SovereignReportBuilder from '../SovereignReportBuilder';
import AutopsyLab from '../AutopsyLab';
import LaunchControlHub from '../LaunchControlHub';
import { Domain, PlatformStats, ServiceIntegration } from '../../types';
import { useDomainContext } from '../../context/DomainContext';
import { NotificationService } from '../../services/NotificationService';

interface Props {
  domains: Domain[];
  stats: PlatformStats;
  integrations: ServiceIntegration[];
  onConnect: (id: string, key: string) => void;
  lang: 'ar' | 'en';
}

const ExecutiveSuite: React.FC<Props> = ({ domains, stats, integrations, onConnect, lang }) => {
  const { activeProfile, exportVault, importVault, wipeLocalVault, monetization, addLog, setActiveProfile } = useDomainContext();
  const [activeTab, setActiveTab] = useState<'profile' | 'integrations' | 'reports' | 'autopsy' | 'launch' | 'vault'>('profile');
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

  return (
    <div className="space-y-16 animate-precision pb-32" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {showPricing && <PricingTerminal onClose={() => setShowPricing(false)} lang={lang} />}

      <section className="relative bg-[#111113] border border-white/5 rounded-[48px] p-10 lg:p-14 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[40px] border-2 border-[#c5a059]/30 p-1.5 transition-transform duration-700 group-hover:rotate-6">
              <img src={activeProfile.avatar} className="full h-full rounded-[35px] object-cover" alt="Sovereign Avatar" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-[#111113] rounded-full"></div>
          </div>
          
          <div className="flex-1 space-y-4 text-center lg:text-right">
            <h2 className="text-4xl lg:text-6xl prestige-heading text-white italic leading-none">
              {activeProfile.name}
            </h2>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 items-center">
              <button onClick={() => setShowPricing(true)} className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.3em] bg-[#c5a059]/10 px-4 py-1.5 rounded-full border border-[#c5a059]/20 hover:bg-[#c5a059] hover:text-black transition-all">
                Access: {activeProfile.subscriptionTier} Tier
              </button>
            </div>
          </div>

          <div className="flex bg-[#0a0a0c] p-2 rounded-3xl border border-white/5 shadow-2xl overflow-x-auto max-w-full">
            {[
              { id: 'profile', label: 'Identity', icon: 'fa-user-tie' },
              { id: 'integrations', label: 'Gateways', icon: 'fa-plug' },
              { id: 'reports', label: 'Briefing', icon: 'fa-file-signature' },
              { id: 'autopsy', label: 'Autopsy', icon: 'fa-dna' },
              { id: 'launch', label: 'Launch', icon: 'fa-rocket' },
              { id: 'vault', label: 'Vault', icon: 'fa-vault' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl transition-all flex-shrink-0
                  ${activeTab === tab.id ? 'bg-[#c5a059] text-black shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}
              >
                <i className={`fas ${tab.icon} text-sm`}></i>
                <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <i className="fas fa-crown absolute right-[-40px] top-[-40px] text-white/5 text-[280px] pointer-events-none -rotate-12"></i>
      </section>

      <div className="min-h-[600px]">
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-slide-up">
            <div className="lg:col-span-2 space-y-10">
              <div className="square-card p-10 lg:p-14">
                <h3 className="text-xl prestige-heading text-white italic mb-10 border-b border-white/5 pb-6">Account Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sovereign Email</label>
                    <div className="text-white text-lg font-medium">{activeProfile.email}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subscription Quota</label>
                    <div className="text-white text-sm font-bold uppercase">
                      {activeProfile.usageStats.scansThisMonth} / {currentPlan.maxScans} Scans Used
                    </div>
                  </div>
                </div>
              </div>
              <div className="square-card p-10 lg:p-14">
                <h3 className="text-xl prestige-heading text-white italic mb-10 border-b border-white/5 pb-6">Transactional Alerts</h3>
                <div className="space-y-6">
                   {[
                     { id: 'emailAlerts', label: 'Global Email Notifications', desc: 'Enable encrypted dispatch for all high-stakes events.' },
                     { id: 'sniperNotifications', label: 'Golden Sniper Discovery', desc: 'Alert me instantly when a domain is audited as "Golden".' },
                     { id: 'reportReadiness', label: 'Executive Report Sync', desc: 'Notify when quarterly financial narrative is synthesized.' }
                   ].map(pref => (
                     <div key={pref.id} className="flex justify-between items-center group">
                        <div className="space-y-1">
                           <div className="text-sm font-bold text-white uppercase tracking-tight">{pref.label}</div>
                           <div className="text-[10px] text-slate-500 uppercase">{pref.desc}</div>
                        </div>
                        <button onClick={() => handleTogglePref(pref.id)} className={`w-14 h-7 rounded-full relative transition-all duration-500 ${ (activeProfile.preferences as any)?.[pref.id] ?? true ? 'bg-indigo-600' : 'bg-white/10' }`}>
                           <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 ${ (activeProfile.preferences as any)?.[pref.id] ?? true ? 'right-1' : 'left-1' }`}></div>
                        </button>
                     </div>
                   ))}
                </div>
              </div>
            </div>
            <div className="space-y-10">
               <div className="square-card p-10 bg-gradient-to-br from-[#161618] to-[#0a0a0c]">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">System Usage</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <div className="flex justify-between text-[8px] font-black uppercase text-slate-600"><span>AI Inference</span><span>{Math.round((activeProfile.usageStats.scansThisMonth / currentPlan.maxScans) * 100)}%</span></div>
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className="bg-[#c5a059] h-full" style={{ width: `${(activeProfile.usageStats.scansThisMonth / currentPlan.maxScans) * 100}%` }}></div></div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && <IntegrationCenter integrations={integrations} onConnect={onConnect} lang={lang} />}
        {activeTab === 'reports' && <SovereignReportBuilder stats={stats} domains={domains} lang={lang} />}
        {activeTab === 'autopsy' && <AutopsyLab />}
        {activeTab === 'launch' && <LaunchControlHub />}
        
        {activeTab === 'vault' && (
          <div className="max-w-5_5xl mx-auto space-y-12 animate-precision">
             <div className="square-card p-14 bg-gradient-to-br from-[#111113] to-[#0a0a0c] border-white/5 relative overflow-hidden group">
                <div className="relative z-10 space-y-10">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-[#c5a059]/10 rounded-3xl flex items-center justify-center text-[#c5a059] border border-[#c5a059]/20"><i className="fas fa-vault text-2xl"></i></div>
                      <div><h3 className="text-3xl prestige-heading text-white italic">Client-Side Vault Logic</h3><p className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.2em] mt-1">Status: Fully Sovereign</p></div>
                   </div>
                   <div className="flex wrap gap-6 pt-6">
                      <button onClick={exportVault} className="bg-white text-black px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all shadow-2xl flex items-center gap-4"><i className="fas fa-file-export"></i> Export Command Backup</button>
                      <button onClick={() => fileInputRef.current?.click()} className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-4"><i className="fas fa-file-import"></i> Restore Environment</button>
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
