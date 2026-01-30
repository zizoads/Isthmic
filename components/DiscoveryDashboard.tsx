
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
      
      if (response.cached) {
        setIsCachedResult(true);
      } else {
        await trackUsage('scan');
      }
      
      setScannedResults(response.data);
      addLog('Discovery', `Mining complete. Found ${response.data.length} assets.`, 'success');
    } catch (e: any) {
      addLog('System', 'Engine communication failure', 'critical');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="stack-md" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {showPricing && <PricingTerminal onClose={() => setShowPricing(false)} lang={lang} />}

      <div className="square-box !p-0 bg-[#0a0a0c]">
        <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex justify-between items-center">
          <span className="text-mute text-gold">mine_input</span>
          <div className="w-1.5 h-1.5 bg-white/10 rounded-full"></div>
        </div>
        
        <div className="p-6 lg:p-8 stack-md">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-xl lg:text-2xl prestige-title outline-none min-h-[100px] border-b border-white/5 focus:border-[#d4af37] transition-all text-white"
          />
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center text-[#d4af37] text-sm shadow-[2px_2px_0px_0px_#000]">
                  <i className="fas fa-satellite"></i>
                </div>
                <div className="text-[9px] font-black text-slate-500 uppercase leading-tight">
                  Search Grounding Active<br/>Gemini-3-Flash
                </div>
             </div>

             <button 
                onClick={handleSearch} 
                disabled={isSearching || !prompt} 
                className="square-btn !px-8"
              >
                {isSearching ? <i className="fas fa-cog fa-spin"></i> : <i className="fas fa-bolt"></i>}
                <span>{isSearching ? 'PROCESS' : t.startInference}</span>
              </button>
          </div>
        </div>
      </div>

      {scannedResults.length > 0 && (
        <div className="stack-md animate-slide-up">
           <div className="flex items-end justify-between border-b border-white/10 pb-2">
              <h3 className="prestige-title text-xl text-white italic">Manifest.</h3>
              <div className="flex items-center gap-2">
                 <span className="text-[8px] font-black text-slate-500 uppercase">{scannedResults.length} FOUND</span>
                 {isCachedResult && <span className="text-[8px] font-black text-black bg-[#d4af37] px-2 py-0.5 uppercase">CACHE</span>}
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {scannedResults.map((r, i) => (
                <div key={i} className="square-box !p-5 bg-white/5 hover:bg-white/10 group">
                   <div className="flex justify-between items-start mb-4">
                      <div className="text-sm font-black text-white group-hover:text-[#d4af37] transition-colors">{r.name}</div>
                      <div className="text-[10px] font-mono font-black text-[#d4af37]">${r.estimatedPrice}</div>
                   </div>
                   
                   <p className="text-[10px] text-slate-400 font-medium mb-6 italic h-12 overflow-hidden line-clamp-2 border-l border-white/10 pl-3">
                     "{r.justification}"
                   </p>
                   
                   <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                      <div className="text-[8px] font-black uppercase text-slate-500">Liquidity: {Math.round(r.probability * 100)}%</div>
                      <button 
                        onClick={() => activeProfile && setDomains(p => [{ id: crypto.randomUUID(), ...r, status: 'available' }, ...p])} 
                        className="square-btn !p-2 !bg-white !shadow-[2px_2px_0px_0px_#000]"
                      >
                        <i className="fas fa-plus text-[10px]"></i>
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
