
import React, { useState, useRef, useMemo } from 'react';
import { Domain, StrategicObjective } from '../types';
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
  objectives?: StrategicObjective[];
}

const DiscoveryDashboard: React.FC<Props> = ({ domains, setDomains, addLog, lang, objectives = [] }) => {
  const t = useSovereignT(lang);
  const { activeProfile, trackUsage } = useDomainContext();
  const [prompt, setPrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isCachedResult, setIsCachedResult] = useState(false);
  const [scannedResults, setScannedResults] = useState<any[]>([]);
  const [showPricing, setShowPricing] = useState(false);
  const [filterElite, setFilterElite] = useState(false); // فلتر النخبة
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = async () => {
    if (!prompt) return;
    setIsSearching(true);
    setScannedResults([]);
    setIsCachedResult(false);
    abortControllerRef.current = new AbortController();
    
    addLog('Discovery', lang === 'ar' ? 'بدء تنقيب السوق الاستراتيجي الموجه...' : 'Initiating goal-oriented market mining...', 'info');

    try {
      // تمرير الأهداف للربط العصبي
      const response = await rigorousDiscoveryAI(prompt, lang, abortControllerRef.current.signal, objectives);
      if (response.cached) setIsCachedResult(true);
      else await trackUsage('scan');
      
      setScannedResults(response.data);
      
      // تنبيه في حال وجود توافق عالي جداً
      const topAlpha = response.data.find(r => r.strategicAlignmentScore > 90);
      if (topAlpha) {
        addLog('Commander', `Critical Synergy Detected: ${topAlpha.name} (Match: ${topAlpha.strategicAlignmentScore}%)`, 'success');
      }

      addLog('Discovery', `Complete. Found ${response.data.length} units aligned with intent.`, 'success');
    } catch (e: any) {
      if (e.message !== 'Aborted') {
        addLog('System', 'Engine failure during mining protocol', 'critical');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const filteredResults = useMemo(() => {
    if (filterElite) return scannedResults.filter(r => r.strategicAlignmentScore >= 80);
    return scannedResults;
  }, [scannedResults, filterElite]);

  return (
    <div className="space-y-16 animate-prestige" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {showPricing && <PricingTerminal onClose={() => setShowPricing(false)} lang={lang} />}

      <div className="glass-panel p-16 lg:p-24 space-y-16 relative overflow-hidden group">
        <header className="space-y-6 relative z-10">
           <div className="flex justify-between items-center">
             <span className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-4">
                <i className="fas fa-brain animate-pulse"></i> Goal-Oriented Discovery
             </span>
             <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-slate-500 uppercase">Neural Context Active</span>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_green]"></div>
             </div>
           </div>
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
                Grounding: Live_Search_Active<br/>Engine: Sovereign_Neural_Link
              </div>
           </div>

           <button 
              onClick={handleSearch} 
              disabled={isSearching || !prompt} 
              className="prestige-btn prestige-btn-gold !px-20 !py-7"
            >
              {isSearching ? <i className="fas fa-cog fa-spin"></i> : <i className="fas fa-bolt"></i>}
              <span>{isSearching ? 'ALIGNING...' : t('startInference')}</span>
            </button>
        </div>
        <i className="fas fa-link absolute right-[-100px] top-[-100px] text-white/[0.01] text-[400px] pointer-events-none -rotate-12 transition-all duration-1000 group-hover:opacity-10 group-hover:scale-110"></i>
      </div>

      {isSearching && (
        <div className="py-20 animate-fade-in">
           <PrestigeLoader label="Syncing Market Voids with Strategic Intent..." />
        </div>
      )}

      {scannedResults.length > 0 && !isSearching && (
        <div className="space-y-12 animate-prestige">
           <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-10 gap-6">
              <div className="space-y-2">
                 <h3 className="prestige-title text-5xl text-white italic">Discovery Manifest.</h3>
                 <p className="text-[10px] text-slate-500 font-bold uppercase">Synthesized based on {objectives.length} Active Objectives</p>
              </div>
              <div className="flex items-center gap-6">
                 <button 
                  onClick={() => setFilterElite(!filterElite)}
                  className={`flex items-center gap-3 px-6 py-2.5 rounded-full border transition-all ${filterElite ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                 >
                    <i className="fas fa-crown text-[10px]"></i>
                    <span className="text-[9px] font-black uppercase tracking-widest">{lang === 'ar' ? 'فلتر النخبة (>80%)' : 'ELITE FILTER (>80%)'}</span>
                 </button>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{filteredResults.length} Units Found</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredResults.map((r, i) => (
                <div key={i} className="square-card p-12 group relative overflow-hidden flex flex-col justify-between h-[450px]">
                   <div className="relative z-10">
                      <div className="flex justify-between items-start mb-10">
                         <div className="text-3xl font-black text-white group-hover:text-[#d4af37] transition-colors leading-none italic">{r.name}</div>
                         <div className="text-right">
                            <div className="text-sm font-mono font-black text-[#d4af37] mb-1">${r.estimatedPrice}</div>
                            <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${r.strategicAlignmentScore >= 80 ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'}`}>
                               Match: {r.strategicAlignmentScore}%
                            </div>
                         </div>
                      </div>
                      
                      <p className="text-sm text-slate-400 font-medium mb-12 italic leading-relaxed h-32 overflow-hidden line-clamp-5 border-l-2 border-white/5 pl-8">
                        "{r.justification}"
                      </p>
                   </div>
                   
                   <div className="pt-10 border-t border-white/5 flex justify-between items-center relative z-10">
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
           {filteredResults.length === 0 && scannedResults.length > 0 && (
             <div className="py-20 text-center opacity-30 italic text-slate-500">
                No Elite Alpha Units meet the 80% threshold. Try adjusting the search context.
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default DiscoveryDashboard;
