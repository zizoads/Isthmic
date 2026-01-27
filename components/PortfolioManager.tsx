
import React, { useState } from 'react';
import { Domain } from '../types';
import { generateBrandIdentityAI, getMarketSignalsAI } from '../services/geminiService';
import { translations } from '../translations';
import StatusBadge from './ui/StatusBadge';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  lang: 'ar' | 'en';
}

const Sparkline = ({ color }: { color: string }) => {
  const data = Array.from({ length: 10 }, () => ({ val: Math.random() * 100 }));
  return (
    <div className="h-6 w-16">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="val" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

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
    <div className="space-y-8 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Portfolio Terminal Grid */}
      <div className="bg-[#0b0e14] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/2 flex justify-between items-center">
          <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">{t.portfolio}</h3>
          <div className="flex gap-4 text-[10px] font-black text-slate-500">
            <span>VOL: 24H</span>
            <span className="text-green-500">+12.4%</span>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left font-mono border-collapse">
            <thead className="bg-white/5 border-b border-white/5">
              <tr className="text-[9px] text-slate-500 uppercase">
                <th className="px-6 py-4 font-black">{lang === 'ar' ? 'الأصل' : 'ASSET'}</th>
                <th className="px-6 py-4 font-black">{lang === 'ar' ? 'الحالة' : 'STATUS'}</th>
                <th className="px-6 py-4 font-black text-right">{lang === 'ar' ? 'السعر' : 'PRICE'}</th>
                <th className="px-6 py-4 font-black text-center">{lang === 'ar' ? 'الزخم' : 'MOMENTUM'}</th>
                <th className="px-6 py-4 font-black text-right">{lang === 'ar' ? 'التغيير' : 'CHG%'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {purchasedDomains.map(d => (
                <tr 
                  key={d.id} 
                  onClick={() => handleDeepAudit(d)}
                  className={`cursor-pointer hover:bg-white/2 transition-all ${selectedDomain?.id === d.id ? 'bg-indigo-500/10' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${d.brandAssets ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-700'}`}></div>
                      <span className="text-xs font-black text-white tracking-tight">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={d.status} lang={lang} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs font-bold text-slate-300">${d.price.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                       <Sparkline color={Math.random() > 0.3 ? '#22c55e' : '#ef4444'} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-[10px] font-black ${Math.random() > 0.4 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.random() > 0.4 ? '+' : '-'}{(Math.random() * 20).toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
              {purchasedDomains.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center opacity-20 text-white font-black uppercase text-[10px] tracking-widest">
                     Portfolio Empty - Awaiting Signal
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engineering Canvas - Redesigned as Sidebar Preview */}
      {selectedDomain && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-slide-up pb-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-[#0b0e14] border border-white/5 rounded-[40px] p-8 lg:p-14 relative overflow-hidden shadow-2xl">
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-10">
                     <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                        <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white leading-tight break-all mb-4">{selectedDomain.name}</h2>
                        <div className="flex gap-3 mb-8">
                           <span className="bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">{selectedDomain.sector}</span>
                        </div>
                        <p className="text-sm text-slate-400 font-medium italic leading-relaxed">
                          "{selectedDomain.brandAssets?.tagline || (lang === 'ar' ? 'بانتظار تركيب الهوية البصرية...' : 'Awaiting identity synthesis...')}"
                        </p>
                     </div>
                     
                     <div className={`flex gap-4 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                        <button 
                          onClick={handleGenerateBrand}
                          disabled={generatingBrand}
                          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl disabled:opacity-50"
                        >
                          {generatingBrand ? <i className="fas fa-dna fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                          {generatingBrand ? t.designing : t.generateBrandIdentityAI}
                        </button>
                     </div>
                  </div>

                  <div className="flex items-center justify-center relative bg-white/2 rounded-[50px] p-10 border border-white/5">
                     {generatingBrand && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-6 bg-slate-900/60 backdrop-blur-md rounded-[50px] animate-fade-in text-white">
                           <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                     )}
                     
                     {selectedDomain.brandAssets?.logoUrl ? (
                        <div className="p-4 bg-white rounded-[50px] shadow-2xl group relative transition-all">
                           <img src={selectedDomain.brandAssets.logoUrl} alt="Logo" className="w-56 h-56 lg:w-64 lg:h-64 object-contain rounded-[40px]" />
                        </div>
                     ) : (
                        <div className="w-56 h-56 border-2 border-dashed border-white/10 rounded-[50px] flex flex-col items-center justify-center text-slate-700 animate-pulse">
                           <i className="fas fa-palette text-4xl mb-4"></i>
                        </div>
                     )}
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#0b0e14] border border-white/5 p-8 rounded-[40px] shadow-2xl text-right">
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Market Pulse</div>
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                  <span className="text-slate-500 text-[10px] font-bold">SENTIMENT</span>
                  <span className={`text-xs font-black ${marketSignal?.signal === 'BUY' ? 'text-green-500' : 'text-amber-500'}`}>{marketSignal?.signal || 'WAITING'}</span>
                </div>
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                  <span className="text-slate-500 text-[10px] font-bold">MOMENTUM</span>
                  <span className="text-xs font-black text-white">{marketSignal?.momentumScore || 0}%</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                  {loading ? 'Crunching data...' : marketSignal?.reasoning || 'Select an asset for deep market telemetry.'}
                </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioManager;
