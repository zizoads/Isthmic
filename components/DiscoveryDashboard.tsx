
import React, { useState, useRef } from 'react';
import { Domain } from '../types';
import { rigorousDiscoveryAI } from '../services/geminiService';
import { translations } from '../translations';
import { useDomainContext } from '../context/DomainContext';
import PricingTerminal from './PricingTerminal';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
  lang: 'ar' | 'en';
}

const DiscoveryDashboard: React.FC<Props> = ({ domains, setDomains, addLog, lang }) => {
  const t = translations[lang];
  const { activeProfile, trackUsage } = useDomainContext();
  const [prompt, setPrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isCachedResult, setIsCachedResult] = useState(false);
  const [scannedResults, setScannedResults] = useState<any[]>([]);
  const [showPricing, setShowPricing] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = async () => {
    if (!prompt) return;
    setIsSearching(true);
    setScannedResults([]);
    setIsCachedResult(false);
    abortControllerRef.current = new AbortController();
    
    addLog('Discovery', lang === 'ar' ? 'بدء تنقيب السوق الاستراتيجي...' : 'Initiating strategic market mining...', 'info');

    try {
      const response = await rigorousDiscoveryAI(prompt, lang, abortControllerRef.current.signal);
      if (response.cached) setIsCachedResult(true);
      else await trackUsage('scan');
      
      setScannedResults(response.data);
      addLog('Discovery', `Complete. Found ${response.data.length} units.`, 'success');
    } catch (e: any) {
      addLog('System', 'Engine failure', 'critical');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-16 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {showPricing && <PricingTerminal onClose={() => setShowPricing(false)} lang={lang} />}

      <div className="glass-panel p-12 lg:p-20 space-y-12">
        <header className="space-y-4">
           <span className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.4em]">Strategic Market Mining</span>
           <textarea
             value={prompt}
             onChange={(e) => setPrompt(e.target.value)}
             placeholder={t.searchPlaceholder}
             className="w-full bg-transparent prestige-title heading-lg outline-none min-h-[140px] text-white placeholder:text-white/10 italic leading-tight"
           />
        </header>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-[#d4af37] text-2xl shadow-2xl">
                <i className="fas fa-satellite"></i>
              </div>
              <div className="text-[10px] font-black text-slate-500 uppercase leading-relaxed tracking-widest">
                Search Grounding: Active<br/>Model: Gemini-3-Flash
              </div>
           </div>

           <button 
              onClick={handleSearch} 
              disabled={isSearching || !prompt} 
              className="prestige-btn prestige-btn-gold !px-16 !py-6"
            >
              {isSearching ? <i className="fas fa-cog fa-spin"></i> : <i className="fas fa-bolt"></i>}
              <span>{isSearching ? 'PROCESSING' : t.startInference}</span>
            </button>
        </div>
      </div>

      {scannedResults.length > 0 && (
        <div className="space-y-10 animate-slide-up">
           <div className="flex items-end justify-between border-b border-white/10 pb-8">
              <h3 className="prestige-title text-4xl text-white italic">Manifest.</h3>
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{scannedResults.length} Units Found</span>
                 {isCachedResult && <span className="px-4 py-1 bg-[#d4af37] text-black text-[9px] font-black rounded-full uppercase">Cache Hit</span>}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {scannedResults.map((r, i) => (
                <div key={i} className="glass-panel p-10 group hover:scale-[1.02] bg-gradient-to-br from-white/[0.05] to-transparent">
                   <div className="flex justify-between items-start mb-8">
                      <div className="text-2xl font-black text-white group-hover:text-[#d4af37] transition-colors">{r.name}</div>
                      <div className="text-sm font-mono font-black text-[#d4af37]">${r.estimatedPrice}</div>
                   </div>
                   
                   <p className="text-sm text-slate-400 font-medium mb-12 italic leading-relaxed h-24 overflow-hidden line-clamp-4 border-r-2 border-[#d4af37]/20 pr-6">
                     "{r.justification}"
                   </p>
                   
                   <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Liquidity</div>
                        <div className="text-xl font-mono font-black text-white">{Math.round(r.probability * 100)}%</div>
                      </div>
                      <button 
                        onClick={() => activeProfile && setDomains(p => [{ id: crypto.randomUUID(), ...r, status: 'available' }, ...p])} 
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black hover:bg-[#d4af37] transition-all shadow-xl"
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default DiscoveryDashboard;
