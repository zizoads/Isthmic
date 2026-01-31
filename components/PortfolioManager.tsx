import React, { useState, useMemo } from 'react';
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
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [marketSignal, setMarketSignal] = useState<any>(null);

  // تحسين الأداء: تصفية البيانات في الذاكرة لتجنب إعادة العرض المكلفة
  const filteredDomains = useMemo(() => {
    return domains
      .filter(d => (d.status === 'purchased' || d.status === 'available'))
      .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 100); // عرض أول 100 فقط لضمان سرعة الواجهة (نظام التحميل التدريجي)
  }, [domains, search]);

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
      setSelectedDomain({ ...selectedDomain, brandAssets: brand });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-12 gap-0 border-2 border-white/10 bg-[#050505] animate-precision" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar: Industrial List */}
      <div className="col-span-12 lg:col-span-4 flex flex-col h-[800px] border-r-2 border-white/10">
        <div className="p-8 border-b-2 border-white/10 bg-white/2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">{t.portfolio}</h3>
            <span className="text-[9px] font-mono text-[#c5a059]">{domains.length} UNITS</span>
          </div>
          <div className="relative group">
             <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 text-xs"></i>
             <input 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-white/5 border border-white/5 !py-3 !pl-10 text-xs font-mono rounded-xl focus:border-[#c5a059]"
               placeholder="SEARCH_REGISTRY..."
             />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar divide-y-2 divide-white/5 bg-black/20">
          {filteredDomains.map(d => (
            <div 
              key={d.id}
              onClick={() => handleDeepAudit(d)}
              className={`p-8 cursor-pointer transition-all flex items-center justify-between group
                ${selectedDomain?.id === d.id ? 'bg-[#c5a059] text-black border-l-4 border-black' : 'hover:bg-white/5'}`}
            >
              <div className="space-y-1">
                <div className={`text-lg font-black prestige-heading italic ${selectedDomain?.id === d.id ? 'text-black' : 'text-white'}`}>{d.name}</div>
                <div className={`text-[9px] font-black uppercase tracking-widest ${selectedDomain?.id === d.id ? 'text-black/60' : 'text-slate-500'}`}>{d.sector}</div>
              </div>
              <div className="text-right">
                 <div className={`text-xs font-mono font-black mb-2 ${selectedDomain?.id === d.id ? 'text-black' : 'text-white'}`}>${d.price.toLocaleString()}</div>
                 <StatusBadge status={d.status} lang={lang} />
              </div>
            </div>
          ))}
          {filteredDomains.length === 0 && (
            <div className="p-20 text-center opacity-10">
               <i className="fas fa-ghost text-4xl mb-4"></i>
               <p className="text-[9px] uppercase font-black">No_Assets_Match</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Precision Engineering View */}
      <div className="col-span-12 lg:col-span-8 flex flex-col h-[800px] overflow-y-auto no-scrollbar bg-[#08080a]">
        {selectedDomain ? (
          <div className="divide-y-2 divide-white/10">
            <div className="p-14 lg:p-24 relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-16">
                <div className="flex-1 space-y-12">
                  <div className="space-y-8">
                    <span className="inline-block text-[10px] font-black text-[#c5a059] uppercase tracking-[0.5em] border border-[#c5a059]/40 px-6 py-1.5 rounded-full">{t.visualSynthesis}</span>
                    <h2 className="text-6xl lg:text-8xl font-black prestige-heading text-white italic leading-none">{selectedDomain.name}</h2>
                    <p className="text-slate-500 text-lg leading-relaxed italic border-l-2 border-[#c5a059]/20 pl-10 max-w-2xl">
                      {selectedDomain.brandAssets?.tagline || "// Awaiting identity synthesis protocol for this operation."}
                    </p>
                  </div>
                  <button 
                    onClick={handleGenerateBrand}
                    disabled={loading}
                    className="prestige-btn prestige-btn-gold !px-12"
                  >
                    {loading ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-dna"></i>}
                    <span className="ml-3 uppercase">Initialize Brand DNA</span>
                  </button>
                </div>
                
                <div className="w-72 h-72 border-2 border-white/5 flex items-center justify-center p-10 bg-black/40 shadow-2xl relative group">
                   {selectedDomain.brandAssets?.logoUrl ? (
                      <img src={selectedDomain.brandAssets.logoUrl} className="w-full h-full object-contain" alt="Brand" />
                   ) : (
                      <i className="fas fa-microchip text-6xl text-slate-800 opacity-20"></i>
                   )}
                   <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#c5a059]"></div>
                   <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#c5a059]"></div>
                </div>
              </div>
              <i className="fas fa-signature absolute right-[-50px] bottom-[-50px] text-white/[0.01] text-[400px] pointer-events-none rotate-12"></i>
            </div>
            
            <div className="p-14 lg:p-20">
               <HardROICalculator domain={selectedDomain} lang={lang} marketHeat={marketSignal?.momentumScore} />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-10">
             <div className="w-24 h-24 border-2 border-white/5 flex items-center justify-center text-slate-800"><i className="fas fa-cube text-4xl"></i></div>
             <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-700 underline underline-offset-8 decoration-[#c5a059]/20">Select Asset to Engage Dashboard</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;
