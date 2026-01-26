
import React, { useState } from 'react';
import { Domain } from '../types';
import { optimizeAfternicListingAI } from '../services/geminiService';

interface Props {
  domains: Domain[];
}

const MarketplaceDashboard: React.FC<Props> = ({ domains }) => {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [optimization, setOptimization] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOptimize = async (domain: Domain) => {
    setIsLoading(true);
    setSelectedDomain(domain);
    const data = await optimizeAfternicListingAI(domain.name, domain.sector || 'Technology');
    setOptimization(data);
    setIsLoading(false);
  };

  const purchasedDomains = domains.filter(d => d.status === 'purchased');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Inventory Panel */}
        <div className="lg:col-span-1 bg-white rounded-[32px] border shadow-sm flex flex-col h-[750px]">
          <div className="p-6 border-b bg-slate-50/50">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Global Distribution Queue</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y">
            {purchasedDomains.map(d => (
              <div 
                key={d.id} 
                onClick={() => handleOptimize(d)}
                className={`p-5 cursor-pointer transition-all hover:bg-indigo-50/50 ${selectedDomain?.id === d.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}
              >
                <div className="font-bold text-slate-900 text-sm">{d.name}</div>
                <div className="flex justify-between items-center mt-2">
                   <span className="text-[9px] font-black text-slate-400 uppercase">Status: Ready</span>
                   <i className="fas fa-chevron-right text-[10px] text-slate-300"></i>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimization Console */}
        <div className="lg:col-span-3 min-h-[750px] relative">
          {!selectedDomain ? (
            <div className="bg-white rounded-[40px] border h-full flex flex-col items-center justify-center text-slate-300">
               <i className="fas fa-globe-americas text-7xl mb-6 opacity-10"></i>
               <p className="italic text-sm">Select an asset to synchronize with Afternic & GoDaddy Network.</p>
            </div>
          ) : isLoading ? (
            <div className="bg-white rounded-[40px] border h-full flex flex-col items-center justify-center space-y-6">
               <div className="w-16 h-16 border-4 border-slate-900 border-t-indigo-500 rounded-full animate-spin"></div>
               <p className="text-xs font-black uppercase tracking-widest">Optimizing registrar metadata...</p>
            </div>
          ) : optimization && (
            <div className="space-y-8">
              {/* Afternic Sync Header */}
              <div className="bg-white p-10 rounded-[40px] border shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6">
                   <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl shadow-2xl shadow-indigo-200">
                      <i className="fas fa-sync-alt"></i>
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{selectedDomain.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fast Transfer Eligible</span>
                      </div>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="text-right">
                      <div className="text-[9px] font-black text-slate-400 uppercase">Suggested Buy Now</div>
                      <div className="text-3xl font-black text-indigo-600">${optimization.pricingStrategy.suggestedBuyNow.toLocaleString()}</div>
                   </div>
                   <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">Push to Afternic</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Metadata & Categories */}
                 <div className="bg-white p-10 rounded-[40px] border shadow-sm space-y-8">
                    <div>
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                          <i className="fas fa-tags text-indigo-500"></i> Registrar Categories
                       </h4>
                       <div className="flex flex-wrap gap-2">
                          {optimization.categories.map((cat: string, i: number) => (
                             <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700">{cat}</span>
                          ))}
                       </div>
                    </div>

                    <div>
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                          <i className="fas fa-search text-indigo-500"></i> Optimized Keywords
                       </h4>
                       <div className="flex flex-wrap gap-2">
                          {optimization.keywords.map((kw: string, i: number) => (
                             <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase">{kw}</span>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Registrar Appearance */}
                 <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                       <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-8">GoDaddy Search Result Preview</h4>
                       <div className="bg-white/5 rounded-3xl p-8 border border-white/10 space-y-6">
                          <div className="flex justify-between items-center">
                             <span className="text-xl font-black">{selectedDomain.name}</span>
                             <span className="px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-black rounded uppercase">Available</span>
                          </div>
                          <p className="text-sm text-slate-400 italic leading-relaxed">
                             "{optimization.searchSnippet}"
                          </p>
                          <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                             <div className="text-2xl font-black text-white">${optimization.pricingStrategy.suggestedBuyNow.toLocaleString()}</div>
                             <button className="bg-indigo-500 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase">Add to Cart</button>
                          </div>
                       </div>
                    </div>
                    <div className="mt-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                       <i className="fas fa-info-circle"></i> This snippet is generated to trigger buyer emotion.
                    </div>
                 </div>
              </div>

              {/* Pricing Logic */}
              <div className="bg-indigo-50 p-10 rounded-[40px] border border-indigo-100">
                 <div className="flex justify-between items-start mb-6">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Marketplace Pricing Strategy</h4>
                    <span className="text-xs font-black text-indigo-900">Minimum Acceptable: ${optimization.pricingStrategy.floorPrice.toLocaleString()}</span>
                 </div>
                 <p className="text-sm text-indigo-900/70 leading-relaxed font-medium">
                    {optimization.pricingStrategy.reasoning}
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
