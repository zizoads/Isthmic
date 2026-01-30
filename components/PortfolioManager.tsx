
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
    <div className="grid grid-cols-12 gap-0 border-2 border-white/10 bg-[#050505]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar: Asset List - Square UI */}
      <div className="col-span-12 lg:col-span-4 flex flex-col h-[800px] border-r-2 border-white/10">
        <div className="p-10 border-b-2 border-white/10 bg-white/2 flex justify-between items-center">
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">{t.portfolio}</h3>
          <span className="text-[10px] font-mono text-[#c5a059] border border-[#c5a059] px-3 py-1">{purchasedDomains.length} UNITS</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar divide-y-2 divide-white/5">
          {purchasedDomains.map(d => (
            <div 
              key={d.id}
              onClick={() => handleDeepAudit(d)}
              className={`p-10 cursor-pointer transition-all flex items-center justify-between group
                ${selectedDomain?.id === d.id ? 'bg-[#c5a059] text-black' : 'hover:bg-white/5'}`}
            >
              <div className="space-y-2">
                <div className={`text-xl font-black prestige-heading italic ${selectedDomain?.id === d.id ? 'text-black' : 'text-white'}`}>{d.name}</div>
                <div className={`text-[10px] font-black uppercase tracking-widest ${selectedDomain?.id === d.id ? 'text-black/60' : 'text-slate-500'}`}>{d.sector}</div>
              </div>
              <div className="text-right">
                 <div className={`text-sm font-mono font-black mb-2 ${selectedDomain?.id === d.id ? 'text-black' : 'text-white'}`}>${d.price.toLocaleString()}</div>
                 <StatusBadge status={d.status} lang={lang} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content: Sharp & Industrial */}
      <div className="col-span-12 lg:col-span-8 flex flex-col h-[800px] overflow-y-auto no-scrollbar">
        {selectedDomain ? (
          <div className="divide-y-2 divide-white/10">
            {/* Visual Header */}
            <div className="p-14 lg:p-24 bg-[#0a0a0a]">
              <div className="flex flex-col md:flex-row justify-between items-start gap-16">
                <div className="flex-1 space-y-12">
                  <div className="space-y-8">
                    <span className="text-[11px] font-black text-[#c5a059] uppercase tracking-[0.5em] border-2 border-[#c5a059] px-6 py-2">{t.visualSynthesis}</span>
                    <h2 className="text-6xl lg:text-8xl font-black prestige-heading text-white italic leading-none">{selectedDomain.name}</h2>
                    <p className="text-slate-400 text-lg leading-relaxed italic border-l-4 border-white/10 pl-10 max-w-2xl">
                      {selectedDomain.brandAssets?.tagline || "System awaiting core visual DNA synthesis. Launch engineering protocol to proceed."}
                    </p>
                  </div>
                  
                  <div className="flex gap-6">
                    <button 
                      onClick={handleGenerateBrand}
                      disabled={loading}
                      className="square-button bg-white text-black"
                    >
                      {loading ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-wand-magic-sparkles mr-4"></i>}
                      {lang === 'ar' ? 'توليد الهوية البصرية' : 'SYNTHESIZE_IDENTITY'}
                    </button>
                  </div>
                </div>

                <div className="w-80 h-80 bg-[#050505] border-2 border-white/10 flex items-center justify-center p-12 group-hover:border-[#c5a059] transition-all relative">
                  {selectedDomain.brandAssets?.logoUrl ? (
                    <img src={selectedDomain.brandAssets.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center gap-6 text-slate-800">
                      <i className="fas fa-microchip text-7xl"></i>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">DNA_OFFLINE</span>
                    </div>
                  )}
                  {/* Decorative corner lines */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#c5a059]"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#c5a059]"></div>
                </div>
              </div>
            </div>

            <div className="p-14 lg:p-20">
               <HardROICalculator domain={selectedDomain} lang={lang} marketHeat={marketSignal?.momentumScore} />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-[#0a0a0a] p-24 text-center">
             <div className="w-32 h-32 border-2 border-white/5 flex items-center justify-center mb-10 text-slate-800">
                <i className="fas fa-cube text-6xl"></i>
             </div>
             <h3 className="text-3xl prestige-heading text-white italic mb-6">Awaiting_Asset_Selection</h3>
             <p className="text-slate-600 text-[11px] font-black uppercase tracking-[0.5em] max-w-sm leading-loose">
                // Select an operational unit from the registry to engage visual engineering.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;
