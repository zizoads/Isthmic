
import React, { useState } from 'react';
import { Domain } from '../types';
import { optimizeAfternicListingAI } from '../services/geminiService';
import { useDomainContext } from '../context/DomainContext';
import { translations } from '../translations';

interface Props {
  domains: Domain[];
  // Added lang to Props to fix context missing property
  lang: 'ar' | 'en';
}

const MarketplaceDashboard: React.FC<Props> = ({ domains, lang }) => {
  // Removed lang from context destructuring as it's not present in DomainContextType
  const { integrations, addLog } = useDomainContext();
  const t = translations[lang || 'en'];
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [optimization, setOptimization] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const isMarketConnected = integrations.some(i => i.provider === 'market_api' && i.status === 'connected');

  const handleOptimize = async (domain: Domain) => {
    setIsLoading(true);
    setSelectedDomain(domain);
    const data = await optimizeAfternicListingAI(domain.name, domain.sector || 'Technology');
    setOptimization(data);
    setIsLoading(false);
  };

  const handleGlobalSync = async () => {
    if (!selectedDomain) return;
    setIsSyncing(true);
    // Simulated API Sync to Sedo/Afternic
    await new Promise(r => setTimeout(r, 3000));
    addLog('Marketplace', `Syndication complete for ${selectedDomain.name}. Active on 4 networks.`, 'success');
    setIsSyncing(false);
  };

  const purchasedDomains = domains.filter(d => d.status === 'purchased');

  return (
    <div className="space-y-10 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Inventory Panel */}
        <div className="lg:col-span-1 bg-[#08090d] border border-white/5 rounded-[40px] flex flex-col h-[750px] overflow-hidden">
          <div className="p-8 border-b border-white/5 bg-white/2">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lang === 'ar' ? 'قائمة التسييل' : 'LIQUIDATION QUEUE'}</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
            {purchasedDomains.map(d => (
              <div 
                key={d.id} 
                onClick={() => handleOptimize(d)}
                className={`p-6 cursor-pointer transition-all hover:bg-white/5 ${selectedDomain?.id === d.id ? 'bg-indigo-600/20 border-r-4 border-indigo-500' : ''}`}
              >
                <div className="font-bold text-white text-sm">{d.name}</div>
                <div className="flex justify-between items-center mt-2">
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Status: Portfolio</span>
                   <i className="fas fa-chevron-left text-[10px] text-slate-700"></i>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimization Console */}
        <div className="lg:col-span-3 min-h-[750px] relative">
          {!selectedDomain ? (
            <div className="bg-[#0b0e14] border border-white/5 rounded-[50px] h-full flex flex-col items-center justify-center text-slate-600 space-y-8">
               <i className="fas fa-globe-americas text-8xl opacity-10"></i>
               <p className="italic text-xs font-black uppercase tracking-[0.4em]">Select an operational unit for global syndication.</p>
            </div>
          ) : isLoading ? (
            <div className="bg-[#0b0e14] border border-white/5 rounded-[50px] h-full flex flex-col items-center justify-center space-y-10">
               <div className="w-20 h-20 border-4 border-white/5 border-t-indigo-500 rounded-full animate-spin"></div>
               <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Engineering Marketplace Metadata...</p>
            </div>
          ) : optimization && (
            <div className="space-y-8 animate-slide-up">
              {/* Afternic Sync Header */}
              <div className="bg-[#05070a] p-12 rounded-[50px] border border-white/10 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden">
                <div className="flex items-center gap-8 relative z-10">
                   <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white text-4xl shadow-2xl shadow-indigo-900/20 group">
                      <i className="fas fa-sync-alt group-hover:rotate-180 transition-transform duration-700"></i>
                   </div>
                   <div>
                      <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">{selectedDomain.name}</h3>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Marketplace Ready</span>
                      </div>
                   </div>
                </div>
                <div className="flex gap-6 relative z-10">
                   <div className="text-right">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Suggested Buy Now</div>
                      <div className="text-4xl font-black text-indigo-400">${optimization.pricingStrategy.suggestedBuyNow.toLocaleString()}</div>
                   </div>
                   {isMarketConnected ? (
                     <button 
                      onClick={handleGlobalSync}
                      disabled={isSyncing}
                      className="bg-white text-black px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
                     >
                       {isSyncing ? <i className="fas fa-dna fa-spin"></i> : <><i className="fas fa-bolt"></i> {t.syncGlobal}</>}
                     </button>
                   ) : (
                     <button className="bg-indigo-600 text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest opacity-40 cursor-not-allowed">
                        API DISCONNECTED
                     </button>
                   )}
                </div>
                <i className="fas fa-network-wired absolute left-[-40px] top-[-40px] text-white/[0.02] text-[250px]"></i>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {/* Metadata & Categories */}
                 <div className="bg-[#0b0e14] p-12 rounded-[50px] border border-white/5 space-y-10">
                    <div>
                       <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-8 flex items-center gap-4">
                          <i className="fas fa-tags"></i> Registrar Categories
                       </h4>
                       <div className="flex flex-wrap gap-3">
                          {optimization.categories.map((cat: string, i: number) => (
                             <span key={i} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white transition-colors">{cat}</span>
                          ))}
                       </div>
                    </div>

                    <div>
                       <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-8 flex items-center gap-4">
                          <i className="fas fa-search"></i> Optimized Search Logic
                       </h4>
                       <div className="flex flex-wrap gap-3">
                          {optimization.keywords.map((kw: string, i: number) => (
                             <span key={i} className="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-lg text-[10px] font-black uppercase border border-indigo-500/20">{kw}</span>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Registrar Appearance */}
                 <div className="bg-white p-12 rounded-[50px] shadow-2xl relative overflow-hidden flex flex-col justify-between group">
                    <div className="relative z-10">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Marketplace Search Preview</h4>
                       <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-6 shadow-inner group-hover:border-indigo-200 transition-all">
                          <div className="flex justify-between items-center">
                             <span className="text-2xl font-black text-slate-900 italic tracking-tighter">{selectedDomain.name}</span>
                             <span className="px-4 py-1.5 bg-green-500 text-white text-[9px] font-black rounded-full uppercase">BUY NOW</span>
                          </div>
                          <p className="text-sm text-slate-600 italic leading-relaxed font-medium">
                             "{optimization.searchSnippet}"
                          </p>
                          <div className="pt-8 border-t border-slate-200 flex justify-between items-center">
                             <div className="text-3xl font-black text-indigo-600 tracking-tighter">${optimization.pricingStrategy.suggestedBuyNow.toLocaleString()}</div>
                             <div className="flex gap-2">
                               <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400"><i className="fas fa-shopping-cart"></i></div>
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="mt-8 text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-3 italic">
                       <i className="fas fa-brain text-indigo-400"></i> Narrative optimized for high-ticket acquisition emotion.
                    </div>
                    <i className="fas fa-signature absolute right-[-30px] bottom-[-30px] text-slate-100 text-[200px] pointer-events-none group-hover:text-indigo-50 transition-colors"></i>
                 </div>
              </div>

              {/* Pricing Logic */}
              <div className="bg-indigo-600/5 p-12 rounded-[50px] border border-indigo-500/10">
                 <div className="flex justify-between items-start mb-8">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Valuation Narrative Logic</h4>
                    <div className="text-right">
                       <div className="text-[8px] font-black text-slate-500 uppercase">Min Exit Floor</div>
                       <div className="text-xl font-black text-white">${optimization.pricingStrategy.floorPrice.toLocaleString()}</div>
                    </div>
                 </div>
                 <p className="text-base text-slate-400 leading-relaxed font-medium italic border-r-4 border-indigo-500 pr-10">
                    "{optimization.pricingStrategy.reasoning}"
                 </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MarketplaceDashboard;
