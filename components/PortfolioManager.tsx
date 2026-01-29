
import React, { useState } from 'react';
import { Domain } from '../types';
import { generateBrandIdentityAI, getMarketSignalsAI } from '../services/geminiService';
import { translations } from '../translations';
import StatusBadge from './ui/StatusBadge';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  lang: 'ar' | 'en';
}

const PortfolioManager: React.FC<Props> = ({ domains, setDomains, lang }) => {
  const t = translations[lang];
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [loading, setLoading] = useState(false);
  const [marketSignal, setMarketSignal] = useState<any>(null);

  const handleDeepAudit = async (domain: Domain) => {
    setLoading(true);
    setSelectedDomain(domain);
    try {
      const signals = await getMarketSignalsAI(domain.name.split('.')[0]);
      setMarketSignal(signals);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleGenerateBrand = async () => {
    if (!selectedDomain) return;
    setLoading(true);
    try {
      const brand = await generateBrandIdentityAI(selectedDomain.name, selectedDomain.sector || 'Technology');
      setDomains(prev => prev.map(d => d.id === selectedDomain.id ? { ...d, brandAssets: brand } : d));
      setSelectedDomain(prev => prev ? { ...prev, brandAssets: brand } : null);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const purchasedDomains = domains.filter(d => d.status === 'purchased' || d.status === 'available');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar: Engineering List */}
      <div className="lg:col-span-4 square-card flex flex-col h-[700px] bg-[#050507]">
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.portfolio}</h3>
          <span className="text-[9px] font-mono text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full">{purchasedDomains.length} UNITS</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {purchasedDomains.map(d => (
            <div 
              key={d.id}
              onClick={() => handleDeepAudit(d)}
              className={`p-6 border-b border-white/5 cursor-pointer transition-all flex items-center justify-between group
                ${selectedDomain?.id === d.id ? 'bg-white/5 border-l-2 border-indigo-500' : 'hover:bg-white/[0.02]'}`}
            >
              <div className="space-y-1">
                <div className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight">{d.name}</div>
                <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{d.sector}</div>
              </div>
              <div className="text-right">
                 <div className="text-xs font-black text-white data-mono">${d.price.toLocaleString()}</div>
                 <StatusBadge status={d.status} lang={lang} />
              </div>
            </div>
          ))}
          {purchasedDomains.length === 0 && (
            <div className="p-20 text-center opacity-10">
               <i className="fas fa-layer-group text-4xl mb-4"></i>
               <p className="text-[10px] font-black uppercase">Inventory_Empty</p>
            </div>
          )}
        </div>
      </div>

      {/* Main: Visual Engineering Canvas */}
      <div className="lg:col-span-8 flex flex-col gap-10">
        {selectedDomain ? (
          <div className="square-card p-12 lg:p-16 bg-[#050507] flex flex-col h-full relative group">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
              <div className="flex-1 space-y-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-500/10 px-4 py-1 rounded-full">Active_Engineering</span>
                  <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter italic">{selectedDomain.name}</h2>
                  <p className="text-slate-500 text-sm leading-relaxed italic max-w-lg">
                    {selectedDomain.brandAssets?.tagline || "System awaiting core visual DNA synthesis. Launch engineering protocol to proceed."}
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={handleGenerateBrand}
                    disabled={loading}
                    className="square-button px-10 py-5 disabled:opacity-50"
                  >
                    {loading ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                    {lang === 'ar' ? 'توليد الهوية البصرية' : 'SYNTHESIZE_DNA'}
                  </button>
                </div>
              </div>

              {/* Logo Preview Area */}
              <div className="w-56 h-56 square-card bg-[#020204] flex items-center justify-center p-8 border-white/5 shadow-2xl group-hover:border-indigo-500/30 transition-all">
                {selectedDomain.brandAssets?.logoUrl ? (
                  <img src={selectedDomain.brandAssets.logoUrl} alt="Logo" className="w-full h-full object-contain animate-fade-in" />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-slate-800">
                    <i className="fas fa-palette text-5xl"></i>
                    <span className="text-[8px] font-black uppercase tracking-[0.4em]">Awaiting_Assets</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tactical Metrics Grid */}
            <div className="mt-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5 relative z-10">
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                 <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-3">Market_Sentiment</div>
                 <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${marketSignal?.signal === 'BULLISH' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-slate-700'}`}></div>
                    <div className="text-sm font-black text-white uppercase tracking-tighter">{marketSignal?.signal || 'N/A'}</div>
                 </div>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                 <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-3">Inference_Momentum</div>
                 <div className="text-xl font-black text-indigo-400 data-mono">{marketSignal?.momentumScore || 0}<span className="text-[10px] text-slate-600">%</span></div>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                 <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-3">Logic_Reasoning</div>
                 <p className="text-[9px] text-slate-500 leading-tight italic line-clamp-2">
                   {marketSignal?.reasoning || 'Perform system audit to reveal underlying market logic.'}
                 </p>
              </div>
            </div>
            
            <i className="fas fa-dna absolute left-[-40px] top-[-40px] text-white/[0.01] text-[250px] pointer-events-none -rotate-12 group-hover:text-indigo-500/[0.02] transition-colors duration-1000"></i>
          </div>
        ) : (
          <div className="square-card h-full flex flex-col items-center justify-center bg-[#050507] border-dashed border-white/10 p-20 text-center">
             <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
                <i className="fas fa-microchip text-slate-700 text-3xl"></i>
             </div>
             <h3 className="text-xl font-black text-white uppercase tracking-tighter italic mb-4">Awaiting_Asset_Selection</h3>
             <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] max-w-xs">
                Select an operational unit from the sidebar to begin visual DNA engineering.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;
