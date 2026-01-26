
import React, { useState } from 'react';
import { Domain } from '../types';
import { generateBrandIdentityAI, getMarketSignalsAI } from '../services/geminiService';
import { translations } from '../translations';

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
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleGenerateBrand = async () => {
    if (!selectedDomain) return;
    setLoading(true);
    try {
      const brand = await generateBrandIdentityAI(selectedDomain.name, selectedDomain.sector || 'Technology');
      setDomains(prev => prev.map(d => d.id === selectedDomain.id ? { ...d, brandAssets: brand } : d));
      setSelectedDomain(prev => prev ? { ...prev, brandAssets: brand } : null);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const purchasedDomains = domains.filter(d => d.status === 'purchased');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* List Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="glass dark:glass-dark rounded-[40px] p-8">
           <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-6">{t.portfolio}</h3>
           <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
              {purchasedDomains.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-10 opacity-50">لا توجد أصول في المحفظة حالياً</p>
              ) : purchasedDomains.map(d => (
                <div 
                  key={d.id} 
                  onClick={() => handleDeepAudit(d)}
                  className={`p-5 rounded-3xl cursor-pointer transition-all border ${selectedDomain?.id === d.id ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl' : 'glass dark:glass-dark hover:border-indigo-500'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm">{d.name}</span>
                    <span className="text-[10px] opacity-60">${d.price}</span>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Detail Area */}
      <div className="lg:col-span-8 space-y-8">
        {selectedDomain ? (
          <div className="space-y-8 animate-slide-up">
            {/* Market Signal Card - TradingView Style */}
            <div className="glass dark:glass-dark rounded-[40px] p-10 flex flex-col md:flex-row justify-between items-center gap-8 border-t-4 border-indigo-500 shadow-lg">
               <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Market Sentiment Signal</div>
                  <div className={`text-4xl font-black ${marketSignal?.signal === 'BUY' ? 'text-green-500' : marketSignal?.signal === 'SELL' ? 'text-red-500' : 'text-amber-500'}`}>
                    {marketSignal?.signal || '---'}
                  </div>
               </div>
               <div className="flex-1 bg-white/5 p-6 rounded-3xl border border-white/5">
                  <p className="text-xs text-slate-400 leading-relaxed italic">"{marketSignal?.reasoning || 'Awaiting signal...'}"</p>
               </div>
               <div className="text-center">
                  <div className="text-2xl font-black text-indigo-500">{marketSignal?.momentumScore || 0}%</div>
                  <div className="text-[8px] font-black text-slate-500 uppercase">Momentum</div>
               </div>
            </div>

            {/* Brand Canvas - Atom Style */}
            <div className="glass dark:glass-dark rounded-[40px] p-12 relative overflow-hidden min-h-[500px] shadow-lg">
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <h2 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">{selectedDomain.name}</h2>
                     <p className="text-lg text-slate-500 dark:text-slate-400 font-medium italic">"{selectedDomain.brandAssets?.tagline || 'No tagline generated yet.'}"</p>
                     
                     <div className="flex gap-4">
                        <button 
                          onClick={handleGenerateBrand}
                          disabled={loading}
                          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2 shadow-xl shadow-indigo-500/20"
                        >
                          {loading ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-magic"></i>}
                          Generate Brand DNA
                        </button>
                     </div>
                  </div>

                  <div className="flex items-center justify-center">
                     {selectedDomain.brandAssets?.logoUrl ? (
                        <div className="p-10 bg-white dark:bg-slate-800 rounded-[50px] shadow-2xl border dark:border-white/5 group relative transition-transform hover:scale-105">
                           <img src={selectedDomain.brandAssets.logoUrl} alt="Logo" className="w-64 h-64 object-contain rounded-2xl" />
                           <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[50px] flex items-center justify-center">
                              <span className="text-white font-black text-[10px] uppercase tracking-widest">Brand Visualized</span>
                           </div>
                        </div>
                     ) : (
                        <div className="w-64 h-64 border-4 border-dashed border-slate-200 dark:border-white/10 rounded-[50px] flex items-center justify-center text-slate-300 animate-pulse">
                           <i className="fas fa-palette text-5xl"></i>
                        </div>
                     )}
                  </div>
               </div>
               <i className="fas fa-rocket absolute right-[-50px] bottom-[-50px] text-white/5 text-[300px] pointer-events-none"></i>
            </div>
          </div>
        ) : (
          <div className="glass dark:glass-dark rounded-[40px] h-[600px] flex flex-col items-center justify-center text-slate-300 opacity-20">
             <i className="fas fa-vault text-[120px] mb-8"></i>
             <p className="text-xl font-black uppercase tracking-widest">Select an asset to engineer</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;
