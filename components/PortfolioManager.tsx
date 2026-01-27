
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

const AssetRow: React.FC<{ domain: Domain, isSelected: boolean, onSelect: (d: Domain) => void, lang: 'ar' | 'en' }> = ({ domain, isSelected, onSelect, lang }) => (
  <tr 
    onClick={() => onSelect(domain)}
    className={`cursor-pointer transition-colors border-b border-white/5 ${isSelected ? 'bg-indigo-500/10' : 'hover:bg-white/5'}`}
  >
    <td className="px-6 py-3 font-bold text-white text-xs">{domain.name}</td>
    <td className="px-6 py-3 text-center"><StatusBadge status={domain.status} lang={lang} /></td>
    <td className="px-6 py-3 text-right font-mono text-xs text-indigo-400">${domain.price.toLocaleString()}</td>
    <td className="px-6 py-3 text-right text-[10px] text-slate-500 uppercase">{domain.sector}</td>
  </tr>
);

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar: Asset List (Compact) */}
      <div className="lg:col-span-4 bg-[#08090d] border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
        <div className="p-4 border-b border-white/5 bg-white/2 flex justify-between items-center">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.portfolio}</h3>
          <span className="text-[10px] font-mono text-indigo-500">{purchasedDomains.length} Assets</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <tbody className="divide-y divide-white/5">
              {purchasedDomains.map(d => (
                <AssetRow 
                  key={d.id} 
                  domain={d} 
                  isSelected={selectedDomain?.id === d.id} 
                  onSelect={handleDeepAudit} 
                  lang={lang} 
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main: Engineering Canvas */}
      <div className="lg:col-span-8 space-y-6">
        {selectedDomain ? (
          <div className="bg-[#08090d] border border-white/5 rounded-3xl p-8 h-full flex flex-col justify-between">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="space-y-4 flex-1">
                <h2 className="text-3xl font-black text-white tracking-tighter">{selectedDomain.name}</h2>
                <p className="text-sm text-slate-400 italic">
                  {selectedDomain.brandAssets?.tagline || (lang === 'ar' ? 'بانتظار تركيب الهوية البصرية...' : 'Awaiting identity synthesis...')}
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={handleGenerateBrand}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2"
                  >
                    {loading ? <i className="fas fa-dna fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                    {t.generateBrandIdentityAI}
                  </button>
                </div>
              </div>

              <div className="w-48 h-48 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center overflow-hidden">
                {selectedDomain.brandAssets?.logoUrl ? (
                  <img src={selectedDomain.brandAssets.logoUrl} alt="Logo" className="w-full h-full object-contain p-4" />
                ) : (
                  <i className="fas fa-palette text-slate-700 text-4xl"></i>
                )}
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-white/5 pt-8">
              <div className="p-4 bg-white/2 rounded-xl">
                 <div className="text-[8px] font-black text-slate-500 uppercase">Market Sentiment</div>
                 <div className="text-sm font-black text-white mt-1">{marketSignal?.signal || 'WAITING'}</div>
              </div>
              <div className="p-4 bg-white/2 rounded-xl">
                 <div className="text-[8px] font-black text-slate-500 uppercase">Momentum</div>
                 <div className="text-sm font-black text-indigo-400 mt-1">{marketSignal?.momentumScore || 0}%</div>
              </div>
              <div className="col-span-2 md:col-span-1 p-4 bg-white/2 rounded-xl">
                 <div className="text-[8px] font-black text-slate-500 uppercase">Strategy</div>
                 <div className="text-[9px] text-slate-400 mt-1 leading-tight">{marketSignal?.reasoning || 'Perform audit to see recommendation.'}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-slate-700">
             <i className="fas fa-microchip text-5xl mb-4"></i>
             <p className="text-[10px] font-black uppercase tracking-[0.3em]">Select asset to begin engineering</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;
