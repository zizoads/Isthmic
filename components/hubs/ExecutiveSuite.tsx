
import React, { useState, useRef } from 'react';
import ExecutiveReportDashboard from '../ExecutiveReportDashboard';
import IntegrationCenter from '../IntegrationCenter';
import { Domain, PlatformStats, ServiceIntegration } from '../../types';
import { useDomainContext } from '../../context/DomainContext';

interface Props {
  domains: Domain[];
  stats: PlatformStats;
  integrations: ServiceIntegration[];
  onConnect: (id: string, key: string) => void;
  lang: 'ar' | 'en';
}

const ExecutiveSuite: React.FC<Props> = ({ domains, stats, integrations, onConnect, lang }) => {
  const { activeProfile, isEmailConfirmed, exportVault, importVault, wipeLocalVault } = useDomainContext();
  const [activeTab, setActiveTab] = useState<'profile' | 'integrations' | 'reports' | 'vault'>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!activeProfile) return null;

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) importVault(event.target.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-16 animate-precision pb-32" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header Profile Section */}
      <section className="relative bg-[#111113] border border-white/5 rounded-[48px] p-10 lg:p-14 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[40px] border-2 border-[#c5a059]/30 p-1.5 transition-transform duration-700 group-hover:rotate-6">
              <img src={activeProfile.avatar} className="w-full h-full rounded-[35px] object-cover" alt="Sovereign Avatar" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-[#111113] rounded-full"></div>
          </div>
          
          <div className="flex-1 space-y-4 text-center lg:text-right">
            <h2 className="text-4xl lg:text-6xl prestige-heading text-white italic leading-none">
              {activeProfile.name}
            </h2>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 items-center">
              <span className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.3em] bg-[#c5a059]/10 px-4 py-1.5 rounded-full border border-[#c5a059]/20">
                Rank: {activeProfile.role}
              </span>
              <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${
                isEmailConfirmed 
                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                : 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse'
              }`}>
                {isEmailConfirmed ? 'Identity Verified' : 'Unverified Identity (Check Spam)'}
              </span>
            </div>
          </div>

          <div className="flex bg-[#0a0a0c] p-2 rounded-3xl border border-white/5 shadow-2xl">
            {[
              { id: 'profile', label: 'Identity', icon: 'fa-user-tie' },
              { id: 'integrations', label: 'Gateways', icon: 'fa-plug' },
              { id: 'reports', label: 'Financials', icon: 'fa-chart-pie' },
              { id: 'vault', label: 'Vault', icon: 'fa-vault' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl transition-all
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

      {/* Content Area */}
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
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deployment Date</label>
                    <div className="text-white text-lg font-medium">{new Date(activeProfile.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Default Language</label>
                    <div className="text-white text-lg font-medium">Standard English (Precision)</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Interface Mode</label>
                    <div className="text-white text-lg font-medium italic">Sovereign Dark Mode</div>
                  </div>
                </div>
              </div>

              {!isEmailConfirmed && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-10 rounded-[40px] flex items-center gap-8">
                  <div className="w-16 h-16 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center text-2xl shrink-0">
                    <i className="fas fa-envelope-open-text"></i>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xl mb-2">Pending Identity Verification</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Your identity is not yet fully anchored in the sovereign cloud. Check your email (including <b>Spam/Junk</b> folders) for the confirmation link.
                    </p>
                    <button className="mt-4 text-[#c5a059] text-[10px] font-black uppercase tracking-widest hover:underline">Resend Verification Signal</button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-10">
               <div className="square-card p-10 bg-gradient-to-br from-[#161618] to-[#0a0a0c]">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Platform Statistics</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Total Discovery Ops</span>
                      <span className="text-white font-bold">{stats.totalDiscovered}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Negotiation Wins</span>
                      <span className="text-green-500 font-bold">{stats.openRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Alpha Yield</span>
                      <span className="text-[#c5a059] font-bold">High</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && <IntegrationCenter integrations={integrations} onConnect={onConnect} lang={lang} />}
        
        {activeTab === 'reports' && <ExecutiveReportDashboard domains={domains} stats={stats} lang={lang} />}
        
        {activeTab === 'vault' && (
          <div className="max-w-5xl mx-auto space-y-12 animate-precision">
             <div className="square-card p-14 bg-gradient-to-br from-[#111113] to-[#0a0a0c] border-white/5 relative overflow-hidden group">
                <div className="relative z-10 space-y-10">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-[#c5a059]/10 rounded-3xl flex items-center justify-center text-[#c5a059] border border-[#c5a059]/20">
                         <i className="fas fa-vault text-2xl"></i>
                      </div>
                      <div>
                        <h3 className="text-3xl prestige-heading text-white italic">Client-Side Vault Logic</h3>
                        <p className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.2em] mt-1">Status: Fully Sovereign & Encrypted locally</p>
                      </div>
                   </div>
                   
                   <p className="text-slate-500 text-base leading-relaxed max-w-2xl font-medium">
                      All strategic data resides in your browser's secure context. Use these tools to relocate your command post between different physical machines.
                   </p>

                   <div className="flex flex-wrap gap-6 pt-6">
                      <button 
                        onClick={exportVault}
                        className="bg-white text-black px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all shadow-2xl flex items-center gap-4"
                      >
                         <i className="fas fa-file-export"></i> Export Command Backup
                      </button>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-4"
                      >
                         <i className="fas fa-file-import"></i> Restore Environment
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".json" />
                   </div>
                </div>
                <i className="fas fa-shield-halved absolute right-[-60px] bottom-[-60px] text-white/[0.02] text-[400px] pointer-events-none group-hover:text-[#c5a059]/[0.02] transition-colors duration-1000"></i>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[32px] space-y-6">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Database Residency</h4>
                   <div className="flex justify-between items-end">
                      <div className="text-3xl font-light prestige-heading text-white">{domains.length}</div>
                      <div className="text-[9px] font-black text-green-500 uppercase pb-1">Nominal</div>
                   </div>
                   <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight">Active Strategic Units</p>
                </div>
                
                <div className="p-10 bg-red-500/5 border border-red-500/10 rounded-[32px] space-y-6 group">
                   <h4 className="text-[10px] font-black text-red-500/60 uppercase tracking-widest">Hazard Protocol</h4>
                   <button 
                     onClick={() => { if(confirm("This will PERMANENTLY delete your local data. Proceed?")) wipeLocalVault(); }}
                     className="text-xl font-light prestige-heading text-white hover:text-red-500 transition-colors block text-left"
                   >
                     Wipe Local Vault
                   </button>
                   <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight">Sanitize current device</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutiveSuite;
