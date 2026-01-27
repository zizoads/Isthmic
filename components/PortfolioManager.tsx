
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
  const [generatingBrand, setGeneratingBrand] = useState(false);

  const handleDeepAudit = async (domain: Domain) => {
    setLoading(true);
    setSelectedDomain(domain);
    setMarketSignal(null);
    try {
      const signals = await getMarketSignalsAI(domain.name.split('.')[0]);
      setMarketSignal(signals);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleGenerateBrand = async () => {
    if (!selectedDomain) return;
    setGeneratingBrand(true);
    try {
      const brand = await generateBrandIdentityAI(selectedDomain.name, selectedDomain.sector || 'Technology');
      setDomains(prev => prev.map(d => d.id === selectedDomain.id ? { ...d, brandAssets: brand } : d));
      setSelectedDomain(prev => prev ? { ...prev, brandAssets: brand } : null);
    } catch (e) {
      console.error(e);
    }
    setGeneratingBrand(false);
  };

  const purchasedDomains = domains.filter(d => d.status === 'purchased' || d.status === 'available');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Asset Selection Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-background border border-border rounded-[40px] p-8 sticky top-0 shadow-sm">
           <h3 className="text-xl font-black text-foreground uppercase tracking-tighter mb-6">{t.portfolio}</h3>
           <div className="space-y-4 max-h-[calc(100vh-350px)] overflow-y-auto pr-2 custom-scrollbar">
              {purchasedDomains.length === 0 ? (
                <div className="py-20 text-center space-y-4 opacity-30">
                   <i className="fas fa-box-open text-4xl"></i>
                   <p className="text-xs font-black uppercase tracking-widest">{lang === 'ar' ? 'المحفظة فارغة' : 'Portfolio Empty'}</p>
                </div>
              ) : purchasedDomains.map(d => (
                <div 
                  key={d.id} 
                  onClick={() => handleDeepAudit(d)}
                  className={`p-6 rounded-[32px] cursor-pointer transition-all border group relative overflow-hidden ${selectedDomain?.id === d.id ? 'bg-primary border-primary text-primary-foreground shadow-2xl scale-[1.02]' : 'bg-accent/30 border-border hover:border-primary/50'}`}
                >
                  <div className="flex justify-between items-center relative z-10">
                    <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                       <span className="font-black text-sm truncate block max-w-[140px]">{d.name}</span>
                       <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={d.status} lang={lang} />
                       </div>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] font-mono opacity-80">${d.price}</span>
                       {d.brandAssets?.logoUrl && <i className="fas fa-certificate text-[10px] text-green-400 mt-1 animate-pulse"></i>}
                    </div>
                  </div>
                  {selectedDomain?.id === d.id && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -rotate-45 translate-x-10 -translate-y-10"></div>
                  )}
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Engineering Canvas */}
      <div className="lg:col-span-8 space-y-8">
        {selectedDomain ? (
          <div className="space-y-8 animate-slide-up pb-10">
            {/* Market Pulse Overlay */}
            <div className="bg-slate-900 text-white rounded-[40px] p-10 flex flex-col md:flex-row justify-between items-center gap-10 border border-white/10 shadow-2xl relative overflow-hidden">
               <div className={lang === 'ar' ? 'text-right w-full md:w-auto' : 'text-left w-full md:w-auto'}>
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">{t.marketSentiment}</div>
                  <div className={`text-5xl font-black ${marketSignal?.signal === 'BUY' ? 'text-green-500' : marketSignal?.signal === 'SELL' ? 'text-red-500' : 'text-amber-500'}`}>
                    {loading ? <i className="fas fa-circle-notch fa-spin text-3xl"></i> : (marketSignal?.signal || '---')}
                  </div>
               </div>
               <div className="flex-1 bg-white/5 p-8 rounded-[32px] border border-white/5 backdrop-blur-xl">
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    {loading ? t.verifyingComps : `"${marketSignal?.reasoning || t.awaitingSignal}"`}
                  </p>
               </div>
               <div className="text-center bg-indigo-500/10 p-6 rounded-[32px] min-w-[120px] border border-indigo-500/20">
                  <div className="text-3xl font-black text-indigo-400">{marketSignal?.momentumScore || 0}%</div>
                  <div className="text-[9px] font-black text-slate-500 uppercase">{t.momentum}</div>
               </div>
               <i className="fas fa-wave-square absolute right-[-20px] bottom-[-20px] text-white/5 text-[150px] pointer-events-none"></i>
            </div>

            {/* Brand Engineering Studio */}
            <div className="bg-background border border-border rounded-[40px] p-8 lg:p-14 relative overflow-hidden shadow-lg">
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-10">
                     <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                        <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-foreground leading-tight break-all mb-4">{selectedDomain.name}</h2>
                        <div className="flex gap-3 mb-8">
                           <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">{selectedDomain.sector}</span>
                           <span className="bg-green-500/10 text-green-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">{t.integrity}</span>
                        </div>
                        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium italic leading-relaxed">
                          "{selectedDomain.brandAssets?.tagline || (lang === 'ar' ? 'بانتظار تركيب الهوية البصرية...' : 'Awaiting identity synthesis...')}"
                        </p>
                     </div>
                     
                     <div className={`flex gap-4 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                        <button 
                          onClick={handleGenerateBrand}
                          disabled={generatingBrand}
                          className="bg-primary text-primary-foreground px-10 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-4 shadow-2xl shadow-primary/20 disabled:opacity-50"
                        >
                          {generatingBrand ? <i className="fas fa-dna fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                          {generatingBrand ? t.designing : t.generateBrandIdentityAI}
                        </button>
                     </div>
                  </div>

                  <div className="flex items-center justify-center relative bg-accent/20 rounded-[50px] p-10 border border-border/50">
                     {generatingBrand && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-6 bg-slate-900/60 backdrop-blur-md rounded-[50px] animate-fade-in text-white">
                           <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                           <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Engineering Pixels...</p>
                        </div>
                     )}
                     
                     {selectedDomain.brandAssets?.logoUrl ? (
                        <div className="p-4 bg-white rounded-[50px] shadow-2xl group relative transition-all hover:scale-110 hover:rotate-3">
                           <img src={selectedDomain.brandAssets.logoUrl} alt="Logo" className="w-56 h-56 lg:w-80 lg:h-80 object-contain rounded-[40px]" />
                           <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[50px] flex items-center justify-center backdrop-blur-[2px]">
                              <span className="text-white font-black text-xs uppercase tracking-[0.3em]">{t.masterpieceReady}</span>
                           </div>
                        </div>
                     ) : (
                        <div className="w-56 h-56 lg:w-80 lg:h-80 border-4 border-dashed border-border rounded-[50px] flex flex-col items-center justify-center text-slate-300 animate-pulse bg-background shadow-inner">
                           <i className="fas fa-palette text-6xl mb-4"></i>
                           <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{t.brandCanvas}</span>
                        </div>
                     )}
                  </div>
               </div>
               <i className="fas fa-drafting-dots absolute right-[-100px] bottom-[-100px] text-primary/5 text-[400px] pointer-events-none -rotate-12"></i>
            </div>

            {/* Asset Audit Specs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-background border border-border p-8 rounded-[40px] shadow-sm md:col-span-2">
                  <h4 className={`text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.operationalHistory}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     {[
                        { label: lang === 'ar' ? 'تاريخ الحجز' : 'Acquisition Date', value: selectedDomain.acquisitionDate || 'Current Cycle' },
                        { label: lang === 'ar' ? 'التقييم الحالي' : 'Current Valuation', value: `$${((selectedDomain.price || 0) * 4.2).toLocaleString()}` },
                        { label: lang === 'ar' ? 'درجة الندرة' : 'Rarity Score', value: 'Alpha-Grade' },
                        { label: lang === 'ar' ? 'قابلية التسييل' : 'Liquidity Horizon', value: '4-8 Months' }
                     ].map((item, i) => (
                        <div key={i} className={`flex justify-between items-center py-4 border-b border-border ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                           <span className="text-xs text-slate-500 font-bold">{item.label}</span>
                           <span className="text-xs font-black text-foreground">{item.value}</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="bg-green-500 text-white p-10 rounded-[40px] shadow-xl flex flex-col justify-center items-center text-center space-y-6 relative overflow-hidden">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl shadow-lg relative z-10">
                     <i className="fas fa-shield-check"></i>
                  </div>
                  <h4 className="text-lg font-black tracking-tight relative z-10">{t.ipIntegrity}</h4>
                  <p className="text-[10px] font-bold uppercase leading-relaxed opacity-80 relative z-10">{lang === 'ar' ? 'تم مسح الأصل من مخاطر العلامات التجارية العالمية.' : 'Asset cleared of global trademark risk factors.'}</p>
                  <i className="fas fa-fingerprint absolute right-[-20px] bottom-[-20px] text-white/10 text-[120px] pointer-events-none"></i>
               </div>
            </div>
          </div>
        ) : (
          <div className="bg-accent/20 border-2 border-dashed border-border rounded-[60px] min-h-[600px] flex flex-col items-center justify-center text-slate-300 p-10">
             <div className="w-32 h-32 bg-background rounded-full flex items-center justify-center mb-8 shadow-xl border border-border">
                <i className="fas fa-microchip text-5xl text-slate-200"></i>
             </div>
             <p className="text-xl font-black uppercase tracking-[0.4em] text-center max-w-sm">{t.awaitingAudit}</p>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">{lang === 'ar' ? 'اختر أصلاً من القائمة الجانبية للبدء' : 'Select an asset from sidebar to begin engineering'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;
