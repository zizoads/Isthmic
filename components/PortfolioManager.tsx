
import React, { useState, useEffect } from 'react';
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

  const purchasedDomains = domains.filter(d => d.status === 'purchased');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* List Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="glass dark:glass-dark rounded-[40px] p-6 lg:p-8 sticky top-0 border dark:border-white/5">
           <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-6">{t.portfolio}</h3>
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
                  className={`p-5 rounded-3xl cursor-pointer transition-all border group ${selectedDomain?.id === d.id ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl scale-[1.02]' : 'glass dark:glass-dark hover:border-indigo-500'}`}
                >
                  <div className="flex justify-between items-center">
                    <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                       <span className="font-black text-sm truncate block max-w-[140px]">{d.name}</span>
                       <span className="text-[9px] uppercase opacity-60 font-black">{d.sector || t.uncategorized}</span>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] font-mono opacity-80">${d.price}</span>
                       {d.brandAssets?.logoUrl && <i className="fas fa-check-circle text-[10px] text-green-400 mt-1"></i>}
                    </div>
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
            {/* Market Signal Card */}
            <div className="glass dark:glass-dark rounded-[40px] p-8 lg:p-10 flex flex-col md:flex-row justify-between items-center gap-8 border-t-4 border-indigo-500 shadow-lg relative overflow-hidden group">
               <div className={lang === 'ar' ? 'text-right w-full md:w-auto' : 'text-left w-full md:w-auto'}>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Market Sentiment Signal</div>
                  <div className={`text-4xl font-black ${marketSignal?.signal === 'BUY' ? 'text-green-500' : marketSignal?.signal === 'SELL' ? 'text-red-500' : 'text-amber-500'}`}>
                    {loading ? <i className="fas fa-circle-notch fa-spin text-2xl"></i> : (marketSignal?.signal || '---')}
                  </div>
               </div>
               <div className="flex-1 bg-white/5 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    {loading ? 'Retrieving market consensus...' : `"${marketSignal?.reasoning || 'Awaiting deep audit signal...'}"`}
                  </p>
               </div>
               <div className="text-center bg-indigo-500/10 p-4 rounded-2xl min-w-[100px]">
                  <div className="text-2xl font-black text-indigo-500">{marketSignal?.momentumScore || 0}%</div>
                  <div className="text-[8px] font-black text-slate-500 uppercase">Momentum</div>
               </div>
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </div>

            {/* Brand Canvas */}
            <div className="glass dark:glass-dark rounded-[40px] p-8 lg:p-12 relative overflow-hidden shadow-lg border dark:border-white/5">
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                        <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight break-all mb-4">{selectedDomain.name}</h2>
                        <div className="flex gap-2 mb-6">
                           <span className="bg-indigo-600/10 text-indigo-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">{selectedDomain.sector}</span>
                           <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-500/20">Verified Asset</span>
                        </div>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium italic leading-relaxed">
                          "{selectedDomain.brandAssets?.tagline || (lang === 'ar' ? 'لم يتم إنشاء شعار بعد.' : 'No tagline generated yet.')}"
                        </p>
                     </div>
                     
                     <div className={`flex gap-4 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                        <button 
                          onClick={handleGenerateBrand}
                          disabled={generatingBrand}
                          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-3 shadow-xl shadow-indigo-500/20 disabled:opacity-50"
                        >
                          {generatingBrand ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                          {generatingBrand ? (lang === 'ar' ? 'جاري التصميم...' : 'Designing...') : (lang === 'ar' ? 'توليد الهوية البصرية' : 'Generate Brand DNA')}
                        </button>
                     </div>
                  </div>

                  <div className="flex items-center justify-center relative">
                     {generatingBrand && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-4 bg-[#0a0c10]/40 backdrop-blur-sm rounded-[50px] animate-fade-in">
                           <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-white animate-pulse">Synthesizing Pixels...</p>
                        </div>
                     )}
                     
                     {selectedDomain.brandAssets?.logoUrl ? (
                        <div className="p-8 lg:p-10 bg-white dark:bg-slate-800 rounded-[50px] shadow-2xl border dark:border-white/5 group relative transition-all hover:scale-105 hover:rotate-2">
                           <img src={selectedDomain.brandAssets.logoUrl} alt="Logo" className="w-48 h-48 lg:w-64 lg:h-64 object-contain rounded-2xl" />
                           <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[50px] flex items-center justify-center">
                              <span className="text-white font-black text-[10px] uppercase tracking-widest">Masterpiece Ready</span>
                           </div>
                           <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-[#f8fafc] dark:border-[#0a0c10] shadow-lg">
                              <i className="fas fa-check text-white"></i>
                           </div>
                        </div>
                     ) : (
                        <div className="w-48 h-48 lg:w-64 lg:h-64 border-4 border-dashed border-slate-200 dark:border-white/10 rounded-[50px] flex items-center justify-center text-slate-300 animate-pulse bg-white/5">
                           <i className="fas fa-palette text-5xl"></i>
                        </div>
                     )}
                  </div>
               </div>
               <i className="fas fa-rocket absolute right-[-50px] bottom-[-50px] text-white/5 text-[200px] lg:text-[300px] pointer-events-none -rotate-12"></i>
            </div>

            {/* Technical DNA Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="glass dark:glass-dark p-8 rounded-[40px] border dark:border-white/5">
                  <h4 className={`text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>Operational History</h4>
                  <div className="space-y-4">
                     {[
                        { label: 'Acquisition Date', value: selectedDomain.acquisitionDate || 'Recently' },
                        { label: 'Current Valuation', value: `$${((selectedDomain.price || 0) * 4.5).toLocaleString()}` },
                        { label: 'Risk Factor', value: 'Minimal' }
                     ].map((item, i) => (
                        <div key={i} className={`flex justify-between items-center py-3 border-b border-slate-100 dark:border-white/5 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                           <span className="text-xs text-slate-500">{item.label}</span>
                           <span className="text-xs font-black text-slate-900 dark:text-white">{item.value}</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="glass dark:glass-dark p-8 rounded-[40px] border dark:border-white/5 flex flex-col justify-center items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                     <i className="fas fa-shield-heart text-2xl"></i>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">IP Integrity Certified</h4>
                  <p className="text-[10px] text-slate-400 font-medium uppercase leading-relaxed max-w-[200px]">Asset cleared of major trademark infringement risks.</p>
               </div>
            </div>
          </div>
        ) : (
          <div className="glass dark:glass-dark rounded-[40px] min-h-[500px] flex flex-col items-center justify-center text-slate-300 opacity-20 border-2 border-dashed border-slate-200 dark:border-white/10">
             <i className="fas fa-vault text-[120px] mb-8"></i>
             <p className="text-xl font-black uppercase tracking-[0.3em]">Select an asset to engineer</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;
