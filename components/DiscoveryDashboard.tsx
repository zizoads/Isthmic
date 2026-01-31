
import React, { useState, useRef } from 'react';
import { Domain } from '../types';
import { rigorousDiscoveryAI } from '../services/geminiService';
import { useDomainContext } from '../context/DomainContext';
import { useSovereignT } from '../hooks/useTranslation';
import PricingTerminal from './PricingTerminal';
import PrestigeLoader from './ui/PrestigeLoader';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
  lang: 'ar' | 'en';
}

const DiscoveryDashboard: React.FC<Props> = ({ domains, setDomains, addLog, lang }) => {
  const t = useSovereignT(lang);
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
      if (e.message !== 'Aborted') {
        addLog('System', 'Engine failure during mining protocol', 'critical');
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-16 animate-prestige" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {showPricing && <PricingTerminal onClose={() => setShowPricing(false)} lang={lang} />}

      <div className="glass-panel p-16 lg:p-24 space-y-16 relative overflow-hidden group">
        <header className="space-y-6 relative z-10">
           <span className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-4">
              <i className="fas fa-satellite-dish animate-pulse"></i> Strategic Market Mining
           </span>
           <textarea
             value={prompt}
             onChange={(e) => setPrompt(e.target.value)}
             placeholder={t('searchPlaceholder')}
             className="w-full bg-transparent border-none text-4xl lg:text-6xl prestige-title outline-none min-h-[180px] text-white placeholder:text-white/5 italic leading-tight p-0 resize-none"
           />
        </header>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5 relative z-10">
           <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[30px] flex items-center justify-center text-[#d4af37] text-3xl shadow-2xl transition-all group-hover:scale-110">
                <i className="fas fa-microchip"></i>
              </div>
              <div className="text-[9px] font-black text-slate-500 uppercase leading-loose tracking-[0.2em]">
                Grounding: Live_Search_Active<br/>Engine: Gemini_3_Flash_Pro
              </div>
           </div>

           <button 
              onClick={handleSearch} 
              disabled={isSearching || !prompt} 
              className="prestige-btn prestige-btn-gold !px-20 !py-7"
            >
              {isSearching ? <i className="fas fa-cog fa-spin"></i> : <i className="fas fa-bolt"></i>}
              <span>{isSearching ? 'SYNTHESIZING' : t('startInference')}</span>
            </button>
        </div>
        <i className="fas fa-globe-americas absolute right-[-100px] top-[-100px] text-white/[0.01] text-[400px] pointer-events-none -rotate-12 transition-all duration-1000 group-hover:opacity-10 group-hover:scale-110"></i>
      </div>

      {isSearching && (
        <div className="py-20 animate-fade-in">
           <PrestigeLoader label="Infiltrating Global Registrars..." />
        </div>
      )}

      {scannedResults.length > 0 && !isSearching && (
        <div className="space-y-12 animate-prestige">
           <div className="flex items-end justify-between border-b border-white/5 pb-10">
              <h3 className="prestige-title text-5xl text-white italic">Discovery Manifest.</h3>
              <div className="flex items-center gap-6">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{scannedResults.length} High-Alpha Units</span>
                 {isCachedResult && <span className="px-5 py-1.5 bg-[#d4af37] text-black text-[9px] font-black rounded-full uppercase shadow-xl shadow-[#d4af37]/20">Vault Memory Hit</span>}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {scannedResults.map((r, i) => (
                <div key={i} className="square-card p-12 group relative overflow-hidden flex flex-col justify-between h-[450px]">
                   <div>
                      <div className="flex justify-between items-start mb-10">
                         <div className="text-3xl font-black text-white group-hover:text-[#d4af37] transition-colors leading-none italic">{r.name}</div>
                         <div className="text-sm font-mono font-black text-[#d4af37] border border-[#d4af37]/20 px-3 py-1 rounded-lg">${r.estimatedPrice}</div>
                      </div>
                      
                      <p className="text-sm text-slate-400 font-medium mb-12 italic leading-relaxed h-32 overflow-hidden line-clamp-5 border-l-2 border-white/5 pl-8">
                        "{r.justification}"
                      </p>
                   </div>
                   
                   <div className="pt-10 border-t border-white/5 flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Liquidity Impulse</div>
                        <div className="text-2xl font-mono font-black text-white">{Math.round(r.probability * 100)}%</div>
                      </div>
                      <button 
                        onClick={() => activeProfile && setDomains(p => [{ id: crypto.randomUUID(), ...r, status: 'available' }, ...p])} 
                        className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-black hover:bg-[#d4af37] transition-all shadow-2xl hover:scale-110 active:scale-95"
                      >
                        <i className="fas fa-plus text-lg"></i>
                      </button>
                   </div>
                   <div className="absolute right-[-20px] bottom-[-20px] text-white/[0.02] text-[120px] group-hover:rotate-12 transition-transform">
                      <i className="fas fa-cube"></i>
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
