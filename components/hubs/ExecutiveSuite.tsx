
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
  const { exportVault, importVault, wipeLocalVault } = useDomainContext();
  const [activeTab, setActiveTab] = useState<'reports' | 'integrations' | 'vault'>('reports');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className="space-y-16 animate-silk pb-24">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
         <div className="space-y-6">
            <h2 className="text-5xl lg:text-7xl prestige-heading text-white italic leading-none">
               Executive Suite
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl font-medium leading-relaxed border-l-2 border-[#c5a059]/40 pl-8 italic">
               Sovereign asset management hub. No accounts, no servers, full professional control over your digital legacy.
            </p>
         </div>
         
         <div className="flex bg-[#161618] p-2 rounded-3xl border border-white/5 shadow-2xl overflow-x-auto max-w-full no-scrollbar">
           {[
             { id: 'reports', label: 'FINANCIAL REPORTS' },
             { id: 'integrations', label: 'GATEWAY CONNECT' },
             { id: 'vault', label: 'SOVEREIGN VAULT' }
           ].map(tab => (
             <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                  ${activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
                {tab.label}
             </button>
           ))}
         </div>
      </div>

      <div className="pt-4">
        {activeTab === 'reports' && <ExecutiveReportDashboard domains={domains} stats={stats} lang="en" />}
        {activeTab === 'integrations' && <IntegrationCenter integrations={integrations} onConnect={onConnect} lang="en" />}
        {activeTab === 'vault' && (
          <div className="max-w-5xl mx-auto space-y-12 animate-precision">
             <div className="square-card p-14 bg-gradient-to-br from-[#111113] to-[#0a0a0c] border-white/5 relative overflow-hidden group">
                <div className="relative z-10 space-y-10">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-[#c5a059]/10 rounded-3xl flex items-center justify-center text-[#c5a059] border border-[#c5a059]/20">
                         <i className="fas fa-vault text-2xl"></i>
                      </div>
                      <div>
                        <h3 className="text-3xl prestige-heading text-white italic">Elite Data Residency</h3>
                        <p className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.2em] mt-1">Status: Fully Sovereign & Encrypted locally</p>
                      </div>
                   </div>
                   
                   <p className="text-slate-500 text-base leading-relaxed max-w-2xl font-medium">
                      Isthmic Pro operates on a "Zero-Knowledge" architecture. Your domain portfolio, negotiation strategies, and API keys reside exclusively in your browser's IndexedDB. This ensures maximum privacy for elite investors.
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

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[32px] space-y-6">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Local Database Status</h4>
                   <div className="flex justify-between items-end">
                      <div className="text-3xl font-light prestige-heading text-white">{domains.length}</div>
                      <div className="text-[9px] font-black text-green-500 uppercase pb-1">Nominal</div>
                   </div>
                   <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight">Active Assets in IndexedDB</p>
                </div>
                
                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[32px] space-y-6">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Privacy Protocol</h4>
                   <div className="flex justify-between items-end">
                      <div className="text-3xl font-light prestige-heading text-white">100%</div>
                      <div className="text-[9px] font-black text-indigo-400 uppercase pb-1">Sovereign</div>
                   </div>
                   <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight">Client-Side Only Mode</p>
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
