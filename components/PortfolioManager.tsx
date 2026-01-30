
import React, { useState } from 'react';
import { Domain } from '../types';
import { generateBrandIdentityAI, getMarketSignalsAI } from '../services/geminiService';
import { translations } from '../translations';
import StatusBadge from './ui/StatusBadge';
import HardROICalculator from './HardROICalculator';

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

  const handleUpdateDomain = (updated: Domain) => {
    setDomains(prev => prev.map(d => d.id === updated.id ? updated : d));
    setSelectedDomain(updated);
  };

  const handleGenerateBrand = async () => {
    if (!selectedDomain) return;
    setLoading(true);
    try {
      const brand = await generateBrandIdentityAI(selectedDomain.name, selectedDomain.sector || 'Technology');
      const updated = { ...selectedDomain, brandAssets: brand };
      handleUpdateDomain(updated);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const purchasedDomains = domains.filter(d => d.status === 'purchased' || d.status === 'available');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-precision" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar: Asset List */}
      <div className="lg:col-span-4 square-card flex flex-col h-[850px] bg-[#0a0a0c]">
        <div className="p-10 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.portfolio}</h3>
          <span className="text-[9px] font-mono text-[#c5a059] bg-[#c5a059]/10 px-4 py-1.5 rounded-full">{purchasedDomains.length} UNITS</span>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {purchasedDomains.map(d => (
            <div 
              key={d.id}
              onClick={() => handleDeepAudit(d)}
              className={`p-8 border-b border-white/5 cursor-pointer transition-all flex items-center justify-between group
                ${selectedDomain?.id === d.id ? 'bg-white/5 border-l-2 border-[#c5a059]' : 'hover:bg-white/[0.01]'}`}
            >
              <div className="space-y-2">
                <div className="text-base font-black text-white group-hover:text-[#c5a059] transition-colors tracking-tight italic">{d.name}</div>
                <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{d.sector}</div>
              </div>
              <div className="text-right">
                 <div className="text-xs font-black text-white prestige-heading mb-2">${d.price.toLocaleString()}</div>
                 <StatusBadge status={d.status} lang={lang} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main: Visual Canvas & ROI */}
      <div className="lg:col-span-8 flex flex-col gap-10 h-[850px] overflow-y-auto no-scrollbar pb-20">
        {selectedDomain ? (
          <div className="space-y-10">
            <div className="square-card p-14 lg:p-20 bg-[#0a0a0c] relative group">
              <div className="flex flex-col md:flex-row justify-between items-start gap-14 relative z-10">
                <div className="flex-1 space-y-10 text-right">
                  <div className="space-y-6">
                    <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest bg-[#c5a059]/10 px-6 py-2 rounded-full border border-[#c5a059]/20">{t.visualSynthesis}</span>
                    <h2 className="text-5xl lg:text-7xl font-light prestige-heading text-white italic leading-none">{selectedDomain.name}</h2>
                    <p className="text-slate-500 text-base leading-relaxed italic max-w-xl pr-6 border-r-2 border-white/5">
                      {selectedDomain.brandAssets?.tagline || "System awaiting core visual DNA synthesis. Launch engineering protocol to proceed."}
                    </p>
                  </div>
                  
                  <div className="flex gap-5 justify-end">
                    <button 
                      onClick={handleGenerateBrand}
                      disabled={loading}
                      className="bg-white text-black px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all shadow-2xl"
                    >
                      {loading ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-wand-magic-sparkles ml-3"></i>}
                      {lang === 'ar' ? 'توليد الهوية البصرية' : 'SYNTHESIZE_DNA'}
                    </button>
                  </div>
                </div>

                <div className="w-64 h-64 square-card bg-[#050507] flex items-center justify-center p-10 border-white/5 shadow-2xl group-hover:border-[#c5a059]/20 transition-all">
                  {selectedDomain.brandAssets?.logoUrl ? (
                    <img src={selectedDomain.brandAssets.logoUrl} alt="Logo" className="w-full h-full object-contain animate-precision" />
                  ) : (
                    <div className="flex flex-col items-center gap-6 text-slate-800">
                      <i className="fas fa-palette text-6xl"></i>
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">DNA_Unidentified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
               <HardROICalculator domain={selectedDomain} lang={lang} marketHeat={marketSignal?.momentumScore} />
            </div>
          </div>
        ) : (
          <div className="square-card h-full flex flex-col items-center justify-center bg-[#0a0a0c] border-dashed border-white/10 p-24 text-center">
             <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mb-10 border border-white/5">
                <i className="fas fa-microchip text-slate-800 text-4xl"></i>
             </div>
             <h3 className="text-2xl prestige-heading text-white italic mb-4">Awaiting_Asset_Selection</h3>
             <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] max-w-xs leading-loose">
                Select an operational unit from the sidebar to begin visual DNA engineering.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;
